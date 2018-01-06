import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'prism-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  msgs: Message[];
  uploadedFiles: any[] = [];

  constructor() { }

  ngOnInit() {}

  onUploadHandler(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.msgs = [];
    this.msgs.push({severity: 'info', summary: 'File has been uploaded', detail: ''});
  }
}
