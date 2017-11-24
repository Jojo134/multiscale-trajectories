import { Injectable } from '@angular/core';
import { Trajectory, TrajectoryViewType, QTree, AABB } from '../../data-structures';
import { stringToColor } from '../util';
import { SelectionService } from './selection.service';
import * as d3 from 'd3';
import { Observable } from 'rxjs/Rx';
@Injectable()
export class DataService {
  resolutions: Array<{ city: string, height: number, width: number }> = [];
  stimuli: { name: string; id: number; }[];
  participants: { name: string; id: number; }[];
  fix_data: Array<Trajectory> = [];
  resolutionName = '/assets/resolution.txt';
  filenameall = 'assets/all_fixation_data_cleaned_up.csv';
  filename = 'assets/small_fix_data_cleaned.csv';
  dataLoaded = false;
  constructor(private selectionSerivce: SelectionService) { }
  getDataLoaded() {
    return this.dataLoaded ? Promise.resolve() : Promise.reject('data not loaded');
  }
  getAllTrajectories() {
    if (!this.dataLoaded) {
      this.loadData(this.filename, this.resolutionName);
    }
    console.log(this.fix_data);
    return this.fix_data;
  }
  getParticipants() {
    if (!this.dataLoaded) {
      this.loadData(this.filename, this.resolutionName);
    }
    return this.participants;
  }
  getStimuli() {
    if (!this.dataLoaded) {
      this.loadData(this.filename, this.resolutionName);
    }
    return this.stimuli;
  }
  getMaxDepth(): number {
    return this.dataLoaded ? Math.max(...this.fix_data.map(d => d.qTree.getDepth())) : 1;
  }
  getMinQuadSize(): number {
    return this.dataLoaded ? this.fix_data[0].qTree.minHalfDimension : -1;
  }
  getMaxDimension(): { x: number, y: number } {
    return { x: Math.max(...this.resolutions.map(r => r.width)), y: Math.max(...this.resolutions.map(r => r.height)) };
  }
  filterData(quadConfig: { asQuad: boolean, level?: number }) {
    let filteredFixData = [];
    const prefilteredFixData = this.fix_data.filter(traj => {
      return this.selectionSerivce.getSelectedParticipants().filter(e => e.name === traj.participant).length > 0
        || this.selectionSerivce.getSelectedSimuli().filter(e => e.name === traj.stimulus).length > 0;
    });
    if (quadConfig.asQuad) {
      console.log('going quad');
      filteredFixData = prefilteredFixData.map(traj => {
        return {
          stimulus: traj.stimulus, participant: traj.participant, color: traj.color,
          points: traj.qTree.getPointsForLevel(quadConfig.level).filter(n => n).sort((a, b) => a.timestamp - b.timestamp)
        };
      });
    } else {
      filteredFixData = prefilteredFixData;
    }
    console.log(filteredFixData);
    return this.removeOutliers(filteredFixData);
  }
  removeOutliers(data) {
    const filteredFixData = data.filter(traj => {
      const resolutionname = this.stimulNameToResName(traj.stimulus);
      const data_resolution = this.retrieveDimension(resolutionname);
      return traj.points.every(p => {
        return p.x > 0 && p.x < data_resolution[0].width
          && p.y > 0 && p.y < data_resolution[0].height;
      });
    });
    return filteredFixData;
  }
  generateTree(minQuadsize: number) {
    console.log(this.fix_data);
    this.fix_data = this.fix_data.map(d => {
      const resolutionname = this.stimulNameToResName(d.stimulus);
      const currentres = this.retrieveDimension(resolutionname);
      d.genQtree(currentres[0].height, currentres[0].width, minQuadsize);
      return d;
    });
    console.log(this.fix_data);
  }

  loadData(trajname: string, resname: string) {
    if (!this.dataLoaded) {
      this.loadResolution(resname);
      this.loadTrajectories(trajname);
    }
    return Promise.resolve();
  }
  loadTrajectories(filename: string) {
    d3.tsv(filename, (err, data) => {
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
      this.dataLoaded = true;
      return Promise.resolve();
      //  console.log(this.fix_data);
    });
  }
  stimulNameToResName(stimuName: string) {
    const stimuSplit = stimuName.split('_');
    return stimuSplit.slice(1, stimuSplit.length - 1).join(' ');
  }
  loadResolution(filename) {
    d3.tsv(filename, (err, data) => {
      data.forEach(d => {
        this.resolutions.push({ city: d.city, height: +d.height, width: +d.width });
      });
    });
  }
  retrieveDimension(resolutionname: string) {
    return this.resolutions.filter(res => res.city === resolutionname);
  }
}
