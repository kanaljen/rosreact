import React from 'react';
import { Link } from 'react-router-dom';
import { socket } from '../App';

export default props => (
  <div className="ui container">
    <Link to={`/`} className="item">
      <i className="home icon"></i> Dashboard
    </Link>
    <Link to={`/nodes`} className="item">
      <i className="block layout icon"></i> Nodes
      <div className="ui black circular label">{props.nodes}</div>
    </Link>
    <Link to={`/topics`} className="item">
      <i className="feed icon"></i> Topics
      <div className="ui black circular label">{props.topics}</div>
    </Link>
    <Link to={`/commands`} className="item">
      <i className="cog icon"></i> Command Center
    </Link>
    <div className="right menu">
      <div className="item">
        <UnicornState />
      </div>
      <div className="item">
        <WsConnected connected={props.wsConnected} />
      </div>
    </div>
  </div>
);

const WsConnected = props => {
  if (props.connected) {
    return (
      <p>
        Websocket:&nbsp;&nbsp;&nbsp;
        <i className="green smile outline icon"></i>
      </p>
    );
  } else {
    return (
      <p>
        Websocket:&nbsp;&nbsp;&nbsp;
        <i className="red spinner loading icon"></i>
      </p>
    );
  }
};

class UnicornState extends React.Component {
  constructor(props) {
    super(props);
    this.state = { unicornState: 'Unknown' };
    socket.emit('reqstate');
  }
  componentDidMount() {
    socket.on('state', e => {
      this.setState({ unicornState: e });
    });
  }
  componentWillUnmount() {
    socket.removeListener('state');
  }
  render() {
    return <p>State:&nbsp;&nbsp;&nbsp;{this.state.unicornState}</p>;
  }
}
