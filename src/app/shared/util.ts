import { PointType } from '../data-structures';
import * as Graph from 'node-dijkstra';
export let stringToColor = (function () {
    let instance = null;

    return {
        next: function stringToColor(str) {
            if (instance === null) {
                instance = {};
                instance.stringToColorHash = {};
                instance.nextVeryDifferntColorIdx = 0;
                instance.veryDifferentColors = ['#000000', '#00FF00', '#0000FF', '#FF0000', '#01FFFE', '#FFA6FE', '#FFDB66', '#006401',
                    '#010067', '#95003A', '#007DB5', '#FF00F6', '#FFEEE8', '#774D00', '#90FB92', '#0076FF', '#D5FF00', '#FF937E', '#6A826C',
                    '#FF029D', '#FE8900', '#7A4782', '#7E2DD2', '#85A900', '#FF0056', '#A42400', '#00AE7E', '#683D3B', '#BDC6FF', '#263400',
                    '#BDD393', '#00B917', '#9E008E', '#001544', '#C28C9F', '#FF74A3', '#01D0FF', '#004754', '#E56FFE', '#788231', '#0E4CA1',
                    '#91D0CB', '#BE9970', '#968AE8', '#BB8800', '#43002C', '#DEFF74', '#00FFC6', '#FFE502', '#620E00', '#008F9C', '#98FF52',
                    '#7544B1', '#B500FF', '#00FF78', '#FF6E41', '#005F39', '#6B6882', '#5FAD4E', '#A75740', '#A5FFD2', '#FFB167', '#009BFF',
                    '#E85EBE'];
            }

            if (!instance.stringToColorHash[str]) {
                instance.stringToColorHash[str] = instance.veryDifferentColors[instance.nextVeryDifferntColorIdx++];
            }
            return instance.stringToColorHash[str];
        }
    };
})();
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

export function euclid_distance(p1: PointType, p2: PointType) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}
export function calcdiag(height: number, width: number): number {
    return Math.sqrt(height * height + width * width);
}
class Vector {
    x: number;
    y: number;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Score {
    shape: number;
    length: number;
    direction: number;
    position: number;
    duration: number;
}
export class MultiMatch {
    simMatrix: number[][];
    traj1: PointType[];
    vectors1: Vector[];
    vectors2: Vector[];
    traj2: PointType[];
    compare(traj1: PointType[], traj2: PointType[], diagonal: number) {
        this.traj1 = traj1;
        this.traj2 = traj2;
        this.vectors1 = this.createVectors(this.traj1);
        this.vectors2 = this.createVectors(this.traj2);
        this.computeSimilarityMatrix();
        const path = this.getPathThroughSimMatrix(this.simMatrix);
        // console.log(path);
        // last position???
        const scores: Score[] = [];
        const maxDuration = Math.max(...this.traj1.concat(this.traj2).map(t => t.duration));
        path.forEach(v => {
            const vIds = v.split(' ');
            vIds[0] = vIds[0].slice(1);
            const score = {
                shape: this.shape(this.vectors1[vIds[0]], this.vectors2[vIds[1]]) / (2 * diagonal),
                length: this.tLength(this.vectors1[vIds[0]], this.vectors2[vIds[1]]) / diagonal,
                direction: this.direction(this.vectors1[vIds[0]], this.vectors2[vIds[1]]) / Math.PI,
                position: this.position(traj1[vIds[0]], this.traj2[vIds[1]]) / diagonal,
                duration: this.duration(traj1[vIds[0]], this.traj2[vIds[1]]) / maxDuration
            };
            scores.push(score);
        });
        // console.log(scores);
        const summed = scores.reduce((sum, a) => {
            return {
                shape: sum.shape + a.shape,
                length: sum.length + a.length,
                direction: sum.direction + a.direction,
                position: sum.position + a.position,
                duration: sum.duration + a.duration
            };
        });
        const average = {
            shape: summed.shape / scores.length,
            length: summed.length / scores.length,
            direction: summed.direction / scores.length,
            position: summed.position / scores.length,
            duration: summed.duration / scores.length
        };
        // console.log(average);
        return average;
    }
    createVectors(traj: PointType[]): Vector[] {
        const vectorList = [];
        for (let i = 0; i < traj.length - 1; i++) {
            vectorList.push(new Vector(traj[i + 1].x - traj[i].x, traj[i + 1].y - traj[i].y));
        }
        return vectorList;
    }
    computeSimilarityMatrix(): number[][] {
        this.simMatrix = [];
        for (let i = 0; i < this.vectors1.length; i++) {
            this.simMatrix[i] = [];
            for (let j = 0; j < this.vectors2.length; j++) {
                // this.simMatrix[i][j] = this.rad2degree(this.computeAngle(this.vectors1[i], this.vectors2[j]));
                this.simMatrix[i][j] = this.vectorLength(this.subtracV(this.vectors1[i], this.vectors2[j]));
            }
        }
        return this.simMatrix;
    }
    getPathThroughSimMatrix(m: number[][]): string[] {
        const adjlist = new Map<string, { target: string, weight: number }[]>();
        for (let i = 0; i < m.length; i++) {
            for (let j = 0; j < m[0].length; j++) {
                adjlist['v' + i + ' ' + j] = [];
                const list = [];
                if (i < m.length - 1 && j < m[0].length - 1) {
                    // non border
                    list.push({ target: 'v' + (i + 1) + ' ' + j, weight: m[i + 1][j] },
                        { target: 'v' + i + ' ' + (j + 1), weight: m[i][j + 1] },
                        { target: 'v' + (i + 1) + ' ' + (j + 1), weight: m[i + 1][j + 1] });
                    adjlist.set('v' + i + ' ' + j, list);
                } else if (j < m[0].length && i === m.length - 1) {
                    list.push({ target: 'v' + (i + 1) + ' ' + j, weight: m[i][j + 1] });
                    adjlist.set('v' + i + ' ' + j, list);
                } else if (i < m.length && j === m[0].length - 1) {
                    list.push({ target: 'v' + i + ' ' + (j + 1), weight: m[i + 1][j] });
                    adjlist.set('v' + i + ' ' + j, list);
                }
            }
        }

        const paths = this.dijkstra(adjlist, 'v0 0');
        return this.getShortestPath('v' + (m.length - 1) + ' ' + (m[0].length - 1), paths);
    }

    dijkstra(ajdlist: Map<string, { target: string, weight: number }[]>, source): Map<string, { key: string, weight: number }> {
        // init
        const nodes = Array.from(ajdlist.keys());
        const dist = new Map<string, number>();
        const prev = new Map<string, { key: string, weight: number }>();
        nodes.forEach((n) => { dist.set(n, Infinity); prev.set(n, undefined); });
        dist.set(source, 0);

        // start mit kinder
        while (nodes.length > 0) {
            let u = { key: '', weight: Infinity };
            for (const key of nodes) {
                if (dist.get(key) < u.weight) {
                    u = { key: key, weight: dist.get(key) };
                }
            }
            const index = nodes.indexOf(u.key);

            if (index > -1) {
                nodes.splice(index, 1);
            }
            const neighbors = ajdlist.get(u.key);

            for (const v in neighbors) {
                if (nodes.includes(neighbors[v].target)) {
                    // dist update
                    const alt = dist.get(u.key) + neighbors[v].weight;
                    if (alt < dist.get(neighbors[v].target)) {
                        dist.set(neighbors[v].target, alt);
                        prev.set(neighbors[v].target, u);
                    }
                }
            }

        }
        return prev;
    }

    getShortestPath(target: string, prev: Map<string, { key: string, weight: number }>): string[] {
        const path = [target];
        let u = target;

        while (prev.get(u)) {
            u = prev.get(u).key;
            path.push(u);
        }

        return path.reverse();
    }

    shape(v1: Vector, v2: Vector) {
        return this.vectorLength(this.subtracV(v1, v2));
    }

    tLength(v1: Vector, v2: Vector) {
        return this.vectorLength(v1) - this.vectorLength(v2);
    }

    direction(v1: Vector, v2: Vector) {
        return this.computeAngle(v1, v2);
    }

    position(pos1: PointType, pos2: PointType) {
        return euclid_distance(pos1, pos2);
    }

    duration(pos1: PointType, pos2: PointType) {
        return pos1.duration - pos2.duration;
    }

    trajectoryDirection(traj: Vector[]) {
        traj.reduce((sum, c) => sum = this.addV(sum, c));
    }

    computeAngle(v1: Vector, v2: Vector) {
        return Math.acos(this.dotP(this.normalizeV(v1), this.normalizeV(v2)));
    }
    rad2degree(radians) {
        return radians * (180 / Math.PI);
    }
    dotP(v0: Vector, v1: Vector) {
        return ((v0.x * v1.x) + (v0.y * v1.y));
    }

    multV(v: Vector, factor): Vector {
        return { x: factor * v.x, y: factor * v.y };
    }
    addV(v0, v1) {
        return { x: v0.x + v1.x, y: v0.y + v1.y, z: v0.z + v1.z };
    }
    subtracV(v0, v1) {
        return { x: v0.x - v1.x, y: v0.y - v1.y, z: v0.z - v1.z };
    }
    normalizeV(v: Vector) {
        const factor = this.vectorLength(v);
        return this.multV(v, (1 / factor));
    }

    vectorLength(v1: Vector) {
        return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    }
}
export const testTraj1: PointType[] = [
    { x: 1151, y: 458, duration: 250, timestamp: 2586, index: 9 },
    { x: 1371, y: 316, duration: 150, timestamp: 2836, index: 10 },
    { x: 1342, y: 287, duration: 283, timestamp: 2986, index: 11 },
    { x: 762, y: 303, duration: 433, timestamp: 3269, index: 12 },
    { x: 624, y: 297, duration: 183, timestamp: 3702, index: 13 },
    { x: 712, y: 303, duration: 333, timestamp: 3885, index: 14 },
    { x: 753, y: 293, duration: 300, timestamp: 4218, index: 15 },
    { x: 804, y: 284, duration: 516, timestamp: 4518, index: 16 },
    { x: 724, y: 305, duration: 183, timestamp: 5035, index: 17 },
    { x: 652, y: 703, duration: 250, timestamp: 5218, index: 18 },
    { x: 495, y: 855, duration: 183, timestamp: 5468, index: 19 },
    { x: 425, y: 976, duration: 550, timestamp: 5651, index: 20 },
    { x: 620, y: 739, duration: 150, timestamp: 6200, index: 21 },
    { x: 601, y: 674, duration: 333, timestamp: 6517, index: 22 }];
export const testTraj2: PointType[] = [
    { x: 670, y: 450, duration: 283, timestamp: 559960, index: 1614 },
    { x: 1355, y: 249, duration: 300, timestamp: 560243, index: 1615 },
    { x: 511, y: 791, duration: 283, timestamp: 560543, index: 1616 },
    { x: 495, y: 840, duration: 167, timestamp: 560826, index: 1617 },
    { x: 467, y: 944, duration: 133, timestamp: 560993, index: 1618 },
    { x: 707, y: 418, duration: 233, timestamp: 561126, index: 1619 },
    { x: 765, y: 224, duration: 183, timestamp: 561359, index: 1620 },
    { x: 1244, y: 204, duration: 233, timestamp: 561542, index: 1621 },
    { x: 1364, y: 279, duration: 416, timestamp: 561776, index: 1622 },
    { x: 421, y: 993, duration: 533, timestamp: 562192, index: 1623 },
    { x: 356, y: 975, duration: 216, timestamp: 562725, index: 1624 },
    { x: 1409, y: 186, duration: 233, timestamp: 562941, index: 1625 },
    { x: 1368, y: 290, duration: 233, timestamp: 563175, index: 1626 },
    { x: 858, y: 270, duration: 250, timestamp: 563408, index: 1627 },
    { x: 707, y: 280, duration: 283, timestamp: 563658, index: 1628 },
    { x: 824, y: 244, duration: 200, timestamp: 563941, index: 1629 },
    { x: 1053, y: 243, duration: 283, timestamp: 564141, index: 1630 },
    { x: 1265, y: 248, duration: 233, timestamp: 564424, index: 1631 },
    { x: 597, y: 739, duration: 300, timestamp: 564657, index: 1632 },
    { x: 447, y: 984, duration: 583, timestamp: 564957, index: 1633 }];

