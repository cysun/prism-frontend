import { Component, OnInit } from '@angular/core';

import { Review } from '../models/review.model';
import { ReviewService } from '../review/review.service';


@Component({
  selector: 'prism-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent implements OnInit {
  reviewsList: Review[] = [];

  constructor(private reviewService: ReviewService) { }

  ngOnInit() {
    this.reviewService.getReviews().subscribe( data => {
      this.reviewsList = data;
    })
  }

}
