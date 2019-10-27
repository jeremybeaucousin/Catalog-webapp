import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, NgForm, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { MatInput } from '@angular/material';

import { ActivatedRoute, Router } from '@angular/router';
import { CatalogApiService } from '../services/catalog-api.service';
import { SnackBarAppService } from '../services/snack-bar-app.services';
import { ToolBoxSheet } from '../models/tool-box-sheet';
import { TranslationKeysConstants } from '../models/translation-keys.constants';

@Component({
  selector: 'app-tool-box-sheet',
  templateUrl: './tool-box-sheet.component.html',
  styleUrls: ['./tool-box-sheet.component.sass']
})
export class ToolBoxSheetComponent implements OnInit {

  _id?: string;

  data: ToolBoxSheet = new ToolBoxSheet();

  // Steps form
  stepsForm: FormGroup;
  steps: FormArray;

  createStep(value): FormGroup {
    return this.formBuilder.group({
      description: value,
    });
  }

  get stepsArray(): FormArray {
    return this.stepsForm.get('steps') as FormArray;
  }

  addStep(value): void {
    this.steps = this.stepsArray;
    this.steps.push(this.createStep(value));
  }

  removeStep(index): void {
    this.steps = this.stepsArray;
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

  get materialsArray(): FormArray {
    return this.materialsForm.get('materials') as FormArray;
  }

  addMaterial(value): void {
    this.materials = this.materialsArray;
    this.materials.push(this.createMaterial(value));
  }

  removeMaterial(index): void {
    this.materials = this.materialsArray;
    this.materials.removeAt(index);
  }

  @ViewChild(MatInput, { static: false }) matInput: MatInput;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogApiService,
    private formBuilder: FormBuilder,
    private _snackBar: SnackBarAppService,
    private translate: TranslateService) {
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

    this.route.queryParams.subscribe(params => {
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
              const item = this.translate.instant(TranslationKeysConstants.TOOL_BOX);
              const page = this.translate.instant(TranslationKeysConstants.TOOL_BOXES_PAGE);
              const message = this.translate.instant(TranslationKeysConstants.ITEM_SAVED_REDIRECTION, { item: item, pageName: page });
              this.useSnackBarForSubmission(message, true);
            } else {
              const message = this.translate.instant(TranslationKeysConstants.ERROR_GENERAL_MESSAGE, { message: result });
              this.useSnackBarForSubmission(message, false);
            }
          } else {
            const message = this.translate.instant(TranslationKeysConstants.ERROR_GENERAL_MESSAGE, { message: response });
            this.useSnackBarForSubmission(message, false);
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
              const item = this.translate.instant(TranslationKeysConstants.TOOL_BOX);
              const page = this.translate.instant(TranslationKeysConstants.TOOL_BOXES_PAGE);
              const message = this.translate.instant(TranslationKeysConstants.ITEM_SAVED_REDIRECTION, { item: item, pageName: page });
              this.useSnackBarForSubmission(message, true);
            } else {
              const message = this.translate.instant(TranslationKeysConstants.ERROR_GENERAL_MESSAGE, { message: result });
              this.useSnackBarForSubmission(message, false);
            }
          } else {
            const message = this.translate.instant(TranslationKeysConstants.ERROR_GENERAL_MESSAGE, { message: response });
            this.useSnackBarForSubmission(message, false);
          }
        });
    }
  }

  useSnackBarForSubmission(message: string, redirection: boolean) {
    const close = this.translate.instant(TranslationKeysConstants.CLOSE);
    this._snackBar.open(message, close, {
      // In seconds
      duration: 3 * 1000,
    }).afterDismissed().subscribe(
      event => {
        if (redirection) {
          this.router.navigate(['tool-box-sheets']);
        }
      });
  };
}
