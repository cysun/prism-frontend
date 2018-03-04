import { Component, Input } from '@angular/core';

import { Review } from '../models/review.model';
import { ReviewNode } from '../models/review_node.model';
import { ReviewService } from './review.service';

@Component({
  selector: 'prism-node',
  templateUrl: './review_node.component.html'
})
export class ReviewNodeComponent {
  @Input() node: ReviewNode;

  constructor(private reviewService: ReviewService) {}
};
