import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolBoxSheetViewComponent } from './tool-box-sheet-view.component';

describe('ToolBoxSheetViewComponent', () => {
  let component: ToolBoxSheetViewComponent;
  let fixture: ComponentFixture<ToolBoxSheetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolBoxSheetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolBoxSheetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
