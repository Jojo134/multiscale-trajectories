import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiMatch, center_of_masst, testTraj1, testTraj2 } from './util';
import { PointType } from '../data-structures';
fdescribe('utils test', () => {
    let mm: MultiMatch;
    it('mm test', () => {
        mm = new MultiMatch();
        //console.log(mm.computeAngle({ x: 220, y: -142 }, { x: 220, y: -142 }));
        //console.log(mm.compare(testTraj1, testTraj2));
        let matrix = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
        console.log(mm.getPathThroughSimMatrix(matrix));
    });
});
