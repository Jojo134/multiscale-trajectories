//https://en.wikipedia.org/wiki/Quadtree
export class QTree {
    //const QT_NODE_CAPACITY: number = 4;
    depth: number = 0;
    // Axis-aligned bounding box stored as a center with half-dimensions
    // to represent the boundaries of this quad tree
    boundary: AABB;

    // Points in this quad tree node
    points: Array<QuadPoint>[];

    // Children
    northWest: QTree;
    northEast: QTree;
    southWest: QTree;
    southEast: QTree;

    // Methods
    constructor(_boundary: AABB) { }
    insert(p: QuadPoint) {
        // Ignore objects that do not belong in this quad tree
        if (!this.boundary.containsPoint(p))
            return false; // object cannot be added

        //check for depth?
        // Otherwise, subdivide and then add the point to whichever node will accept it
        if (this.northWest == null)
            this.subdivide();

        if (this.northWest.insert(p)) return true;
        if (this.northEast.insert(p)) return true;
        if (this.southWest.insert(p)) return true;
        if (this.southEast.insert(p)) return true;

        // Otherwise, the point cannot be inserted for some unknown reason (this should never happen)
        return false;
    }

    subdivide() { } // create four children that fully divide this quad into four quads of equal area
    queryRange(range: AABB) {
        // Prepare an array of results
        let pointsInRange: Array<QuadPoint>[];

        // Automatically abort if the range does not intersect this quad
        if (!this.boundary.intersectsAABB(range))
            return pointsInRange; // empty list

        // Check objects at this quad level
        for (let p = 0; p < this.points.length; p++) {
            if (range.containsPoint(this.points[p]))
                pointsInRange.push(this.points[p]);
        }

        // Terminate here, if there are no children
        if (this.northWest == null)
            return pointsInRange;

        // Otherwise, add the points from the children
        //could be combined 
        pointsInRange.concat(this.northWest.queryRange(range));
        pointsInRange.concat(this.northEast.queryRange(range));
        pointsInRange.concat(this.southWest.queryRange(range));
        pointsInRange.concat(this.southEast.queryRange(range));

        return pointsInRange;
    }
}
export class QuadPoint {

}
export class AABB {
    center: QuadPoint;
    halfDimension: number;
    containsPoint(point: QuadPoint) {

    }
    intersectsAABB(other: AABB) {

    }
}