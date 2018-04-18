import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ExternalUpload } from '../models/external-upload.model';
import { ExternalUploadService } from './external-upload.service';

@Component({
  selector: 'prism-external-upload',
  templateUrl: './external-upload.component.html',
  styleUrls: ['./external-upload.component.css']
})
export class ExternalUploadComponent implements OnInit {
  token: string;
  externalReport: ExternalUpload;

  file: File;
  fileName: string;

  constructor(private externalUploadService: ExternalUploadService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe( params => {
      this.token = params.token;
    });

    this.externalUploadService.getExternalUpload(this.token).subscribe( data => {
      this.externalReport = data;
    })
  }

  /* Set file variable to the file the user has chosen */
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileName = event.target.files[0].name;
    }
  }

  /* Submit file to the database */
  submitExternalUpload() {
    if (this.file && this.fileName) {
      this.externalUploadService.uploadExternalDocument(this.externalReport.token,
        this.file).subscribe( () => {
          this.externalReport.completed = true;
      })
    }
  }
}
