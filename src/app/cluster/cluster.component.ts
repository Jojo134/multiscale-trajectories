import { Component, OnInit } from '@angular/core';
import { SelectionService } from '../shared';
@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {
  someRange = [3, 4];
  constructor(private selectionService: SelectionService) { }

  ngOnInit() {
    console.log(this.selectionService.getSelectedParticipants());
  }

}
