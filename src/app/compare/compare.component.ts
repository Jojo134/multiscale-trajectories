import { Component, OnInit } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';

import { SelectionService, DataService, MultiMatch, calcdiag } from '../shared';
import { QTree, Trajectory, TrajectoryViewType } from '../data-structures';
import * as _ from 'lodash';
@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  visibleData = [];
  someRange = 3;
  private chartData1: Array<any> = [];
  private chartData2: Array<any> = [];
  cutPoints = [0, 0];
  nrLines: number;
  minQuadsize = 20;
  simScores;
  stimuli2_hist: Array<TrajectoryViewType> = [];
  stimuli1_hist: Array<TrajectoryViewType> = [];
  private mm = new MultiMatch();
  viewAsQuadtree: boolean;
  selected_stimuli1: Trajectory;
  selected_stimuli2: Trajectory;
  select1: Trajectory;
  select2: Trajectory;
  filteredFixData: Array<TrajectoryViewType> = [];

  simMatrix: number[][];
  constructor(public ngProgress: NgProgress, private selectionService: SelectionService, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getDataLoaded()
      .then(() => this.fillVars())
      .catch(() =>
        this.dataService.loadData(this.dataService.filename, this.dataService.resolutionName))
      .then(() => this.fillVars());
  }
  fillVars() {
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.someRange });
    this.visibleData = this.filteredFixData;
  }
  onChange1(v) {
    console.log(v);
    this.selected_stimuli1 = _.cloneDeep(v);
    this.visibleData = [];
    if (this.selected_stimuli2) {
      // let newCourse = _.cloneDeep(this.selected_stimuli1);
      // console.log(newCourse.points.pop());
      console.log(this.selected_stimuli1);
      this.visibleData = [this.selected_stimuli1, this.selected_stimuli2];
      this.clearStimHist();
      this.stimuli1_hist.push(this.selected_stimuli1);
      this.stimuli2_hist.push(this.selected_stimuli2);
      this.calcScores(this.selected_stimuli1, this.selected_stimuli2);
    }
  }

  onChange2(v) {
    console.log(v);
    this.selected_stimuli2 = _.cloneDeep(v);
    this.visibleData = [];
    if (this.selected_stimuli1) {

      this.visibleData = [this.selected_stimuli1, this.selected_stimuli2];
      this.clearStimHist();
      this.stimuli1_hist.push(this.selected_stimuli1);
      this.stimuli2_hist.push(this.selected_stimuli2);
      this.calcScores(this.selected_stimuli1, this.selected_stimuli2);
    }
  }
  clearStimHist() {
    this.stimuli1_hist = [];
    this.stimuli2_hist = [];
  }
  calcScores(t1: TrajectoryViewType, t2: TrajectoryViewType) {
    this.chartData1 = [];
    this.chartData2 = [];
    for (let i = 0; i < t1.points.length; i++) {
      this.chartData1.push([`${i}`, Object.values(this.mm.compare(t1.points.filter((v, index) => i !== index),
        t2.points, calcdiag(2000, 2000))).reduce((sum, current) => sum + current) / 5]);
    }
    for (let i = 0; i < t2.points.length; i++) {
      this.chartData2.push([`${i}`, Object.values(this.mm.compare(t2.points.filter((v, index) => i !== index),
        t1.points, calcdiag(2000, 2000))).reduce((sum, current) => sum + current) / 5]);
    }
  }

  cutTraj(traj: string) {
    this.visibleData = [];
    console.log(traj);
    console.log(this.cutPoints);
    const p = { ...this.selected_stimuli1.points };
    let removedPoints;
    const numberOfPoints = this.cutPoints[1] - this.cutPoints[0];
    console.log(numberOfPoints);
    if (traj === 'first') {
      console.log(p);
      removedPoints = this.selected_stimuli1.points.splice(this.cutPoints[0], numberOfPoints === 0 ? 1 : numberOfPoints + 1);
      const modifiedstimulus = {
        color: this.selected_stimuli1.color,
        participant: this.selected_stimuli1.participant,
        stimulus: this.selected_stimuli1.stimulus,
        points: this.selected_stimuli1.points
      };
      console.log(this.selected_stimuli1.points);
      this.stimuli1_hist.push(removedPoints);

      this.visibleData = [modifiedstimulus, this.selected_stimuli2];
      // console.log(modifiedstimulus, this.selected_stimuli2.points);
    } else {
      removedPoints = this.selected_stimuli2.points.splice(this.cutPoints[0], numberOfPoints === 0 ? 1 : numberOfPoints + 1);
      const modifiedstimulus = {
        color: this.selected_stimuli2.color,
        participant: this.selected_stimuli2.participant,
        stimulus: this.selected_stimuli2.stimulus,
        points: this.selected_stimuli2.points
      };
      this.stimuli2_hist.push(removedPoints);
      this.visibleData = [modifiedstimulus, this.selected_stimuli1];
      // console.log(modifiedstimulus, this.selected_stimuli1.points);
    }
    this.calcScores(this.visibleData[0], this.visibleData[1]);
  }
  values(v) {
    this.cutPoints = v;
  }
  dataLoaded() {
    return this.dataService.dataLoaded;
  }
}
