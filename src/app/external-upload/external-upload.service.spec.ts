import { TestBed, inject } from '@angular/core/testing';

import { ExternalUploadService } from './external-upload.service';

describe('ExternalUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalUploadService]
    });
  });

  it('should be created', inject([ExternalUploadService], (service: ExternalUploadService) => {
    expect(service).toBeTruthy();
  }));
});
