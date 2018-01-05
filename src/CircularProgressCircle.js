import React, { Component } from 'react';

const circleText = {
  fontSize: '3em',
  fontWeight: 'bold',
  fill: 'black'
};

const backgroundCircle = {
  stroke: 'black',
  fill: 'none'
};

const progressCircle = {
  stroke: '#ddd',
  fill: 'none'
};

class CircularProgressCircle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // Size of the enclosing square
    const sqSize = this.props.sqSize;
    // SVG centers the stroke width on the radius, subtract out so circle fits in square
    const radius = (this.props.sqSize - this.props.strokeWidth) / 2;
    // Enclose cicle in a circumscribing square
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    // Arc length at 100% coverage is the circle circumference
    const dashArray = radius * Math.PI * 2;
    // Scale 100% coverage overlay with the actual percent
    const dashOffset = dashArray - dashArray * this.props.percentage / 100;

    return (
      <svg
          width={ this.props.sqSize }
          height={ this.props.sqSize }
          viewBox={ viewBox }
      >
          <circle
            style={ backgroundCircle }
            cx={ this.props.sqSize / 2 }
            cy={ this.props.sqSize / 2 }
            r={ radius }
            strokeWidth={ `${this.props.strokeWidth}px` }
          />
          <circle
            cx={ this.props.sqSize / 2 }
            cy={ this.props.sqSize / 2 }
            r={ radius }
            strokeWidth={ `${parseInt(this.props.strokeWidth, 10) - 2}px` }
            transform={`rotate(270 ${this.props.sqSize / 2} ${this.props.sqSize / 2})`}
            style={{
              stroke: progressCircle.stroke,
              fill: progressCircle.fill,
              strokeDasharray: dashArray,
              strokeDashoffset: dashOffset
            }}
          />
          <text
            style={ circleText }
            x="50%"
            y="50%"
            dy=".3em"
            textAnchor="middle">
            { `${this.props.timeLeft}` }
          </text>
      </svg>
    );
  }
}

export default CircularProgressCircle;
