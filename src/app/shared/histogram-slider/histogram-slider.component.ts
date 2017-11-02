import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-histogram-slider',
  templateUrl: './histogram-slider.component.html',
  styleUrls: ['./histogram-slider.component.css']
})
export class HistogramSliderComponent implements OnInit {
  @ViewChild('histo') private chartContainer: ElementRef;
  //@Input() private data = [0.1, 0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  private data = [0.1, 0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  chartData;
  currentValue = 0;
  someRange = [3, 5];
  constructor() {
    let data = [['Index 0', 0.1], ['Index 1', 0.2], ['Index 2', 0.3], ['Index 3', 0.4],
    ['Index 4', 0.5], ['Index 5', 0.6], ['Index 6', 0.7], ['Index 7', 0.8], ['Index 8', 0.9], ['Index 9', 1]];
    this.chartData = data;
  }
  // https://bl.ocks.org/officeofjane/f132634f67b114815ba686484f9f7a77
  ngOnInit() {

  }
}
