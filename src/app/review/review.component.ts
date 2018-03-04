import { Component, Directive, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  reviewId: string;

  constructor(private router: Router, private reviewService: ReviewService, private zone: NgZone) {}

  ngOnInit() {

  }

  renderGraph() {
    this.reviewService.getReview(this.reviewId).subscribe(review => {
      // Create the input graph
      const g = new dagreD3.graphlib.Graph()
        .setGraph({})
        .setDefaultEdgeLabel(function() { return {}; });
      g.graph().rankdir = 'LR';

      const added = {};

      const traverseNode = nodeId => {
        if (!nodeId || !review.nodes[nodeId]) {
          return;
        }
        for (const prerequisiteId of review.nodes[nodeId].prerequisites) {
          if (!added[prerequisiteId]) {
            g.setNode(prerequisiteId, { label: prerequisiteId, class: 'type-.' });
            added[prerequisiteId] = true;
          }
          g.setEdge(prerequisiteId, nodeId);
          traverseNode(review.nodes[prerequisiteId]);
        }
      }

      for (const nodeId of review.endNodes) {
        g.setNode(nodeId, { label: nodeId, class: 'type-.' });
        added[nodeId] = true;
        traverseNode(nodeId);
      }

      g.nodes().forEach(function(v) {
        const node = g.node(v);

        node.rx = node.ry = 5;
      });

      const render = new dagreD3.render();

      const svg = d3.select('svg'),
          svgGroup = svg.append('g');

      render(d3.select('svg g'), g);
      const componentScope = this;
      d3.select('svg g').selectAll('g.node').attr('label', nodeId => review.nodes[nodeId].title).each(function(nodeId) {
        this.addEventListener('click', function() {
          componentScope.router.navigate(['/document', review.nodes[nodeId].document]);
        });
      });

      const xCenterOffset = (svg.attr('width') - g.graph().width) / 2;
      svgGroup.attr('transform', 'translate(' + xCenterOffset + ', 20)');
      svg.attr('height', g.graph().height + 40);
      this.zone.run(() => {});
    });
  }
}
