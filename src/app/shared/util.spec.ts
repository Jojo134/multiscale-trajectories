import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiMatch, center_of_masst, testTraj1, testTraj2, calcdiag } from './util';
import { PointType, AABB, QTree, Trajectory } from '../data-structures';
//import { QTree2, AABB } from '../data-structures/tree2';

fdescribe('utils test', () => {
    let mm: MultiMatch;
    let qTree: QTree;
    it('qtree test level 0', () => {
        const boundary = new AABB({ x: 8, y: 8 }, 8);
        qTree = new QTree(new AABB({ x: 8, y: 8 }, 8), 1);
        console.log(qTree.insert({ x: 0, y: 0, index: 0, timestamp: 0 }));
        console.log(qTree.insert({ x: 1, y: 1, index: 1, timestamp: 1 }));
        console.log(qTree.insert({ x: 0, y: 1, index: 2, timestamp: 2 }));
        console.log(qTree.insert({ x: 1, y: 0, index: 3, timestamp: 3 }));

        console.log(qTree.insert({ x: 11, y: 1, index: 4, timestamp: 4 }));
        console.log(qTree.insert({ x: 1, y: 11, index: 5, timestamp: 5 }));
        console.log(qTree.insert({ x: 12, y: 12, index: 6, timestamp: 6 }));

        console.log(qTree.insert({ x: 2, y: 2, index: 7, timestamp: 7 }));
        console.log(qTree.insert({ x: 3, y: 3, index: 8, timestamp: 8 }));
        console.log(qTree.insert({ x: 2, y: 3, index: 9, timestamp: 9 }));
        console.log(qTree.insert({ x: 3, y: 2, index: 10, timestamp: 10 }));
        console.log(qTree.getDepth());
        console.log('query start');
        const result = qTree.queryRange(boundary);
        console.log(result);
        console.log('length', result.length);
        expect(result.length).toBe(11);
        const res2 = qTree.getPointsForLevel(0);
        expect(res2[0].x).toBeCloseTo(3.27, 2);
        expect(res2.length).toBe(1);
    });
    it('qtree test level 1', () => {
        const boundary = new AABB({ x: 8, y: 8 }, 8);
        qTree = new QTree(new AABB({ x: 8, y: 8 }, 8), 1);
        console.log(qTree.insert({ x: 0, y: 0, index: 0, timestamp: 0 }));
        console.log(qTree.insert({ x: 1, y: 1, index: 1, timestamp: 1 }));
        console.log(qTree.insert({ x: 0, y: 1, index: 2, timestamp: 2 }));
        console.log(qTree.insert({ x: 1, y: 0, index: 3, timestamp: 3 }));

        console.log(qTree.insert({ x: 11, y: 1, index: 4, timestamp: 4 }));
        console.log(qTree.insert({ x: 1, y: 11, index: 5, timestamp: 5 }));
        console.log(qTree.insert({ x: 12, y: 12, index: 6, timestamp: 6 }));

        console.log(qTree.insert({ x: 2, y: 2, index: 7, timestamp: 7 }));
        console.log(qTree.insert({ x: 3, y: 3, index: 8, timestamp: 8 }));
        console.log(qTree.insert({ x: 2, y: 3, index: 9, timestamp: 9 }));
        console.log(qTree.insert({ x: 3, y: 2, index: 10, timestamp: 10 }));
        console.log(qTree.getDepth());
        //console.log(qTree.getPointsForLevel(2).filter(n => n).sort((a, b) => a.timestamp - b.timestamp));
        console.log('query start');
        const result = qTree.queryRange(boundary);
        expect(result.length).toBe(11);
        //console.log(JSON.stringify(qTree));
        //console.log(qTree.getPointsForLevel(0));
        //expect(qTree.getPointsForLevel(0).length).toBe(1);
        //console.log(qTree.getDepth());
        //console.log('nr points', qTree.getPointsForLevel(qTree.getDepth()).length);
        const res2 = qTree.getPointsForLevel(1);
        expect(res2[0].x).toBeCloseTo(0.5, 2);
        expect(res2.length).toBe(5);
    });
    it('qtree test level 2', () => {
        const boundary = new AABB({ x: 8, y: 8 }, 8);
        qTree = new QTree(new AABB({ x: 8, y: 8 }, 8), 1);
        console.log(qTree.insert({ x: 0, y: 0, index: 0, timestamp: 0 }));
        console.log(qTree.insert({ x: 1, y: 1, index: 1, timestamp: 1 }));
        console.log(qTree.insert({ x: 0, y: 1, index: 2, timestamp: 2 }));
        console.log(qTree.insert({ x: 1, y: 0, index: 3, timestamp: 3 }));

        console.log(qTree.insert({ x: 11, y: 1, index: 4, timestamp: 4 }));
        console.log(qTree.insert({ x: 1, y: 11, index: 5, timestamp: 5 }));
        console.log(qTree.insert({ x: 12, y: 12, index: 6, timestamp: 6 }));

        console.log(qTree.insert({ x: 2, y: 2, index: 7, timestamp: 7 }));
        console.log(qTree.insert({ x: 3, y: 3, index: 8, timestamp: 8 }));
        console.log(qTree.insert({ x: 2, y: 3, index: 9, timestamp: 9 }));
        console.log(qTree.insert({ x: 3, y: 2, index: 10, timestamp: 10 }));
        console.log(qTree.getDepth());
        console.log('query start');
        const result = qTree.queryRange(boundary);
        expect(result.length).toBe(11);
        console.log('case level 3')
        const res2 = qTree.getPointsForLevel(2);
        expect(res2[1].x).toBeCloseTo(2.5, 2);
        expect(res2.length).toBe(5);
        console.log(res2)
    });
    it('qtree test level 3', () => {
        const boundary = new AABB({ x: 8, y: 8 }, 8);
        qTree = new QTree(new AABB({ x: 8, y: 8 }, 8), 1);
        console.log(qTree.insert({ x: 0, y: 0, index: 0, timestamp: 0 }));
        console.log(qTree.insert({ x: 1, y: 1, index: 1, timestamp: 1 }));
        console.log(qTree.insert({ x: 0, y: 1, index: 2, timestamp: 2 }));
        console.log(qTree.insert({ x: 1, y: 0, index: 3, timestamp: 3 }));

        console.log(qTree.insert({ x: 11, y: 1, index: 4, timestamp: 4 }));
        console.log(qTree.insert({ x: 1, y: 11, index: 5, timestamp: 5 }));
        console.log(qTree.insert({ x: 12, y: 12, index: 6, timestamp: 6 }));

        console.log(qTree.insert({ x: 2, y: 2, index: 7, timestamp: 7 }));
        console.log(qTree.insert({ x: 3, y: 3, index: 8, timestamp: 8 }));
        console.log(qTree.insert({ x: 2, y: 3, index: 9, timestamp: 9 }));
        console.log(qTree.insert({ x: 3, y: 2, index: 10, timestamp: 10 }));
        console.log(qTree.getDepth());
        console.log('query start');
        const result = qTree.queryRange(boundary);
        expect(result.length).toBe(11);
        console.log('case level 3')
        const res2 = qTree.getCleanPointsForLevel(3);
        expect(res2[0].x).toBeCloseTo(0.5, 2);
        expect(res2.length).toBe(5);
        console.log(res2)
    });

    it('data test', () => {
        const traj = new Trajectory();

        traj.participant = 'p2';
        traj.stimulus = '02_Berlin_S1.jpg';
        traj.points = [
            { timestamp: 9066, index: 27, duration: 149, x: 1067, y: 681 },
            { timestamp: 9215, index: 28, duration: 266, x: 1116, y: 757 },
            { timestamp: 9481, index: 29, duration: 217, x: 1020, y: 723 },
            { timestamp: 9698, index: 30, duration: 183, x: 711, y: 781 },
            { timestamp: 9881, index: 31, duration: 183, x: 439, y: 776 },
            { timestamp: 10064, index: 32, duration: 167, x: 328, y: 552 },
            { timestamp: 10231, index: 33, duration: 400, x: 310, y: 359 },
            { timestamp: 10631, index: 34, duration: 666, x: 246, y: 336 },
            { timestamp: 11297, index: 35, duration: 333, x: 172, y: 279 }
        ];
        traj.genQtree(2000, 2000, 20);
        //console.log(traj.qTree.queryRange(new AABB({ x: 500, y: 500 }, 500)));
        //expect(traj.qTree.getPointsForLevel(0).length).toBe(1);
        //console.log('bound', traj.qTree.queryRangeTrajectory())
        //console.log('level 1', traj.qTree.getPointsForLevel(1));
        //x: 1067,666666666667, y: 720,3333333333333
        //x: 367,6666666666667 y: 513,8333333333333
        //expect(traj.qTree.getPointsForLevel(1).length).toBe(2);

    });
    it('mm test', () => {
        mm = new MultiMatch();
        // console.log(mm.computeAngle({ x: 220, y: -142 }, { x: 220, y: -142 }));
        console.log(mm.compare(testTraj1, testTraj2, calcdiag(1651, 1200)));
    });
    it('mm test equal', () => {
        mm = new MultiMatch();
        // console.log(mm.computeAngle({ x: 220, y: -142 }, { x: 220, y: -142 }));
        console.log(mm.compare(testTraj1, testTraj1, calcdiag(1651, 1200)));
    });
    it('mm2 test', () => {
        mm = new MultiMatch();

        const matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
        console.log(mm.getPathThroughSimMatrix(matrix));
    });
    it('mm2 test', () => {
        mm = new MultiMatch();
        const matrix = [[8, 9, 6, 7, 5],
        [8, 1, 10, 12, 11],
        [4, 12, 0.5, 7, 3],
        [7, 12, 7, 1, 4],
        [4, 11, 1, 7, 4]];
        console.log(mm.getPathThroughSimMatrix(matrix));
    });
});
