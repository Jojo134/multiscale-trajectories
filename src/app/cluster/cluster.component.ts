import { Component, OnInit } from '@angular/core';
import { SelectionService, DataService } from '../shared';
import { QTree, Trajectory, TrajectoryViewType } from '../data-structures';
@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {
  someRange = [3, 4];
  private chartData: Array<any>;
  nrLines: number;
  minQuadsize = 20;
  simScores;
  dataLoaded = false;

  participants = [];
  stimuli = [];
  viewAsQuadtree: boolean;
  selected_participants = Array<{ name: string, id: number }>();
  selected_stimuli = Array<{ name: string, id: number }>();
  resolutionName = '/assets/resolution.txt';
  filenameall = 'assets/all_fixation_data_cleaned_up.csv';
  filename = 'assets/small_fix_data_cleaned.csv';
  filteredFixData: Array<TrajectoryViewType> = [];
  fix_data: Array<Trajectory> = [];
  resolutions: Array<{ city: string, height: number, width: number }> = [];
  qTree: QTree;
  simMatrix: number[][];
  constructor(private selectionService: SelectionService, private dataService: DataService) { }

  ngOnInit() {
    console.log(this.selectionService.getSelectedParticipants());
    this.selected_stimuli = this.selectionService.getSelectedSimuli();
    this.selected_participants = this.selectionService.getSelectedParticipants();
    this.participants = this.dataService.getParticioants();
    this.stimuli = this.dataService.getStimuli();
  }

}
