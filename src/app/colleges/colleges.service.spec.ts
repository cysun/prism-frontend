import { TestBed, inject } from '@angular/core/testing';

import { CollegesService } from './colleges.service';

describe('CollegesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollegesService]
    });
  });

  it('should be created', inject([CollegesService], (service: CollegesService) => {
    expect(service).toBeTruthy();
  }));
});
