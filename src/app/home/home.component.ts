
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { NgProgress } from 'ngx-progressbar';
import { WebWorkerService } from 'angular2-web-worker';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import * as d3 from 'd3';
import { Trajectory, TrajectoryViewType, QTree, AABB } from '../data-structures';
import { MultiMatch, calcdiag, stringToColor, DataService, SelectionService } from '../shared';

import * as hamsters from 'hamsters.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private chartData: Array<any>;
  nrLines: number;
  minQuadsize = 20;
  simScores;
  someRange = 5;
  participants = [];
  stimuli = [];
  viewAsQuadtree: boolean;
  selected_participants = Array<{ name: string, id: number }>();
  selected_stimuli = Array<{ name: string, id: number }>();
  resolutionName = '/assets/resolution.txt';
  filenameall = 'assets/all_fixation_data_cleaned_up.csv';
  filename = 'assets/small_fix_data_cleaned.csv';
  filteredFixData: Array<TrajectoryViewType> = [];
  fix_data: Array<Trajectory> = [];
  resolutions: Array<{ city: string, height: number, width: number }> = [];
  qTree: QTree;
  simMatrix: number[][];
  constructor(public http: Http, public ngProgress: NgProgress,
    private dataService: DataService, private selectionService: SelectionService, private webWorkerService: WebWorkerService) {
    const boundary = new AABB({ x: 50, y: 50 }, 50);
    this.qTree = new QTree(new AABB({ x: 50, y: 50 }, 50), 20);

    this.qTree.insert({ x: 24, y: 24, index: 0 });
    this.qTree.insert({ x: 74, y: 74, index: 4 });
    this.qTree.insert({ x: 73, y: 74, index: 5 });
    this.qTree.insert({ x: 74, y: 74, index: 6 });
    // console.log(this.qTree.insert({ x: 120, y: 120, index: }));

    // console.log(this.qTree);
    // console.log(this.qTree.queryRange(boundary));
    // console.log('ragnequery traj', this.qTree.queryRangeTrajectory(boundary));
  }

  showSimMarix() {
    const mm = new MultiMatch();
    const trs = this.fix_data.filter(t => t.stimulus === '01_Antwerpen_S1.jpg').map(t => t.points);
    mm.compare(trs[0], trs[1], calcdiag(1651, 1200));
    this.simMatrix = mm.simMatrix;
  }

  ngOnInit() {
    this.dataService.loadData(this.dataService.filename, this.dataService.resolutionName);

    this.selected_stimuli = this.selectionService.getSelectedSimuli();
    this.selected_participants = this.selectionService.getSelectedParticipants();
    this.participants = this.dataService.getParticioants();
    this.stimuli = this.dataService.getStimuli();
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.someRange });
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
  filterData() {
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.someRange });
  }
  generateTree() {
    this.dataService.generateTree(this.minQuadsize);
  }

  dataLoaded() {
    return this.dataService.dataLoaded;
  }
}
