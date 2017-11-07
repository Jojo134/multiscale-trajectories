import { Component, OnInit, Output, Input, ElementRef, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-histogram-slider',
  templateUrl: './histogram-slider.component.html',
  styleUrls: ['./histogram-slider.component.css']
})
export class HistogramSliderComponent implements OnInit {
  @Input() private data;
  @Output() selectedValues = new EventEmitter<any>();
  // private data = [0.1, 0.2, 0.3, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  chartData;
  someRange = [0, 0];
  constructor() {
  }
  ngOnInit() {
  }
  valueChange() {
    this.selectedValues.emit(this.someRange);
  }
}
