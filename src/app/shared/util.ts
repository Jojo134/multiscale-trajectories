import { PointType } from '../data-structures';
export function center_of_masst(points: PointType[]): PointType {
    const summedPoints = points.reduce((a, b) => {
        return {
            x: a.x + b.x, y: a.y + b.y, duration: a.duration + b.duration,
            index: a.index, timestamp: a.timestamp
        };
    });
    return {
        x: summedPoints.x / points.length,
        y: summedPoints.y / points.length, duration: summedPoints.duration,
        index: summedPoints.index, timestamp: summedPoints.timestamp
    };
}
