import React, { Component } from "react";
import "./App.css";
import Survey from "./components/Pages/Survey";
import SurveyEnd from "./components/Pages/SurveyEnd";
import Results from "./components/Pages/Results";
import Menu from "./components/Pages/Menu";
import {
  AppBar,
  Toolbar,
  MuiThemeProvider,
  createMuiTheme,
  Typography
} from "@material-ui/core";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = { pageName: "Menu", endMessage: "" };
  }

  changePage = (endMessage, specificPage) => {
    if (specificPage !== undefined) {
      /* If a page has been specified then display it and update
      the endMessage if necessary */
      this.setState({
        pageName: specificPage,
        endMessage:
          endMessage === undefined ? this.state.endMessage : endMessage
      });
    } else {
      /* Check current page to determine which page should
      be displayed next and update the state accordingly */
      switch (this.state.pageName) {
        case "Survey":
          this.setState({
            pageName: "SurveyEnd",
            endMessage: endMessage
          });
          break;
        case "SurveyEnd":
          this.setState({
            pageName: "Menu"
          });
          break;
        case "Results":
          this.setState({
            pageName: "Menu"
          });
          break;
        default:
      }
    }
  };

  getPage = () => {
    // Build and return page object based on current state
    let page;
    switch (this.state.pageName) {
      case "Menu":
        // Menu page allows user to specify which page to go to next
        page = <Menu loadPage={this.changePage} />;
        break;
      case "Survey":
        /* When survey has ended the change page function will 
        be triggered to display the end message */
        page = <Survey unMount={this.changePage} />;
        break;
      case "SurveyEnd":
        /* Display the end message and trigger the change page
        to send the user back to the menu when ready */
        page = (
          <SurveyEnd
            endMessage={this.state.endMessage}
            unMount={this.changePage}
          />
        );
        break;
      case "Results":
        /* Display the results and trigger the change page
        to send the user back to the menu when ready */
        page = <Results unMount={this.changePage} />;
        break;
      default:
        page = null;
    }
    return page;
  };

  render() {
    const customTheme = createMuiTheme({
      palette: {
        primary: {
          light: "#00A9DD",
          main: "#009ADA",
          dark: "#0099CE",
          contrastText: "#fff"
        }
      }
    });

    // Display page according to state
    return (
      <div>
        <MuiThemeProvider theme={customTheme}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6">BMW</Typography>
            </Toolbar>
          </AppBar>
          <div className="body-content">{this.getPage()}</div>
        </MuiThemeProvider>
      </div>
    );
  }
}
