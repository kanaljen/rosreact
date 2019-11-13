import React from 'react';
import { socket } from '../App';
import Disconnected from './status';

export default props => {
  if (props.connected) {
    return (
      <div className="ui centered cards">
        {props.items.map(item => (
          <UiCard
            key={JSON.stringify(item)}
            name={item}
            type={props.type}
          />
        ))}
      </div>
    );
  } else return <Disconnected />;
};

class UiCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      type: this.props.type,
      id: this.props.id,
      info: null
    };
  }
  componentDidMount() {
    this.updateInfo();
    socket.on(this.state.name, e => {
      if (JSON.stringify(e) !== this.state.info) {
        this.setState({ info: e });
      }
    });
  }
  componentWillUnmount() {
    socket.removeListener(this.state.name);
  }
  updateInfo() {
    socket.emit(this.state.type + 'info', this.state.name);
  }
  render() {
    return (
      <div className="card">
        <div className="content">
          <div className="header">
            {this.state.name.substring(0, 28)}
          </div>
          <div className="meta">{this.state.type}</div>
          <div className="description">
            {this.state.type === 'node' && (
              <NodeCardDescription info={this.state.info} />
            )}
            {this.state.type === 'topic' && (
              <TopicCardDescription info={this.state.info} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const NodeCardDescription = props => {
  if (props.info) {
    let pid = 0;
    let puplications = [];
    let subscriptions = [];
    let services = [];
    if (typeof props.info.pid !== 'undefined') {
      pid = props.info.pid;
    }
    if (typeof props.info.puplications !== 'undefined') {
      puplications = props.info.puplications.map(item => (
        <li key={item.toString()}>{item.split('[')[0]}</li>
      ));
    }
    if (typeof props.info.subscriptions !== 'undefined') {
      subscriptions = props.info.subscriptions.map(item => (
        <li key={item.toString()}>{item.split('[')[0]}</li>
      ));
    }
    if (typeof props.info.services !== 'undefined') {
      services = props.info.services.map(item => (
        <li key={item.toString()}>{item}</li>
      ));
    }
    return (
      <div>
        {props.info.pid > 0 && (
          <div class="ui green label">PID: {pid}</div>
        )}
        {props.info.pid === 0 && (
          <div class="ui yellow label">roboRIO</div>
        )}
        {puplications.length > 0 && (
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Puplications</h5>
            <div style={{ wordWrap: 'break-word' }}>
              {puplications}
            </div>
          </div>
        )}
        {subscriptions.length > 0 && (
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Subscriptions</h5>
            <div style={{ wordWrap: 'break-word' }}>
              {subscriptions}
            </div>
          </div>
        )}
        {services.length > 0 && (
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Services</h5>
            <div style={{ wordWrap: 'break-word' }}>{services}</div>
          </div>
        )}
      </div>
    );
  } else {
    return <Loading />;
  }
};

const TopicCardDescription = props => {
  if (props.info) {
    let type = 'unknown';
    let publishers = [];
    let subscribers = [];
    if (typeof props.info.type !== 'undefined') {
      type = props.info.type;
    }
    if (typeof props.info.publishers !== 'undefined') {
      publishers = props.info.publishers.map(item => (
        <li key={item.toString()}>{item.split('(')[0]}</li>
      ));
    }
    if (typeof props.info.subscribers !== 'undefined') {
      subscribers = props.info.subscribers.map(item => (
        <li key={item.toString()}>{item.split('(')[0]}</li>
      ));
    }
    return (
      <div>
        <div class="ui blue label">Type: {type}</div>

        {publishers.length > 0 && (
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Publishers</h5>
            <div style={{ wordWrap: 'break-word' }}>{publishers}</div>
          </div>
        )}
        {subscribers.length > 0 && (
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Subscribers</h5>
            <div style={{ wordWrap: 'break-word' }}>
              {subscribers}
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return <Loading />;
  }
};

const Loading = props => (
  <div className="ui active centered inline loader"></div>
);
