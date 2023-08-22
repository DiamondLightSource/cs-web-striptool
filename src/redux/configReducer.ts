import { AnyAction } from "redux";
import { ADD_CURVE, DELETE_CURVE, MODIFY_CONFIG } from "./actions";
import { StripToolConfig } from "../types";

const initialState: StripToolConfig = {
    config: "1.2",
    option: {
      gridXOn: 1,
      gridYOn: 1,
      axisYColorStat: true,
      graphLineWidth: 2
    },
    time: {
        timespan: 300,
        numSamples: 700,
        sampleInterval: 1,
        refreshInterval: 1
    },
    color: {
        background: [0, 0, 0],
        foreground: [41, 56, 200],
        grid: [95, 76, 120],
        colors: [
          [191, 191, 191],
          [0, 0, 256],
          [107, 143, 35],
          [166, 42, 42],
          [95, 159, 161],
          [256, 107, 0],
          [161, 32, 241],
          [256, 0, 0],
          [256, 216, 0],
          [189, 144, 144],
          [155, 206, 50]
        ]
    },
    curve: []
}

export default function cartReducer (state = initialState, action: AnyAction) {
  switch (action.type) {
    case ADD_CURVE:
      const newCurve = [...state.curve, action.curve];
      return {
        ...state,
        curve: newCurve,
      };

    case DELETE_CURVE:
      // Find index of curve to remove
      const index = state.curve.findIndex(curve => curve.name === action.curveName);
      const newCurves = state.curve;
      newCurves.splice(index, 1);
      return {
        ...state,
        curve: newCurves,
      };

    case MODIFY_CONFIG:
      const newTime = state.time;
      newTime.timespan += 1;
      return {
        ...state,
        time: newTime,
      };
    default:
      return state;
  }
};
