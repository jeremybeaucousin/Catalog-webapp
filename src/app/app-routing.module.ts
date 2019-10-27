import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ToolBoxSheetsComponent } from './tool-box-sheets/tool-box-sheets.component';
import { ToolBoxSheetComponent } from './tool-box-sheet/tool-box-sheet.component';
import { CanActivatePublic } from './permissions/can-activate-public';
import { CanActivateAdmin } from './permissions/can-activate-admin';
import { ToolBoxTableComponent } from './tool-box-table/tool-box-table.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [CanActivatePublic],
    children: [

    ]
  },
  {
    path: 'tool-box-sheets',
    data: {
      breadcrumb: "Boite à outils",
      i18n: "Label for toolboxes page link in navigation@@navToolBoxesPage"
    },
    component: ToolBoxSheetsComponent,
    canActivate: [CanActivatePublic],
    children: [
      {
        path: '',
        data: {
          breadcrumb: "Tableau de bord",
          i18n: "Label for toolbox dashboard link in navigation@@navToolBoxesOverviewPage"
        },
        component: ToolBoxTableComponent,
        canActivate: [CanActivateAdmin],
      },
      {
        path: 'tool-box-sheet',
        data: {
          breadcrumb: "Boite à outil",
          i18n: "Label for toolbox page link in navigation@@navToolBoxPage"
        },
        component: ToolBoxSheetComponent,
        canActivate: [CanActivateAdmin],
      },
      {
        path: 'tool-box-sheet/:_id',
        data: {
          breadcrumb: "Boite à outil",
          i18n: "Label for toolbox page link in navigation@@navToolBoxPage"
        },
        component: ToolBoxSheetComponent,
        canActivate: [CanActivateAdmin],
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
