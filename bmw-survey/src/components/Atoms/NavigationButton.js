import React, { Component } from "react";
import Button from "@material-ui/core/Button";

// Navigation button is designed to be used to navigate between questions and between pages
export default class NavigationButton extends Component {
  render() {
    const {
      navigationButtonText,
      navigationCallbackFunction,
      classes,
      endIcon
    } = this.props;

    return (
      <div className={classes}>
        <Button
          variant="contained"
          color="primary"
          onClick={navigationCallbackFunction}
          endIcon={endIcon}
        >
          {navigationButtonText}
        </Button>
      </div>
    );
  }
}
