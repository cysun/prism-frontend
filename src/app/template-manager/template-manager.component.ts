import { Component, OnInit } from '@angular/core';

import { Globals } from '../shared/app.global';
import { Document } from '../models/document.model';
import { DocumentService } from '../document/document.service';
import { TemplateManagerService } from './template-manager.service';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';

@Component({
  selector: 'prism-template-manager',
  templateUrl: './template-manager.component.html',
  styleUrls: ['./template-manager.component.css']
})
export class TemplateManagerComponent implements OnInit {

  /*
  templates = [
      {
          '_id': '5a8f9e63510eee15a17181ca',
          'title': 'Template Misc 2',
          'completionEstimate': 3,
          'groups': [
              'Administrators', 'PRS Members'
          ]
      },
      {
          '_id': '5a8f9e63510eee15a17181cb',
          'title': 'Template Misc 3',
          'completionEstimate': 73,
          'groups': [
              'Administrators', 'Deans'
          ]
      },
      {
          '_id': '5a8f9e63510eee15a17181cc',
          'title': 'Template Misc 4',
          'completionEstimate': 8,
          'groups': [
              'Administrators', 'OGS Staff'
          ]
      },
      {
          '_id': '5a8f9e63510eee15a17181cd',
          'title': 'Template Misc 5',
          'completionEstimate': 31,
          'groups': [
              'Administrators'
          ]
      },
  ]*/
  templates: Document[];
  modal: NgbModalRef;
  alert: any;
  message: string;
  file: File;
  fileName: string;

  constructor(private modalService: NgbModal,
              private documentService: DocumentService,
              private templateManagerService: TemplateManagerService,
              private globals: Globals) { }

  ngOnInit() {
    this.templateManagerService.listAllTemplates().subscribe( data => {
      this.templates = data;
    })
  }

  /* Open a basic modal passing the data of the specific revision or comment */
  openModal(content, revisionIndex?: number, modalType?: string, commentId?: string) {
    this.modal = this.modalService.open(content, this.globals.options);
  }

  /* Close a modal */
  closeModal() {
    this.alert = '';
    this.message = '';
    this.file = null;
    this.fileName = '';
    this.modal.close();
  }

  /* Delete template from the list */
  deleteTemplate(id: string) {
    this.templateManagerService.deleteTemplate(id).subscribe( () => {
      console.log('Template deleted')
      const findTemplateIndex = this.templates.findIndex( temp => temp._id === id);
      this.templates.splice(findTemplateIndex, 1);
    })
  }

}
