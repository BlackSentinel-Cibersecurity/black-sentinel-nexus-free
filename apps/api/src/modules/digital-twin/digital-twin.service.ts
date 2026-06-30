import { Injectable } from '@nestjs/common';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class DigitalTwinService {
  constructor(private readonly assetsService: AssetsService) {}

  async getGraph() {
    return this.assetsService.getDigitalTwin();
  }

  async getNodeDetails(nodeId: string) {
    const asset = await this.assetsService.findById(nodeId);
    return {
      ...asset,
      metrics: {
        cpu: 45,
        memory: 62,
        disk: 38,
        network: 27,
      },
    };
  }

  async getTopology() {
    const graph = await this.getGraph();
    return {
      nodes: graph.nodes.length,
      edges: graph.edges.length,
    };
  }
}
