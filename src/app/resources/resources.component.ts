import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef,  NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { Resource } from '../models/resource.model';
import { ResourceService } from './resource.service'

import { saveAs } from 'file-saver';

@Component({
  selector: 'prism-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  modal: NgbModalRef;
  options: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg',
  };

  alert: any;
  resource: Resource = new Resource();
  resources: Resource[] = [];

  fileName: string;
  file: File;

  constructor(private resourceService: ResourceService, private modalService: NgbModal, private route: ActivatedRoute) { }

  ngOnInit() {
    // Get all resources
    this.resourceService.getResources().subscribe(data => {
        this.resources = data;
        console.log(data);
    });
  }

  closeModal() {
    this.modal.close();
  }

  downloadResource(resourceId) {

  }

  downloadResources() {

  }

  /* Set file variable to the file the user has chosen */
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileName = event.target.files[0].name;
    }
  }

  open(content) {
    this.modal = this.modalService.open(content, this.options);
  }

  postNewResource() {
    if (this.file) {
      this.resourceService.createResource(this.resource.title).subscribe( data => {
          this.resources.push(data);
          this.uploadFile(data._id);
          this.closeModal();
        }, (err) => {
          console.log(err)
        });
      } else {
        this.alert = { message: 'Please attach a file.' };
      }
  }

  /* Upload the file along with the revision message */
  uploadFile(resourceId: string) {
    this.resourceService.uploadFile(resourceId, this.file).subscribe( data => {
      // this.listTemplates();
      console.log(data)
    }, (err) => {
      console.log(err);
    });
  }

  /* Get resources */
  listResources() {
    // this.resourceManagerService.listAllTemplates().subscribe( data => {
    //   this.resources = data;
    // })
  }

}

/* Required Resource Fields:
title: string
message: string
uploader: Id
goups: Id
*/
