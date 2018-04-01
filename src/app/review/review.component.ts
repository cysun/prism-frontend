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
  public nodeId: string;

  reviewId: string;

  constructor(private router: Router, private reviewService: ReviewService, private zone: NgZone, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.reviewId = params.id;
    });
    this.updateReview();
  }

  public handleDocumentUpdate() {
    this.updateReview();
  }

  updateReview() {
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

      node.rx = node.ry = 10;
    });

    const render = new dagreD3.render();

    const svg = d3.select('svg'),
        svgGroup = svg.append('g');

    const zoom = d3.zoom().on('zoom', function() {
      svgGroup.attr('transform', d3.event.transform);
    });
    svg.call(zoom);

    render(d3.select('svg g'), g);

    const initialScale = 0.75;
    svg.call(zoom.transform, d3.zoomIdentity.translate((svg.attr('width') - g.graph().width * initialScale) / 2, 20).scale(initialScale));

    const componentScope = this;
    d3.select('svg g').selectAll('g.node')
      .attr('class', function(nodeId) {
        const reviewNode: ReviewNode = componentScope.review.nodes[nodeId];
        return d3.select(this).attr('class') + ` node-${componentScope.getNodeStatus(reviewNode)}`;
      })
      .each(function(nodeId) {
        this.addEventListener('click', function() {
          componentScope.documentId = componentScope.review.nodes[nodeId].document;
          componentScope.nodeId = nodeId;
          if (componentScope.documentComponent) {
            setTimeout(() => {componentScope.documentComponent.ngOnInit()}, 30);
          }
        });
      });

    svg.attr('height', g.graph().height + 40);
    this.zone.run(() => {});
  }

  getLabel(node: ReviewNode): string {
    let completionLabel: string;
    if ((new Date()).getTime() - (new Date(node.finishDate)).getTime() < 0 && !node.finalized) {
      completionLabel = 'Estimated Completion';
    } else {
      completionLabel = 'Completed';
    }
    return `${node.title}
${completionLabel}: ${this.formatDate(node.finishDate)}`;
  }

  getNodeStatus(node: ReviewNode): string {
    if (node.finalized) {
      return 'finalized';
    }
    if (node.prerequisites.reduce((acc, prerequisiteId) => acc && this.review.nodes[prerequisiteId].finalized, true)) {
      return 'in-progress';
    }
    return 'prerequisites-pending';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
