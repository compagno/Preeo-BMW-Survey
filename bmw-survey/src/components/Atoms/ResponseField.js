import React, { Component } from "react";
import { TextField, Select, MenuItem } from "@material-ui/core";

export default class ResponseField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldValue: ""
    };
  }

  /* Use regex to restrict user input ensuring it abides by the pre-determined model name patterns
      Pattern 1:
        Starts with 'M' (optional)
        3 Numbers
        Ends with 'd' or 'i' (optional)
      Pattern 2:
        Starts with 'X' OR 'Z'
        1 Number */
  checkModelRegex = inputValue => {
    const { fieldValue } = this.state;
    /* Pattern Explanations
        Pattern 1: ^M$  or  ^X$  or  ^Z$  or  ^\d$
        Pattern 2: ^M\d$  or  ^\d{2}$  or  ^X\d$  or  ^Z\d$
        Pattern 3: ^\d{3}[di]{0,1}$  or  ^M\d{2}$  or  ^M\d{3}[di]{0,1}$
        ^ = start of line
        $ = end of line
        {0,1} = repeated 0 or 1 times, {2} = repeated exactly 2 times, {3} = repeated exactly 3 times
        \d = digit
        [di] = d or i
        M = M 
        X = X
        Z = Z
    */
    let returnValue = inputValue;
    //
    if (inputValue.length === 1 && !/^M$|^X$|^Z$|^\d$/.test(inputValue)) {
      returnValue = fieldValue;
    } else if (
      inputValue.length === 2 &&
      !/^M\d$|^\d{2}$|^X\d$|^Z\d$/.test(inputValue)
    ) {
      returnValue = fieldValue;
    } else if (
      inputValue.length > 2 &&
      inputValue.length <= 5 &&
      !/^\d{3}[di]{0,1}$|^M\d{2}$|^M\d{3}[di]{0,1}$/.test(inputValue)
    ) {
      returnValue = fieldValue;
    } else if (inputValue.length > 5) {
      // Maximum length of input allowed is 5 ex: M123d
      returnValue = fieldValue;
    }
    return returnValue;
  };

  // Checks number inputs to ensure they fall within the min and max defined in inputProperties
  checkNumberRange = inputValue => {
    let returnValue = inputValue;
    const { inputProperties } = this.props;

    if (inputProperties.min !== undefined && inputValue < inputProperties.min) {
      // If value falls below minimum, set it to minimum
      returnValue = inputProperties.min;
    } else if (
      inputProperties.max !== undefined &&
      inputValue > inputProperties.max
    ) {
      // If value is above maximum, set it to maximum
      returnValue = inputProperties.max;
    }

    return returnValue;
  };

  handleResponseChange = e => {
    const {
      fieldType,
      inputProperties,
      id,
      name,
      isPredecessorQuantifier,
      arraySize,
      arrayPosition,
      setNextInputRepetition,
      prepSurveyResponseArray,
      handleResponseChange
    } = this.props;
    let inputValue = e.target.value;

    // Ensure number inputs are inserted correctly
    if (fieldType === "input" && inputProperties.type === "number") {
      if (inputValue === "") {
        inputValue = 0;
      }
      inputValue = parseInt(inputValue);
      inputValue = this.checkNumberRange(inputValue);
    }

    /* Validate input of model names, if the user inserts an invalid character
    it will be removed from the input field */
    if (name === "Models") {
      inputValue = this.checkModelRegex(inputValue);
    }

    /* If the current field is a predecessor quantifier field and is a 
    valid number then define the number of repititions for the input 
    fields belonging to next question */
    if (isPredecessorQuantifier && !isNaN(inputValue)) {
      setNextInputRepetition(inputValue);
      prepSurveyResponseArray(id + 1, inputValue);
    } else {
      setNextInputRepetition(1);
    }

    // Trigger a response change so that the values can be saved in the survey responses
    handleResponseChange(name, inputValue, arrayPosition, arraySize);

    this.setState({ fieldValue: inputValue });
  };

  componentDidUpdate() {
    // Clear field if a new question has been loaded
    if (this.props.isNewQuestion) {
      if (this.state.fieldValue !== "") {
        this.setState({ fieldValue: "" });
      }
    }
  }

  generateField() {
    // Create JSX fields according to the field type passed in
    if (this.props.fieldType === "select") {
      return this.generateSelectField();
    } else {
      return this.generateInputField();
    }
  }

  generateInputField = () => {
    const { inputProperties, innerLabel, isNewQuestion } = this.props;
    let fieldValue = this.state.fieldValue;

    // If this is a new question, prepare the default value for the field
    if (isNewQuestion) {
      if (inputProperties.type === "number") {
        fieldValue = inputProperties.min;
      } else {
        fieldValue = "";
      }
    }

    return (
      <TextField
        placeholder={innerLabel}
        {...inputProperties}
        value={fieldValue}
        onChange={this.handleResponseChange}
      />
    );
  };

  generateSelectField = () => {
    const { options, id, isNewQuestion } = this.props;
    let selectedValue = this.state.fieldValue;

    // Iterate the options array to create a JSX component for each
    let optionTags = options.map((optionProperties, index) => {
      // If this is a new question, set the default option to the first one in the list
      if (isNewQuestion && index === 0) {
        selectedValue = optionProperties.displayValue;
      }

      return (
        <MenuItem
          key={id + "_" + index}
          className="drop-down-item"
          value={optionProperties.displayValue}
        >
          {optionProperties.displayValue}
        </MenuItem>
      );
    });

    return (
      <Select
        value={selectedValue}
        className="drop-down"
        onChange={this.handleResponseChange}
      >
        {optionTags}
      </Select>
    );
  };

  componentDidMount() {
    const {
      fieldType,
      name,
      options,
      inputProperties,
      handleResponseChange
    } = this.props;

    // On component intiialization update the survey responses with the default value
    if (fieldType === "select") {
      handleResponseChange(name, options[0].displayValue);
    } else if (inputProperties.type === "number") {
      handleResponseChange(name, inputProperties.min);
    }
  }

  render() {
    return <div>{this.generateField()}</div>;
  }
}
