import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalUploadComponent } from './external-upload.component';

describe('ExternalUploadComponent', () => {
  let component: ExternalUploadComponent;
  let fixture: ComponentFixture<ExternalUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
