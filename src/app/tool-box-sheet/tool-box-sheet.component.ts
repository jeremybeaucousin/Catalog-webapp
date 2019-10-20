import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { CatalogApiService } from '../catalog-api.service';


@Component({
  selector: 'app-tool-box-sheet',
  templateUrl: './tool-box-sheet.component.html',
  styleUrls: ['./tool-box-sheet.component.sass']
})
export class ToolBoxSheetComponent implements OnInit {

  _id?: string;
  data: Object = {
    title: "",
    materials: [
    ],
    steps: [
    ]
  };

  stepsForm: FormGroup;
  materialsForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogApiService,
    private formBuilder: FormBuilder) {

    this.stepsForm = this.formBuilder.group({
      steps: this.formBuilder.array([])
    });

    this.materialsForm = this.formBuilder.group({
      materials: this.formBuilder.array([])
    });

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this._id = params['_id'];
      if (this._id) {
        this.catalogService.getToolBoxSheetById(this._id).subscribe(
          (response) => {
            this.data = response;
          }
        );
      }
    });
  }

  save() {
    console.log(this.data);
  }
}
