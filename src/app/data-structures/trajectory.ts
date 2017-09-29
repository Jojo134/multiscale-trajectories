import { QTree, AABB } from './tree';
import { PointType } from './pointType';
export class Trajectory {
    stimulus: string;
    participant: string;
    color: string;
    points: Array<PointType>;
    qTree: QTree;
    constructor() {
    }
    genQtree(maxHeight: number, maxWidth: number, minHalfDimension) {
        const centerCoord = Math.ceil(Math.max(maxHeight, maxWidth) / 2);
        this.qTree = new QTree(new AABB({ x: centerCoord, y: centerCoord }, centerCoord), minHalfDimension);
        this.points.forEach(p => this.qTree.insert(p));
    }
}
export class TrajectoryViewType {
    stimulus: string;
    participant: string;
    color: string;
    points: Array<PointType>;
}
