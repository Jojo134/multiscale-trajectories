import { QTree, AABB } from './tree';
import { PointType } from './pointType';
export class Trajectory {
    stimulus: string;
    participant: string;
    color: string;
    points: Array<PointType>;
    qTree: QTree;
    constructor(maxHeight: number, maxWidth: number) {
        const centerCoord = Math.ceil(Math.max(maxHeight, maxWidth) / 2);
        this.qTree = new QTree(new AABB({ x: centerCoord, y: centerCoord }, centerCoord), 20);
    }
    genQtree() {
        this.points.forEach(p => this.qTree.insert(p));
    }
}
export class TrajectoryViewType {
    stimulus: string;
    participant: string;
    color: string;
    points: Array<PointType>;
}
