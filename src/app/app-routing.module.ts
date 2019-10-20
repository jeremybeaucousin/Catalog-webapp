import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ToolBoxSheetsComponent } from './tool-box-sheets/tool-box-sheets.component';
import { ToolBoxSheetComponent } from './tool-box-sheet/tool-box-sheet.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tool-box-sheets', component: ToolBoxSheetsComponent },
  { path: 'tool-box-sheet', component: ToolBoxSheetComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
