import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolBoxTableComponent } from './tool-box-table.component';

describe('ToolBoxTableComponent', () => {
  let component: ToolBoxTableComponent;
  let fixture: ComponentFixture<ToolBoxTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolBoxTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolBoxTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
