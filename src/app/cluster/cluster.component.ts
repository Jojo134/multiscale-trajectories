import { Component, OnInit } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';

import { SelectionService, DataService, MultiMatch, calcdiag } from '../shared';
import { QTree, Trajectory, TrajectoryViewType } from '../data-structures';
import * as ml from 'machine_learning';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {
  someRange = 3;
  private chartData: Array<any>;

  nrLines: number;
  minQuadsize = 20;
  simScores;
  participants = [];
  stimuli = [];
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
    let data = [['Index 0', 0.1], ['Index 1', 0.2], ['Index 2', 0.3], ['Index 3', 0.4],
    ['Index 4', 0.5], ['Index 5', 0.6], ['Index 6', 0.7], ['Index 7', 0.8], ['Index 8', 0.9], ['Index 9', 1]];
    this.chartData = data;
  }

  ngOnInit() {
    if (!this.dataService.dataLoaded) {
      this.dataService.loadData(this.dataService.filename, this.dataService.resolutionName);
    }
    this.selected_stimuli = this.selectionService.getSelectedSimuli();
    this.selected_participants = this.selectionService.getSelectedParticipants();
    this.participants = this.dataService.getParticioants();
    this.stimuli = this.dataService.getStimuli();
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.someRange });

  }
  generateData() {
    this.chartData = [];
    for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
      this.chartData.push([`Index ${i}`, Math.floor(Math.random() * 100)]);
    }
  }
  filterChangeParticipant(selected: any[]) {
    console.log(selected);
    this.selected_participants = selected;
    this.selectionService.setSelectedParticipants(selected);
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.someRange });
  }

  filterChangeStimuli(selected: any[]) {
    console.log(selected);
    this.selected_stimuli = selected;
    this.selectionService.setSelectedStimuli(selected);
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.someRange });
  }
  cluster() {
    this.simScores = this.computeSimScores();
    console.log('sim scores done');
    const data = [];
    this.ngProgress.start();
    for (let i = 0; i < this.filteredFixData.length; i++) {
      for (let k = i + 1; k < this.filteredFixData.length; k++) {
        data.push(Object.values(this.simScores[i][k].scores));
      }
      this.ngProgress.set(i / this.filteredFixData.length);
    }
    this.ngProgress.done();
    console.log('data transform done');
    console.log(data);
    this.ngProgress.start();
    const result = ml.kmeans.cluster({
      data: data,
      //k: data.length > 20 ? 20 : data.length,
      k: 2,
      epochs: 100,
      distance: { type: 'euclidean' }
    });
    this.ngProgress.done();
    // arrfjson {header:{ relation: , attributes:[{},{}],data:[{},{}]}}}
    // list participant, stimuli as nominal
    console.log('clusters : ', result.clusters);
    console.log('means : ', result.means);
    result.clusters.forEach(element => {
      element.forEach(e => console.log(this.findCorrespondingPair(e)));
    });
    // console.log(simScores);
    // console.log(JSON.stringify(simScores));
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
  dataLoaded() {
    return this.dataService.dataLoaded;
  }
}
