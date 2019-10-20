import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, NgForm } from '@angular/forms';

import { MatInput, MatSnackBar } from '@angular/material';

import { ActivatedRoute } from '@angular/router';
import { CatalogApiService } from '../catalog-api.service';

@Component({
  selector: 'app-tool-box-sheet',
  templateUrl: './tool-box-sheet.component.html',
  styleUrls: ['./tool-box-sheet.component.sass']
})
export class ToolBoxSheetComponent implements OnInit {

  _id?: string;

  data = {
    steps: [],
    materials: []
  };

  stepsForm: FormGroup;
  materialsForm: FormGroup;

  @ViewChild(MatInput, { static: false }) matInput: MatInput;

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogApiService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {

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
            console.log("load", response);
            if (!response._source.steps) {
              response._source.steps = [];
            }
            if (!response._source.materials) {
              response._source.materials = [];
            }
            this.data = response._source;
          }
        );
      }
    });
  }

  save() {
    console.log(this.data);

  }

  onSubmit(data: NgForm) {
    console.log(data.value);
    console.log(data.valid);
    console.log(this.materialsForm.value);
    console.log(this.stepsForm.value);
    if (this._id) {
      this.catalogService.editToolBoxSheet(this._id, data.value).subscribe(
        response => {
          console.log(response);
          this._snackBar.open("Fiche mise à jour", "fermer", {
            // In seconds
            duration: 3 * 1000,
          });
        });
    } else {
      this.catalogService.addToolBoxSheet(data.value).subscribe(
        response => {
          console.log(response);
          if (response._id) {
            this._id = response._id;
          }
          this._snackBar.open("Fiche ajoutée", "fermer", {
            // In seconds
            duration: 3 * 1000,
          });
        });
    }
  }
}
