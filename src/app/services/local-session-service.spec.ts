import { TestBed } from '@angular/core/testing';

import { LocalSessionService } from './local-session-service';

describe('LocalSessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalSessionService = TestBed.get(LocalSessionService);
    expect(service).toBeTruthy();
  });
});
