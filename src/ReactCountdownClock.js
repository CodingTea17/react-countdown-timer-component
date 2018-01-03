/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ReactCountdownClock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _seconds: this.props.seconds,
      _fraction: null,
      _content: null,
      _timeoutIds: [],
      _scale: window.devicePixelRatio || 1,
    }
  }

  componentDidUpdate(prevState) {
    if (prevState.seconds !== this.props.seconds) {
      this.setState({ _seconds: this.props.seconds });
      this._stopTimer();
      this._setupTimer();
    }

    if (prevState.color !== this.props.color) {
      this._updateCanvas();
    }

    if (prevState.paused !== this.props.paused) {
      if (!this.props.paused) {
        this._startTimer();
      }
      if (this.props.paused) {
        return this._pauseTimer();
      }
    }
  }

  componentDidMount() {
    this.setState({ _seconds: this.props.seconds });
    return this._setupTimer();
  }

  componentWillUnmount() {
    return this._cancelTimer();
  }

  _setupTimer() {
    this._setScale();
    this._setupCanvases();
    this._drawTimer();
    if (!this.props.paused) {
      return this._startTimer();
    }
  }

  _updateCanvas() {
    this._clearTimer();
    return this._drawTimer();
  }

  _setScale() {
    this.setState({
      _radius: this.props.size / 2,
      _fraction: 2 / this.state._seconds
    });
    this._tickPeriod = this._calculateTick();
    return (this.setState({_innerRadius: this.props.weight ? this.state._radius - this.props.weight : this.state._radius / 1.8}))
  }

  _calculateTick() {
    // Tick period (milleseconds) needs to be fast for smaller time periods and slower
    // for longer ones. This provides smoother rendering. It should never exceed 1 second.
    const tickScale = 1.8;
    const tick = this.state._seconds * tickScale;
    if (tick > 1000) {
      return 1000;
    } else {
      return tick;
    }
  }

  _setupCanvases() {
    if (this._background && this._timer) {
      return;
    }

    this._background = this.refs.background.getContext("2d");
    this._background.scale(this.state._scale, this.state._scale);

    this._timer = this.refs.timer.getContext("2d");
    this._timer.textAlign = "center";
    this._timer.textBaseline = "middle";
    this._timer.scale(this.state._scale, this.state._scale);

    if (this.props.onClick != null) {
      return this.refs.component.addEventListener("click", this.props.onClick);
    }
  }

  _startTimer() {
    // Give it a moment to collect it's thoughts for smoother render
    const newTimeoutIds = this.state._timeoutIds;
    newTimeoutIds.push(setTimeout(() => this._tick()), 200);
    this.setState({_timeoutIds: newTimeoutIds});
    return this.state._timeoutIds.length;
  }

  _pauseTimer() {
    this._stopTimer();
    return this._updateCanvas();
  }

  _stopTimer() {
    return Array.from(this.state._timeoutIds).map(timeout => clearTimeout(timeout));
  }

  _cancelTimer() {
    this._stopTimer();

    if (this.props.onClick != null) {
      return this.refs.component.removeEventListener(
        "click",
        this.props.onClick
      );
    }
  }

  _tick() {
    const start = Date.now();
    const tempTimeoutIds = this.state._timeoutIds;
    tempTimeoutIds.push(
      setTimeout(() => {
        const duration = (Date.now() - start) / 1000;
        this.setState({ _seconds: this.state._seconds - duration });

        if (this.state._seconds <= 0) {
          this.setState({_seconds: 0});
          this._handleComplete();
          return this._clearTimer();
        } else {
          this._updateCanvas();
          return this._tick();
        }
      }, this._tickPeriod)
    );
    this.setState({ _timeoutIds: tempTimeoutIds});
    return this.state._timeoutIds.length
  }

  _handleComplete() {
    if (this.props.onComplete) {
      return this.props.onComplete();
    }
  }

  _clearTimer() {
    return this._timer.clearRect(
      0,
      0,
      this.refs.timer.width,
      this.refs.timer.height
    );
  }

  _formattedTime() {
    const decimals = (this.state._seconds <= 9.9 && this.props.showMilliseconds) ? 1 : 0 ;
    if (this.props.timeFormat === "hms") {
      const hours = parseInt(this.state._seconds / 3600, 10) % 24;
      const minutes = parseInt(this.state._seconds / 60, 10) % 60;
      const seconds = (this.state._seconds % 60).toFixed(decimals);

      let hoursStr = `${hours}`;
      let minutesStr = `${minutes}`;
      let secondsStr = `${seconds}`;

      if (hours < 10) {
        hoursStr = `0${hours}`;
      }
      if (minutes < 10 && hours >= 1) {
        minutesStr = `0${minutes}`;
      }
      if (seconds < 10 && (minutes >= 1 || hours >= 1)) {
        secondsStr = `0${seconds}`;
      }

      const timeParts = [];
      if (hours > 0) {
        timeParts.push(hoursStr);
      }
      if (minutes > 0 || hours > 0) {
        timeParts.push(minutesStr);
      }
      timeParts.push(secondsStr);

      return timeParts.join(":");
    } else {
      return this.state._seconds.toFixed(decimals);
    }
  }

  _fontSize(timeString) {
    if (this.props.fontSize === "auto") {
      const scale = (() => {
        switch (timeString.length) {
          case 8:
            return 4; // hh:mm:ss
          case 5:
            return 3; // mm:ss
          default:
            return 2; // ss or ss.s
        }
      })();
      const size = this.state._radius / scale;
      return `${size}px`;
    } else {
      return this.props.fontSize;
    }
  }

  _drawTimer() {
    const percent = this.state._fraction * this.state._seconds + 1.5;
    const formattedTime = this._formattedTime();
    const text =
      this.props.paused && this.props.pausedText != null
        ? this.props.pausedText
        : formattedTime;

    // Timer
    this._timer.globalAlpha = this.props.alpha;
    this._timer.fillStyle = this.props.color;
    this._timer.font = `bold ${this._fontSize(formattedTime)} ${
      this.props.font
    }`;

    this._timer.fillText(text, this.state._radius, this.state._radius);
    this._timer.beginPath();
    this._timer.arc(
      this.state._radius,
      this.state._radius,
      this.state._radius,
      Math.PI * 1.5,
      Math.PI * percent,
      false
    );

    this._timer.arc(
      this.state._radius,
      this.state._radius,
      this.state._innerRadius,
      Math.PI * percent,
      Math.PI * 1.5,
      true
    );
    this._timer.closePath();
    return this._timer.fill();
  }

  render() {
    const canvasStyle = {
      position: "absolute",
      width: this.props.size,
      height: this.props.size
    };
    const canvasProps = {
      style: canvasStyle,
      height: this.props.size * this.state._scale,
      width: this.props.size * this.state._scale
    };

    return (
      <div
        ref="component"
        className="react-countdown-clock"
        style={{ width: this.props.size, height: this.props.size }}
      >
        <canvas {...Object.assign({ ref: "background" }, canvasProps)} />
        <canvas {...Object.assign({ ref: "timer" }, canvasProps)} />
      </div>
    );
  }
};

ReactCountdownClock.propTypes = {
  seconds: PropTypes.number,
  size: PropTypes.number,
  weight: PropTypes.number,
  color: PropTypes.string,
  fontSize: PropTypes.string,
  font: PropTypes.string,
  alpha: PropTypes.number,
  timeFormat: PropTypes.string,
  onComplete: PropTypes.func,
  onClick: PropTypes.func,
  showMilliseconds: PropTypes.bool,
  paused: PropTypes.bool,
  pausedText: PropTypes.string
};

ReactCountdownClock.defaultProps = {
  seconds: 60,
  size: 300,
  color: "#000",
  alpha: 0.3,
  timeFormat: "hms",
  fontSize: "auto",
  font: "Arial",
  showMilliseconds: true,
  paused: false
};

export default ReactCountdownClock;
