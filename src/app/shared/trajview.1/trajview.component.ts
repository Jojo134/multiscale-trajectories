import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Trajectory, TrajectoryViewType } from '../../data-structures';
import * as stringhash from 'string-hash';
import * as _ from 'lodash';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-trajview1',
  templateUrl: './trajview.component.html',
  styleUrls: ['./trajview.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Trajview1Component implements OnInit, OnChanges {
  @ViewChild('chart1') private chartContainer: ElementRef;
  @Input() private data: Array<TrajectoryViewType>;
  @Input() private quadLines: boolean;
  @Input() private nrLines: number;
  @Input() private dwellFactor: number;
  linefunc1 = d3.line()
    .x(function (d) { return d['x']; })
    .y(function (d) { return d['y']; });
  private dwellTimes = false;
  private margin: any = { top: 0, bottom: 0, left: 0, right: 0 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private svg: any;

  constructor() { }

  ngOnInit() {
    this.createChart();
    if (this.data) {
      this.updateChart();
    }
  }

  ngOnChanges() {
    this.dwellFactor = 1;
    if (this.svg) {
      this.updateChart();
    }
  }
  exportSVG() {
    const el = this.chartContainer.nativeElement;
    el.children[0].setAttribute('title', 'Export');
    el.children[0].setAttribute('version', 1.1);
    el.children[0].setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const blob = new Blob([el.innerHTML], { type: 'image/svg+xml' });
    saveAs(blob, 'export.svg');
  }
  make_x_axis() {
    return d3.axisBottom(this.xScale)
      .tickValues(this.calcGridPos());
  }

  make_y_axis() {
    return d3.axisLeft(this.yScale)
      .tickValues(this.calcGridPos());
  }
  createChart() {
    // set the dimensions and margins of the graph
    const element = this.chartContainer.nativeElement;

    this.width = 2000;
    this.height = 2000;

    // set the ranges
    this.xScale = d3.scaleLinear().range([0, this.width]);
    this.yScale = d3.scaleLinear().range([this.height, 0]);

    this.chart = d3.select(element).append('svg');

    this.svg = this.chart
      .attr('class', 'svg-element')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 2000 2000')
      .append('g')
      .attr('transform',
      'translate(' + this.margin.left + ',' + this.margin.top + ')')
    d3.select(element).select('svg').append('g')
      .attr('class', 'grid x-grid')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.make_x_axis().tickSize(-this.height));
    //
    d3.select(element).select('svg').append('g')
      .attr('class', 'grid y-grid')
      .call(this.make_y_axis().tickSize(-this.width));

  }

  calcGridPos() {
    const genData = [];
    for (let i = 1; i < this.nrLines; i++) {
      genData.push(i / this.nrLines);
    }
    return genData;
  }
  updateChart() {
    console.log(this.data);
    let dataCopy = _.cloneDeep(this.data);
    // console.log(this.keyFuncData(this.data[0]));
    if (this.dwellTimes) {
      this.drawDwellPoints(dataCopy);
    } else {
      this.svg.selectAll('.dot').remove();
    }
    const update = this.svg.selectAll('.trajectory').data(dataCopy,
      (d) => stringhash(d.points.reduce((total, p) => total + '' + p.x + p.y)));

    update.exit().transition().attr('stroke-width', 0).remove();

    update.enter().append('path')
      .attr('class', 'trajectory')
      .attr('stroke-width', 0)
      .transition()
      .attr('stroke-width', 3)
      .attr('fill', 'none')
      .attr('d', d => this.linefunc1(d.points))
      .attr('stroke', d => d.color)
      .attr('marker-start', 'url(#markerarrow)')
      .attr('marker-end', 'url(#markercircle)');
    const updateLines = this.chart.selectAll('g.grid').remove();
    if (this.quadLines) {
      this.chart.append('g')
        .attr('class', 'grid x-grid')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(this.make_x_axis().tickSize(-this.height));

      this.chart.append('g')
        .attr('class', 'grid y-grid')
        .call(this.make_y_axis().tickSize(-this.width));
    }
    // summierte dauer anzeigen radius abhängig
    // radius/ms als eingabe
    // checkbox
    this.drawStartPoints(dataCopy);
  }
  drawDwellPoints(data) {
    const update = this.svg.selectAll('.dot').data(_.flatMap(data.map(d => d['points']
      .map(p => {
        return {
          x: p.x,
          y: p.y,
          duration: p.duration,
          color: d.color,
          factor: this.dwellFactor
        };
      }))), (d) => '' + d.x + d.y + d.factor);
    console.log(this.dwellFactor);
    update.exit().transition().attr('r', 0).remove();
    update.enter().append('circle').attr('class', 'dot')
      .attr('cx', function (d) { return d['x']; })
      .attr('cy', function (d) { return d['y']; })
      .attr('stroke', function (d) { return d['color']; })
      .attr('stroke-width', 3)
      // .attr('fill', function (d) { return d['color']; })
      .attr('fill', 'none')
      .attr('r', function (d) { console.log(d, this.dwellFactor); return Math.sqrt(d['duration'] * d['factor']); });
  }

  drawStartPoints(data) {
    const update = this.svg.selectAll('.start-dot').data(data.map(d => d['points'][0]), (d) => '' + d.x + d.y);
    update.exit().transition().attr('r', 0).remove();

    update.enter().append('circle').attr('class', 'start-dot')
      .attr('cx', function (d) { return d['x']; })
      .attr('cy', function (d) { return d['y']; })
      //
      .attr('r', 7);
  }
}
