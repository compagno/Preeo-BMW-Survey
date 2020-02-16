import React, { Component } from "react";
import * as firebase from "firebase";
import BarChart from "../Atoms/BarChart";
import CircularChart from "../Atoms/CircularChart";
import NavigationButton from "../Atoms/NavigationButton";

export default class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allSurveyResponses: [],
      adolescents: [],
      unlicensed: [],
      firstTimers: [],
      targetables: [],
      averageCarsPerPerson: 0
    };
  }

  // Retrieves data from the firebase database and stores information in the component states
  componentDidMount() {
    // Get the response collection from the database
    firebase
      .firestore()
      .collection("Survey Responses")
      .get()
      .then(data => {
        const allSurveyResponses = data.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Extract the respondent groups from the result set
        const adolescents = allSurveyResponses.filter(x => x.Age < 18);
        const unlicensed = allSurveyResponses.filter(
          x => x.Age >= 18 && !x.HasDrivingLicence
        );
        const firstTimers = allSurveyResponses.filter(
          x => x.Age >= 18 && x.Age <= 25 && x.IsFirstCar
        );
        const targetables = allSurveyResponses.filter(
          x =>
            x.Age >= 18 &&
            x.HasDrivingLicence &&
            (!x.IsFirstCar || x.IsFirstCar === "")
        );

        // Calculate the average number of cars each respondent has
        let averageCarsPerPerson = targetables.map(x => x.QtyBMW);
        averageCarsPerPerson = (
          averageCarsPerPerson.reduce((a, b) => a + b, 0) /
          averageCarsPerPerson.length
        ).toFixed(1);

        // Save datasets in state
        this.setState({
          allSurveyResponses: allSurveyResponses,
          adolescents: adolescents,
          unlicensed: unlicensed,
          firstTimers: firstTimers,
          targetables: targetables,
          averageCarsPerPerson: averageCarsPerPerson
        });
      });
  }

  /* Gets all model names that have been inputted from the targetable group, 
  the other groups would not have data for model names */
  getAllModels = () => {
    const targetableModels = this.state.targetables.map(x => x.Models);
    let allModels = [];
    for (let i = 0; i < targetableModels.length; i++) {
      allModels.push(...targetableModels[i]);
    }
    return allModels;
  };

  // Get data for the model chart {labels[], data[]}
  getModelChartInfo = () => {
    const allModels = this.getAllModels();

    // Get a distinct list of models
    const distinctModels = [...new Set(allModels)];

    /* Iterate the distinct list of models and get the total number of occurences for each.
    The results are sorted by total number of occurances in descending order */
    let resultSet = distinctModels
      .map(distinctModel => {
        return {
          label: distinctModel,
          data: allModels.filter(model => model === distinctModel).length
        };
      })
      .sort((a, b) => b.data - a.data);

    return {
      labels: resultSet.map(x => x.label),
      data: resultSet.map(x => x.data)
    };
  };

  // Get data for the respondent groups chart {labels[], data[]}
  getRespondentGroupsChartInfo = () => {
    const labels = ["Adolescents", "Unlicensed", "First Timers", "Targetables"];
    const { adolescents, unlicensed, firstTimers, targetables } = this.state;

    const data = [
      adolescents.length,
      unlicensed.length,
      firstTimers.length,
      targetables.length
    ];

    return { labels: labels, data: data };
  };

  // Get data for the respondent groups (%) chart {labels[], data[]}
  getRespondentGroupsPercentageChartInfo = () => {
    const labels = ["Adolescents", "Unlicensed", "First Timers", "Targetables"];
    const {
      allSurveyResponses,
      adolescents,
      unlicensed,
      firstTimers,
      targetables
    } = this.state;

    const data = [
      Math.round((adolescents.length / allSurveyResponses.length) * 100),
      Math.round((unlicensed.length / allSurveyResponses.length) * 100),
      Math.round((firstTimers.length / allSurveyResponses.length) * 100),
      Math.round((targetables.length / allSurveyResponses.length) * 100)
    ];

    return { labels: labels, data: data };
  };

  // Get data for the prefrences percentage chart {labels[], data[]}
  getPreferencesPercentageChartInfo = () => {
    const { targetables } = this.state;

    const labels = [
      "Care about drifting",
      "Picked FWD or I don't know for drivetrain"
    ];
    const drifterPreference = targetables.filter(x => x.LikesDrifting);
    const drivetrainPreference = targetables.filter(
      x =>
        x.PreferredDrivetrain === "FWD" ||
        x.PreferredDrivetrain === "I don't know"
    );

    console.log(targetables.length);
    console.log(drifterPreference.length);
    console.log(drivetrainPreference.length);

    const data = [
      Math.round((drifterPreference.length / targetables.length) * 100),
      Math.round((drivetrainPreference.length / targetables.length) * 100)
    ];

    return { labels: labels, data: data };
  };

  render() {
    const modelChartInfo = this.getModelChartInfo();
    const respondentGroupsChartInfo = this.getRespondentGroupsChartInfo();
    const respondentGroupsPercentageChartInfo = this.getRespondentGroupsPercentageChartInfo();
    const preferencesPercentageChartInfo = this.getPreferencesPercentageChartInfo();

    return (
      <div className="chart-page">
        <h2 className="results-title">
          Average number of BMW cars owned per person:{" "}
          <span className="result-value">
            {this.state.averageCarsPerPerson}
          </span>
        </h2>
        <div className="chart-container">
          <div className="chart-row">
            <div className="chart">
              <BarChart
                chartInfo={{
                  title: "Respondent Groups",
                  isHorizontal: false,
                  labels: respondentGroupsChartInfo.labels,
                  data: respondentGroupsChartInfo.data
                }}
              />
            </div>

            <div className="chart">
              <CircularChart
                chartInfo={{
                  title: "Respondent Groups (%)",
                  isPolar: false,
                  labels: respondentGroupsPercentageChartInfo.labels,
                  data: respondentGroupsPercentageChartInfo.data
                }}
              />
            </div>
          </div>

          <div className="chart-row space-top-extra-large">
            <div className="chart">
              <CircularChart
                chartInfo={{
                  title: "Preferences by Targetables (%)",
                  isPolar: true,
                  labels: preferencesPercentageChartInfo.labels,
                  data: preferencesPercentageChartInfo.data
                }}
              />
            </div>
            <div className="chart">
              <BarChart
                chartInfo={{
                  title: "BMW Models",
                  isHorizontal: true,
                  labels: modelChartInfo.labels,
                  data: modelChartInfo.data
                }}
              />
            </div>
          </div>
        </div>
        <footer className="results-footer space-top-extra-large">
          <NavigationButton
            navigationButtonText="Back"
            navigationCallbackFunction={this.props.unMount}
          />
        </footer>
      </div>
    );
  }
}
