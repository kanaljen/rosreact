import React from 'react';
//import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import io from 'socket.io-client';

// Create socket
var socket = io('http://192.168.1.209:8000/')

export class App extends React.Component {
  constructor() {
    super();
    this.state = {nodes: [],topics: [],tx2mem: [],wsConnected: false}
    socket.on('connect', () => {
      console.info('websocket connected')
      this.setState({wsConnected: true})
    })
    socket.on('disconnect', () => {
      console.info('websocket disconnected')
      this.setState({wsConnected: false,nodes: [],topics: []})
    })

  }

  componentDidMount() {
    socket.on('rosnode', (e) => {
      if (JSON.stringify(e) !== JSON.stringify(this.state.nodes)){
        this.setState({ nodes: (e)?e:[] })
      }
    })
    socket.on('rostopic', (e) => {
      if (JSON.stringify(e) !== JSON.stringify(this.state.topics)){
        this.setState({ topics: (e)?e:[] })
      }
    })
  }

  //shouldComponentUpdate() { return false}

  render() {
    return (
      <div>
        <Router>
          <div>
            <div className="ui attached stackable menu" id="navbar">
              <Navbar wsConnected={this.state.wsConnected} nodes={this.state.nodes.length} topics={this.state.topics.length}/>
            </div>
            <div className="ui basic segment" id="main">
              <main>
                <Route exact path="/" render={(props) => <Dashboard {...props} />} />
                <Route path="/nodes" render={(props) => <ItemList {...props} type="node" items={this.state.nodes}/>} />
                <Route path="/topics" render={(props) => <ItemList {...props} type="topic" items={this.state.topics}/>} />
                <Route path="/commands" render={(props) => <CommandCenter {...props} />} />
              </main> 
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

const Navbar = (props) => (
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
        <WsConnected connected = {props.wsConnected}/>
      </div>
    </div>
  </div>
)

const Dashboard = (props) => (
  <div>Dashboard</div>
)

const ItemList = (props) => {
  return (
    <div className="ui centered cards">
      {props.items.map( (item) => <UiCard key={JSON.stringify(item)} name = {item} type = {props.type} /> )}
    </div>
  )
}

const CommandCenter = () => (
  <div><h1>Command Center</h1></div>
)

class UiCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: this.props.name,
                type: this.props.type,
                id: this.props.id,
                info: null};
  }

  componentDidMount() {
    this.updateInfo()
    socket.on(this.state.name, (e) => {
      if (JSON.stringify(e)!==this.state.info){
        this.setState({info: e})
      }
    })
  }

  componentWillUnmount(){
    socket.removeListener(this.state.name)
  }

  updateInfo() {
    socket.emit(this.state.type + 'info',this.state.name)
  }

  render() {
    return (
      <div className="card">
        <div className="content">
          <div className="header" >{this.state.name.substring(0, 29)}</div>
          <div className="meta">{this.state.type}</div>
          <div className="description">
            {this.state.type === 'node' &&
              <NodeCardDescription info = {this.state.info} />
            }
            {this.state.type === 'topic' &&
              <TopicCardDescription info = {this.state.info} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const NodeCardDescription = (props) => {
  if (props.info) {
    let pid = 0
    let puplications = []
    let subscriptions = []
    let services = []
    if(typeof props.info.pid !== 'undefined'){
      pid = props.info.pid
    }
    if(typeof props.info.puplications !== 'undefined'){
      puplications = props.info.puplications.map((item) => 
      <li key={item.toString()}>{item}</li>);
    }
    if(typeof props.info.subscriptions !== 'undefined'){
      subscriptions = props.info.subscriptions.map((item) =>
      <li key={item.toString()}>{item}</li>);
    }
    if(typeof props.info.services !== 'undefined'){
      services = props.info.services.map((item) =>
      <li key={item.toString()}>{item}</li>);
    }
    return (
      <div>
        {props.info.pid > 0 &&
          <h5 className="ui header">PID: {pid}</h5>
        }
        {puplications.length > 0 &&
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Puplications</h5>
            <div>{puplications}</div>
          </div>
        }
        {subscriptions.length > 0 &&
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Subscriptions</h5>
            <div>{subscriptions}</div>
          </div>
        }
        {services.length > 0 &&
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Services</h5>
            <div>{services}</div>
          </div>
        }
      </div>
    )
  }else {
    return <Loading />
  }
}

const TopicCardDescription = (props) => {
  if (props.info) {
    let type = 'unknown'
    let publishers = []
    let subscribers = []
    if(typeof props.info.type !== 'undefined'){
      type = props.info.type
    }
    if(typeof props.info.publishers !== 'undefined'){
      publishers = props.info.publishers.map((item) =>
      <li key={item.toString()}>{item}</li>);
    }
    if(typeof props.info.subscribers !== 'undefined'){
      subscribers = props.info.subscribers.map((item) =>
      <li key={item.toString()}>{item}</li>);
    }
    return (
      <div>

        <h5 className="ui header">Type: {type}</h5>

        {publishers.length > 0 &&
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Publishers</h5>
            <div>{publishers}</div>
          </div>
        }
        {subscribers.length > 0 &&
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Subscribers</h5>
            <div>{subscribers}</div>
          </div>
        }
      </div>
    )
  }else {
    return <Loading />
  }
}

const Loading = (props) => (
  <div className="ui active centered inline loader"></div>
)

const WsConnected = (props) => {
  if (props.connected) {
    return <p>Websocket:&nbsp;&nbsp;&nbsp;<i className="green smile outline icon"></i></p>
  }else {
    return <p>Websocket:&nbsp;&nbsp;&nbsp;<i className="red spinner loading icon"></i></p>
  }
}



