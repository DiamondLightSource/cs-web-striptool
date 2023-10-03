import { AnyAction } from "redux";
import { LOAD_FILE, SAVE_FILE, ADD_CURVE, DELETE_CURVE, MODIFY_CONFIG, CLEAR_STATE } from "./actions";
import { StripToolConfig } from "../types";

const initialState: StripToolConfig = {
    file: {
      name: "new.stp",
      loaded: false
    },
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

export default function configReducer (state = initialState, action: AnyAction) {
  switch (action.type) {
    case LOAD_FILE:
      // Overwrite old state with new
      const newState = action.config;
      return { 
        ...state,
        ...newState 
      };

    case SAVE_FILE:
      // Overwrite old state with new
      const newFile = {name: action.fileName, loaded: action.loaded};
      return { 
        ...state,
        ...newFile 
      };

    case CLEAR_STATE:
      // Sets state back to initial
      return {...initialState};

    case ADD_CURVE:
      const newCurve = [...state.curve, action.curve];
      return {
        ...state,
        curve: newCurve,
      };

    case DELETE_CURVE:
      // Find index of curve to remove
      const index = state.curve.findIndex(curve => curve.name === action.curveName);
      const newCurves = [...state.curve];
      newCurves.splice(index, 1);
      return {
        ...state,
        curve: newCurves,
      };

    case MODIFY_CONFIG:
      const fields = action.field.split(".");
      if (fields[0] === "curve") {
        const idx = fields[1];
        // We have updated a curve at given index
        const newCurves = [...state.curve];
        newCurves[idx] = action.value;
        return {
          ...state,
          curve: newCurves
        };
      } 
      // Update field with new value
      return {
        ...state,
        [fields[0]]: {
          ...state[fields[0] as keyof StripToolConfig],
          [fields[1]]: action.value
        },
      };
    default:
      return state;
  }
};
