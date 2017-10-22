import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-compare',
  templateUrl: './detail-compare.component.html',
  styleUrls: ['./detail-compare.component.css']
})
export class DetailCompareComponent implements OnInit {
  someRange = [3, 4];
  constructor() { }

  ngOnInit() {
  }

}
