import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as Baby from 'babyparse';
import 'rxjs/Rx';
import * as d3 from 'd3';
import { Trajectory } from '../data-structures';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private chartData: Array<any>;
  dataLoaded = false;
  filename = 'assets/small_fix_data_cleaned.csv';
  fix_data: Array<Trajectory> = [];
  resolutions: Array<any>;
  constructor(public http: Http) {
  }
  getTrajectories() {
    d3.tsv(this.filename, (err, data) => {
      console.log(data);
      console.log(d3.max(data, o => +o.MappedFixationPointX));
      var MaxMappedFixationPointX = Math.max(...Array.from(data, o => +o.MappedFixationPointX));
      console.log(MaxMappedFixationPointX);
      var MaxMappedFixationPointY = Math.max(...Array.from(data, o => +o.MappedFixationPointY));
      var MinMappedFixationPointX = Math.min(...Array.from(data, o => +o.MappedFixationPointX));
      var MinMappedFixationPointY = Math.min(...Array.from(data, o => +o.MappedFixationPointY));
      var users = new Set(Array.from(data, o => o.user));
      console.log(users);
      var StimuliName = new Set(Array.from(data, o => o.StimuliName));
      console.log(StimuliName);
      users.forEach(user => {
        StimuliName.forEach(stimu => {

          let result = data.filter(d => {
            return d.StimuliName === stimu && d.user === user
          })
          if (result.length) {
            let nTrajectory = new Trajectory();
            nTrajectory.participant = user;
            nTrajectory.stimulus = stimu;
            nTrajectory.color = this.stringToColor.next(user + stimu);
            nTrajectory.points = result.map(d => {
              return {
                x: +d.MappedFixationPointX,
                y: +d.MappedFixationPointY,
                duration: +d.FixationDuration,
                timestamp: +d.Timestamp,
                fixationIndex: +d.FixationIndex
              }
            })
            this.fix_data.push(nTrajectory);
          }
        })
      });
      console.log(this.fix_data)
    });
  }

  getResolution() {
    d3.tsv('assets/resolution.txt', (err, data) => {
      this.resolutions = data;
    })
  }

  ngOnInit() {
    // give everything a chance to get loaded before starting the animation to reduce choppiness
    setTimeout(() => {
      this.generateData();

      // change the data periodically
      setInterval(() => this.generateData(), 3000);
    }, 1000);
    this.getResolution();
    this.getTrajectories();
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

  stringToColor = (function () {
    var instance = null;

    return {
      next: function stringToColor(str) {
        if (instance === null) {
          instance = {};
          instance.stringToColorHash = {};
          instance.nextVeryDifferntColorIdx = 0;
          instance.veryDifferentColors = ["#000000", "#00FF00", "#0000FF", "#FF0000", "#01FFFE", "#FFA6FE", "#FFDB66", "#006401", "#010067", "#95003A", "#007DB5", "#FF00F6", "#FFEEE8", "#774D00", "#90FB92", "#0076FF", "#D5FF00", "#FF937E", "#6A826C", "#FF029D", "#FE8900", "#7A4782", "#7E2DD2", "#85A900", "#FF0056", "#A42400", "#00AE7E", "#683D3B", "#BDC6FF", "#263400", "#BDD393", "#00B917", "#9E008E", "#001544", "#C28C9F", "#FF74A3", "#01D0FF", "#004754", "#E56FFE", "#788231", "#0E4CA1", "#91D0CB", "#BE9970", "#968AE8", "#BB8800", "#43002C", "#DEFF74", "#00FFC6", "#FFE502", "#620E00", "#008F9C", "#98FF52", "#7544B1", "#B500FF", "#00FF78", "#FF6E41", "#005F39", "#6B6882", "#5FAD4E", "#A75740", "#A5FFD2", "#FFB167", "#009BFF", "#E85EBE"];
        }

        if (!instance.stringToColorHash[str])
          instance.stringToColorHash[str] = instance.veryDifferentColors[instance.nextVeryDifferntColorIdx++];

        return instance.stringToColorHash[str];
      }
    }
  })();
}
