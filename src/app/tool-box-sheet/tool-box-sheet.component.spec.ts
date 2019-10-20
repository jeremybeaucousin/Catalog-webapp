import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolBoxSheetComponent } from './tool-box-sheet.component';

describe('ToolBoxSheetComponent', () => {
  let component: ToolBoxSheetComponent;
  let fixture: ComponentFixture<ToolBoxSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolBoxSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolBoxSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
