import { TestBed } from '@angular/core/testing';
import { SnackBarAppService } from './snack-bar-app.services';


describe('SnackBarAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SnackBarAppService = TestBed.get(SnackBarAppService);
    expect(service).toBeTruthy();
  });
});
