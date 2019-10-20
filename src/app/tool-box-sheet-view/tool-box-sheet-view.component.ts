import { Component, OnInit, Input } from '@angular/core';

import { CatalogApiService } from '../catalog-api.service';

@Component({
  selector: 'app-tool-box-sheet-view',
  templateUrl: './tool-box-sheet-view.component.html',
  styleUrls: ['./tool-box-sheet-view.component.sass']
})
export class ToolBoxSheetViewComponent implements OnInit {

  @Input() _id: string;

  detail;

  constructor(private catalogService: CatalogApiService) { }

  ngOnInit() {
    this.catalogService.getToolBoxSheetById(this._id).subscribe(
      (response) => {
        this.detail = response;
      }
    )
  }

}
