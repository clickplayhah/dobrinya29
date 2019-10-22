import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Bear } from 'src/app/services/data.service.service';

@Component({
  selector: 'app-bears-list',
  templateUrl: './bears-list.component.html',
  styleUrls: ['./bears-list.component.less'],
})
export class BearsListComponent implements OnInit {
  @Input() bears: Bear[] = [];
  @Output() bear: EventEmitter<Bear> = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  select(bear: Bear) {
    this.bear.emit(bear);
  }
}
