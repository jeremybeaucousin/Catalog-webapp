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

  materials: {
    id: number;
    description: string;
  }[];

  data = {};

  // stepsForm: FormGroup;
  // steps: FormArray;

  // get stepsArray() {
  //   return this.stepsForm.get('steps') as FormArray;
  // }

  // createStep(value): FormGroup {
  //   return this.formBuilder.group({
  //     description: value
  //   });
  // }

  // addStep(value): void {
  //   this.steps = this.stepsForm.get('items') as FormArray;
  //   this.steps.push(this.createStep(value));
  // }

  // removeStep(index): void {
  //   this.steps = this.stepsForm.get('items') as FormArray;
  //   this.steps.removeAt(index);
  // }

  // Test
  stepsForm: FormGroup;
  steps: FormArray;

  createStep(value): FormGroup {
    return this.formBuilder.group({
      description: value,
    });
  }

  addStep(value): void {
    this.steps = this.stepsForm.get('steps') as FormArray;
    this.steps.push(this.createStep(value));
  }

  removeStep(index): void {
    this.steps = this.stepsForm.get('steps') as FormArray;
    this.steps.removeAt(index);
  }

  materialsForm: FormGroup;

  @ViewChild(MatInput, { static: false }) matInput: MatInput;

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogApiService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.stepsForm = this.formBuilder.group({
      description: '',
      steps: this.formBuilder.array([])
    });

    // this.stepsForm = this.formBuilder.group({
    //   description: "",
    //   items: this.formBuilder.array([this.addStep("")])
    // });

    this.materialsForm = this.formBuilder.group({
      materialsArray: this.formBuilder.array([])
    });

    this.materials = [];
    this.route.params.subscribe(params => {
      this._id = params['_id'];
      if (this._id) {
        this.catalogService.getToolBoxSheetById(this._id).subscribe(
          (response) => {
            if (response._source.steps) {
              response._source.steps.forEach((element, index) => {
                this.addStep(element);
              });
            } else
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
        this.materials = [];
      }
    });
  }

  // addStep(description) {
  //   var newStep = {
  //     id: this.steps.length,
  //     description: description
  //   };
  //   this.steps.push(newStep);
  //   this.stepsArray.push(this.formBuilder.control(false));
  // }

  // removeStep(index) {
  //   this.steps.splice(index, 1);
  //   this.stepsArray.removeAt(index);
  // }

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
    var values = data.value;
    console.log(this.steps);
    if (this.steps && this.steps.value) {
      var steps: Array<string> = [];
      this.steps.value.forEach(
        element => {
          steps.push(element.description);
        });
      values.steps = steps;
    }
    values.materials = this.materialsArray.value;
    if (this._id) {
      this.catalogService.editToolBoxSheet(this._id, values).subscribe(
        response => {
          this._snackBar.open("Fiche mise à jour", "fermer", {
            // In seconds
            duration: 3 * 1000,
          });
        });
    } else {
      this.catalogService.addToolBoxSheet(values).subscribe(
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
