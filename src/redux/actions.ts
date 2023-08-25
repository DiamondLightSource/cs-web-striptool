import { GraphCurve } from "../types";

export const ADD_CURVE = "ADD_CURVE";
export const DELETE_CURVE = "DELETE_CURVE";
export const MODIFY_CONFIG = "MODIFY_CONFIG";


const addCurve = (curve: GraphCurve) => {
  return {
    type: ADD_CURVE,
    curve: curve
  };
};

const deleteCurve = (name: string) => {
  return {
    type: DELETE_CURVE,
    curveName: name
  };
};

const modifyConfig = (name: string, value: string | number | boolean | GraphCurve) => {
    return {
      type: MODIFY_CONFIG,
      field: name,
      value: value
    };
  };

export { addCurve, deleteCurve, modifyConfig };
