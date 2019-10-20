import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tool-box-sheet-view',
  templateUrl: './tool-box-sheet-view.component.html',
  styleUrls: ['./tool-box-sheet-view.component.sass']
})
export class ToolBoxSheetViewComponent implements OnInit {

  @Input() _id: string;

  constructor() { }

  ngOnInit() {
    console.log(this._id);
  }

}
