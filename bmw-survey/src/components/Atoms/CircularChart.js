import React, { Component } from "react";
import { Pie, Polar } from "react-chartjs-2";

export default class PieChart extends Component {
  constructor(props) {
    super(props);

    this.state = { data: {}, options: {} };
  }

  // Define chart information & default styling
  static getDerivedStateFromProps(props) {
    const opacity = 0.8;
    let colours = [
      "rgba(241,200,0," + opacity + ")",
      "rgba(115,200,225," + opacity + ")",
      "rgba(0,150,194," + opacity + ")",
      "rgba(0,86,134," + opacity + ")",
      "rgba(118,138,155," + opacity + ")"
    ];
    let colourIndex = 0;
    let chartColours = [];

    for (let i = 0; i < props.chartInfo.labels.length; i++) {
      chartColours.push(colours[colourIndex++]);

      if (colourIndex === colours.length) {
        colourIndex = 0;
      }
    }

    const data = {
      labels: props.chartInfo.labels,
      datasets: [
        {
          backgroundColor: chartColours,
          borderColor: chartColours,
          data: props.chartInfo.data
        }
      ]
    };

    var options = {
      title: {
        display: true,
        text: props.chartInfo.title,
        fontSize: 20
      },
      legend: {
        display: true,
        position: "right"
      }
    };

    return { data: data, options: options };
  }

  getCircularComponent = () => {
    const { data, options } = this.state;

    let circularComponent = this.props.chartInfo.isPolar ? (
      <Polar data={data} options={options} />
    ) : (
      <Pie data={data} options={options} />
    );

    return circularComponent;
  };

  render() {
    return <div className="chartWrapper">{this.getCircularComponent()} </div>;
  }
}
