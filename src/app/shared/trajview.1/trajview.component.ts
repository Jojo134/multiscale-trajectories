import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { Trajectory } from '../../data-structures';

@Component({
  selector: 'app-trajview1',
  templateUrl: './trajview.component.html',
  styleUrls: ['./trajview.component.css']
})
export class Trajview1Component implements OnInit, OnChanges {
  @ViewChild('chart1') private chartContainer: ElementRef;
  @Input() private data: any;
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
      console.log('component', this.data)
    }
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  createChart() {
    // set the dimensions and margins of the graph
    let element = this.chartContainer.nativeElement;
    //this.width = element.offsetWidth - this.margin.left - this.margin.right;
    //this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.width = 1650;
    this.height = 1200;

    // set the ranges
    var x = d3.scaleTime().range([0, this.width]);
    var y = d3.scaleLinear().range([this.height, 0]);

    this.svg = d3.select(element).append('svg')
      .attr('width', 1700)
      .attr('height', 1300)
      .append("g")
      .attr("transform",
      "translate(" + this.margin.left + "," + this.margin.top + ")");

    var circle = this.svg.append("circle")
      .attr("cx", 30)
      .attr("cy", 30)
      .attr("r", 20);

    this.svg.append("circle")
      .attr("cx", 1500)
      .attr("cy", 1100)
      .attr("r", 20);

  }

  linefunc1 = d3.line()
    .x(function (d) { return d['x']; })
    .y(function (d) { return d['y']; })

  drawTraj(points, color) {
    return this.svg.append('path')
      .attr('class', 'trajectory')
      .attr("d", this.linefunc1(points))
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("fill", "none");
  }

  updateChart() {
    let update = this.svg.selectAll('path').data(this.data);

    update.exit().transition().attr('troke-width', 0).remove();

    update.enter().append('path')
      .attr('class', 'trajectory')
      .attr('stroke-width', 0)
      .transition()
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("d", d => { return this.linefunc1(d.points) })
      .attr("stroke", d => { return d.color; });
  }
  removeItem() {
    this.data.pop();
    this.updateChart();
  }
}
