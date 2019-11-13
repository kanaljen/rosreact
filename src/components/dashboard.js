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
              <JetsonInfo />
              <UnicornInfo />
            </div>
            <div className="column">
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
      <div class="ui segments">
        <div className="ui top green attached segment">
          <h3 className="ui center aligned header">Jetson TX2</h3>
        </div>
        <div className="ui center aligned attached segment">
          <h5>Overview</h5>
          <div className="ui equal width grid">
            <JetsonStats />
          </div>
        </div>
      </div>
    );
  }
}

class UnicornInfo extends React.Component {
  render() {
    return (
      <div class="ui segments">
        <div className="ui top blue attached segment">
          <h3 className="ui center aligned header">Unicorn</h3>
        </div>
        <div className="ui center aligned attached segment">
          <h5>LiDAR (R2000)</h5>
          <div className="ui equal width grid">
            <LidarStats />
          </div>
        </div>
        <div className="ui center aligned attached segment">
          <h5>ZED Stereo camera</h5>
          <div className="ui equal width grid">
            <ZedStats />
          </div>
        </div>
      </div>
    );
  }
}

class RioInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cpu: 0,
      mem: 0,
      lift: false,
      isLifting: false,
      backLidar: false,
      scans: 0,
      uwb: false,
      location: { x: 0, y: 0 },
      light: false,
      lightMode: 1
    };
  }
  componentDidMount() {
    socket.on('riostats', e => {
      if (e !== null) {
        if (e.cpu !== this.state.cpu && e.cpu !== undefined)
          this.setState({ cpu: e.cpu });
        if (e.mem !== this.state.mem && e.mem !== undefined)
          this.setState({ mem: e.mem });
      }
    });
  }
  componentWillUnmount() {
    socket.removeListener('riostats');
  }
  render() {
    return (
      <div class="ui segments">
        <div className="ui center aligned top yellow attached segment">
          <h3 className="ui center aligned header">RoboRIO</h3>
        </div>
        <div className="ui center aligned attached segment">
          <h5>Overview</h5>
          <div className="ui equal width grid">
            <div className="column">
              <i className="at icon"></i> IP: 10.0.0.2
            </div>
            <div className="column">
              <i className="microchip icon"></i>CPU: {this.state.cpu}%
            </div>
            <div className="column">
              <i className="table icon"></i>Memory: {this.state.mem}%
            </div>
          </div>
        </div>
        <div className="ui center aligned attached segment">
          <h5>Lift</h5>
          <div className="ui equal width grid">
            <div className="column">
              <i className="at icon"></i> MXP
            </div>
            <div className="column">
              <StateIcon status={this.state.lift} /> Status
            </div>
            <div className="column">
              <StateIcon status={this.state.isLifting} /> Working
            </div>
          </div>
        </div>
        <div className="ui center aligned attached segment">
          <h5>LiDAR (Back)</h5>
          <div className="ui equal width grid">
            <div className="column">
              <i className="at icon"></i> RS232
            </div>
            <div className="column">
              <StateIcon status={this.state.backLidar} /> Status
            </div>
            <div className="column">
              <i className="rss icon"></i>Scans: {this.state.scans}
            </div>
          </div>
        </div>
        <div className="ui center aligned attached segment">
          <h5>UWB</h5>
          <div className="ui equal width grid">
            <div className="column">
              <i className="at icon"></i> MXP
            </div>
            <div className="column">
              <StateIcon status={this.state.uwb} /> Status
            </div>
            <div className="column">
              <i className="location arrow icon"></i> (
              {this.state.location.x},{this.state.location.y})
            </div>
          </div>
        </div>
        <div className="ui center aligned attached segment">
          <h5>LED-strip</h5>
          <div className="ui equal width grid">
            <div className="column">
              <i className="at icon"></i> I2C
            </div>
            <div className="column">
              <StateIcon status={this.state.light} /> Status
            </div>
            <div className="column">
              <i className="tag icon"></i>State:{' '}
              {this.state.lightMode}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class JetsonStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = { cpu: 0, mem: 0 };
  }
  componentDidMount() {
    socket.on('tx2stats', e => {
      if (e.cpu !== this.state.cpu && e.cpu !== undefined)
        this.setState({ cpu: e.cpu });
      if (e.mem !== this.state.mem && e.mem !== undefined)
        this.setState({ mem: e.mem });
    });
  }
  componentWillUnmount() {
    socket.removeListener('tx2stats');
  }
  render() {
    return (
      <>
        <div className="column">
          <i className="at icon"></i>IP: 10.0.0.3
        </div>
        <div className="column">
          <i className="microchip icon"></i>CPU: {this.state.cpu}%
        </div>
        <div className="column">
          <i className="table icon"></i>Memory: {this.state.mem}%
        </div>
      </>
    );
  }
}

class LidarStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = { online: false, scans: 0 };
  }
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    return (
      <>
        <div className="column">
          <i className="at icon"></i>IP: 10.0.0.3
        </div>
        <div className="column">
          <StateIcon status={this.state.online} /> Online
        </div>
        <div className="column">
          <i className="rss icon"></i>Scans: {this.state.scans}
        </div>
      </>
    );
  }
}

class ZedStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = { online: false, vectors: 0 };
  }
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    return (
      <>
        <div className="column">
          <i className="at icon"></i> USB -> Jetson
        </div>
        <div className="column">
          <StateIcon status={this.state.online} /> Online
        </div>
        <div className="column">
          <i className="external square alternate icon"></i>Vectors:{' '}
          {this.state.vectors}
        </div>
      </>
    );
  }
}

function StateIcon(props) {
  if (props.status) return <i className="green circle icon"></i>;
  else return <i className="red circle icon"></i>;
}
