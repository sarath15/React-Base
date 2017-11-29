import React from "react";

/**
 * PropTypes shared by components that check authorization status
 */
export default {
  component: PropTypes.func.isRequired,
  user: (props, propName, componentName) => {
    const propValue = props[propName];

    // if (propValue !== null && !(propValue instanceof firebase.User)) {
    //   return new Error(
    //     `Prop '${propName}' on component '${componentName} has invalid value '${propValue}'`
    //   );
    // }
  }
};
