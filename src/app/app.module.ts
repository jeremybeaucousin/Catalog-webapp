import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { registerLocaleData } from '@angular/common';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatInputModule,
  MatButtonModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatOptionModule,
  MatSelectModule,
  MatSliderModule,
  MatDialogModule,
  MatDividerModule
} from '@angular/material';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTwitter, faLinkedin, faFacebook, faViadeo } from '@fortawesome/free-brands-svg-icons';
import {
  faSearch,
  faEdit,
  faTrash,
  faPlusCircle,
  faUsers,
  faClock
} from '@fortawesome/free-solid-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolBoxSheetsComponent } from './tool-box-sheets/tool-box-sheets.component';
import { HomeComponent } from './home/home.component';
import { ToolBoxSheetComponent } from './tool-box-sheet/tool-box-sheet.component';
import { ToolBoxSheetViewComponent } from './tool-box-sheet-view/tool-box-sheet-view.component';
import { DialogAppComponent } from './commons/dialog-app.component';
import { LoginComponent } from './login/login.component';
import { RequestInterceptor } from './request-interceptor';

import { UserToken } from './models/user-token';
import { CanActivatePublic } from './permissions/can-activate-public';
import { CanActivateToolboxesAdmin } from './permissions/can-activate-toolboxes-admin';
import { CanActivateToolboxesUser } from './permissions/can-activate-toolboxes-user';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ToolBoxTableComponent } from './tool-box-table/tool-box-table.component';

registerLocaleData(localeFr, 'fr');
registerLocaleData(localeEn, 'en');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    ToolBoxSheetsComponent,
    HomeComponent,
    ToolBoxSheetComponent,
    ToolBoxSheetViewComponent,
    DialogAppComponent,
    LoginComponent,
    BreadcrumbComponent,
    ToolBoxTableComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatSliderModule,
    MatDialogModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDividerModule,
    NgbModule,
    FontAwesomeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    CanActivatePublic,
    CanActivateToolboxesAdmin,
    CanActivateToolboxesUser,
    UserToken
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogAppComponent,
  ]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faTwitter);
    library.addIcons(faLinkedin);
    library.addIcons(faFacebook);
    library.addIcons(faViadeo);
    library.addIcons(faSearch);
    library.addIcons(faEdit);
    library.addIcons(faTrash);
    library.addIcons(faPlusCircle);
    library.addIcons(faUsers);
    library.addIcons(faClock);
  }
}
