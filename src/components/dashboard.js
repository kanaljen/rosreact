import React from 'react';
import Disconnected from './status';
import { socket } from '../App';

export default props => {
  if (props.connected)
    return (
      <>
        <h1 className="ui center aligned header">Dashboard</h1>
        <div className="ui stackable two column grid container">
          <div className="row">
            <div className="column">
              <div className="ui center aligned top green attached segment">
                <h3 class="ui center aligned header">Jetson TX2</h3>
              </div>
              <JetsonInfo />
            </div>
            <div className="column">
              <div className="ui center aligned top yellow attached segment">
                <h3 class="ui center aligned header">RoboRIO</h3>
              </div>
              <RioInfo />
            </div>
          </div>
        </div>
      </>
    );
  else return <Disconnected />;
};

class JetsonInfo extends React.Component {
  render() {
    return (
      <div className="ui center aligned attached segment">
        <h5>Overview</h5>
        <div class="ui equal width grid">
          <div class="column">
            <i class="at icon"></i>IP: 10.0.0.3
          </div>
          <div class="column">
            <i class="microchip icon"></i>CPU: <Tx2Stats />
          </div>
          <div class="column">
            <i class="table icon"></i>Memory: 45%
          </div>
        </div>
      </div>
    );
  }
}

class RioInfo extends React.Component {
  render() {
    return (
      <>
        <div className="ui center aligned attached segment">
          <h5>Overview</h5>
          <div class="ui equal width grid">
            <div class="column">
              <i class="at icon"></i>IP: 10.0.0.2
            </div>
            <div class="column">
              <i class="microchip icon"></i>CPU: 30%{' '}
            </div>
            <div class="column">
              <i class="table icon"></i>Memory: 45%
            </div>
          </div>
        </div>
        <div className="ui center aligned attached segment">
          <h5>Sensors</h5>
          <div class="fluid ui grid">
            <div class="six wide column"></div>
            <div class="ten wide left aligned column">
              <div class="ui list">
                <div class="item">
                  <i class="green circle icon"></i>
                  <div class="content">Lift</div>
                </div>
                <div class="item">
                  <i class="green circle icon"></i>
                  <div class="content">Lidar Back</div>
                </div>
                <div class="item">
                  <i class="green circle icon"></i>
                  <div class="content">UWB</div>
                </div>
                <div class="item">
                  <i class="red circle icon"></i>
                  <div class="content">Light</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

class Tx2Stats extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }
  componentDidMount() {
    socket.on('stats', e => {
      console.log(e.data);
      this.setState({ value: e.data });
    });
  }
  componentWillUnmount() {
    socket.removeListener('stats');
  }
  render() {
    return <>{this.state.value}</>;
  }
}
