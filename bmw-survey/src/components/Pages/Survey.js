import React, { Component } from "react";
import NavigationButton from "../Atoms/NavigationButton";
import Question from "../Structures/Question";
import questionData from "../../data/questionData";
import * as firebase from "firebase";
import Icon from "@material-ui/core/Icon";

export default class Survey extends Component {
  constructor(props) {
    super(props);

    // Initialize an empty set of responses
    let surveyResponses = questionData.map(x => {
      let defaultDbValue = "";
      let defaultinputValue = "";

      // The db expects models to be an array
      if (x.name === "Models") {
        defaultDbValue = [""];
        defaultinputValue = [""];
      }

      return {
        id: x.id,
        name: x.name,
        dbValue: defaultDbValue,
        inputValue: defaultinputValue
      };
    });

    this.state = {
      questionIndex: 0,
      navigationButtonText: "next",
      navigationCallbackFunction: this.goToNextQuestion,
      surveyResponses: surveyResponses,
      defaultEndMessage: "Thank you for your interest in helping BMW"
    };
  }

  // Adds a new entry to the firebase database using the survey respones
  addSurveyResponsesToDb = () => {
    const db = firebase.firestore();

    // Build and send a response collection using the database values from the survey responses
    db.collection("Survey Responses").add({
      Age: this.getSurveyResponseDbValue("Age"),
      Gender: this.getSurveyResponseDbValue("Gender"),
      HasDrivingLicence: this.getSurveyResponseDbValue("HasDrivingLicence"),
      IsFirstCar: this.getSurveyResponseDbValue("IsFirstCar"),
      PreferredDrivetrain: this.getSurveyResponseDbValue("PreferredDrivetrain"),
      LikesDrifting: this.getSurveyResponseDbValue("LikesDrifting"),
      QtyBMW: this.getSurveyResponseDbValue("QtyBMW"),
      Models: this.getSurveyResponseDbValue("Models")
    });
  };

  // Retrieves the database value of a specific reponse
  getSurveyResponseDbValue = name => {
    return this.state.surveyResponses.find(x => x.name === name).dbValue;
  };

  // Updates the survey responses with new values
  updateResponse = (name, displayValue, arrayPosition, arraySize) => {
    let surveyResponses = this.state.surveyResponses;
    let targetResponse = surveyResponses.find(x => x.name === name);

    // By default, the db value is identical to the user input
    let dbValue = displayValue;
    let question = questionData.find(x => x.name === name);

    /* If the question was a select, update the db value according to the corresponsing value
    associated with the user's choice (specified in questionData.js). For instance "Yes" would
    be translated to true and "No, I prefer using other transport" would be translated to false */
    if (question.fieldType === "select") {
      dbValue = question.options.find(x => x.displayValue === displayValue)
        .dbValue;
    }

    /* If multiple responses are expected then use an array to convey the response.
    In the case of inputting model names, an array is always to be expected */
    if (arraySize > 1 || name === "Models") {
      targetResponse.dbValue[arrayPosition] = dbValue;
      targetResponse.inputValue[arrayPosition] = displayValue;
    } else {
      targetResponse.dbValue = dbValue;
      targetResponse.inputValue = displayValue;
    }

    this.setState({
      surveyResponses: surveyResponses
    });
  };

  // Load the next question.
  goToNextQuestion = () => {
    const { questionIndex } = this.state;

    /* Assess the last response to see if the user is eligible to contiue 
    with the survey. If not, validation will automatically halt the survey
    and if necessary specify a reason message */
    this.validateLastAnswer();

    /* Bonus questions such as "Is this your first car?" may need to be skipped
    based on the last response submitted by the user */
    let skipQuestions = this.calculateQuestionsToSkip();

    // Set the next question index and if necessary skip some questions
    this.setState({
      questionIndex: questionIndex + 1 + skipQuestions
    });

    // If this was the question before the last, prepare layout for final answer
    if (questionIndex === questionData.length - 2) {
      this.prepareFinalNavigation();
    }
  };

  // Prepares a specific survey response for an array input of a specific size
  prepSurveyResponseArray = (surveyResponseIndex, arraySize) => {
    let surveyResponses = this.state.surveyResponses;

    // Set the dbValue and inputValue to new arrays of a specified size
    surveyResponses[surveyResponseIndex].dbValue = Array.from({
      length: arraySize
    });
    surveyResponses[surveyResponseIndex].inputValue = Array.from({
      length: arraySize
    });

    this.setState({
      surveyResponses: surveyResponses
    });
  };

  /* Validates the last answer inputted. If necessary, the survey will end prematurely,
  displaying a message to the user */
  validateLastAnswer = () => {
    const { defaultEndMessage, surveyResponses, questionIndex } = this.state;
    const lastSurveyReponse = surveyResponses.find(x => x.id === questionIndex);

    let endSurvey = false;
    let endMessage = defaultEndMessage;

    // Get the corresponding question information so that select fields are validated accurately
    let correspondingQuestionData = questionData.find(
      x => x.id === questionIndex
    );

    // Adolescents, respondents without a licence and first timers are not allowed to continue
    if (lastSurveyReponse.name === "Age" && lastSurveyReponse.inputValue < 18) {
      endSurvey = true;
    } else if (
      lastSurveyReponse.name === "HasDrivingLicence" &&
      lastSurveyReponse.inputValue ===
        correspondingQuestionData.options[1].displayValue
    ) {
      endSurvey = true;
    } else if (
      lastSurveyReponse.name === "IsFirstCar" &&
      lastSurveyReponse.inputValue ===
        correspondingQuestionData.options[0].displayValue
    ) {
      // Use customized end message for first timers
      endSurvey = true;
      endMessage =
        "We are targeting more experienced clients, thank you for your interest";
    }

    if (endSurvey) {
      this.endSurvey(endMessage);
    }
  };

  // Gets the number of questions to be skipped based on the current response
  calculateQuestionsToSkip = () => {
    const { questionIndex, surveyResponses } = this.state;
    let currentQuestionInfo = questionData.find(x => x.id === questionIndex);
    let skips = 0;

    /* When users answer the driving licence question, if they are older than 25
    the next question (is first timer) should be skipped. Thus, only those who are
    between 18 and 25 are presented with the next question - at this stage all respondents
    are at least 18 */
    if (currentQuestionInfo.name === "HasDrivingLicence") {
      let driverAge = surveyResponses.find(x => x.name === "Age").inputValue;
      if (driverAge > 25) {
        skips = 1;
      }
    }

    return skips;
  };

  // Prepare layout for final survey question
  prepareFinalNavigation = () => {
    this.setState({
      navigationButtonText: "submit",
      navigationCallbackFunction: this.submitSurvey,
      endIcon: <Icon>send</Icon>
    });
  };

  /* Check the model names inputted to ensure that they abide by the following patterns
      Pattern 1:
        Starts with 'M' (optional)
        3 Numbers
        Ends with 'd' or 'i' (optional)
      Pattern 2:
        Starts with 'X' OR 'Z'
        1 Number */
  areValidModelNames = () => {
    let isValid = true;
    const modelNames = this.state.surveyResponses.find(x => x.name === "Models")
      .inputValue;
    modelNames.forEach(modelName => {
      /* Pattern Explanation: ^M{0,1}\d{3}[di]{0,1}$|^[XZ]\d$
         Pattern 1: ^M{0,1}\d{3}[di]{0,1}$
         Pattern 2: ^[XZ]\d$
         ^ = start of line
         $ = end of line
         {0,1} = repeated 0 or 1 times, {3} = repeated exactly 3 times
         \d = digit
         [di] = d or i, [XZ] = X or Z
         M = M
      */
      if (!/^M{0,1}\d{3}[di]{0,1}$|^[XZ]\d$/.test(modelName)) {
        isValid = false;
      }
    });
    return isValid;
  };

  // Submits a completed survey
  submitSurvey = () => {
    /* Ensure that the model names are all valid. Although input is already restricted to
    abide by the pre-determined patterns, this additional check will catch forcefully entered
    values via the browser console */

    if (this.areValidModelNames()) {
      this.endSurvey(this.state.defaultEndMessage);
    } else {
      alert(
        "Kindly note that all Model names must adhere to one of the patterns below\r\n" +
          "Pattern 1:\r\n" +
          "- Starts with 'M' (optional)\r\n" +
          "- 3 Numbers\r\n" +
          "- Ends with 'd' or 'i' (optional)\r\n" +
          "Pattern 2:\r\n" +
          "- Starts with 'X' OR 'Z'\r\n" +
          "- 1 Number"
      );
    }
  };

  // Ends the survey by adding the responses to the database and unmounts the component
  endSurvey = endMessage => {
    this.addSurveyResponsesToDb();
    this.props.unMount(endMessage);
  };

  render() {
    const {
      questionIndex,
      navigationButtonText,
      navigationCallbackFunction,
      endIcon
    } = this.state;

    return (
      <div className="survey-wrapper">
        <Question
          questionIndex={questionIndex}
          handleResponseChange={this.updateResponse}
          prepSurveyResponseArray={this.prepSurveyResponseArray}
        />
        <NavigationButton
          classes="space-top-large"
          navigationButtonText={navigationButtonText}
          navigationCallbackFunction={navigationCallbackFunction}
          endIcon={endIcon}
        />
      </div>
    );
  }
}
