import React, { Component } from "react";
import questionData from "../../data/questionData";
import ResponseField from "../Atoms/ResponseField";

export default class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputRepetition: 1,
      nextInputRepetition: 1,
      isNewQuestion: true
    };
  }

  handleResponseChange = (name, displayValue, arrayPosition, arraySize) => {
    // Upon receiving updates from the field, turn off the new question flag
    this.setState({ isNewQuestion: false });

    // Trigger an update in survey responses
    this.props.handleResponseChange(
      name,
      displayValue,
      arrayPosition,
      arraySize
    );
  };

  setNextInputRepetition = repetitions => {
    this.setState({ nextInputRepetition: repetitions });
  };

  prepSurveyResponseArray = (surveyResponseIndex, arraySize) => {
    this.props.prepSurveyResponseArray(surveyResponseIndex, arraySize);
  };

  // Create and return input fields for the user
  getResponseFields = data => {
    let responseFields = [];
    const { inputRepetition, isNewQuestion } = this.state;

    /* Repeats the creation of an input field based on inputRepetition.
    This is to cater for predecessor questions which determine the 
    number of inputs expected for the following question */
    for (let i = 0; i < inputRepetition; i++) {
      let newComponent = React.createElement(ResponseField, {
        key: data.id + "_" + i,
        id: data.id,
        innerLabel: inputRepetition > 1 ? (i + 1).toString() : "",
        arrayPosition: i,
        arraySize: inputRepetition,
        name: data.name,
        fieldType: data.fieldType,
        options: data.options,
        inputProperties: data.inputProperties,
        isPredecessorQuantifier: data.isPredecessorQuantifier,
        handleResponseChange: this.handleResponseChange,
        setNextInputRepetition: this.setNextInputRepetition,
        isNewQuestion: isNewQuestion,
        prepSurveyResponseArray: this.prepSurveyResponseArray
      });

      responseFields.push(newComponent);
    }

    return responseFields;
  };

  // On update check if this is a new question and prepare accordingly
  componentDidUpdate(prevProps) {
    if (prevProps.questionIndex !== this.props.questionIndex) {
      this.setState({
        isNewQuestion: true,
        inputRepetition: this.state.nextInputRepetition,
        nextInputRepetition: 1
      });
    }
  }

  render() {
    // Gets the current question to be rendered
    const data = questionData.find(x => x.id === this.props.questionIndex);

    return (
      <div>
        <h3>{data.question}</h3>
        <h5>{data.infoMessage}</h5>
        {this.getResponseFields(data)}
      </div>
    );
  }
}
