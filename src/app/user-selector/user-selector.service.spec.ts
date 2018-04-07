import { TestBed, inject } from '@angular/core/testing';

import { UserSelectorService } from './user-selector.service';

describe('UserSelectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserSelectorService]
    });
  });

  it('should be created', inject([UserSelectorService], (service: UserSelectorService) => {
    expect(service).toBeTruthy();
  }));
});
