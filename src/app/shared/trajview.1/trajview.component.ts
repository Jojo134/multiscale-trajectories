import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Trajectory, TrajectoryViewType } from '../../data-structures';

@Component({
  selector: 'app-trajview1',
  templateUrl: './trajview.component.html',
  styleUrls: ['./trajview.component.css']
})
export class Trajview1Component implements OnInit, OnChanges {
  @ViewChild('chart1') private chartContainer: ElementRef;
  @Input() private data: any;
  @Input() private quadLines: boolean;
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
      .ticks(5);
  }

  make_y_axis() {
    return d3.axisLeft(this.yScale)
      .ticks(5);
  }
  createChart() {
    // set the dimensions and margins of the graph
    const element = this.chartContainer.nativeElement;
    // this.width = element.offsetWidth - this.margin.left - this.margin.right;
    // this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.width = 1650;
    this.height = 1200;

    // set the ranges
    this.xScale = d3.scaleLinear().range([0, this.width]);
    this.yScale = d3.scaleLinear().range([this.height, 0]);

    this.svg = d3.select(element).append('svg')
      .attr('class', 'svg-element')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 1700 1300')
      // .attr('class', 'svg-content-responsive')
      // .attr('width', 1700)
      // .attr('height', 1300)
      .append('g')
      .attr('transform',
      'translate(' + this.margin.left + ',' + this.margin.top + ')');
    if (this.quadLines) {
      this.svg.append('g')
        .attr('class', 'grid')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(this.make_x_axis()
          .tickSize(-this.height));

      this.svg.append('g')
        .attr('class', 'grid')
        .call(this.make_x_axis()
          .tickSize(-this.width));
    }
  }

  drawTraj(points, color) {
    return this.svg.append('path')
      .attr('class', 'trajectory')
      .attr('d', this.linefunc1(points))
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  }

  updateChart() {
    const update = this.svg.selectAll('path').data(this.data);

    update.exit().transition().attr('stroke-width', 0).remove();

    update.enter().append('path')
      .attr('class', 'trajectory')
      .attr('stroke-width', 0)
      .transition()
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('d', d => this.linefunc1(d.points))
      .attr('stroke', d => d.color);
  }
  removeItem() {
    this.data.pop();
    this.updateChart();
  }
}
