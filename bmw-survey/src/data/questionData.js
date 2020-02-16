const questions = [
  {
    id: 0,
    name: "Age",
    question: "Age?",
    fieldType: "input",
    inputProperties: {
      id: "survey-question-age",
      type: "number",
      min: 0,
      max: 100
    }
  },
  {
    id: 1,
    name: "Gender",
    question: "Gender?",
    fieldType: "select",
    options: [
      { dbValue: "M", displayValue: "M" },
      { dbValue: "F", displayValue: "F" },
      { dbValue: "Other", displayValue: "Other" }
    ]
  },
  {
    id: 2,
    name: "HasDrivingLicence",
    question: "Do you own a car driving license?",
    fieldType: "select",
    options: [
      { dbValue: true, displayValue: "Yes" },
      { dbValue: false, displayValue: "No, I prefer using other transport" }
    ]
  },
  {
    id: 3,
    name: "IsFirstCar",
    question: "Is this your first car?",
    fieldType: "select",
    options: [
      { dbValue: true, displayValue: "Yes" },
      { dbValue: false, displayValue: "No" }
    ]
  },
  {
    id: 4,
    name: "PreferredDrivetrain",
    question: "Which drivetrain do you prefer?",
    fieldType: "select",
    options: [
      { dbValue: "FWD", displayValue: "FWD" },
      { dbValue: "RWD", displayValue: "RWD" },
      { dbValue: "I don't know", displayValue: "I don't know" }
    ]
  },
  {
    id: 5,
    name: "LikesDrifting",
    question: "Do you care about drifting?",
    fieldType: "select",
    options: [
      { dbValue: true, displayValue: "Yes" },
      { dbValue: false, displayValue: "No" }
    ]
  },
  {
    id: 6,
    name: "QtyBMW",
    question: "How many BMWs did you drive?",
    fieldType: "input",
    inputProperties: { id: "survey-question-bmw-qty", type: "number", min: 1 },
    isPredecessorQuantifier: true
  },
  {
    id: 7,
    name: "Models",
    question: "Which BMW did you drive?",
    fieldType: "input",
    inputProperties: { className: "survey-question-bmw-models", type: "text" },
    infoMessage:
      "Format must be as one of the following: 3 digits (optional prefix 'M', optional suffix 'd' or 'i') eg: M123 || 'X' or 'Z' followed by 1 digit eg: X5."
  }
];

export default questions;
