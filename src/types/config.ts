import { Curve } from "./curve";

export type GraphPanelComponentProps = {
  graphConfig: StripToolConfig;
};

export type ControlPanelComponentProps = {
  graphConfig: StripToolConfig;
};

export type StripToolConfigDict = {
  [key: string]: string;
};

export type StripToolConfig = {
  file: {
    name: string;
    loaded: boolean; // whether file is new or loaded from existing file
  };
  option: {
    gridXOn: number;
    gridYOn: number;
    axisYColorStat: boolean;
    graphLineWidth: number;
  };
  time: {
    timespan: number;
    numSamples: number;
    sampleInterval: number;
    refreshInterval: number;
  };
  color: {
    background: number[];
    foreground: number[];
    grid: number[];
    colors: number[][];
  };
  curve: Curve[];
};
