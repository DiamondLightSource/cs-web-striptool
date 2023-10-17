import { PV } from "./pv";
import { Curve } from "./curve";

export type GenericProp = string | boolean | number | PV | Curve;

export interface Expression {
  boolExp: string;
  value: string;
  convertedValue?: GenericProp;
}
