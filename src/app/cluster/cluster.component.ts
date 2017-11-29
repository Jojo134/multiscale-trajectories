import { Component, OnInit } from '@angular/core';
import { NgProgress } from 'ngx-progressbar';

import { SelectionService, DataService, MultiMatch, calcdiag, stringToColor } from '../shared';
import { QTree, Trajectory, TrajectoryViewType } from '../data-structures';
import * as ml from 'machine_learning';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {
  visibleData: Array<TrajectoryViewType> = [];
  currentDepth = 0;
  cluster_list;
  clusteredData = [];
  idList;
  clustered_stimuli = [];
  k = 2;
  epochs = 100;
  private chartData: Array<any>;
  nrLines: number;
  maxDepth = 1;
  minQuadsize = 20;
  simScores;
  participants = [];
  stimuli = [];
  viewAsQuadtree: boolean;
  selected_participants = Array<{ name: string, id: number }>();
  selected_stimuli = Array<{ name: string, id: number }>();
  filteredFixData: Array<TrajectoryViewType> = [];
  resolutions: Array<{ city: string, height: number, width: number }> = [];
  qTree: QTree;
  simMatrix: number[][];
  constructor(public ngProgress: NgProgress, private selectionService: SelectionService, private dataService: DataService) {

  }

  ngOnInit() {
    this.dataService.getDataLoaded()
      .then(() => this.fillVars())
      .catch(() =>
        this.dataService.loadData(this.dataService.filename, this.dataService.resolutionName))
      .then(() => this.fillVars());
  }
  filterData() {
    this.nrLines = Math.pow(2, this.currentDepth);
    console.log('nr lines', this.nrLines);
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.currentDepth });
  }
  fillVars() {
    this.selected_stimuli = this.selectionService.getSelectedSimuli();
    this.selected_participants = this.selectionService.getSelectedParticipants();
    this.participants = this.dataService.getParticipants();
    this.stimuli = this.dataService.getStimuli();
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.currentDepth });
    this.visibleData = this.filteredFixData;
    this.maxDepth = this.dataService.getMaxDepth();
  }

  filterChangeParticipant(selected: any[]) {
    console.log(selected);
    this.selected_participants = selected;
    this.selectionService.setSelectedParticipants(selected);
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.currentDepth });
    this.visibleData = this.filteredFixData;
  }

  filterChangeStimuli(selected: any[]) {
    console.log(selected);
    this.selected_stimuli = selected;
    this.selectionService.setSelectedStimuli(selected);
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.currentDepth });
    this.visibleData = this.filteredFixData;
  }

  filterChangeCluster(selected: any[]) {
    console.log(selected);
    this.clustered_stimuli = [];
    this.visibleData = [];
    selected.forEach(e => {
      this.clustered_stimuli.push(...this.clusteredData.filter(c => e.name === c.cluster));
      this.visibleData.push(...this.clusteredData.filter(c => e.name === c.cluster));
    });
  }

  filterChangeClusterStimuli(selected: any[]) {
    console.log(selected);
    const checkdata = selected.map(s => s.data);
    this.visibleData = [];
    this.visibleData = selected.map(d => ({ stimulus: d.data.s, participant: d.data.p, color: d.color, points: d.points }));
  }

  cluster() {
    this.simScores = this.computeSimScores();
    console.log('sim scores done');
    const data = [];
    this.idList = [];
    this.ngProgress.start();
    for (let i = 0; i < this.filteredFixData.length; i++) {
      for (let k = i + 1; k < this.filteredFixData.length; k++) {
        data.push(Object.values(this.simScores[i][k].scores));
        this.idList.push(this.simScores[i][k].p1 +
          ' ' + this.simScores[i][k].s1 + ' ' + this.simScores[i][k].p2 + ' ' + this.simScores[i][k].s2);
      }
      this.ngProgress.set(i / this.filteredFixData.length);
    }
    this.ngProgress.done();
    console.log('data transform done');

    this.ngProgress.start();
    const result = ml.kmeans.cluster({
      data: data,
      k: this.k,
      epochs: this.epochs,
      distance: { type: 'euclidean' }
    });
    this.ngProgress.done();
    console.log('clusters : ', result.clusters);
    console.log('means : ', result.means);
    result.clusters.forEach(element => {
      element.forEach(e => console.log(element, this.idList[e]));
    });

    let count = 0;

    this.cluster_list = result.clusters.map((v, i) => ({ id: i, name: 'cluster ' + i, values: v }));


    this.clusteredData = [];
    this.cluster_list.forEach(e => e.values.forEach(v => {
      const splitted = this.idList[v].split(' ');
      const names = [{ p: splitted[0], s: splitted[1] }, { p: splitted[2], s: splitted[3] }];
      this.clusteredData.push(...names.map(n => ({
        id: count++,
        name: n.p + ' ' + n.s,
        data: n,
        cluster: e.name,
        color: stringToColor.next(e.name),
        points: this.filteredFixData.find(d => d.participant === n.p && d.stimulus === n.s).points
      })
      ));
    }));
    console.log(this.clusteredData);
    this.visibleData = this.clusteredData.map(d => ({ stimulus: d.data.s, participant: d.data.p, color: d.color, points: d.points }));
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
          scores: mm.compare(this.filteredFixData[i].points, this.filteredFixData[k].points, calcdiag(2000, 2000)),
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
