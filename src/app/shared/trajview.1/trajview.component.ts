import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

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

  constructor() { }

  ngOnInit() {
    this.createChart();
    console.log('trajviewchart created')
    if (this.data) {
      this.updateChart();
      console.log(this.data)
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
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");

    // set the ranges
    var x = d3.scaleTime().range([0, this.width]);
    var y = d3.scaleLinear().range([this.height, 0]);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    let svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight)
      .append("g")
      .attr("transform",
      "translate(" + this.margin.left + "," + this.margin.top + ")");

    var circle = svg.append("circle")
      .attr("cx", 30)
      .attr("cy", 30)
      .attr("r", 20);
    /*svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.make_x_gridlines()
        .tickSize(-this.height)
        .tickFormat()
      )

    // add the Y gridlines
    svg.append("g")
      .attr("class", "grid")
      .call(this.make_y_gridlines()
        .tickSize(-this.width)
        .tickFormat()
      )*/
  }
  make_x_gridlines() {
    return d3.axisBottom(this.xScale)
      .ticks(5)
  }

  // gridlines in y axis function
  make_y_gridlines() {
    return d3.axisLeft(this.yScale)
      .ticks(5)
  }

  updateChart() {
  }
}
