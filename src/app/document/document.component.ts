import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef,  NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { Document } from '../models/document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'prism-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})
export class DocumentComponent implements OnInit {
  modal: NgbModalRef;
  options: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false,
    size: 'lg',
  };

  alert: any;
  document: Document = new Document();
  revision: any[];
  revisionIndex: string;
  totalIndices: Number;
  message: string;
  file: File;
  fileName: string;

  constructor(private documentService: DocumentService, private modalService: NgbModal) { }

  ngOnInit() {
    this.documentService.retrieveDocument('5a7a17879b263d9503ca14d1').subscribe( data => {
      this.document = data;
      this.totalIndices = this.getNumOfRevisions();
    })
  }

  /* Set file variable to the file the user has chosen */
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileName = event.target.files[0].name;
    }
  }

  /* Get the total amount of revisions in the document */
  getNumOfRevisions() {
    return Object.keys(this.document.revisions).length;
  }

  /* Open a basic modal passing the data of the specific revision */
  openModal(content, revisionIndex?: string) {
    if (revisionIndex) {
      this.revision = this.document.revisions[revisionIndex];
      this.revisionIndex = revisionIndex;
    }
    this.modal = this.modalService.open(content, this.options);
  }

  /* Close a modal */
  closeModal() {
    this.alert = '';
    this.message = '';
    this.file = null;
    this.fileName = '';
    this.modal.close();
  }

  /* Create a new document (for frontend test purposes only) */
  createNewDocument(documentTitle: string) {
    this.documentService.createDocument(documentTitle).subscribe( data => {
      this.document = data;
      console.log(data);
    })
  }

  /* Edit document's title */
  editDocumentName(documentId: string) {
    this.documentService.editDocument(documentId, this.document).subscribe( data => {
      this.document.title = data.title;
    })
    this.modal.close();
  }

  /* Retrieve document data */
  retrieveDocument() {
    this.documentService.retrieveDocument(this.document._id).subscribe( data => {
      this.document = data;
      this.totalIndices = this.getNumOfRevisions();
    })
  }

  /* Upload revision message and the file being sent */
  uploadRevision() {
    if (this.file && this.message) {
      this.documentService.postRevision(this.document._id, this.message).subscribe( () => {
        console.log('posted a revision')
      }, (err) => {
        console.log(err)
        console.log('the num of revisions rn: ' + this.getNumOfRevisions())
        const numOfRevisions = this.getNumOfRevisions();

        this.retrieveDocument();
        this.uploadFile(numOfRevisions);
        this.closeModal();
      });
    } else if (!this.file) {
      this.alert = { message: 'Please upload a file.' };
    }
  }

  /* Upload the file along with the revision message */
  uploadFile(index) {
    this.documentService.uploadFile(this.document._id, index, this.file).subscribe( () => {
    }, (err) => {
      console.log(err);
      this.retrieveDocument();
    });
  }

  /* Delete a revision */
  deleteRevision() {
    this.documentService.deleteRevision(this.document._id, this.revisionIndex).subscribe( () => {
      this.retrieveDocument();
      this.closeModal();
    });
  }
}
