import { SinglePvState, MultiplePvState } from "../redux/state";
import {
  InferWidgetProps,
  PvArrayPropOpt,
  PvPropOpt,
  PvTypeArrayPropOpt,
  PvTypePropOpt
} from "./propTypes";

// Internal type for creating widgets
export type WidgetComponent = {
  baseWidget: React.FC<any>;
};

// SINGLE PV COMPONENT

// Internal prop types object for properties which are not in a standard widget
const SinglePVExtras = {
  pvName: PvPropOpt,
  pvType: PvTypePropOpt
};

// PropTypes object for a PV widget which can be expanded
export const SinglePVPropType = {
  ...SinglePVExtras
};

export type SinglePVProps = InferWidgetProps<typeof SinglePVExtras>;

// MULTIPLE PV COMPONENT

const MultiplePVExtras = {
  pvNames: PvArrayPropOpt,
  pvTypes: PvTypeArrayPropOpt
};

// PropTypes object for a PV widget which can be expanded
export const MultiplePVPropType = {
  ...MultiplePVExtras
};

export type MultiplePVProps = InferWidgetProps<typeof MultiplePVExtras>;

export interface Component {
  style?: Record<string, string>;
}

export type SinglePVComponent = Component & SinglePvState;
export type SinglePVInputComponent = SinglePVComponent & { pvName: string };

export type MultiplePVComponent = Component & MultiplePvState;
export type MultiplePVInputComponent = MultiplePVComponent & { pvName: string };
