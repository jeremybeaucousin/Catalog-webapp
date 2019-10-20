import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolBoxSheetsComponent } from './tool-box-sheets.component';

describe('ToolBoxSheetsComponent', () => {
  let component: ToolBoxSheetsComponent;
  let fixture: ComponentFixture<ToolBoxSheetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolBoxSheetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolBoxSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
