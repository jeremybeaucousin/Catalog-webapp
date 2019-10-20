import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, NgForm, FormArray } from '@angular/forms';

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

  steps: {
    id: number;
    description: string;
  }[];

  materials: {
    id: number;
    description: string;
  }[];

  data = {};

  stepsForm: FormGroup;
  materialsForm: FormGroup;

  @ViewChild(MatInput, { static: false }) matInput: MatInput;

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogApiService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {

    this.stepsForm = this.formBuilder.group({
      stepsArray: this.formBuilder.array([])
    });

    this.materialsForm = this.formBuilder.group({
      materialsArray: this.formBuilder.array([])
    });

  }

  ngOnInit() {
    this.steps = [];
    this.materials = [];
    this.route.params.subscribe(params => {
      this._id = params['_id'];
      if (this._id) {
        this.catalogService.getToolBoxSheetById(this._id).subscribe(
          (response) => {
            console.log("load", response);
            if (!response._source.steps) {
              this.steps = [];
            } else {
              this.steps = response._source.steps;
            }
            if (!response._source.materials) {
              this.materials = [];
            } else {
              this.materials = response._source.materials;
            }
            this.data = response._source;
          }
        );
      } else {
        this.steps = [];
        this.materials = [];
      }
    });
  }

  get stepsArray() {
    return this.stepsForm.get('stepsArray') as FormArray;
  }

  addStep(item) {
    this.steps.push(item);
    this.stepsArray.push(this.formBuilder.control(false));
  }

  removeStep(index) {
    this.steps.splice(index, 1);
    this.stepsArray.removeAt(index);
  }

  get materialsArray() {
    return this.materialsForm.get('materialsArray') as FormArray;
  }

  addMaterial(item) {
    this.materials.push(item);
    this.materialsArray.push(this.formBuilder.control(false));
  }

  removeMaterial(index) {
    this.materials.splice(index, 1);
    this.materialsArray.removeAt(index);
  }

  onSubmit(data: NgForm) {
    console.log(data.value);
    console.log(data.valid);
    console.log(this.steps);

    console.log(this.stepsForm.value);
    console.log(this.materials);
    console.log(this.materialsForm.value);
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
