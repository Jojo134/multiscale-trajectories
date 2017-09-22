import { QTree } from './tree';
import { PointType } from './pointType';
export class Trajectory {
    stimulus: string;
    participant: string;
    color: string;
    points: Array<PointType>;
}
