import { Component, OnInit } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';

import { SelectionService, DataService, MultiMatch, calcdiag } from '../shared';
import { QTree, Trajectory, TrajectoryViewType } from '../data-structures';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {
  someRange = 3;
  private chartData: Array<any>;
  cutPoints: [number, number];
  nrLines: number;
  minQuadsize = 20;
  simScores;
  stimuli2 = [];
  stimuli1 = [];
  viewAsQuadtree: boolean;
  selected_participants = Array<{ name: string, id: number }>();
  selected_stimuli = Array<{ name: string, id: number }>();
  resolutionName = '/assets/resolution.txt';
  filenameall = 'assets/all_fixation_data_cleaned_up.csv';
  filename = 'assets/small_fix_data_cleaned.csv';
  filteredFixData: Array<TrajectoryViewType> = [];
  resolutions: Array<{ city: string, height: number, width: number }> = [];
  qTree: QTree;
  simMatrix: number[][];
  constructor(public ngProgress: NgProgress, private selectionService: SelectionService, private dataService: DataService) {
    const data = [['Index 0', 0.1], ['Index 1', 0.2], ['Index 2', 0.3], ['Index 3', 0.4],
    ['Index 4', 0.5], ['Index 5', 0.6], ['Index 6', 0.7], ['Index 7', 0.8], ['Index 8', 0.9], ['Index 9', 1]];
    this.chartData = data;
  }

  ngOnInit() {
    if (!this.dataService.dataLoaded) {
      console.log('load data');
      this.dataService.loadData(this.dataService.filename, this.dataService.resolutionName);
    }
    this.selected_stimuli = this.selectionService.getSelectedSimuli();
    this.selected_participants = this.selectionService.getSelectedParticipants();

    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.someRange });
    this.stimuli1 = this.filteredFixData.map((d, i) => ({ id: i, name: d.participant + ' ' + d.stimulus }));
    this.stimuli2 = this.filteredFixData.map((d, i) => ({ id: i, name: d.participant + ' ' + d.stimulus }));
  }
  generateData() {
    this.chartData = [];
    for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
      this.chartData.push([`Index ${i}`, Math.floor(Math.random() * 100)]);
    }
  }

  findCorrespondingPair(clusterIndex: number) {
    const row = clusterIndex % this.simScores.length;
    const col = clusterIndex / this.simScores[0].length;
    return this.simScores[row][col + row];
  }
  computeSimScores() {
    const simScores = [];
    this.ngProgress.start();
    const mm = new MultiMatch();
    console.log('start mm');
    for (let i = 0; i < this.filteredFixData.length; i++) {
      simScores[i] = [];
      for (let k = i + 1; k < this.filteredFixData.length; k++) {
        simScores[i][k] = {
          p1: this.filteredFixData[i].participant,
          s1: this.filteredFixData[i].stimulus,
          p2: this.filteredFixData[k].participant,
          s2: this.filteredFixData[k].stimulus,
          scores: mm.compare(this.filteredFixData[i].points, this.filteredFixData[k].points, calcdiag(1651, 1200)),
          cluster: 'none'
        };
        this.ngProgress.set((i * k) / ((this.filteredFixData.length * this.filteredFixData.length) / 2));
      }

    }
    this.ngProgress.done();
    return simScores;
  }
  cutTraj() {

  }
  values(v) {
    this.cutPoints = v;
  }
  dataLoaded() {
    return this.dataService.dataLoaded;
  }
}
