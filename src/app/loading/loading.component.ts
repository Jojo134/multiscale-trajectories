import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2FileInputService } from 'ng2-file-input';
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
  public onActionTraj(event: any) {
    console.log(event);
    this.actionLog += '\n currentFiles: ' + this.getFileNames(event.currentFiles);
    console.log(this.getTempPaths(event.currentFiles));
    this.trajectoryName = this.getTempPaths(event.currentFiles)[0];
    console.log(this.actionLog);
  }
  public onActionRes(event: any) {
    console.log(event);
    this.actionLog += '\n currentFiles: ' + this.getFileNames(event.currentFiles);
    console.log(this.getTempPaths(event.currentFiles));
    this.resolutionName = this.getTempPaths(event.currentFiles)[0];
    console.log(this.actionLog);
  }
  private getFileNames(files: File[]): string {
    const names = files.map(file => file.name);
    return names ? names.join(', ') : 'No files currently added.';
  }
  private getTempPaths(files: File[]): string[] {
    return files.map(file => URL.createObjectURL(file));
  }
}
