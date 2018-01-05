import React, { Component } from 'react';
import CircularProgressBar from './CircularProgressCircle';

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
    // Initially set the interval to calculate the time until return
    this.timerID = setInterval(
      () => this.timeUntilReturn(this.props.returnTime),
      1000
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.returnTime !== this.props.returnTime) {
      // If the returnTime changes, clear the interval
      clearInterval(this.timerID);
      // Restart the interval to continue counting down
      this.timerID = setInterval(
        () => this.timeUntilReturn(this.props.returnTime),
        1000
      );
    }
  }

  componentWillUnmount() {
    // Make sure the interval is cleared if the component is unmounted
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
    // Once the return time has been reached, clear the interval to prevent leaks
    clearInterval(this.timerID);
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

  calculatePercentage() {
    const percentage = Math.floor((Date.now() - Date.parse(this.props.sentTime)) / (Date.parse(this.props.returnTime) - Date.parse(this.props.sentTime)) * 100);
    if ( percentage <= 100 ) {
      return -percentage;
    }
    return 100;
  }

  render() {
    return (
      <div>
          <CircularProgressBar
            strokeWidth="25"
            sqSize="200"
            timeLeft={ this.formatTime(this.state.minutes, this.state.seconds) }
            percentage={ this.calculatePercentage() }
          />
      </div>
    );
  }
}

export default Clock;
