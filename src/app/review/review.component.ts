import { Component, Directive, OnInit, NgZone, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DocumentComponent } from '../document/document.component';
import { Review } from '../models/review.model';
import { ReviewNode } from '../models/review_node.model';
import { ReviewService } from './review.service';

declare var dagreD3: any;
declare var d3: any;

@Component({
  selector: 'prism-review',
  templateUrl: './review.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ReviewComponent implements OnInit {
  @ViewChild('documentComponent') public documentComponent: DocumentComponent;
  public documentId: string;
  public review: Review;
  public yearString: string;

  reviewId: string;

  constructor(private router: Router, private reviewService: ReviewService, private zone: NgZone, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.reviewId = params.id;
    });

    this.reviewService.getReview(this.reviewId).subscribe(review => {
      if (!review) {
        return;
      }
      this.review = review;
      const startYear: number = (new Date(review.startDate)).getFullYear();
      this.yearString = startYear + '-' + (startYear + 1);
      this.renderGraph();
    });
  }

  renderGraph() {
    console.log(this.review);
    // Create the input graph
    const g = new dagreD3.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(function() { return {}; });
    g.graph().rankdir = 'LR';

    const added = {};

    const traverseNode = nodeId => {
      if (!nodeId || !this.review.nodes[nodeId]) {
        return;
      }
      for (const prerequisiteId of this.review.nodes[nodeId].prerequisites) {
        if (!added[prerequisiteId]) {
          g.setNode(prerequisiteId, { label: this.getLabel(this.review.nodes[prerequisiteId]), class: 'type-.' });
          added[prerequisiteId] = true;
        }
        g.setEdge(prerequisiteId, nodeId);
        traverseNode(prerequisiteId);
      }
    }

    for (const nodeId of this.review.endNodes) {
      g.setNode(nodeId, { label: this.getLabel(this.review.nodes[nodeId]), class: 'type-.' });
      added[nodeId] = true;
      traverseNode(nodeId);
    }

    g.nodes().forEach(v => {
      const node = g.node(v);

      node.rx = node.ry = 5;
    });

    const render = new dagreD3.render();

    const svg = d3.select('svg'),
        svgGroup = svg.append('g');

    render(d3.select('svg g'), g);
    const componentScope = this;
    d3.select('svg g').selectAll('g.node').each(function(nodeId) {
      this.addEventListener('click', function() {
        componentScope.documentId = componentScope.review.nodes[nodeId].document;
        if (componentScope.documentComponent) {
          setTimeout(() => {componentScope.documentComponent.ngOnInit()}, 30);
        }
      });
    });

    const xCenterOffset = (svg.attr('width') - g.graph().width) / 2;
    svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 20)');
    svg.attr('height', g.graph().height + 40);
    this.zone.run(() => {});
  }

  getLabel(node: ReviewNode): string {
    return node.title;
  }
}
