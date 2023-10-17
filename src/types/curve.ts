export interface Curve {
  name: string;
  units?: string;
  comment?: string;
  precision: number;
  min: number;
  max: number;
  scale: boolean;
  plotStatus: boolean;
}
