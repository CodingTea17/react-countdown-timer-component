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

  timeUntilReturn(returnTime) {
    // Nexmo messages come with a UTC timestamp so to calculate the time until return I use 'Date.now()' which returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
    const time = Date.parse(returnTime) - Date.now();

    // Seconds are calculated as the remainder of dividing all the seconds by 60. (0-59)
    const seconds = Math.floor((time / 1000) % 60);

    /*********** TODO **********/
    /* Update minutes to reach 99 */
    /***************************/
    // Minutes are calculated as the remainder of dividing all the minutes by 60. (0-59)
    const minutes = Math.floor((time / 60000) % 60);

    this.setState({ seconds, minutes })
  }

  render() {
    return (
      <div>
        <h1>{ `${this.state.minutes}:${this.state.seconds}` }</h1>
      </div>
    );
  }
}

export default Clock;
