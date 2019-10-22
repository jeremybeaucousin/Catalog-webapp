import { Component, OnInit, Input } from '@angular/core';

import { CatalogApiService } from '../services/catalog-api.service';
import { ToolBoxSheet } from '../models/tool-box-sheet';

@Component({
  selector: 'app-tool-box-sheet-view',
  templateUrl: './tool-box-sheet-view.component.html',
  styleUrls: ['./tool-box-sheet-view.component.sass']
})
export class ToolBoxSheetViewComponent implements OnInit {

  @Input() _id: string;

  detail: ToolBoxSheet = new ToolBoxSheet();

  constructor(private catalogService: CatalogApiService) { }

  ngOnInit() {
    this.catalogService.getToolBoxSheetById(this._id).subscribe(
      (response) => {
        this.detail = response;
      }
    )
  }

}
