import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Pitch } from './entities';
import { PitchSearchBody, PitchSearchResult, PitchTypeMap } from './types';

@Injectable()
export default class PitchSearchService {
  index = 'pitches';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPitch(pitch: Pitch) {
    return this.elasticsearchService.index<PitchSearchResult, PitchSearchBody>({
      index: this.index,
      body: {
        id: pitch.id,
        name: `sân ${pitch.name}`,
        type: PitchTypeMap[pitch.type],
        cost: JSON.stringify(pitch.cost),
        hub: JSON.stringify(pitch.hub),
      },
    });
  }

  async search(text: string) {
    const query = {};
    if (text) {
      query['multi_match'] = {
        query: text,
        fields: ['name', 'type', 'cost', 'hub'],
      };
    } else {
      query['match_all'] = {};
    }
    const { body } = await this.elasticsearchService.search<PitchSearchResult>({
      index: this.index,
      body: { query },
      size: 100,
    });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async update(pitch: Pitch) {
    const newBody: PitchSearchBody = {
      id: pitch.id,
      name: `sân ${pitch.name}`,
      type: PitchTypeMap[pitch.type],
      cost: JSON.stringify(pitch.cost),
      hub: JSON.stringify(pitch.hub),
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: { id: pitch.id },
        },
        script: { inline: script },
      },
    });
  }

  async remove(pitchId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: { id: pitchId },
        },
      },
    });
  }
}
