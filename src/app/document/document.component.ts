import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Comment } from '../models/comment.model';
import { Document } from '../models/document.model';
import { ExternalUpload } from '../models/external-upload.model';
import { Revision } from '../models/revision.model';
import { User } from '../models/user.model';
import { UserResponse } from '../models/user-response.model';
import { Globals } from '../shared/app.global';

import { DocumentService } from './document.service';
import { GroupManagerService } from '../group-manager/group-manager.service';
import { ReviewService } from '../review/review.service';

import { saveAs } from 'file-saver';

@Component({
  selector: 'prism-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})

export class DocumentComponent implements OnInit {
  currentUser: UserResponse;
  externalReviewer: User = new User();
  modal: NgbModalRef;
  alert: any;

  document: Document = new Document();
  currentRevision: Revision = new Revision();
  mainRevision: Revision = new Revision();
  selectedComment: Comment = new Comment();
  externalUploadsList: ExternalUpload[] = [];

  validComment = true;
  performDelete = false;

  revisionIndex: number;
  totalIndices: number;

  documentTitle: string;
  @Input() documentId: string;
  @Input() reviewId: string;
  @Input() nodeId: string;
  @Input() updateReviewComponent: () => void;
  @Input() externalUploadTitle: string;
  message: string;
  file: File;
  fileName: string;
  selectedOption: string;
  selectedFilter: string;
  textComment = '';
  externalMessage = '';
  modalMessage: any;
  // Angular Bootstrap object with day, month, and year properties
  newCompletionDate: any;

  constructor(private documentService: DocumentService,
              private groupManagerService: GroupManagerService,
              private reviewService: ReviewService,
              private modalService: NgbModal,
              private route: ActivatedRoute,
              private globals: Globals,
              private location: Location) { }

  public ngOnInit() {
    if (!this.documentId) {
      this.route.params.subscribe( params => {
        this.documentId = params.id;
      });
    }

    const castedUser: UserResponse = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = new UserResponse(castedUser.user, castedUser.groups, castedUser.token);

    this.documentService.retrieveDocument(this.documentId).subscribe(data => {
      this.document = data;

      if (this.document.revisions && this.document.revisions.length !== 0) {
        this.selectedOption = this.document.revisions.slice(0).reverse().find(item =>
          item.message !== 'Deleted revision')._id;

        this.selectedFilter = this.document.revisions.slice(0).reverse().find(item =>
            item.message !== 'Deleted revision')._id;
      }

      this.documentTitle = this.document.title;
      this.totalIndices = this.getNumOfRevisions();
      this.getLatestRevision();
    }, err => {
      this.documentId = null;
      this.document = null;
    });

    if (this.currentUser.isRootOrAdmin()) {
      this.documentService.getAllExternalUploads(this.documentId).subscribe( data => {
        this.externalUploadsList = data;
      });
    }
  }

  /* Set file variable to the file the user has chosen */
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileName = event.target.files[0].name;

      if (this.file.size > this.globals.maxFileSize) {
        this.alert = { message: 'File is too large.' };
      } else {
        this.alert = '';
      }
    }
  }

  /* Get the total amount of revisions in the document */
  getNumOfRevisions() {
    return Object.keys(this.document.revisions).length;
  }

  /* Allow user to edit their own (specific) comment */
  toggleEditButton(commentId?: string) {
    this.performDelete = false;
    this.validComment = true;

    if (commentId) {
      const copyText = this.document.comments.find(item => item._id === commentId);
      this.selectedComment = JSON.parse(JSON.stringify(copyText));
    } else {
      this.selectedComment = new Comment();
    }
  }

  /* Return list of revision objects not marked as deleted */
  checkDeletedRevisions(arr: any[], message: string) {
    return arr.filter( x => x.message !== message);
  }

  /* Open a basic modal passing the data of the specific revision or comment */
  openModal(content, revisionIndex?: number, modalType?: string, commentId?: string) {
    if (this.reviewId) {
      this.externalMessage = `Please upload your report for the ${this.externalUploadTitle}.`;
    }
    /* If user wants to revert or delete a revision */
    if (revisionIndex >= 0) {
      this.currentRevision = this.document.revisions[revisionIndex];
      this.revisionIndex = revisionIndex;

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

    } else if (commentId && commentId.length > 0) { /* If user wants to delete a comment */
      this.selectedComment = this.document.comments.find(comm => comm._id === commentId);
      this.performDelete = true;
    }

    this.externalReviewer = new User();
    this.externalReviewer.name = {'first': '', 'last': ''};
    this.modal = this.modalService.open(content, this.globals.options);
  }

  /* Close a modal */
  closeModal() {
    this.alert = '';
    this.textComment = '';
    this.externalMessage = '';
    this.message = '';
    this.file = null;
    this.fileName = '';
    this.document.title = this.documentTitle;
    this.modal.close();
  }

  /* Create a new document (for frontend test purposes only) */
  createNewDocument(documentTitle: string) {
    this.documentService.createDocument(documentTitle).subscribe( data => {
      this.document = data;
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
      this.totalIndices = this.getNumOfRevisions();
      this.getLatestRevision();

      this.selectedOption = this.document.revisions.slice(0).reverse().find( item =>
        item.message !== 'Deleted revision')._id;

      this.selectedFilter = this.document.revisions.slice(0).reverse().find( item =>
        item.message !== 'Deleted revision')._id;
    })
  }

  /* Upload revision message and the file being sent */
  uploadRevision() {
    if (this.file && this.message && (this.file.size <= this.globals.maxFileSize)) {
      this.documentService.postRevision(this.document._id, this.message).subscribe( data => {
        const numOfRevisions = this.getNumOfRevisions();
        this.retrieveDocument();
        this.uploadFile(numOfRevisions);

        this.closeModal();
      }, (err) => {
        console.log(err);
      });
    } else if (!this.file) {
      this.alert = { message: 'Please attach a file with size ~5 MB.' };
    }
  }

  getLatestRevision() {
    const lastIndex = this.totalIndices - 1;
    this.mainRevision = this.document.revisions[lastIndex];
  }

  /* Upload the file along with the revision message */
  uploadFile(revisionIndex: number) {
    this.documentService.uploadFile(this.document._id, revisionIndex, this.file).subscribe( () => {
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
    this.documentService.revertRevision(this.document._id, this.revisionIndex).subscribe( () => {
      this.retrieveDocument();
      this.closeModal();
    }, (err) => {
      console.log(err);
    })
  }

  /* Restore a revision */
  restoreRevision(revisionIndex: number) {
    this.documentService.restoreRevision(this.document._id, revisionIndex).subscribe( () => {
      this.retrieveDocument();
    }, (err) => {
      console.log(err);
    })
  }

  /* Post a comment */
  postComment() {
    if (this.textComment.length <= 2000) {
      const findRevisionNum = this.document.revisions.findIndex(revision =>
        revision._id === this.selectedOption);

      const getFilename = this.document.revisions[findRevisionNum].message;
      const insertFilename = getFilename ?
        getFilename : this.document.revisions[findRevisionNum].message;

      this.documentService.addComment(this.document._id, this.textComment,
        findRevisionNum, insertFilename).subscribe( data => {
        this.retrieveDocument();
        this.modal.close();

        this.alert = '';
        this.textComment = '';
      });
    } else {
      this.alert = { message: 'Comment exceeds maximum 2000 characters.' };
    }

  }

  /* Edit a comment */
  editComment(commentId: string, text: string) {
    if (text.length <= 2000) {
      this.validComment = true;
      const findCommentIndex = this.document.comments.findIndex(item => item._id === commentId);

      this.documentService.editComment(this.document._id, findCommentIndex, text).subscribe( data => {
        this.document.comments[findCommentIndex].text = text;
        this.toggleEditButton();
      })
    } else {
      this.validComment = false;
    }
  }

  /* Delete a comment */
  deleteComment(commentId: string) {
    const findCommentIndex = this.document.comments.findIndex(item => item._id === commentId);

    this.documentService.deleteComment(this.document._id, findCommentIndex).subscribe( data => {
      this.document.comments.splice(findCommentIndex, 1);
      this.selectedComment = new Comment();
      this.closeModal();
    })
  }

  /* Filter comments based on user's choice in the dropdown list */
  filterComments(revisionId: string, commentsArr: any[]) {
    const findRevisionIndex = this.document.revisions.findIndex (item => item._id === revisionId);

    const filteredComments = this.document.comments.filter( data => {
      return data.revision === findRevisionIndex;
    });

    return filteredComments;
  }

  /* Subscribe to a document */
  subscribeToDocument() {
    this.documentService.subscribeToDocument(this.document._id).subscribe( () => {
      (<string[]> this.document.subscribers).push(this.currentUser.user._id);
    })
  }

  /* Subscribe to a document */
  unsubscribeFromDocument() {
    this.documentService.unsubscribeFromDocument(this.document._id).subscribe( () => {
      const findUserId = (<string[]> this.document.subscribers).indexOf(this.currentUser.user._id);
      this.document.subscribers.splice(findUserId, 1);
    })
  }

  /* Check if current user is already subscribed to the document */
  isSubscribed() {
    if (this.document.subscribers) {
      return (<string[]> this.document.subscribers).includes(this.currentUser.user._id);
    }
    return false;
  }

  /* Make the request to finalize the node of this document in the review */
  finalizeNode() {
    this.reviewService.finalizeNode(this.reviewId, this.nodeId).subscribe(() => {
      this.document.locked = true;
      this.updateReviewComponent();
      this.closeModal();
    });
  }

  /* Change the completion date of the node of this document in the review */
  changeCompletionDate(newDate: any) {
    const newDateString = `${newDate.year}-${newDate.month}-${newDate.day}`;

    this.reviewService.setNodeFinishDate(this.reviewId, this.nodeId, newDateString).subscribe(() => {
      this.updateReviewComponent();
      this.closeModal();
    });
  }

  /* Create an external upload page for external submission */
  createExternalUpload() {

    if (this.externalReviewer.username.length < this.globals.minUsernameLength ||
        this.externalReviewer.username.length > this.globals.maxUsernameLength) {
      this.alert = { 'message': 'Please enter a username between 4 and 20 characters.'};
    } else {
      this.documentService.createExternalUpload(this.document._id, this.externalReviewer, this.externalMessage).subscribe (
        data => {
          this.groupManagerService.getUser(data.user).subscribe( userData => {
            data.user = userData;
            this.externalUploadsList.push(data);
            this.closeModal();
          })
        }, (err) => {
          this.alert = { 'message': 'Username already exists or fails validation. Please use another username.' };
        })
    }
  }

  /* Cancel an external upload from being used */
  cancelExternalUpload(token: string) {
    this.documentService.cancelExternalUpload(token).subscribe( () => {
      const matchingIndex = this.externalUploadsList.findIndex(x => x.token === token);
      this.externalUploadsList[matchingIndex].disabled = true;
    });
  }
}
