import React from "react";
import { useSubscription } from "./useSubscription";
import { useSelector } from "react-redux";
import { StateConfig } from "../../redux/state";
import {
  pvStateSelector,
  PvArrayResults,
  pvStateComparator,
  MultiplePvDataArray,
  MultiplePvData
} from "./utils";
import { SubscriptionType } from "../../connection/plugin";
import { DType } from "../../types/dtypes";

export interface PvProps extends React.PropsWithChildren<any> {
  pvName: string;
  effectivePvName: string;
}

export function useConnection(
  id: string,
  pvName?: string,
  type?: SubscriptionType
): [string, boolean, boolean, DType?] {
  const pvNameArray = pvName === undefined ? [] : [pvName];
  const typeArray = type === undefined ? [] : [type];
  useSubscription(id, pvNameArray, typeArray);
  const pvResults = useSelector(
    (state: StateConfig): PvArrayResults => pvStateSelector(pvNameArray, state),
    pvStateComparator
  );
  let connected = false;
  let readonly = false;
  let value = undefined;
  let effectivePvName = "undefined";
  if (pvName !== undefined) {
    const [pvState, effPvName] = pvResults[pvName];
    effectivePvName = effPvName;
    if (pvState) {
      connected = pvState.connected || false;
      readonly = pvState.readonly || false;
      value = pvState.value;
    }
  }
  return [effectivePvName, connected, readonly, value];
}

/**
 * Connect to multiple PVs
 * @param id id of component
 * @param pvNames name of all pvs
 * @param types type of all pvs
 * @returns array of data on each pvs connection, values
 */
export function useConnections(
  id: string,
  pvNames: string[],
  types: SubscriptionType[]
): MultiplePvDataArray {
  useSubscription(id, pvNames, types);
  const pvResults = useSelector(
    (state: StateConfig): PvArrayResults => pvStateSelector(pvNames, state),
    pvStateComparator
  );
  // Create an object where each key is pv name
  const pvData: MultiplePvDataArray = {};
  pvNames.forEach(pvName => {
    if (pvName !== undefined) {
      let pv: MultiplePvData = {};
      const [pvState, effPvName] = pvResults[pvName];
      if (pvState) {
        pv = {
          connected: pvState.connected || false,
          readonly: pvState.readonly || false,
          value: pvState.value || undefined
        };
      }
      pvData[pvName] = pv;
    }
  });
  return pvData;
}
