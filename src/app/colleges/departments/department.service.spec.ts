import { TestBed, inject } from '@angular/core/testing';

import { DepartmentService } from './departments.service';

describe('DepartmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DepartmentsService]
    });
  });

  it('should be created', inject([DepartmentsService], (service: DepartmentService) => {
    expect(service).toBeTruthy();
  }));
});
