import React, { Component } from 'react';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      minutes: 0,
    }
  }

  componentWillMount() {
    this.timeUntilReturn(this.props.returnTime);
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.timeUntilReturn(this.props.returnTime),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  timeUntilReturn(returnTime) {
    if (returnTime >= Date.now()) {

      // Nexmo messages come with a UTC timestamp so to calculate the time until return I use 'Date.now()' which returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
      const time = Date.parse(returnTime) - Date.now();

      // Seconds are calculated as the remainder of dividing all the seconds by 60. (0-59)
      const seconds = Math.floor((time / 1000) % 60);

      // Minutes are calculated as the remainder of dividing all the minutes by 100. (0-99)
      const minutes = Math.floor((time / 60000) % 100);

      // key:value shorthand syntax
      return this.setState({ seconds, minutes })
    }
    return this.setState({
      seconds: 0,
      minutes: 0
    });
  }

  formatTime(minutes, seconds) {
    const formattedMins = (minutes < 10 ? `0${minutes}` : minutes);
    const formattedSecs = (seconds < 10 ? `0${seconds}` : seconds);
    if (minutes === 0 && seconds === 0) {
      return "00:00";
    }
    return `${formattedMins}:${formattedSecs}`;
  }



  render() {
    return (
      <div>
        <h1>{ this.formatTime(this.state.minutes, this.state.seconds) }</h1>
      </div>
    );
  }
}

export default Clock;
