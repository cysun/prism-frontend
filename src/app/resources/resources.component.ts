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
    this.alert = '';
    this.modal.close();
  }

  compareTitles(resource1: Resource, resource2: Resource): number {
    const title1 = resource1.title;
    const title2 = resource2.title;

    if (title1 < title2) {
      return -1;
    }
    if (title1 > title2) {
      return 1;
    }
    // title1 must be equal to title2
    return 0;
}

  createFile(resourceId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.resourceService.createFile(resourceId).subscribe(data => {
        resolve();
      }, (err) => {
        reject();
        console.log(err);
      });
    });
  }

  /* Delete the specified resource(s) */
  deleteSelected(): void {
    this.selected.forEach((id) => {
      this.resourceService.deleteResource(id).subscribe(data => {
      });
    });
    this.selected = [];
    this.getResources();
  }

  /* Delete all resources */
  deleteAll(): void {
    this.resources.forEach((resource) => {
      this.resourceService.deleteResource(resource._id).subscribe(() => {
      });
    });
    this.selected = [];
    this.getResources();
  }

  /* Download specified resource(s) */
  async downloadSelected() {
    let downloaded = false;
    let index = this.selected.length - 1;
    this.download(this.selected[index]).then(() => {
      downloaded = true;
    }).catch((err) => {
      console.log(err);
    });
    const id = setInterval(() => {
      if (index === 0) {
        this.selected = [];
        clearInterval(id);
      } else if (downloaded) {
        this.download(this.selected[--index]).then(() => {
          downloaded = true;
        }).catch((err) => {
          console.log(err);
        });
      } else {
        downloaded = false;
      }
    }, 100);
  }

  async downloadAll() {
    for (const resource of this.resources) {
      await this.download(resource._id);
    }
  }

  download(resourceId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.resourceService.downloadFile(resourceId).subscribe(fileData => {
        const contentDisposition = fileData.headers.get('content-disposition');
        const contentType = fileData.headers.get('content-type');
        const fileName = contentDisposition.slice(22, contentDisposition.length - 1);
        saveAs(new Blob([fileData.body], { type: contentType }), fileName);
        resolve();
      }, err => {
        console.log(err);
        reject();
      });
    })
  }

  /* Get all resources */
  getResources() {
    this.resourceService.getResources().subscribe(data => {
        this.resources = data;
        this.resources.sort(this.compareTitles);
    }, (err) => {
      console.log(err)
    });
  }

  /* Check for resource in selected list */
  isSelected(resourceId: string): boolean {
    return this.selected.indexOf(resourceId) >= 0;
  }

  /* Set file variable to the file the user has chosen */
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileName = event.target.files[0].name;

      if ((this.file.size > (2 ** 20) * 5)) {
        this.alert = { message: 'File is too large to upload.' };
      } else {
        this.alert = '';
      }
    }
  }

  open(content): void {
    this.modal = this.modalService.open(content, this.options);
  }

  postNewResource(): void {
    if (this.file && (this.file.size <= (2 ** 20) * 5)) {
      this.resourceService.createResource(this.resource.title).subscribe(resourceData => {
        this.createFile(resourceData._id).then(() => {
          this.resourceService.uploadFile(resourceData._id, this.file).subscribe(empty => {
            this.file = null;
            this.fileName = '';
            this.resource = new Resource();
            this.getResources();
            this.closeModal();
          }, (err) => {
            console.log(err);
          });
        }).catch((err) => {
          console.log(err);
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
