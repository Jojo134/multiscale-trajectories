
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { NgProgress } from 'ngx-progressbar';
import { WebWorkerService } from 'angular2-web-worker';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import * as d3 from 'd3';
import { Trajectory, TrajectoryViewType, QTree, AABB } from '../data-structures';
import { MultiMatch, calcdiag, stringToColor, DataService, SelectionService } from '../shared';

import * as ml from 'machine_learning';
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
  dataLoaded = false;
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
  cluster() {

    this.simScores = this.computeSimScores();
    console.log('sim scores done');
    const data = [];
    this.ngProgress.start();
    for (let i = 0; i < this.fix_data.length; i++) {
      for (let k = i + 1; k < this.fix_data.length; k++) {
        data.push(Object.values(this.simScores[i][k].scores));
      }
      this.ngProgress.set(i / this.fix_data.length);
    }
    this.ngProgress.done();
    console.log('data transform done');
    console.log(data);
    this.ngProgress.start();
    const result = ml.kmeans.cluster({
      data: data,
      //k: data.length > 20 ? 20 : data.length,
      k: 4,
      epochs: 50,
      distance: { type: 'euclidean' }
    });
    this.ngProgress.done();
    // arrfjson {header:{ relation: , attributes:[{},{}],data:[{},{}]}}}
    // list participant, stimuli as nominal
    console.log('clusters : ', result.clusters);
    console.log('means : ', result.means);
    // console.log(simScores);
    // console.log(JSON.stringify(simScores));

  }
  computeSimScores() {
    const simScores = [];
    //console.log(data);
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
  showSimMarix() {
    const mm = new MultiMatch();
    const trs = this.fix_data.filter(t => t.stimulus === '01_Antwerpen_S1.jpg').map(t => t.points);
    mm.compare(trs[0], trs[1], calcdiag(1651, 1200));
    this.simMatrix = mm.simMatrix;
  }

  filterData() {
    this.filteredFixData = [];
    const prefilteredFixData = this.fix_data.filter(traj => {
      return this.selected_participants.filter(e => e.name === traj.participant).length > 0
        || this.selected_stimuli.filter(e => e.name === traj.stimulus).length > 0;
    });
    if (this.viewAsQuadtree) {
      console.log('going quad');
      this.filteredFixData = prefilteredFixData.map(traj => {
        return {
          stimulus: traj.stimulus, participant: traj.participant, color: traj.color,
          points: traj.qTree.getPointsForLevel(this.someRange).filter(n => n).sort((a, b) => a.timestamp - b.timestamp)
        };
      });
    } else {
      this.filteredFixData = prefilteredFixData;
    }
    console.log(this.filteredFixData);
    this.removeOutliers();
  }

  stimulNameToResName(stimuName: string) {
    const stimuSplit = stimuName.split('_');
    return stimuSplit.slice(1, stimuSplit.length - 1).join(' ');
  }
  removeOutliers() {
    this.filteredFixData = this.filteredFixData.filter(traj => {
      const resolutionname = this.stimulNameToResName(traj.stimulus);
      const data_resolution = this.retrieveDimension(resolutionname);
      return traj.points.every(p => {
        return p.x > 0 && p.x < data_resolution[0].width
          && p.y > 0 && p.y < data_resolution[0].height;
      });
    });
  }
  retrieveDimension(resolutionname: string) {
    return this.resolutions.filter(res => res.city === resolutionname);
  }
  getTrajectories() {
    d3.tsv(this.filename, (err, data) => {
      // console.log(data);
      const users = new Set(Array.from(data, o => o.user));
      this.participants = Array.from(users).map((u, index) => ({ name: u, id: index }));
      const StimuliName = new Set(Array.from(data, o => o.StimuliName));
      this.stimuli = Array.from(StimuliName).map((s, index) => ({ name: s, id: index }));
      users.forEach(user => {
        StimuliName.forEach(stimu => {

          const result = data.filter(d => {
            return d.StimuliName === stimu && d.user === user;
          });
          if (result.length) {
            const resolutionname = this.stimulNameToResName(stimu);
            const currentres = this.retrieveDimension(resolutionname);
            const nTrajectory = new Trajectory();
            nTrajectory.participant = user;
            nTrajectory.stimulus = stimu;
            nTrajectory.color = stringToColor.next(user);
            nTrajectory.points = result.map(d => {
              return {
                x: +d.MappedFixationPointX,
                y: +d.MappedFixationPointY,
                duration: +d.FixationDuration,
                timestamp: +d.Timestamp,
                index: +d.FixationIndex
              };
            });
            nTrajectory.points = nTrajectory.points.sort((a, b) => a.timestamp - b.timestamp);
            nTrajectory.genQtree(currentres[0].height, currentres[0].width, 20);
            this.fix_data.push(nTrajectory);
          }
        });
      });
      //  console.log(this.fix_data);
    });
  }

  getResolution() {
    d3.tsv(this.resolutionName, (err, data) => {
      data.forEach(d => {
        this.resolutions.push({ city: d.city, height: +d.height, width: +d.width });
      });
    });
  }

  ngOnInit() {
    // this.dataService.getResolution(this.resolutionName);
    // this.dataService.loadTrajectories(this.filename);
    this.getResolution();
    this.getTrajectories();
    // d3.queue().defer(this.getResolution).await(this.getTrajectories)
  }

  filterChangeParticipant(selected: any[]) {
    console.log(selected);
    this.selected_participants = selected;
    this.selectionService.setSelectedParticipants(selected);
    this.filterData();
  }

  filterChangeStimuli(selected: any[]) {
    console.log(selected);
    this.selected_stimuli = selected;
    this.selectionService.setSelectedStimuli(selected);
    this.filterData();
  }

  generateTree() {
    console.log(this.minQuadsize)
    console.log(this.fix_data);
    this.fix_data = this.fix_data.map(d => {
      const resolutionname = this.stimulNameToResName(d.stimulus);
      const currentres = this.retrieveDimension(resolutionname);
      d.genQtree(currentres[0].height, currentres[0].width, this.minQuadsize);
      return d;
    });
    console.log(this.fix_data)
  }


}
