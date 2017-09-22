import { center_of_masst } from '../shared/util';
import { PointType } from './pointType';
// https://en.wikipedia.org/wiki/Quadtree
export class QTree {
    depth = 0;
    // Axis-aligned bounding box stored as a center with half-dimensions
    // to represent the boundaries of this quad tree
    boundary: AABB;
    minHalfDimension: number;
    currentLevel: number;
    // Points in this quad tree node
    points: Array<QuadPoint> = [];

    // Children
    northWest: QTree;
    northEast: QTree;
    southWest: QTree;
    southEast: QTree;

    // Methods
    constructor(boundary: AABB, minHalfDimension: number, currentLevel?: number) {
        this.boundary = boundary;
        this.minHalfDimension = minHalfDimension;
        this.currentLevel = currentLevel ? currentLevel : 0;
    }

    getPointsForLevel(level: number) {
        if (level === this.currentLevel) {
            // return center_of_masst(this.points);
        } else {
            return this.getPointsForLevel(level + 1);
        }
    }

    insertPointType(p: PointType) {
        this.insert({ x: p.x, y: p.y, index: p.fixationIndex });
    }

    insert(p: QuadPoint) {
        // Ignore objects that do not belong in this quad tree
        if (!this.boundary.containsPoint(p)) {
            return false; // object cannot be added
        }
        // check for depth?
        if (this.boundary.halfDimension < this.minHalfDimension) {
            this.points.push(p);
            return true;
        }
        // Otherwise, subdivide and then add the point to whichever node will accept it
        if (this.northWest == null) {
            this.subdivide();
        }

        if (this.northWest.insert(p)) { return true; }
        if (this.northEast.insert(p)) { return true; }
        if (this.southWest.insert(p)) { return true; }
        if (this.southEast.insert(p)) { return true; }

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
        const foundPoints = this.queryRange(range);
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

    queryRange(range: AABB): Array<QuadPoint> {
        // Prepare an array of results
        let pointsInRange: Array<QuadPoint> = [];

        // Automatically abort if the range does not intersect this quad
        if (!this.boundary.intersectsAABB(range)) {
            return pointsInRange; // empty list
        }
        // Check objects at this quad level
        for (let p = 0; p < this.points.length; p++) {
            if (range.containsPoint(this.points[p])) {
                pointsInRange.push(this.points[p]);
            }
        }

        // Terminate here, if there are no children
        if (this.northWest == null) {
            return pointsInRange;
        }

        // Otherwise, add the points from the children
        // could be combined
        pointsInRange = pointsInRange.concat(this.northWest.queryRange(range));
        pointsInRange = pointsInRange.concat(this.northEast.queryRange(range));
        pointsInRange = pointsInRange.concat(this.southWest.queryRange(range));
        pointsInRange = pointsInRange.concat(this.southEast.queryRange(range));
        return pointsInRange;
    }
}

export class QuadPoint {
    x: number;
    y: number;
    index?: number;
}

export class AABB {
    center: QuadPoint;
    halfDimension: number;

    constructor(center: QuadPoint, halfDimension: number) {
        this.center = center;
        this.halfDimension = halfDimension;
    }

    public containsPoint(point: QuadPoint) {
        if (this.inYRange(point) && this.inXRange(point)) {
            return true;
        }
        return false;
    }
    private inXRange(point: QuadPoint) {
        if ((this.center.x + this.halfDimension) > point.x
            && (this.center.x - this.halfDimension) < point.x) {
            return true;
        }
        return false;
    }
    private inYRange(point: QuadPoint) {
        if ((this.center.y + this.halfDimension) > point.y
            && (this.center.y - this.halfDimension) < point.y) {
            return true;
        }
        return false;
    }
    intersectsAABB(other: AABB) {
        return Math.max(this.center.x - this.halfDimension, other.center.x - other.halfDimension)
            < Math.min(this.center.x + this.halfDimension, other.center.x + other.halfDimension)
            && Math.max(this.center.y - this.halfDimension, other.center.y - other.halfDimension)
            < Math.min(this.center.x + this.halfDimension, other.center.y + other.halfDimension);

    }
}
