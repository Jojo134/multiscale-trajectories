import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Trajectory, TrajectoryViewType } from '../../data-structures';

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
  linefunc1 = d3.line()
    .x(function (d) { return d['x']; })
    .y(function (d) { return d['y']; });

  private margin: any = { top: 20, bottom: 20, left: 20, right: 20 };
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
      console.log('component', this.data);
    }
  }

  ngOnChanges() {
    if (this.svg) {
      this.updateChart();
    }
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
    // this.width = element.offsetWidth - this.margin.left - this.margin.right;
    // this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.width = 1650;
    this.height = 1650;

    // set the ranges
    this.xScale = d3.scaleLinear().range([0, this.width]);
    this.yScale = d3.scaleLinear().range([this.height, 0]);

    this.chart = d3.select(element).append('svg');

    /*    d3.select(element).select('svg').append('defs').append('marker')
          .attr('id', 'markerarrow')
          .attr('viewBox', '-0.5 -0.5 1 1')
          .append('path')
          .attr('d', 'M 0,0 m -5,-5 L 5,0 L -5,5 Z')
          .attr('fill', '#2ca02c');
        d3.select(element).select('svg').select('defs').append('marker')
          .attr('id', 'markercircle')
          .attr('viewbox', '-.6 -.6 1.2 1.2')
          .append('path')
          .attr('d', 'M 0, 0  m -5, 0  a 5,5 0 1,0 10,0  a 5,5 0 1,0 -10,0')
          .attr('fill', '#1f77b4');
    */
    this.svg = this.chart
      .attr('class', 'svg-element')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 1700 1300')
      // .attr('class', 'svg-content-responsive')
      // .attr('width', 1700)
      // .attr('height', 1300)
      .append('g')
      .attr('transform',
      'translate(' + this.margin.left + ',' + this.margin.top + ')');
    d3.select(element).select('svg').append('g')
      .attr('class', 'grid x-grid')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.make_x_axis().tickSize(-this.height));
    //
    d3.select(element).select('svg').append('g')
      .attr('class', 'grid y-grid')
      .call(this.make_y_axis().tickSize(-this.width));

  }

  drawTraj(points, color) {
    return this.svg.append('path')
      .attr('class', 'trajectory')
      .attr('d', this.linefunc1(points))
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  }
  calcGridPos() {
    const genData = [];
    for (let i = 1; i < this.nrLines; i++) {
      genData.push(i / this.nrLines);
    }
    return genData;
  }
  updateChart() {
    console.log(this.calcGridPos());
    const update = this.svg.selectAll('.trajectory').data(this.data);

    update.exit().transition().attr('stroke-width', 0).remove();

    update.enter().append('path')
      .attr('class', 'trajectory')
      .attr('stroke-width', 0)
      .transition()
      .attr('stroke-width', 2)
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
    this.drawPoints();
  }
  drawPoints() {
    const update = this.svg.selectAll('.dot').data(this.data.map(d => d['points'][0]));
    update.exit().transition().attr('r', 0).remove();

    update.enter().append('circle').attr('class', 'dot')
      .attr('cx', function (d, i) { return d['x']; })
      .attr('cy', function (d) { return d['y']; })
      .attr('r', 5);
  }
  removeItem() {
    this.data.pop();
    this.updateChart();
  }
}
