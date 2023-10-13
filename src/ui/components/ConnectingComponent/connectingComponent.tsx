import React from "react";
import { useConnection } from "../../hooks/useConnection";
import { PV } from "../../../types/pv";

/**
 * This component creates the connection aspect of a widget.
 * This is separate because the PV value changes more often than
 * most props, so we allow this component to re-render without
 * the other calculations in Widget being repeated.
 * @param props
 * @returns JSX Element to render
 */
export const ConnectingComponent = (props: {
  component: React.FC<any>;
  widgetProps: any;
}): JSX.Element => {
  const Component = props.component;
  const { id = 1, pvName, type } = props.widgetProps;
  // now we need to make sure that
  const pv = new PV("", "ca");
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
