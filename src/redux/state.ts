/**
 * Define the shape of the state a
 */
import log from "loglevel";
import { AnyAction } from "redux";
import {
  LOAD_FILE,
  SAVE_FILE,
  ADD_CURVE,
  DELETE_CURVE,
  MODIFY_CONFIG,
  CLEAR_CONFIG
} from "./appActions";
import type { StripToolConfig } from "../types";
import {
  VALUE_CHANGED,
  VALUES_CHANGED,
  DEVICE_QUERIED,
  Action,
  SUBSCRIBE,
  CONNECTION_CHANGED,
  UNSUBSCRIBE,
  ValueChanged
} from "./connectionActions";
import { MacroMap } from "../types/macros";
import { DType, mergeDType } from "../types/dtypes";

const initialConfigState: StripToolConfig = {
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
};

const initialConnectionState: CsState = {
  valueCache: {},
  globalMacros: { SUFFIX: "1" },
  effectivePvNameMap: {},
  subscriptions: {},
  deviceCache: {}
};

export interface StateConfig {
  config: StripToolConfig;
  connection: CsState;
}

const allState: StateConfig = {
  config: initialConfigState,
  connection: initialConnectionState
};

export interface PvState {
  value?: DType;
  connected: boolean;
  readonly: boolean;
}

export interface FullPvState extends PvState {
  initializingPvName: string;
}

export interface ValueCache {
  [pvName: string]: FullPvState;
}

export interface Subscriptions {
  [pvName: string]: string[];
}

export interface DeviceCache {
  [deviceName: string]: DType;
}

/* The shape of the store for the entire application. */
export interface CsState {
  valueCache: ValueCache;
  effectivePvNameMap: { [pvName: string]: string };
  globalMacros: MacroMap;
  subscriptions: Subscriptions;
  deviceCache: DeviceCache;
}

/* Given a new object that is a shallow copy of the original
   valueCache, update with contents of a ValueChanged action. */
function updateValueCache(
  newValueCache: ValueCache,
  action: ValueChanged
): void {
  const { pvName, value } = action.payload;
  // New PvState object.
  const newPvState = { ...newValueCache[pvName] };
  // New DType object.
  const newValue = mergeDType(newPvState.value, value);
  newPvState.value = newValue;
  newValueCache[pvName] = newPvState;
}

/**
 * REDUCERS
 */

export function connectionReducer(
  state = initialConnectionState,
  action: Action
): CsState {
  log.debug(action);
  switch (action.type) {
    case VALUE_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      updateValueCache(newValueCache, action);
      return { ...state, valueCache: newValueCache };
    }
    case VALUES_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      for (const changedAction of action.payload) {
        updateValueCache(newValueCache, changedAction);
      }
      return { ...state, valueCache: newValueCache };
    }
    case CONNECTION_CHANGED: {
      const newValueCache: ValueCache = { ...state.valueCache };
      const { pvName, value } = action.payload;
      const pvState = newValueCache[pvName];
      const newPvState = {
        ...pvState,
        connected: value.isConnected,
        readonly: value.isReadonly
      };
      newValueCache[action.payload.pvName] = newPvState;
      return { ...state, valueCache: newValueCache };
    }
    case SUBSCRIBE: {
      const { componentId, effectivePvName } = action.payload;
      const newEffectivePvMap = { ...state.effectivePvNameMap };
      const newSubscriptions = { ...state.subscriptions };
      if (newSubscriptions.hasOwnProperty(effectivePvName)) {
        newSubscriptions[effectivePvName].push(componentId);
      } else {
        newSubscriptions[effectivePvName] = [componentId];
      }

      if (action.payload.pvName !== action.payload.effectivePvName) {
        newEffectivePvMap[action.payload.pvName] =
          action.payload.effectivePvName;
      }
      return {
        ...state,
        subscriptions: newSubscriptions,
        effectivePvNameMap: newEffectivePvMap
      };
    }
    case UNSUBSCRIBE: {
      const newEffectivePvMap = { ...state.effectivePvNameMap };
      const { componentId, pvName } = action.payload;
      const effectivePvName = state.effectivePvNameMap[pvName] || pvName;

      if (
        state.subscriptions[effectivePvName].length === 1 &&
        state.subscriptions[effectivePvName][0] === componentId
      ) {
        // O(n)
        Object.keys(newEffectivePvMap).forEach((key): void => {
          if (newEffectivePvMap[key] === effectivePvName) {
            delete newEffectivePvMap[key];
          }
        });
      }

      const newSubscriptions = { ...state.subscriptions };
      const newPvSubs = state.subscriptions[effectivePvName].filter(
        (id): boolean => id !== componentId
      );
      newSubscriptions[effectivePvName] = newPvSubs;

      return {
        ...state,
        subscriptions: newSubscriptions,
        effectivePvNameMap: newEffectivePvMap
      };
    }
    case DEVICE_QUERIED: {
      const { device, value } = action.payload;
      const newDeviceState = { ...state.deviceCache };
      newDeviceState[device] = value;
      return {
        ...state,
        deviceCache: newDeviceState
      };
    }
  }
  return state;
}

export function configReducer(state = initialConfigState, action: AnyAction) {
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
      const newFile = { name: action.fileName, loaded: action.loaded };
      return {
        ...state,
        ...newFile
      };

    case CLEAR_CONFIG:
      // Sets state back to initial
      return { ...initialConfigState };

    case ADD_CURVE:
      const newCurve = [...state.curve, action.curve];
      return {
        ...state,
        curve: newCurve
      };

    case DELETE_CURVE:
      // Find index of curve to remove
      const index = state.curve.findIndex(
        curve => curve.name === action.curveName
      );
      const newCurves = [...state.curve];
      newCurves.splice(index, 1);
      return {
        ...state,
        curve: newCurves
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
        }
      };
    default:
      return state;
  }
}
