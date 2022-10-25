export enum HubStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

export enum PitchType {
  FIVE_A_SIDE = '5A_SIDE',
  SEVEN_A_SIDE = '7A_SIDE',
  ELEVEN_A_SIDE = '11A_SIDE',
}

export interface CostType {
  time: string;
  value: number;
}
