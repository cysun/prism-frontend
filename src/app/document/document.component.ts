import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../shared/app.global';

import { Document } from '../models/document.model';
import { DocumentService } from './document.service';

import { saveAs } from 'file-saver';

@Component({
  selector: 'prism-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})
export class DocumentComponent implements OnInit {
  modal: NgbModalRef;
  alert: any;
  document: Document = new Document();
  currentRevision: any[];
  mainRevision: any[];

  revisionIndex: number;
  totalIndices: number;

  documentTitle: string;
  documentId: string;
  message: string;
  file: File;
  fileName: string;
  selectedOption: string;
  textComment = '';
  modalMessage: any;

  constructor(private documentService: DocumentService,
              private modalService: NgbModal,
              private route: ActivatedRoute,
              private globals: Globals) {
    this.route.params.subscribe( params => {
      this.documentId = params.id;
    })
  }

  ngOnInit() {
    this.documentService.retrieveDocument(this.documentId).subscribe( data => {
      this.document = data;

      if (this.document.revisions[0]) {
        this.selectedOption = this.document.revisions[0].originalFilename;
      }

      this.documentTitle = this.document.title;
      this.totalIndices = this.getNumOfRevisions();
      this.getLatestRevision();
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
  openModal(content, revisionIndex?: number, modalType?: string) {
    if (revisionIndex >= 0) {
      this.currentRevision = this.document.revisions[revisionIndex];
      this.revisionIndex = revisionIndex;

      console.log('current revision: ' + JSON.stringify(this.currentRevision))
      console.log('revisionIndex: ' + this.revisionIndex);
    }

    if (modalType === 'delete') {
      const modalMessage = 'This revision will be removed from the document and ' +
      'can only be restored by an Administrator. Are you sure you want to delete?';

      this.modalMessage = {
        title: 'Deleting Revision',
        message: modalMessage,
        button: 'Delete',
      };
    } else if (modalType === 'revert') {
      const modalMessage = 'This revision will become a new copy and be treated as the' +
      ' main version of the document. Are you sure you want to revert to this revision?';

      this.modalMessage = {
        title: 'Reverting Revision',
        message: modalMessage,
        button: 'Revert',
      };
    }

    this.modal = this.modalService.open(content, this.globals.options);
  }

  /* Close a modal */
  closeModal() {
    this.alert = '';
    this.textComment = '';
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
  editDocumentName(documentId: string, newDocumentTitle: string) {
    const trimmedTitle = newDocumentTitle.trim();

    this.documentService.editDocument(documentId, trimmedTitle).subscribe( data => {
      this.documentTitle = data.title;
      this.modal.close();
    }, (err) => {
      console.log(err);
      this.alert = { message: 'Field is blank. Please enter a new document title.' };
    })
  }

  /* Retrieve document data */
  retrieveDocument() {
    this.documentService.retrieveDocument(this.document._id).subscribe( data => {
      this.document = data;
      this.selectedOption = this.document.revisions[0].originalFilename;
      this.totalIndices = this.getNumOfRevisions();
      this.getLatestRevision();
    })
  }

  /* Upload revision message and the file being sent */
  uploadRevision() {
    if (this.file && this.message) {
      this.documentService.postRevision(this.document._id, this.message).subscribe( data => {
        const numOfRevisions = this.getNumOfRevisions();
        this.retrieveDocument();
        this.uploadFile(numOfRevisions);
        this.closeModal();
      }, (err) => {
        console.log(err)
      });
    } else if (!this.file) {
      this.alert = { message: 'Please attach a file.' };
    }
  }

  getLatestRevision() {
    const lastIndex = this.totalIndices - 1;
    this.mainRevision = this.document.revisions[lastIndex];
  }

  /* Upload the file along with the revision message */
  uploadFile(revisionIndex: number) {
    this.documentService.uploadFile(this.document._id, revisionIndex, this.file).subscribe( data => {
      console.log(data)
      this.retrieveDocument();
    }, (err) => {
      console.log(err);
    });
  }

  downloadFile(revisionIndex: number) {
    this.documentService.downloadFile(this.document._id, revisionIndex).subscribe ( data => {
      const contentDisposition = data.headers.get('content-disposition');
      const contentType = data.headers.get('content-type');
      const fileName = contentDisposition.slice(22, contentDisposition.length - 1);

      saveAs(new Blob([data.body], { type: contentType }), fileName);
    });
  }

  /* Delete a revision */
  deleteRevision() {
    this.documentService.deleteRevision(this.document._id, this.revisionIndex).subscribe( () => {
      this.retrieveDocument();
      this.closeModal();
    });
  }

  /* Revert to a previous revision */
  revertRevision() {
    this.documentService.revertRevision(this.document._id, this.revisionIndex).subscribe( data => {
      console.log(data);
      this.retrieveDocument();
      this.closeModal();
    }, (err) => {
      console.log(err);
    })
  }

  /* Restore a revision */
  restoreRevision(revisionIndex: number) {
    this.documentService.restoreRevision(this.document._id, revisionIndex).subscribe( data => {
      console.log(data);
      this.retrieveDocument();
    }, (err) => {
      console.log(err);
    })
  }

  /* Post a comment */
  postComment() {
    this.documentService.addComment(this.document._id, this.textComment, 0).subscribe( data => {
      console.log(data);
      this.retrieveDocument();
      this.modal.close();
    })
  }
}
