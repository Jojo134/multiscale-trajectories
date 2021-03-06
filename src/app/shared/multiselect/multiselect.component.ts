import { Component, OnInit, Input, Output, EventEmitter, Renderer, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.css']
})
export class MultiselectComponent implements OnInit {
  @ViewChild('multiselect') element: ElementRef;
  @Input() public items: any[] = [];
  @Output() public selectedItems = new EventEmitter<any[]>();
  public selected: any[] = [];
  constructor(private renderer: Renderer) {
  }

  ngOnInit() {

  }

  toggleMultiSelect(event, val) {
    event.preventDefault();
    const elem = (event.target as Element).getElementsByTagName('i')[0];
    // this.renderer.setElementClass(event.target, 'fa fa-fw fa-square-o', true);
    if (this.selected.indexOf(val) === -1) {
      this.selected = [...this.selected, val];
      elem.className = elem.className.replace('fa fa-fw fa-square-o', 'fa fa-fw fa-check-square-o');
    } else {
      elem.className = elem.className.replace('fa fa-fw fa-check-square-o', 'fa fa-fw fa-square-o');
      this.selected = this.selected.filter(element => {
        return element !== val;
      });
    }
    this.selectedItems.emit(this.selected);
  }


}
