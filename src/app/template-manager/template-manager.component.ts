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
  templates: Document[];
  modal: NgbModalRef;
  alert: any;
  message: string;
  file: File;
  fileName: string;

  currentTemplateId: string;
  currentTemplate: Document = new Document();

  constructor(private modalService: NgbModal,
              private documentService: DocumentService,
              private templateManagerService: TemplateManagerService,
              private globals: Globals) { }

  ngOnInit() {
    this.templateManagerService.listAllTemplates().subscribe( data => {
      this.templates = data;
    })
  }

  /* Open a basic modal passing the data of the specific template */
  openModal(content, templateId?: string) {
    this.modal = this.modalService.open(content, this.globals.options);
    // this.currentTemplateId = templateId;
    this.currentTemplate = this.templates.find( temp => temp._id === templateId);
    console.log('printing currentTemp: ' + JSON.stringify(this.currentTemplate))
  }

  /* Close a modal */
  closeModal() {
    this.alert = '';
    this.currentTemplate = new Document();
    this.message = '';
    this.file = null;
    this.fileName = '';
    this.modal.close();
  }

  /* Delete template from the list */
  deleteTemplate() {
    this.templateManagerService.deleteTemplate(this.currentTemplate._id).subscribe( () => {
      console.log('Template deleted')
      const findTemplateIndex = this.templates.findIndex( temp => temp._id === this.currentTemplate._id);
      this.templates.splice(findTemplateIndex, 1);
      this.modal.close();
    })
  }

}
