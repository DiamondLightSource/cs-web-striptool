
export type GraphPanelComponentProps = {
    graphConfig: StripToolConfig
};

export type ControlPanelComponentProps = {
    graphConfig: StripToolConfig
};


export type StripToolConfigDict = {
    [key: string]: string,
};

type StripToolConfig = {
    config: string,
    option: {
        gridXOn: number,
        gridYOn: number,
        axisYColorStat: boolean,
        graphLineWidth: number
    },
    time: {
        timespan: number,
        numSamples: number,
        sampleInterval: number,
        refreshInterval: number
    },
    color: {
        background: number[],
        foreground: number[],
        grid: number[]
    },
    curve: GraphCurve[]
};

type GraphCurve = {
    name: string,
    color: number[],
    units: string,
    comment: string,
    precision: number,
    min: number,
    max: number,
    scale: boolean,
    plotStatus: boolean
};