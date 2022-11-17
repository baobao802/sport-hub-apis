import { Hub } from '../entities';

export enum HubStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

export enum PitchType {
  FIVE_A_SIDE = '5A_SIDE',
  SEVEN_A_SIDE = '7A_SIDE',
  ELEVEN_A_SIDE = '11A_SIDE',
}

export const PitchTypeMap = {
  '5A_SIDE': '5 người, 5người, 5nguoi',
  '7A_SIDE': '7 người, 7người, 7nguoi',
  '11A_SIDE': '11 người, 11người, 11nguoi',
};

export interface CostType {
  time: string;
  value: number;
}

export interface PitchSearchBody {
  id: number;
  name: string;
  type: string;
  cost: string;
  hub: any;
}

export interface PitchSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PitchSearchBody;
    }>;
  };
}
