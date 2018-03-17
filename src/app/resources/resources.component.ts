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

  title: string;
  id: string;
  message: string;
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

  // Set file variable to the file the user has chosen
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  open(content) {
    this.modal = this.modalService.open(content, this.options);
  }

  uploadResource() {
    if (this.file && this.message && this.title) {
      this.resourceService.addResource(this.resource).subscribe( data => {
        this.closeModal();
      }, (err) => {
        console.log(err)
      });
    } else if (!this.file) {
      this.alert = { message: 'Please attach a file.' };
    }
  }
}

/* Required Resource Fields:
title: string
message: string
uploader: Id
goups: Id
*/
