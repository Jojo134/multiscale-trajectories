
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { NgProgress } from 'ngx-progressbar';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import * as d3 from 'd3';
import { Trajectory, TrajectoryViewType, QTree, AABB } from '../data-structures';
import { MultiMatch, calcdiag, stringToColor, DataService, SelectionService } from '../shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private chartData: Array<any>;
  maxDepth = 0;
  minQuadsize = 20;
  simScores;
  currentDepth = 0;
  nrLines: number;
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
    private dataService: DataService, private selectionService: SelectionService) {
  }

  ngOnInit() {
    this.dataService.getDataLoaded()
      .then(() => this.fillVars())
      .catch(() =>
        this.dataService.loadData(this.dataService.filename, this.dataService.resolutionName))
      .then(() => this.fillVars());

  }

  fillVars() {
    this.selected_stimuli = this.selectionService.getSelectedSimuli();
    this.selected_participants = this.selectionService.getSelectedParticipants();
    this.participants = this.dataService.getParticipants();
    this.stimuli = this.dataService.getStimuli();
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.currentDepth });
    this.maxDepth = this.dataService.getMaxDepth();
    console.log(this.maxDepth);
  }

  filterChangeParticipant(selected: any[]) {
    console.log(selected);
    this.selected_participants = selected;
    this.selectionService.setSelectedParticipants(selected);
    console.log('depth', this.currentDepth);
    console.log('nr lines', this.nrLines);
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.currentDepth });
  }

  filterChangeStimuli(selected: any[]) {
    console.log(selected);
    this.selected_stimuli = selected;
    this.selectionService.setSelectedStimuli(selected);
    console.log('nr lines', this.nrLines);
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.currentDepth });
  }
  filterData() {
    this.nrLines = Math.pow(2, this.currentDepth);
    console.log('nr lines', this.nrLines);
    this.filteredFixData = this.dataService.filterData({ asQuad: this.viewAsQuadtree, level: this.currentDepth });
  }
  generateTree() {
    this.dataService.generateTree(this.minQuadsize);
  }

  dataLoaded() {
    return this.dataService.dataLoaded;
  }
}
