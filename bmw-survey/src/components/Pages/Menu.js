import React, { Component } from "react";
import NavigationButton from "../Atoms/NavigationButton";

export default class Menu extends Component {
  takeSurvey = () => {
    this.props.loadPage(null, "Survey");
  };

  viewresults = () => {
    this.props.loadPage(null, "Results");
  };

  render() {
    return (
      // Present user with options to either take survey or view results.
      <div className="space-top-extra-large">
        <NavigationButton
          navigationButtonText="Take Survey"
          navigationCallbackFunction={this.takeSurvey}
        />
        <NavigationButton
          navigationButtonText="View Results"
          navigationCallbackFunction={this.viewresults}
          classes="space-top-small"
        />
      </div>
    );
  }
}
