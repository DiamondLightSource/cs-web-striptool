import React from "react";
import { useConnection, useConnections } from "../../hooks/useConnection";
import { PV } from "../../../types/pv";

/**
 * This component creates the connection aspect of a legend entry.
 * Updates the value of a single PV
 * This is separate because the PV value changes more often than
 * most props, so we allow this component to re-render without
 * the other calculations in Legend being repeated.
 * @param props
 * @returns JSX Element to render
 */
export const SingleConnectingComponent = (props: {
  component: React.FC<any>;
  widgetProps: any;
}): JSX.Element => {
  const Component = props.component;
  const { id = 1, type } = props.widgetProps;
  // now we need to make sure that
  let pv = new PV("", "ca");
  if (props.widgetProps.color !== null) {
    pv = new PV(props.widgetProps.curve.name, "ca");
  }
  const [effectivePvName, connected, readonly, latestValue] = useConnection(
    id,
    pv.qualifiedName(),
    type
  );

  const widgetProps = {
    ...props.widgetProps,
    pvName: effectivePvName,
    value: latestValue,
    connected,
    readonly
  };

  // The div rendered here is the container into which the widget
  // will render itself.
  return (
    <div>
      <Component {...widgetProps} />
    </div>
  );
};

/**
 * This component creates the connection aspect for the Graph to
 * multiple PVs.
 * This is separate because the PV values change more often than
 * most props, so we allow this component to re-render without
 * the other calculations in GRaph being repeated.
 * @param props
 * @returns JSX Element to render
 */
export const MultipleConnectingComponent = (props: {
  component: React.FC<any>;
  widgetProps: any;
}): JSX.Element => {
  const Component = props.component;
  const { id, pvNames, types = [] } = props.widgetProps;
  // Get value for each
  const pvValues = useConnections(
    id,
    pvNames.map((pvName: PV) => pvName.qualifiedName()),
    types
  );

  const widgetProps = {
    ...props.widgetProps,
    pvValues: pvValues
  };

  // The div rendered here is the container into which the widget
  // will render itself.
  return (
    <div>
      <Component {...widgetProps} />
    </div>
  );
};
