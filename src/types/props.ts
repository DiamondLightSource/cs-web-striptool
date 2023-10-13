import { PV } from "./pv";

export type GenericProp = string | boolean | number | PV;

export interface Expression {
  boolExp: string;
  value: string;
  convertedValue?: GenericProp;
}
