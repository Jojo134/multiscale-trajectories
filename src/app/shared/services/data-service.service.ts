import { Injectable } from '@angular/core';
import { Trajectory, TrajectoryViewType, QTree, AABB } from '../../data-structures';
import { stringToColor } from '../util';
import * as d3 from 'd3';

@Injectable()
export class DataService {
  resolutions: Array<{ city: string, height: number, width: number }> = [];
  stimuli: { name: string; id: number; }[];
  participants: { name: string; id: number; }[];
  fix_data: Array<Trajectory> = [];
  constructor() { }
  getAllTrajectories() {
    return this.fix_data;
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
      //  console.log(this.fix_data);
    });
  }
  stimulNameToResName(stimuName: string) {
    const stimuSplit = stimuName.split('_');
    return stimuSplit.slice(1, stimuSplit.length - 1).join(' ');
  }
  getResolution(filename) {
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
