import React from 'react';
import Disconnected from './status';
import { socket } from '../App';

export default props => {
  if (props.connected)
    return (
      <div>
        <h1 className="ui center aligned header">Command Center</h1>
        <div className="ui stackable two column grid container">
          <div className="row">
            <div className="column">
              <div className="ui center aligned top blue attached segment">
                <h3 class="ui center aligned header">NAVIGATION</h3>
              </div>
              <NavigationButtons />
            </div>
            <div className="column">
              <LidarTextField />
            </div>
          </div>
        </div>
      </div>
    );
  else return <Disconnected />;
};

class NavigationButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stop: false, pause: false, play: false };
  }
  stop = () => {
    if (!this.state.stop) {
      this.setState({ stop: true, pause: false, play: false });
      socket.emit('navigation', 'stop');
    }
  };
  pause = () => {
    if (!this.state.pause) {
      this.setState({ stop: false, pause: true, play: false });
      socket.emit('navigation', 'pause');
    }
  };
  play = () => {
    if (!this.state.play) {
      this.setState({ stop: false, pause: false, play: true });
      socket.emit('navigation', 'play');
    }
  };
  render() {
    return (
      <div className="ui center aligned attached segment">
        <h4 className="ui center aligned header">
          Use buttons to control navigation
        </h4>
        <div class="fluid huge ui basic vertical buttons">
          <Button
            active={this.state.stop}
            type={'stop'}
            onclick={this.stop}
          />
          <Button
            active={this.state.pause}
            type={'pause'}
            onclick={this.pause}
          />
          <Button
            active={this.state.play}
            type={'play'}
            onclick={this.play}
          />
        </div>
      </div>
    );
  }
}

const Button = props => {
  let style = '',
    icon = null,
    title = null;
  if (props.type === 'stop') {
    icon = <i class="stop icon"></i>;
    title = 'Stop Navigation';
  } else if (props.type === 'play') {
    icon = <i class="play icon"></i>;
    title = 'Resume Navigation';
  } else if (props.type === 'pause') {
    icon = <i class="pause icon"></i>;
    title = 'Pause Navigation';
  }
  if (props.active) style = 'ui labeled active icon button';
  else style = 'ui labeled icon button';

  return (
    <button className={style} onClick={props.onclick}>
      {icon}
      {title}
    </button>
  );
};

class LidarTextField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  handleChange = event => {
    this.setState({ text: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    socket.emit('lidartext', this.state.text);
    this.setState({ text: '' });
  };
  render() {
    return (
      <>
        <div className="ui center aligned top green attached segment">
          <h3 class="ui center aligned header">DISPLAY TEXT</h3>
        </div>
        <div className="ui center aligned attached segment">
          <h4 className="ui center aligned header">
            Set the text visible on the LIDAR!
          </h4>

          <form
            className="fluid ui action input"
            onSubmit={this.handleSubmit}
          >
            <input
              className="huge ui input"
              type="text"
              value={this.state.text}
              onChange={this.handleChange}
            />
            <button className="ui button" type="submit">
              Submit
            </button>
          </form>
        </div>
      </>
    );
  }
}
