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
  selected: string[] = [];

  fileName: string;
  file: File;

  constructor(private resourceService: ResourceService, private modalService: NgbModal, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getResources();
  }

  closeModal(): void {
    this.modal.close();
  }

  createFile(resourceId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.resourceService.createFile(resourceId).subscribe(data => {
          resolve();
      }, err => {
          reject();
      });
    });
  }

  deleteSelected(): void {
    this.selected.forEach((id) => {
      this.resourceService.deleteResource(id).subscribe(data => {
        console.log('Deleted resource ' + id);
      });
    });
    this.selected = [];
    this.getResources();
  }

  downloadSelected(): void {

  }

  downloadAll(): void {

  }

  /* Get all resources */
  getResources() {
    this.resourceService.getResources().subscribe(data => {
        this.resources = data;
        console.log(data);
    }, (err) => {
      console.log(err)
    });
  }

  isSelected(resourceId: string): boolean {
    return this.selected.indexOf(resourceId) >= 0;
  }

  /* Set file variable to the file the user has chosen */
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileName = event.target.files[0].name;
    }
  }

  open(content): void {
    this.modal = this.modalService.open(content, this.options);
  }

  postNewResource(): void {
    if (this.file) {
      this.resourceService.createResource(this.resource.title).subscribe(resourceData => {
        this.resourceService.createFile(resourceData._id).subscribe(data => {
            this.resourceService.uploadFile(resourceData._id, this.resource.files[0]._id, this.file).subscribe(empty => {
              console.log('sucessfully created file');
            });
        });
      })
    }
  }

  updateSelected(action: string, resourceId: string): void {
    if (action === 'add' && this.selected.indexOf(resourceId) === -1) {
      this.selected.push(resourceId);
    }
    if (action === 'remove' && this.selected.indexOf(resourceId) !== -1) {
      this.selected.splice(this.selected.indexOf(resourceId), 1);
    }
  }

  updateSelection(event: any, id: string): void {
   const checkbox = event.target;
   const action = (checkbox.checked ? 'add' : 'remove');
   this.updateSelected(action, id)
  }

}
