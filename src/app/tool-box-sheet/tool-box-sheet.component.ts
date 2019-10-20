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
            if (!response._source.steps) {
              this.steps = [];
            } else {
              response._source.steps.forEach((element, index) => {
                this.addStep(element);
              });
            }
            if (!response._source.materials) {
              this.materials = [];
            } else {
              response._source.materials.forEach((element, index) => {
                this.addMaterial(element);
              })
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

  addStep(description) {
    var newStep = {
      id: this.steps.length,
      description: description
    };
    this.steps.push(newStep);
    this.stepsArray.push(this.formBuilder.control(false));
  }

  removeStep(index) {
    this.steps.splice(index, 1);
    this.stepsArray.removeAt(index);
  }

  get materialsArray() {
    return this.materialsForm.get('materialsArray') as FormArray;
  }

  addMaterial(description) {
    var newMateriel = {
      id: this.materials.length,
      description: description
    };
    this.materials.push(newMateriel);
    this.materialsArray.push(this.formBuilder.control(false));
  }

  removeMaterial(index) {
    this.materials.splice(index, 1);
    this.materialsArray.removeAt(index);
  }

  onSubmit(data: NgForm) {
    // Add Values from form array
    data.value.steps = this.stepsArray.value;
    data.value.materials = this.materialsArray.value;
    if (this._id) {
      this.catalogService.editToolBoxSheet(this._id, data.value).subscribe(
        response => {
          this._snackBar.open("Fiche mise à jour", "fermer", {
            // In seconds
            duration: 3 * 1000,
          });
        });
    } else {
      this.catalogService.addToolBoxSheet(data.value).subscribe(
        response => {
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
