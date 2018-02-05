import { Component, OnInit } from '@angular/core';

import { NgbModal, NgbModalRef,  NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


import { Document } from '../models/document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'prism-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  modal: NgbModalRef;
  options: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false,
    size: 'lg',
  };

  uploadedFiles: any[] = [];
  document: Document = new Document();

  constructor(private documentService: DocumentService, private modalService: NgbModal) { }

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

  editDocumentName(documentId: string) {
    console.log('documentId: ' + documentId)
    this.documentService.editDocument(documentId, this.document).subscribe( data => {
      this.document.title = data.title;
    })
    this.modal.close();
  }

  /* Open a basic modal */
  openModal(content) {
    this.modal = this.modalService.open(content, this.options);
  }

  closeModal() {
    this.modal.close();
  }


}
