import { PoinType } from '../data-structures';
export function center_of_masst(points: PoinType[]): PoinType {
    let summedPoints = points.reduce((a, b) => {
        return {
            x: a.x + b.x, y: a.y + b.y, duration: a.duration + b.duration,
            fixationIndex: a.fixationIndex, timestamp: a.timestamp
        }
    })
    return {
        x: summedPoints.x / points.length,
        y: summedPoints.y / points.length, duration: summedPoints.duration,
        fixationIndex: summedPoints.fixationIndex, timestamp: summedPoints.timestamp
    };
}