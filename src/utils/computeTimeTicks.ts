//const AXIS_MAJOR_TICK_LENGTH = 5;
//const AXIS_MAX_LABEL = 32; //max amount of characters in axis label
//const DOUBLE_EPSILON = 2.2204460492503131E-16;
const bestUnit = [0, 1, 2, 3, 4, 5, 6]

const TickDivisorVals = [1, 2, 5, 10, 20, 25, 50]

const TimeUnitValues: number[]  =
[
  1,                    /* seconds */
  60,                   /* minutes */
  60*60,                /* hours */
  24*60*60,             /* days */
  7*24*60*60,           /* weeks */
  30*24*60*60,          /* months */
  365*24*60*60          /* years */
];

const TimeUnitStrings: string[] = [
    "Seconds",
    "Minutes",
    "Hours",
    "Days",
    "Weeks",
    "Months",
    "Years"
]

const MaxTimeIntervals: number[] =
[
  180,                  /* 3 minutes */
  180,                  /* 3 hours */
  72,                   /* 3 days */
  21,                   /* 3 weeks */
  12,                   /* ~3 months */
  36,                   /* 3 years */
  100                   /* a century */
];

/**
 * Calculate normalised tick offsets and scale values for x axis.
 * Chosen such that the interval widths are easiest to understand.
 * We want 4 or 5 ticks, unless value is less than 4.
 * @param timespan the length of time to plot in seconds
 */
export function computeTimeTickLabels(timespan: number): [string[], string, number, number] {
    //const q = 1;
    //let major: number;
    //let minor: number;
    let idx: number;
    // Find which unit is best
    for (idx = 0; idx < bestUnit.length; idx++){
        if ((timespan / TimeUnitValues[idx]) <= MaxTimeIntervals[idx]) break;
    }
    // Convert to units
    //const a = axis.min / TimeUnitValues[idx];
    //const b = axis.max / TimeUnitValues[idx];
    // Calculate number of units in selected time e.g. 20 days, or 5 hours
    const numUnits = timespan / TimeUnitValues[idx];
    // Then calculate which of the tick divisor values gives me
    // a number of ticks closest to 4 or 5, or 2 for smaller numbers? 
    let tickValue: number = 0;
    let tickNumber: number = 0;
    if (numUnits >= 4) {
      for (let i = 0; i < TickDivisorVals.length; i++) {
        const tickAccuracy = numUnits / TickDivisorVals[i];
        if (4 <= tickAccuracy && tickAccuracy <= 5) {
          tickValue = TickDivisorVals[i];
          // Check if it's closer to 4 or 5
          tickNumber = tickAccuracy % 4 < tickAccuracy % 5 ? 4 : 5;
        }
      }
    } else {
      // If less than 4, just use rounded numUnits as the tickDivisor
      tickValue = 1;
      tickNumber = Math.floor(numUnits);
    }
    // Create an array of every tick
    // e.g. for 20 days it should be 0, -5, -10, -15, -20
    // and this is tickNumber * index
    const tickStringArray: string[] = ["DateTime"]; //Overwrite with datetime when plotting
    //const tickArray: number[] = [min]
    for (let i = 1; i < tickNumber + 1; i++) {
      tickStringArray[i] = (-1 * i * tickValue).toString();
      //tickArray[i+1] = min + ((i + 1) * tickValue * TimeUnitValues[idx])
    }
    // Reverse string array so datetime is last value
    tickStringArray.reverse();
    return [tickStringArray, TimeUnitStrings[idx], tickValue, TimeUnitValues[idx]];

    /*
    switch (idx) {
        case 0: // Seconds
        case 1: // Minutes
          if (numUnits <= 5){
            major = 1; // best divisors
            minor = 1;
          } else if (numUnits <= 10){
            major = 2;
            minor = 1;
          } else if (numUnits <= 20) {
            major = 5;
            minor = 1;
          } else if (numUnits <= 40) {
            major = 10;
            minor = 2;
          } else if (numUnits < 90) {
            major = 20;
            minor = 5;
          } else {
            major = 30;
            minor = 5;
          }
          break;
        case 2: // Hours
          if (numUnits <= 5){
            major = 1;
            minor = 1;
          } else if (numUnits < 12) {
            major = 2;
            minor = 1;
          } else if (numUnits < 20) {
            major = 4;
            minor = 1;
          } else if (numUnits < 30) {
            major = 6;
            minor = 1;
          } else if (numUnits < 60) {
            major = 12;
            minor = 2;
          } else {
            major = 24;
            minor = 4;
          }
          break;
        case 3: // Days
          if (numUnits <= 5) {
            major = 1;
            minor = 1;
          } else if (numUnits < 12) {
            major = 2;
            minor = 1;
          } else if (numUnits < 20) {
            major = 4;
            minor = 1;
          } else {
            major = 7;
            minor = 1;
          }
          break;
        case 4: // Weeks
          if (numUnits <= 5){
            major = 1;
            minor = 1;
          } else if (numUnits < 12) {
            major = 2;
            minor = 1;
          } else {
            major = 4;
            minor = 1;
          }
          break;
        case 5: // Months
          if (numUnits <= 5) {
            major = 1;
            minor = 1;
          } else if (numUnits < 10) {
            major = 2;
            minor = 1;
          } else if (numUnits < 15) {
            major = 3;
            minor = 1;
          } else if (numUnits < 20) {
            major = 4;
            minor = 1;
          } else if (numUnits < 30) {
            major = 6;
            minor = 1;
          } else {
            major = 12;
            minor = 2;
          }
          break;
        case 6: // Years
        default:
          if (numUnits <= 5) {
              major = 1;
              minor = 1;
          } else if (numUnits < 12){
              major = 2;
              minor = 1;
          } else if (numUnits < 24) {
              major = 4;
              minor = 1;
          } else if (numUnits < 30) {
              major = 5;
              minor = 1;
          } else if (numUnits < 60) {
              major = 10;
              minor = 2;
          } else if (numUnits < 120) {
              major = 20;
              minor = 5;
          } else {
              major = 50;
              minor = 50;
          } 
          break;
        }

    console.log(major, minor);
    
    // Ticks must fall on intuitive points 
    if (axis.valueType === "absoluteTime") {
        // Finding tick location is different for time because don't 
        // always occupy consistent intervals. To find first boundary, 
        // truncate current resolution units in min value and add one
        const aSecs = axis.min;
    } else {
        // Relative time
       //(major, minor) = findLinearTicks(axis, false, a, b, q, minor, major)
       const interval = major * q;
       let multiplier = 1;
       let r = b;
       let i = 0;
       const tickOffsets: number[] = [];
       const tickLengths: number[] = [];
       const tickLabels: string[] = [];
       if (interval !== 1) multiplier = interval;

       while ((r - a) > - DOUBLE_EPSILON) {
            tickOffsets[i] = r * TimeUnitValues[idx];
            tickLengths[i] = AXIS_MAJOR_TICK_LENGTH;

            if((i*minor) % major > DOUBLE_EPSILON) {
                tickLabels[i] = "0";
                tickLengths[i] /= 2;
            } else {
                // If this is first tick mark (for max value)
                // print entire date.
                // TO DO - check what xjaxis_reltime_dates is
                // Limit size of label to AXIS_MAX_LABEL characters
                const label = String(r - b)
                tickLabels[i] = label.length > AXIS_MAX_LABEL ? label.substring(0, AXIS_MAX_LABEL) : label;
            }
            r -= minor * q;
            i++;
       }
       let tickScale = "";
       if (multiplier) {
            tickScale = `${TimeUnitNameStrings[idx]} x ${multiplier}`
       } else {
            tickScale = TimeUnitNameStrings[idx];
       }

       const numTicks = i;
       //transformValuesNormalised(axis.min, axis.max, tickOffsets, tickOffsets, numTicks);
    }*/

}

/*
function findLinearTicks(axis: any, niceIntervals: boolean, min: number, max: number, mag: number, minDivisor: number, macDivisor: number) {
    const p = Math.round(Math.log10(max - min));
    const q = Math.pow(10.0, p-1);

    const a = min / q;
    const b = max / q;
    let nums: number[] = [] // number of ticks for ith divisor
    for (let i = 0; i <= 9; i++) {
        if (niceIntervals) {
            nums[i] = (((Math.floor(b/TickDivisorVals[i]) * TickDivisorVals[i]) - Math.ceil((a/TickDivisorVals[i]) * TickDivisorVals[i]))/TickDivisorVals[i]) + 1;
        } else {
            nums[i] = ((b - a)/TickDivisorVals[i]) + 1;
        }
    }

    const nMajor = 0;
    const mMajor = 1;
    for (let i = 0; i <= 9; i++) {
        if (nums[i] > nMajor && nums[i]<= 6) {
            nums[i] = (((Math.floor(b/TickDivisorVals[i]) * TickDivisorVals[i]) - Math.ceil((a/TickDivisorVals[i]) * TickDivisorVals[i]))/TickDivisorVals[i]) + 1;
        } else {
            nums[i] = ((b - a)/TickDivisorVals[i]) + 1;
        }
    }
}

function transformValuesNormalised(xIn: number[], xOut: number[], minVal: number, maxVal: number, num: number) {
    while (num > 0) {
        xOut[num] = (xIn[num] - minVal) / (maxVal - minVal)
        num--;
    }
    return [xIn, xOut]
}*/