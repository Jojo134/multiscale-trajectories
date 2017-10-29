import { Injectable } from '@angular/core';

@Injectable()
export class SelectionService {
  private selected_participants = Array<{ name: string, id: number }>();
  private selected_stimuli = Array<{ name: string, id: number }>();
  constructor() { }
  getSelectedParticipants(): Array<{ name: string, id: number }> {
    return this.selected_participants;
  }
  getSelectedSimuli(): Array<{ name: string, id: number }> {
    return this.selected_stimuli;
  }
  setSelectedParticipants(p: Array<{ name: string, id: number }>) {
    this.selected_participants = p;
  }
  setSelectedStimuli(s: Array<{ name: string, id: number }>) {
    this.selected_stimuli = s;
  }
}
