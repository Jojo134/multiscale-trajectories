export class Trajectory {
    stimulus: string;
    participant: string;
    color: string;
    points: Array<PoinType>;
}
export class PoinType {
    x: number; y: number; duration: number; timestamp: number; fixationIndex: number;
}