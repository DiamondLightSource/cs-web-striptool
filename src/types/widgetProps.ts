import { PvState } from "../redux/state";
import { InferWidgetProps, PvPropOpt, PvTypePropOpt } from "./propTypes";

import { GenericProp } from "./props";
import { DType } from "./dtypes";

// Internal type for creating widgets
export type WidgetComponent = {
  baseWidget: React.FC<any>;
};

// Internal prop types object for properties which are not in a standard widget
const PVExtras = {
  pvName: PvPropOpt,
  pvType: PvTypePropOpt
};
// PropTypes object for a PV widget which can be expanded
export const PVWidgetPropType = {
  ...PVExtras
};
export type PVWidgetProps = InferWidgetProps<typeof PVExtras>;
export type PVWidgetComponent = PVWidgetProps & { baseWidget: React.FC<any> };
export type AnyProps = PVWidgetComponent & {
  id: string;
  connected?: boolean;
  readonly?: boolean;
  value?: DType;
} & {
  // All other props with valid types.
  [x: string]: GenericProp;
};

export interface Component {
  style?: Record<string, string>;
}

export type PVComponent = Component & PvState;
export type PVInputComponent = PVComponent & { pvName: string };
