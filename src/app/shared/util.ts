import { PointType } from '../data-structures';
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
