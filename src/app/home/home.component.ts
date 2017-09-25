import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as Baby from 'babyparse';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import * as d3 from 'd3';
import { Trajectory, TrajectoryViewType, QTree, AABB } from '../data-structures';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  stringToColor = (function () {
    let instance = null;

    return {
      next: function stringToColor(str) {
        if (instance === null) {
          instance = {};
          instance.stringToColorHash = {};
          instance.nextVeryDifferntColorIdx = 0;
          instance.veryDifferentColors = ['#000000', '#00FF00', '#0000FF', '#FF0000', '#01FFFE', '#FFA6FE', '#FFDB66', '#006401',
            '#010067', '#95003A', '#007DB5', '#FF00F6', '#FFEEE8', '#774D00', '#90FB92', '#0076FF', '#D5FF00', '#FF937E', '#6A826C',
            '#FF029D', '#FE8900', '#7A4782', '#7E2DD2', '#85A900', '#FF0056', '#A42400', '#00AE7E', '#683D3B', '#BDC6FF', '#263400',
            '#BDD393', '#00B917', '#9E008E', '#001544', '#C28C9F', '#FF74A3', '#01D0FF', '#004754', '#E56FFE', '#788231', '#0E4CA1',
            '#91D0CB', '#BE9970', '#968AE8', '#BB8800', '#43002C', '#DEFF74', '#00FFC6', '#FFE502', '#620E00', '#008F9C', '#98FF52',
            '#7544B1', '#B500FF', '#00FF78', '#FF6E41', '#005F39', '#6B6882', '#5FAD4E', '#A75740', '#A5FFD2', '#FFB167', '#009BFF',
            '#E85EBE'];
        }

        if (!instance.stringToColorHash[str]) {
          instance.stringToColorHash[str] = instance.veryDifferentColors[instance.nextVeryDifferntColorIdx++];
        }
        return instance.stringToColorHash[str];
      }
    };
  })();
  private chartData: Array<any>;
  dataLoaded = false;
  someRange = 5;
  participants = [];
  stimuli = [];
  viewAsQuadtree: boolean;
  selected_participants = Array<{ name: string, id: number }>();
  selected_stimuli = Array<{ name: string, id: number }>();
  filenameall = 'assets/all_fixation_data_cleaned_up.csv';
  filename = 'assets/small_fix_data_cleaned.csv';
  filteredFixData: Array<TrajectoryViewType> = [];
  fix_data: Array<Trajectory> = [];
  resolutions: Array<{ city: string, height: number, width: number }> = [];
  qTree: QTree;

  constructor(public http: Http) {
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

  filterData() {
    this.filteredFixData = [];
    const prefilteredFixData = this.fix_data.filter(traj => {
      return this.selected_participants.filter(e => e.name === traj.participant).length > 0
        || this.selected_stimuli.filter(e => e.name === traj.stimulus).length > 0;
    });
    if (this.viewAsQuadtree) {
      console.log('going quad')
      this.filteredFixData = prefilteredFixData.map(traj => {
        return {
          stimulus: traj.stimulus, participant: traj.participant, color: traj.color,
          points: traj.qTree.getPointsForLevel(this.someRange).filter(n => n).sort((a, b) => a.timestamp - b.timestamp)
        };
      });
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
            const nTrajectory = new Trajectory(currentres[0].height, currentres[0].width);
            nTrajectory.participant = user;
            nTrajectory.stimulus = stimu;
            nTrajectory.color = this.stringToColor.next(user);
            nTrajectory.points = result.map(d => {
              return {
                x: +d.MappedFixationPointX,
                y: +d.MappedFixationPointY,
                duration: +d.FixationDuration,
                timestamp: +d.Timestamp,
                fixationIndex: +d.FixationIndex
              };
            });
            nTrajectory.points = nTrajectory.points.sort((a, b) => a.timestamp - b.timestamp);
            nTrajectory.genQtree();
            this.fix_data.push(nTrajectory);
          }
        });
      });
      //  console.log(this.fix_data);
    });
  }

  getResolution() {
    d3.tsv('assets/resolution.txt', (err, data) => {
      data.forEach(d => {
        this.resolutions.push({ city: d.city, height: +d.height, width: +d.width });
      });
    });
  }

  ngOnInit() {
    // give everything a chance to get loaded before starting the animation to reduce choppiness
    // setTimeout(() => {
    // this.generateData();

    // change the data periodically
    //  setInterval(() => this.generateData(), 3000);
    // }, 1000);
    this.getResolution();
    this.getTrajectories();
    // d3.queue().defer(this.getResolution).await(this.getTrajectories)
  }

  filterChangeParticipant(selected: any[]) {
    console.log(selected);
    this.selected_participants = selected;
    // this.filterData();
  }

  filterChangeStimuli(selected: any[]) {
    console.log(selected);
    this.selected_stimuli = selected;
    // this.filterData();
  }

  generateData() {
    this.chartData = [];
    for (let i = 0; i < (8 + Math.floor(Math.random() * 10)); i++) {
      this.chartData.push([
        `Index ${i}`,
        Math.floor(Math.random() * 100)
      ]);
    }
  }


}
