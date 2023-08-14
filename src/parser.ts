/**
 * Load a .stp file and parse into an array of dicts
 */
import { readFileSync } from "fs";

type StripToolConfigDict = {
    [key: string]: string,
}

/**
 * Opens and reads the .stp file
 * @param filename the file to load and read
 * @returns: an array of dictionaries
 */
function readFile(filename: string) {
    // Read file
    const file = readFileSync(filename, 'utf-8');
    const lines: string[] = file.split("\n");

    const dataDict: StripToolConfigDict = {};
    lines.forEach(line => {
        const res = (line.split(" ")).filter(res => res !== "");
        const keyname = res.shift();
        dataDict[keyname as string] = res.toString();
    })

    const stripToolConfig = {
        config: Number(dataDict["StripConfig"]),
        option: parseGraphOptions(dataDict),
        time: parseTimes(dataDict),
        color: parseGraphColors(dataDict),
        curves: parseCurves(dataDict)

    }
    console.log(stripToolConfig);
    return stripToolConfig;
}



/**
 * Parse graph option values from dict, and convert values to correct
 * type (boolean with !! operator)
 * @param data 
 * @returns dict
 */
function parseGraphOptions(data: StripToolConfigDict) {
    const option = {
        gridXOn: Number(data["Strip.Option.GridXon"]), // whether to display none, some or all grid lines
        gridYOn: Number(data["Strip.Option.GridYon"]),
        axisYColorStat: !!data["Strip.Option.AxisYcolorStat"], // Color y axis with line color or not
        graphLineWidth: Number(data["Strip.Option.GraphLineWidth"])
    }
    return option;
}

/**
 * Parse data into a dict of time values. Convert
 * array into number values.
 * @param data 
 * @returns dict of string keys and number values
 */
function parseTimes(data: StripToolConfigDict) {
    const time = {
        timespan: Number(data["Strip.Time.Timespan"]),
        numSamples: Number(data["Strip.Time.NumSamples"]),
        sampleInterval: Number(data["Strip.Time.SampleInterval"]),
        refreshInterval: Number(data["Strip.Time.RefreshInterval"])
    }
    return time;
}

function parseGraphColors(data: StripToolConfigDict) {
    // split by comma, divide by
    const color = {
        background: parseColor(data["Strip.Color.Background"]),
        foreground: parseColor(data["Strip.Color.Foreground"]),
        grid: parseColor(data["Strip.Color.Grid"]),
    }
    return color;
}

function parseColor(colorString: string){
    const values = colorString.split(",")
    const colors = values.map(val => {
        return Math.floor(Number(val) / 256);
    })
    return colors;
}

function parseCurves(data: StripToolConfigDict) {
    // get number of plots
    const curves: any[] = [];
    // Determine how many curves there are by how many keys contain "Strip.Curve.<num>.Name"
    const numCurves = (Object.keys(data).filter(key => key.includes(".Name"))).length;
    for(let idx = 0; idx < numCurves; idx++){
        const curve = {
            name: data[`Strip.Curve.${idx}.Name`],
            color: parseColor(data[`Strip.Color.Color${idx + 1}`]),
            units: data[`Strip.Curve.${idx}.Units`],
            comment: data[`Strip.Curve.${idx}.Comment`],
            precision: Number(data[`Strip.Curve.${idx}.Precision`]),
            min: Number(data[`Strip.Curve.${idx}.Min`]),
            max: Number(data[`Strip.Curve.${idx}.Max`]),
            scale: !!data[`Strip.Curve.${idx}.Scale`], // this is log10 or not
            plotStatus: !!data[`Strip.Curve.${idx}.PlotStatus`], // whether to show plot
        }
        curves.push(curve);
    }
    return curves;
}

readFile("/dls_sw/work/R3.14.12.7/ioc/BL23I/BL/BL23IApp/opi/edl/vacuum1.stp");