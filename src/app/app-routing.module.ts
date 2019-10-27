import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ToolBoxSheetsComponent } from './tool-box-sheets/tool-box-sheets.component';
import { ToolBoxSheetComponent } from './tool-box-sheet/tool-box-sheet.component';
import { CanActivatePublic } from './permissions/can-activate-public';
import { CanActivateAdmin } from './permissions/can-activate-admin';
import { ToolBoxTableComponent } from './tool-box-table/tool-box-table.component';
import { CanActivateUser } from './permissions/can-activate-user';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [CanActivatePublic],
    children: [

    ]
  },
  {
    path: 'tool-box-sheets',
    data: {
      breadcrumbTranslationKey: "NAV_TOOLBOXES_PAGE"
    },
    component: ToolBoxSheetsComponent,
    canActivate: [CanActivatePublic],
    children: [
      {
        path: '',
        data: {
          breadcrumbTranslationKey: "NAV_TOOLBOXES_DASHBOARD_PAGE"
        },
        component: ToolBoxTableComponent,
        canActivate: [CanActivatePublic],
      },
      {
        path: 'tool-box-sheet',
        component: ToolBoxSheetComponent,
        data: {
          breadcrumbTranslationKey: "NAV_TOOLBOXES_TOOLBOXE_PAGE"
        },
        canActivate: [CanActivateAdmin]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    canActivate: [CanActivatePublic]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
