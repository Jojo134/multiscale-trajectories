import { PointType } from '../data-structures';
import * as Dijkstra from 'node-dijkstra';
export function center_of_masst(points: PointType[]): PointType {
    if (!points.includes(undefined)) {
        const summedPoints = points.reduce((sum, point) => {
            return {
                x: sum.x + point.x, y: sum.y + point.y, duration: sum.duration + point.duration,
                index: sum.index, timestamp: sum.timestamp
            };
        }, { x: 0, y: 0, duration: 0, index: points[0].index, timestamp: points[0].timestamp });
        return {
            x: summedPoints.x / points.length,
            y: summedPoints.y / points.length, duration: summedPoints.duration,
            index: summedPoints.index, timestamp: summedPoints.timestamp
        };
    } else {
        return null;
    }
}

export function eudclid_distance(p1: PointType, p2: PointType) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}
class Vector {
    x: number;
    y: number;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export class MultiMatch {
    simMatrix: number[][];
    traj1: PointType[];
    vectors1: Vector[];
    vectors2: Vector[];
    traj2: PointType[];
    compare(traj1: PointType[], traj2: PointType[]) {
        this.traj1 = traj1;
        this.traj2 = traj2;
        this.vectors1 = this.createVectors(traj1);
        this.vectors2 = this.createVectors(traj2);
    }
    createVectors(traj: PointType[]): Vector[] {
        const vectorList = [];
        for (let i = 0; i < traj.length - 1; i++) {
            vectorList.push(new Vector(traj[i + 1].x - traj[i].x, traj[i + 1].y - traj[i].y));
        }
        return vectorList;
    }
    computeSimilarityMatrix() {
        for (let i = 0; i < this.vectors1.length; i++) {
            for (let j = 0; j < this.vectors2.length; j++) {
                this.simMatrix[i][j] = this.computeAngle(this.vectors1[i], this.vectors2[j]);
            }
        }
    }

    computeAngle(v1: Vector, v2: Vector) {
        return Math.acos(this.dotP(this.normalizeV(v1), this.normalizeV(v2)));
    }

    shape(traj1: PointType[], traj2: PointType[]) {

    }

    length(traj1: PointType[], traj2: PointType[]) {

    }

    direction(traj1: PointType[], traj2: PointType[]) {

    }

    position(traj1: PointType[], traj2: PointType[]) {

    }

    duration(traj1: PointType[], traj2: PointType[]) {

    }

    dotP(v0: Vector, v1: Vector) {
        return ((v0.x * v1.x) + (v0.y * v1.y));
    }

    multV(v: Vector, factor): Vector {
        return { x: factor * v.x, y: factor * v.y };
    }

    normalizeV(v: Vector) {
        const factor = this.vectorLength(v);
        return this.multV(v, (1 / factor));
    }

    vectorLength(v1: Vector) {
        return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    }
}
