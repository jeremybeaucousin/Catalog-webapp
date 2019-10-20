import { Component, OnInit } from '@angular/core';
import { CatalogApiService } from '../catalog-api.service';

@Component({
  selector: 'app-tool-box-sheets',
  templateUrl: './tool-box-sheets.component.html',
  styleUrls: ['./tool-box-sheets.component.sass']
})
export class ToolBoxSheetsComponent implements OnInit {

  constructor(private catalogService: CatalogApiService) { }

  sheets;

  ngOnInit() {
    this.catalogService.getToolBoxSheets().subscribe(
      (data) => {
        this.sheets = data;
      }
    )
  }

}
