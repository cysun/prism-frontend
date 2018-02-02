import { Component, OnInit } from '@angular/core';

import { Document } from '../models/document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'prism-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  uploadedFiles: any[] = [];
  document: Document = new Document();

  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this.documentService.retrieveDocument('5a74ec2a2be15015df5ea703').subscribe( data => {
      this.document = data;
    })

  }

  // onUploadHandler(event) {
  //   for (let file of event.files) {
  //     this.uploadedFiles.push(file);
  //   }
  //   this.msgs = [];
  //   this.msgs.push({severity: 'info', summary: 'File has been uploaded', detail: ''});
  // }

  createNewDocument(documentTitle: string) {
    this.documentService.createDocument(documentTitle).subscribe( data => {
      this.document = data;
      console.log(data);
    })
  }
}
