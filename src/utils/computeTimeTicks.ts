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
    let idx: number;
    // Find which unit is best
    for (idx = 0; idx < bestUnit.length; idx++){
        if ((timespan / TimeUnitValues[idx]) <= MaxTimeIntervals[idx]) break;
    }
    // Convert to units
    // Calculate number of units in selected time e.g. 20 days, or 5 hours
    const numUnits = timespan / TimeUnitValues[idx];
    // Then calculate which of the tick divisor values gives me
    // a number of ticks closest to 4 or 5, or 2 for smaller numbers? 
    let tickValue: number = 0;
    let tickNumber: number = 0;
    if (numUnits >= 4) {
      for (let i = 0; i < TickDivisorVals.length; i++) {
        const tickAccuracy = numUnits / TickDivisorVals[i];
        // We want to find the value closest to 4 or 5, so
        // use 3 and 6 as filter to include those just above/below
        if (3 <= tickAccuracy && tickAccuracy <= 6) {
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
}