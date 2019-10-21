import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, NgForm, FormArray } from '@angular/forms';

import { MatInput, MatSnackBar } from '@angular/material';

import { ActivatedRoute, Router } from '@angular/router';
import { CatalogApiService } from '../catalog-api.service';

@Component({
  selector: 'app-tool-box-sheet',
  templateUrl: './tool-box-sheet.component.html',
  styleUrls: ['./tool-box-sheet.component.sass']
})
export class ToolBoxSheetComponent implements OnInit {

  _id?: string;

  data = {};

  // Steps form
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

  // Materials form
  materialsForm: FormGroup;
  materials: FormArray;

  createMaterial(value): FormGroup {
    return this.formBuilder.group({
      description: value,
    });
  }

  addMaterial(value): void {
    this.materials = this.materialsForm.get('materials') as FormArray;
    this.materials.push(this.createMaterial(value));
  }

  removeMaterial(index): void {
    this.steps = this.materialsForm.get('materials') as FormArray;
    this.steps.removeAt(index);
  }

  @ViewChild(MatInput, { static: false }) matInput: MatInput;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogApiService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.stepsForm = this.formBuilder.group({
      description: '',
      steps: this.formBuilder.array([])
    });

    this.materialsForm = this.formBuilder.group({
      description: '',
      materials: this.formBuilder.array([])
    });

    this.route.params.subscribe(params => {
      this._id = params['_id'];
      if (this._id) {
        this.catalogService.getToolBoxSheetById(this._id).subscribe(
          (response) => {
            if (response._source.steps) {
              response._source.steps.forEach((element, index) => {
                this.addStep(element);
              });
            }
            if (response._source.materials) {
              response._source.materials.forEach((element, index) => {
                this.addMaterial(element);
              });
            }
            this.data = response._source;
          }
        );
      }
    });
  }

  onSubmit(data: NgForm) {
    // Add Values from form array
    var values = data.value;
    if (this.steps && this.steps.value) {
      var steps: Array<string> = [];
      this.steps.value.forEach(
        element => {
          steps.push(element.description);
        });
      values.steps = steps;
    }

    if (this.materials && this.materials.value) {
      var materials: Array<string> = [];
      this.materials.value.forEach(
        element => {
          materials.push(element.description);
        });
      values.materials = materials;
    }



    if (this._id) {
      this.catalogService.editToolBoxSheet(this._id, values).subscribe(
        response => {
          this.useSnackBarForSubmission("mise à jour");
        });
    } else {
      this.catalogService.addToolBoxSheet(values).subscribe(
        response => {
          if (response._id) {
            this._id = response._id;
          }
          this.useSnackBarForSubmission("ajoutée");
        });
    }
  }

  useSnackBarForSubmission(actionType) {
    this._snackBar.open(`Fiche ${actionType}, vous aller être redirigé vers la liste des boites à outil`, "fermer", {
      // In seconds
      duration: 3 * 1000,
    }).afterDismissed().subscribe(
      event => {
        this.router.navigate(['/tool-box-sheets']);
      }
    );
  };
}
