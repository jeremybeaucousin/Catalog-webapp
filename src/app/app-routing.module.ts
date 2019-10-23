import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ToolBoxSheetsComponent } from './tool-box-sheets/tool-box-sheets.component';
import { ToolBoxSheetComponent } from './tool-box-sheet/tool-box-sheet.component';
import { CanActivatePublic } from './permissions/can-activate-public';
import { CanActivateAdmin } from './permissions/can-activate-admin';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [CanActivatePublic]
  },
  {
    path: 'tool-box-sheets',
    component: ToolBoxSheetsComponent,
    canActivate: [CanActivatePublic]
  },
  {
    path: 'tool-box-sheet',
    children: [
      {
        path: '',
        component: ToolBoxSheetComponent,
        canActivate: [CanActivateAdmin]
      },
      {
        path: ':_id',
        component: ToolBoxSheetComponent,
        canActivate: [CanActivateAdmin]
      },
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
