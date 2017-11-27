import { center_of_masst } from '../shared/util';
import { PointType } from './pointType';
import * as _ from 'lodash';

// https://en.wikipedia.org/wiki/Quadtree
export class QTree {
    // Axis-aligned bounding box stored as a center with half-dimensions
    // to represent the boundaries of this quad tree
    boundary: AABB;
    minHalfDimension: number;
    currentLevel: number;
    // Points in this quad tree node
    points: Array<PointType> = [];

    // Children
    northWest: QTree;
    northEast: QTree;
    southEast: QTree;
    southWest: QTree;

    // Methods
    constructor(boundary: AABB, minHalfDimension: number, currentLevel?: number) {
        this.boundary = boundary;
        this.minHalfDimension = minHalfDimension;
        this.currentLevel = currentLevel ? currentLevel : 0;
    }
    getDepth() {
        if (this.northWest == null) {
            return this.currentLevel;
        }
        return Math.max(this.northWest.getDepth(), this.northEast.getDepth(), this.southEast.getDepth(), this.southWest.getDepth());
    }
    getPoints(): PointType[] {
        return this.queryRangeTrajectory(this.boundary).map(e => e.sort((a, b) => a.timestamp - b.timestamp)).map(center_of_masst);
    }
    getCleanPointsForLevel(level: number) {
        return this.getPointsForLevel(level).filter(Boolean);
    }
    getPointsForLevel(level: number): PointType[] {
        if (this.currentLevel < level) {
            if (!this.northWest) {
                return;
            }
            return ([].concat(this.northWest.getPointsForLevel(level),
                this.northEast.getPointsForLevel(level),
                this.southEast.getPointsForLevel(level),
                this.southWest.getPointsForLevel(level)));
        } else {
            const res = [].concat(this.getPoints());
            return res.filter(Boolean);
        }
    }
    insert(p: PointType) {
        // Ignore objects that do not belong in this quad tree
        if (!this.boundary.containsPoint(p)) {
            return false; // object cannot be added
        }
        // check for depth?
        if (this.boundary.halfDimension / 2 < this.minHalfDimension) {
            this.points.push(p);
            return true;
        }
        // Otherwise, subdivide and then add the point to whichever node will accept it
        if (this.northWest == null) {
            this.subdivide();
        }

        if (this.northWest.insert(p)) { return true; }
        if (this.northEast.insert(p)) { return true; }
        if (this.southEast.insert(p)) { return true; }
        if (this.southWest.insert(p)) { return true; }

        // Otherwise, the point cannot be inserted for some unknown reason (this should never happen)
        return false;
    }

    subdivide() {
        // create four children that fully divide this quad into four quads of equal area
        const halfDimension = this.boundary.halfDimension / 2;
        const nwBoundary = new AABB({
            x: this.boundary.center.x - halfDimension,
            y: this.boundary.center.y - halfDimension
        }, halfDimension);
        this.northWest = new QTree(nwBoundary, this.minHalfDimension, this.currentLevel + 1);

        const neBoundary = new AABB({
            x: this.boundary.center.x + halfDimension,
            y: this.boundary.center.y - halfDimension
        }, halfDimension);
        this.northEast = new QTree(neBoundary, this.minHalfDimension, this.currentLevel + 1);

        const seBoundary = new AABB({
            x: this.boundary.center.x + halfDimension,
            y: this.boundary.center.y + halfDimension
        }, halfDimension);
        this.southEast = new QTree(seBoundary, this.minHalfDimension, this.currentLevel + 1);

        const swBoundary = new AABB({
            x: this.boundary.center.x - halfDimension,
            y: this.boundary.center.y + halfDimension
        }, halfDimension);
        this.southWest = new QTree(swBoundary, this.minHalfDimension, this.currentLevel + 1);
    }
    queryRangeTrajectory(range: AABB) {
        const foundPoints = this.queryRange(range).sort((a, b) => a.timestamp - b.timestamp);
        const foundSub = [];
        let collect = [];
        collect.push(foundPoints[0]);
        for (let i = 1; i < foundPoints.length; i++) {
            if (foundPoints[i].index - foundPoints[i - 1].index > 1) {
                foundSub.push(collect);
                collect = [];
            }
            collect.push(foundPoints[i]);
        }
        foundSub.push(collect);
        return foundSub;
    }

    queryRange(range: AABB, origin?): Array<PointType> {
        // Prepare an array of results
        let pointsInRange: Array<PointType> = [];
        // Automatically abort if the range does not intersect this quad
        if (!this.boundary.intersectRect(range)) {
            return pointsInRange; // empty list
        }
        // Check objects at this quad level
        for (let p = 0; p < this.points.length; p++) {
            if (range.containsPoint(this.points[p])) {
                pointsInRange.push(this.points[p]);
            }
        }
        // console.log(pointsInRange);
        // Terminate here, if there are no children
        if (!this.northWest) {
            return pointsInRange;
        }

        // Otherwise, add the points from the children
        // could be combined
        pointsInRange = [];
        pointsInRange.push(...this.northWest.queryRange(range, 'nw'),
            ...this.northEast.queryRange(range, 'ne'),
            ...this.southEast.queryRange(range, 'se'),
            ...this.southWest.queryRange(range, 'sw'));
        return pointsInRange;
    }
}

export class AABB {
    center: PointType;
    halfDimension: number;

    constructor(center: PointType, halfDimension: number) {
        this.center = center;
        this.halfDimension = halfDimension;
    }

    public containsPoint(point: PointType) {
        if (this.inYRange(point) && this.inXRange(point)) {
            return true;
        }
        return false;
    }
    private inXRange(point: PointType) {
        if ((this.center.x + this.halfDimension) > point.x
            && (this.center.x - this.halfDimension) <= point.x) {
            return true;
        }
        return false;
    }
    private inYRange(point: PointType) {
        if ((this.center.y + this.halfDimension) > point.y
            && (this.center.y - this.halfDimension) <= point.y) {
            return true;
        }
        return false;
    }

    intersectRect(other: AABB) {
        return (this.center.x - this.halfDimension <= other.center.x + other.halfDimension &&
            other.center.x - other.halfDimension <= this.center.x + this.halfDimension &&
            this.center.y - this.halfDimension <= other.center.y + other.halfDimension &&
            other.center.y - other.halfDimension <= this.center.y + this.halfDimension);
    }
}
