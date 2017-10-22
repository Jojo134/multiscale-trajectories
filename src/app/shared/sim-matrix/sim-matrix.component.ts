import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-sim-matrix',
  templateUrl: './sim-matrix.component.html',
  styleUrls: ['./sim-matrix.component.css']
})
export class SimMatrixComponent implements OnInit, OnChanges {
  @Input() simMatrix;
  @Input() labels;
  constructor() { }

  ngOnInit() {
    const correlationMatrix = [
      [1, 0.3, 0, 0.8, 0, 0.2, 1, 0.5, 0, 0.75],
      [0.3, 1, 0.5, 0.2, 0.4, 0.3, 0.8, 0.1, 1, 0],
      [0, 0.5, 1, 0.4, 0, 0.9, 0, 0.2, 1, 0.3],
      [0.8, 0.2, 0.4, 1, 0.3, 0.4, 0.1, 1, 0.2, 0.9],
      [0, 0.4, 0, 0.3, 1, 0.1, 0.4, 0, 0.6, 0.7],
      [0.2, 0.3, 0.9, 0.4, 0.1, 1, 0, 0.1, 0.4, 0.1],
      [1, 0.8, 0, 0.1, 0.4, 0, 1, 0.5, 0, 1],
      [0.5, 0.1, 0.2, 1, 0.1, 0, 0.5, 1, 0, 0.4],
      [0, 1, 1, 0.2, 0.6, 0.4, 0, 0, 1, 0.6],
      [0.75, 0, 0.3, 0.9, 0.7, 0.1, 1, 0.4, 0.6, 1]
    ];

    const labels = ['Var 1', 'Var 2', 'Var 3', 'Var 4', 'Var 5', 'Var 6', 'Var 7', 'Var 8', 'Var 9', 'Var 10'];
    if (this.simMatrix) {
      this.Matrix({
        container: '#container',
        data: correlationMatrix,
        labels: labels,
        start_color: '#ffffff',
        end_color: '#3498db'
      });
    }
  }
  ngOnChanges() {
    if (this.simMatrix) {
      this.Matrix({
        container: '#container',
        data: this.simMatrix,
        labels: this.labels,
        start_color: '#ffffff',
        end_color: '#3498db'
      });
    }
  }
  Matrix(options) {
    const margin = { top: 50, right: 50, bottom: 100, left: 100 },
      width = 350,
      height = 350,
      data = options.data,
      container = options.container,
      labelsData = options.labels,
      startColor = options.start_color,
      endColor = options.end_color;

    const widthLegend = 100;

    if (!data) {
      throw new Error('Please pass data');
    }

    if (!Array.isArray(data) || !data.length || !Array.isArray(data[0])) {
      throw new Error('It should be a 2-D array');
    }

    const maxValue = Number(d3.max(data, function (layer) { return d3.max(layer); }));
    const minValue = Number(d3.min(data, function (layer) { return d3.min(layer); }));

    const numrows = data.length;
    const numcols = data[0].length;

    const svg = d3.select(container).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const background = svg.append('rect')
      .style('stroke', 'black')
      .style('stroke-width', '2px')
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleBand().domain(d3.range(1, numcols).map(v => v.toString()));

    /*const x = d3.scaleOrdinal()
      .domain(d3.range(numcols))
      .rangeBands([0, width]);
  */
    const y = d3.scaleBand().domain(d3.range(1, numrows).map(v => v.toString()));

    /*const y = d3.scaleOrdinal()
      .domain(d3.range(numrows))
      .rangeBands([0, height]);
  */
    const colorMap = d3.scaleLinear()
      .domain([Number(minValue), maxValue])
      .range([startColor, endColor]);

    const row = svg.selectAll('.row')
      .data(data)
      .enter().append('g')
      .attr('class', 'row')
      .attr('transform', function (d, i) { return 'translate(0,' + y.bandwidth() * i * height + ')'; });

    const cell = row.selectAll('.cell')
      .data(function (d) { return d; })
      .enter().append('g')
      .attr('class', 'cell')
      .attr('transform', function (d, i) { return 'translate(' + x.bandwidth() * i * width + ', 0)'; });

    cell.append('rect')
      .attr('width', x.bandwidth() * width)
      .attr('height', y.bandwidth() * height)
      .style('stroke-width', 0);

    cell.append('text')
      .attr('dy', '.32em')
      .attr('x', x.bandwidth() * width / 2)
      .attr('y', y.bandwidth() * height / 2)
      .attr('text-anchor', 'middle')
      .style('fill', function (d, i) { return d >= maxValue / 2 ? 'white' : 'black'; });
    // .text(function (d, i) { return d['title']; });

    row.selectAll('.cell')
      .data(function (d, i) { return data[i]; })
      .style('fill', colorMap);

    const labels = svg.append('g')
      .attr('class', 'labels');

    const columnLabels = labels.selectAll('.column-label')
      .data(labelsData)
      .enter().append('g')
      .attr('class', 'column-label')
      .attr('transform', function (d, i) { return 'translate(' + x.bandwidth() * i * width + ',' + height + ')'; });

    columnLabels.append('line')
      .style('stroke', 'black')
      .style('stroke-width', '1px')
      .attr('x1', x.bandwidth() * width / 2)
      .attr('x2', x.bandwidth() * height / 2)
      .attr('y1', 0)
      .attr('y2', 5);

    columnLabels.append('text')
      .attr('x', 0)
      .attr('y', y.bandwidth() * height / 2)
      .attr('dy', '.82em')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-60)');
    //      .text(function (d, i) { return d; });

    const rowLabels = labels.selectAll('.row-label')
      .data(labelsData)
      .enter().append('g')
      .attr('class', 'row-label')
      .attr('transform', function (d, i) { return 'translate(' + 0 + ',' + y.bandwidth() * i * height + ')'; });

    rowLabels.append('line')
      .style('stroke', 'black')
      .style('stroke-width', '1px')
      .attr('x1', 0)
      .attr('x2', -5)
      .attr('y1', y.bandwidth() * height / 2)
      .attr('y2', y.bandwidth() * height / 2);

    rowLabels.append('text')
      .attr('x', -8)
      .attr('y', y.bandwidth() * height / 2)
      .attr('dy', '.32em')
      .attr('text-anchor', 'end');
    // .text(function (d, i) { return d; });

    const key = d3.select('#legend')
      .append('svg')
      .attr('width', widthLegend)
      .attr('height', height + margin.top + margin.bottom);

    const legend = key
      .append('defs')
      .append('svg:linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '100%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%')
      .attr('spreadMethod', 'pad');

    legend
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', endColor)
      .attr('stop-opacity', 1);

    legend
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', startColor)
      .attr('stop-opacity', 1);

    key.append('rect')
      .attr('width', widthLegend / 2 - 10)
      .attr('height', height)
      .style('fill', 'url(#gradient)')
      .attr('transform', 'translate(0,' + margin.top + ')');

    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([minValue, maxValue]);

    const yAxis = d3.axisRight(y);

    key.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(41,' + margin.top + ')')
      .call(yAxis);
  }
}
