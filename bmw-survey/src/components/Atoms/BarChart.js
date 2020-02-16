import React, { Component } from "react";
import { HorizontalBar, Bar } from "react-chartjs-2";

export default class BarChart extends Component {
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
          fill: false,
          lineTension: 0.1,
          backgroundColor: chartColours,
          borderColor: chartColours,
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: props.chartInfo.data
        }
      ]
    };

    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              max: Math.max(...props.chartInfo.data),
              min: 0,
              stepSize: Math.round(
                props.chartInfo.data.reduce((a, b) => a + b, 0) * 0.1
              )
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              max: Math.max(...props.chartInfo.data),
              min: 0,
              stepSize: Math.round(
                props.chartInfo.data.reduce((a, b) => a + b, 0) * 0.1
              )
            }
          }
        ]
      },
      title: {
        display: true,
        text: props.chartInfo.title,
        fontSize: 20
      },
      legend: {
        display: false
      }
    };

    return { data: data, options: options };
  }

  getBarComponent = () => {
    const { data, options } = this.state;

    let barComponent = this.props.chartInfo.isHorizontal ? (
      <HorizontalBar data={data} options={options} />
    ) : (
      <Bar data={data} options={options} />
    );

    return barComponent;
  };

  render() {
    return <div className="chartWrapper">{this.getBarComponent()}</div>;
  }
}
