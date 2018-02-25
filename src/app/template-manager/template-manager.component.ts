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

  currentTemplate: Document = new Document();

  constructor(private modalService: NgbModal,
    private documentService: DocumentService,
    private templateManagerService: TemplateManagerService,
    private globals: Globals) { }

    ngOnInit() {
      this.listTemplates();
    }

    /* Open a basic modal passing the data of the specific template */
    openModal(content, templateId?: string) {
      if (templateId) {
        this.currentTemplate = this.templates.find( temp => temp._id === templateId);
        console.log('printing currentTemp: ' + JSON.stringify(this.currentTemplate))
      }
      this.modal = this.modalService.open(content, this.globals.options);
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

    /* Get the total amount of revisions in the document */
    getNumOfTemplates(templateIndex: number) {
      return Object.keys(this.templates[templateIndex].revisions).length;
    }

    /* Set file variable to the file the user has chosen */
    onFileChange(event) {
      if (event.target.files.length > 0) {
        this.file = event.target.files[0];
        this.fileName = event.target.files[0].name;
      }
    }

    /* Post a template */
    postTemplate() {
      if (this.file) {
        this.templateManagerService.createTemplate(this.currentTemplate.title,
          this.currentTemplate.completionEstimate).subscribe( data => {
            this.templates.push(data);

            this.postRevision(data._id).then( () => {
              const temp = this.templates.find(item => item._id === data._id);
              this.uploadFile(data._id, temp.revisions.length);
              this.closeModal();
            })
          }, (err) => {
            console.log(err)
          });
        } else {
          this.alert = { message: 'Please attach a file.' };
        }
      }

      /* Upload revision message and the file being sent */
      postRevision(templateId: string) {
        return new Promise((resolve, reject) => {
          this.documentService.postRevision(templateId, this.message).subscribe( () => {
            resolve();
          }, (err) => {
            console.log(err)
            reject();
          });
        });
      }

      /* Upload the file along with the revision message */
      uploadFile(templateId: string, templateIndex: number) {
        this.documentService.uploadFile(templateId, templateIndex, this.file).subscribe( data => {
          this.listTemplates();
          console.log(data)
        }, (err) => {
          console.log(err);
        });
      }

      /* Get templates */
      listTemplates() {
        this.templateManagerService.listAllTemplates().subscribe( data => {
          this.templates = data;
        })
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
