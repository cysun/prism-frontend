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
  uploadForm: FormGroup;
  modal: NgbModalRef;
  options: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false,
    size: 'lg',
  };

  document: Document = new Document();
  message: string;
  file: File;

  constructor(private documentService: DocumentService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.documentService.retrieveDocument('5a7a17879b263d9503ca14d1').subscribe( data => {
      this.document = data;
    })

    // this.createForm();
  }

  // createForm() {
  //   this.uploadForm = this.formBuilder.group({
  //     message: ['', Validators.required],
  //     file: [null, Validators.required]
  //   })
  // }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      // this.uploadForm.setValue({'file': this.file});
    }
  }

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

  uploadFile() {
    // this.documentService.postRevision(this.document._id, this.message).subscribe( data => {
    //   this.document = data;
    // });

    this.documentService.uploadFile(this.document._id, '0', this.file).subscribe( data => {
      console.log(data)
      this.document = data;
    });
  }


}
