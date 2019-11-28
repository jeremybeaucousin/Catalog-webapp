import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../services/authentication-service';
import { SnackBarAppService } from '../services/snack-bar-app.services';
import { TranslationKeysConstants } from '../models/translation-keys.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private _snackBar: SnackBarAppService,
    private translate: TranslateService
  ) {

  }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  getUser() {
    return this.authenticationService.getUser();
  }

  logout() {
    this.authenticationService.logout();
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    var message = this.translate.instant(TranslationKeysConstants.AUTH_FAIL);
    if (this.form.username &&
      this.form.password) {
      this.authenticationService.login(this.form.username.value, this.form.password.value).subscribe(
        authenticate => {
          if (authenticate === true) {
            message = this.translate.instant(TranslationKeysConstants.AUTH_SUCCESS);
            // Clear form after validation
            this.loginForm.reset();
          }
          const close = this.translate.instant(TranslationKeysConstants.CLOSE);
          this._snackBar.open(message, close, {
            // In seconds
            duration: 3 * 1000,
          });
        }
      );
    }
  }
}
