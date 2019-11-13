import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Navbar from './components/navbar';
import Dashboard from './components/dashboard';
import ItemList from './components/itemlist';
import CommandCenter from './components/commands';

// Create socket
var server = 'http://192.168.1.208:8000/';
var socket = io(server);

export class App extends React.Component {
  constructor() {
    super();
    this.state = { nodes: [], topics: [], wsConnected: false };
    socket.on('connect', () => {
      console.info('websocket connected');
      this.setState({ wsConnected: true });
    });
    socket.on('disconnect', () => {
      console.info('websocket disconnected');
      this.setState({ wsConnected: false, nodes: [], topics: [] });
    });
  }
  componentDidMount() {
    socket.on('rosnode', e => {
      if (JSON.stringify(e) !== JSON.stringify(this.state.nodes)) {
        this.setState({ nodes: e ? e : [] });
      }
    });
    socket.on('rostopic', e => {
      if (JSON.stringify(e) !== JSON.stringify(this.state.topics)) {
        this.setState({ topics: e ? e : [] });
      }
    });
  }
  render() {
    return (
      <div>
        <Router>
          <div>
            <div className="ui attached stackable menu" id="navbar">
              <Navbar
                wsConnected={this.state.wsConnected}
                nodes={this.state.nodes.length}
                topics={this.state.topics.length}
              />
            </div>
            <div className="ui basic segment" id="main">
              <main>
                <Route
                  exact
                  path="/"
                  render={props => (
                    <Dashboard
                      {...props}
                      connected={this.state.wsConnected}
                    />
                  )}
                />
                <Route
                  path="/nodes"
                  render={props => (
                    <ItemList
                      {...props}
                      connected={this.state.wsConnected}
                      type="node"
                      items={this.state.nodes}
                    />
                  )}
                />
                <Route
                  path="/topics"
                  render={props => (
                    <ItemList
                      {...props}
                      connected={this.state.wsConnected}
                      type="topic"
                      items={this.state.topics}
                    />
                  )}
                />
                <Route
                  path="/commands"
                  render={props => (
                    <CommandCenter
                      {...props}
                      connected={this.state.wsConnected}
                    />
                  )}
                />
              </main>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export { server, socket };
