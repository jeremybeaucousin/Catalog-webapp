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
          (data) => {
            if (data.steps) {
              data.steps.forEach((element, index) => {
                this.addStep(element);
              });
            }
            if (data.materials) {
              data.materials.forEach((element, index) => {
                this.addMaterial(element);
              });
            }
            this.data = data;
          }
        );
      }
    });
  }

  onSubmit(data: NgForm) {
    var extractValuesToArray = (array: Array<any>, field: string) => {
      if (array && field) {
        var values: Array<string> = [];
        array.forEach(
          element => {
            values.push(element[field]);
          });
        return values
      }
    }
    // Add Values from form array
    var values = data.value;
    if (this.steps && this.steps.value) {
      values.steps = extractValuesToArray(this.steps.value, "description");
    }

    if (this.materials && this.materials.value) {
      values.materials = extractValuesToArray(this.materials.value, "description");;
    }

    if (this._id) {
      this.catalogService.editToolBoxSheet(this._id, values).subscribe(
        response => {
          // catchError Error dont send tuple, only message
          if (response && response instanceof Array) {
            var success = response[0];
            var result = response[1];
            if (success) {
              this.useSnackBarForSubmission(`Fiche mise à jour, vous aller être redirigé vers la liste des boites à outil`, true);
            } else {
              this.useSnackBarForSubmission(`Une erreur est survenue :  ${result}`, false);
            }
          } else {
            this.useSnackBarForSubmission(`Une erreur est survenue :  ${response}`, false);
          }
        });
    } else {
      this.catalogService.addToolBoxSheet(values).subscribe(
        response => {
          // catchError Error dont send tuple, only message
          if (response && response instanceof Array) {
            var success = response[0];
            var result = response[1];
            if (success) {
              this._id = result;
              this.useSnackBarForSubmission(`Fiche ajoutée, vous aller être redirigé vers la liste des boites à outil`, true);
            } else {
              this.useSnackBarForSubmission(`Une erreur est survenue :  ${result}`, false);
            }
          } else {
            this.useSnackBarForSubmission(`Une erreur est survenue :  ${response}`, false);
          }
        });
    }
  }

  useSnackBarForSubmission(message: string, redirection: boolean) {
    this._snackBar.open(message, "fermer", {
      // In seconds
      duration: 3 * 1000,
    }).afterDismissed().subscribe(
      event => {
        if (redirection) {
          this.router.navigate(['/tool-box-sheets']);
        }
      }
    );
  };
}
