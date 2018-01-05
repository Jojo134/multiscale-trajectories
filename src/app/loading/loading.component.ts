import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Ng2FileInputService, Ng2FileInputAction } from 'ng2-file-input';
import { DataService } from '../shared';
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  resolutionName = '/assets/resolution.txt';
  trajectoryName = '/assets/small_fix_data_cleaned.csv';
  actionLog: string;
  loading = false;
  constructor(private router: Router, private dataService: DataService, private ng2FileInputService: Ng2FileInputService) { }

  ngOnInit() {
    this.loading = false;
  }
  loadData() {
    console.log(this.trajectoryName, this.resolutionName);
    this.loading = true;
    this.dataService.loadData(this.trajectoryName, this.resolutionName);
  }
  public onAction(event: any) {
    console.log(event);
    this.actionLog += '\n currentFiles: ' + this.getFileNames(event.currentFiles);
    console.log(this.actionLog);
  }
  public onAdded(event: any) {
    this.actionLog += '\n FileInput: ' + event.id;
    this.actionLog += '\n Action: File added';
  }
  public onRemoved(event: any) {
    this.actionLog += '\n FileInput: ' + event.id;
    this.actionLog += '\n Action: File removed';
  }
  private getFileNames(files: File[]): string {
    const names = files.map(file => file.name);
    return names ? names.join(', ') : 'No files currently added.';
  }
}
