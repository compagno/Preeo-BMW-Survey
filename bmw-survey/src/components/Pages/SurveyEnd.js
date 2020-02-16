import React, { Component } from "react";
import NavigationButton from "../Atoms/NavigationButton";

// Presents a message to the user with the option to go back to the menu
export default class SurveyEnd extends Component {
  render() {
    return (
      <div>
        <h3>{this.props.endMessage}</h3>

        <footer className="survey-end-footer">
          <NavigationButton
            navigationButtonText="Back"
            navigationCallbackFunction={this.props.unMount}
          />
        </footer>
      </div>
    );
  }
}
