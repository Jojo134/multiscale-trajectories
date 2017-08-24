import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.css']
})
export class MultiselectComponent implements OnInit {
  @Input() public items: any[] = [];
  @Output() public selectedItems = new EventEmitter<any[]>();
  public selected: any[] = [];
  constructor() {
  }

  ngOnInit() {

  }

  toggleMultiSelect(event, val) {
    event.preventDefault();
    if (this.selected.indexOf(val) == -1) {
      this.selected = [...this.selected, val];
      var elem = document.getElementById(val.id);
      elem.className += " fa fa-check";
    } else {
      var elem = document.getElementById(val.id);
      elem.className = elem.className.split(' ').splice(0, elem.className.split(' ').length - 2).join(' ');
      this.selected = this.selected.filter(function (elem) {
        return elem != val;
      })
    }
    this.selectedItems.emit(this.selected);
  }


}
