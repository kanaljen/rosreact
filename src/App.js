import React from 'react';
//import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import io from 'socket.io-client';

// Create socket
var server = 'http://192.168.1.209:8000/'
var socket = io(server)

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
                <Route exact path="/" render={(props) => <Dashboard {...props} connected = {this.state.wsConnected}/>} />
                <Route path="/nodes" render={(props) => <ItemList {...props} connected = {this.state.wsConnected} type="node" items={this.state.nodes}/>} />
                <Route path="/topics" render={(props) => <ItemList {...props} connected = {this.state.wsConnected} type="topic" items={this.state.topics}/>} />
                <Route path="/commands" render={(props) => <CommandCenter {...props} connected = {this.state.wsConnected}/>} />
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

const Dashboard = (props) => {
  let comp = null
  if(true)comp = <div>Dashboard</div>
  else comp = <Disconnected/>
  return (
    <div>{comp}</div>
  )
}

const ItemList = (props) => {
  if(props.connected){
    return (
      <div className="ui centered cards">
        {props.items.map( (item) => <UiCard key={JSON.stringify(item)} name = {item} type = {props.type} /> )}
      </div>
    )
  }
  else return <Disconnected/>
}

const CommandCenter = (props) => {
  if(props.connected)return (
    <div>
      <h1 className="ui center aligned header">Command Center</h1>
      <div className="ui stackable two column grid container">
        <div className="row">
          <div className="column">
          <div className="ui center aligned top blue attached segment">
            <h3 class="ui center aligned header">NAVIGATION</h3></div>
            <NavigationButtons />
          </div>
          <div className="column">
            <LidarTextField />
          </div>
        </div>
      </div>
    </div>
  )
  else return <Disconnected/>
}

class NavigationButtons extends React.Component {
  constructor(props) {
    super(props)
    this.state = {stop: false,pause: false, play: false}
  }
  stop = () => {
    if (!this.state.stop){
      this.setState({stop: true,pause: false, play: false})
      socket.emit('navigation','stop')
    }
  }
  pause = () => {
    if (!this.state.pause){
      this.setState({stop: false,pause: true, play: false})
      socket.emit('navigation','pause')
    }
  }
  play = () =>  {
    if (!this.state.play){
      this.setState({stop: false,pause: false, play: true})
      socket.emit('navigation','play')
    }
  }
  render() {
    return (
      <div className="ui center aligned attached segment">
        <h4 className="ui center aligned header">Use buttons to control navigation</h4>
        <div class="fluid huge ui basic vertical buttons">
          <Button active={this.state.stop}  type={'stop'} onclick={this.stop}/>
          <Button active={this.state.pause}  type={'pause'} onclick={this.pause}/>
          <Button active={this.state.play}  type={'play'} onclick={this.play}/>
        </div>
      </div>
    )
  }
}

const Button = (props) => {
  let style = '',icon = null, title= null
  if (props.type === 'stop'){
    icon = <i class="stop icon"></i>
    title = 'Stop Navigation'
  }else if (props.type === 'play'){
    icon = <i class="play icon"></i>
    title = 'Resume Navigation'
  }else if (props.type === 'pause'){
    icon = <i class="pause icon"></i>
    title = 'Pause Navigation'
  }
  if (props.active)style = 'ui labeled active icon button'
  else style = 'ui labeled icon button'

  return (
      <button className={style} onClick={props.onclick}>{icon}{title}</button>
    )
}

class LidarTextField extends React.Component {
  constructor(props){
    super(props)
    this.state = {text: ''}
  }
  handleChange = (event) => {
    this.setState({text: event.target.value})
  }
  handleSubmit= (event) => {
    event.preventDefault()
    socket.emit('lidartext',this.state.text)
    this.setState({text: ''})
  }
  render(){
    return(
      <>
        <div className="ui center aligned top green attached segment"><h3 class="ui center aligned header">DISPLAY TEXT</h3></div>
        <div className="ui center aligned attached segment">
          <h4 className="ui center aligned header">Set the text visible on the LIDAR!</h4>
          
          <form className="fluid ui action input" onSubmit={this.handleSubmit}>
            <input className="huge ui input" type="text" value={this.state.text} onChange={this.handleChange} />
            <button className="ui button" type="submit">Submit</button>
          </form>
            

        </div>
      </>
    )
  }
}

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
          <div className="header" >{this.state.name.substring(0, 28)}</div>
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
          <div class="ui green label">PID: {pid}</div>
        }
        {props.info.pid === 0 &&
          <div class="ui yellow label">roboRIO</div>
        }
        {puplications.length > 0 &&
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Puplications</h5>
            <div style={{ wordWrap: "break-word" }}>{puplications}</div>
          </div>
        }
        {subscriptions.length > 0 &&
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Subscriptions</h5>
            <div style={{ wordWrap: "break-word" }}>{subscriptions}</div>
          </div>
        }
        {services.length > 0 &&
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Services</h5>
            <div style={{ wordWrap: "break-word" }}>{services}</div>
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

        <div class="ui blue label">Type: {type}</div>

        {publishers.length > 0 &&
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Publishers</h5>
            <div style={{ wordWrap: "break-word" }}>{publishers}</div>
          </div>
        }
        {subscribers.length > 0 &&
          <div>
            <div className="ui divider"></div>
            <h5 className="ui header">Subscribers</h5>
            <div style={{ wordWrap: "break-word" }}>{subscribers}</div>
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

const Disconnected = () => (
  <div class="ui icon message">
  <i class="notched circle loading icon"></i>
    <div class="content">
      <div class="header">
        Websocket not connected
      </div>
      <p>Trying to reconnect at {server}</p>
    </div>
  </div>
)

const WsConnected = (props) => {
  if (props.connected) {
    return <p>Websocket:&nbsp;&nbsp;&nbsp;<i className="green smile outline icon"></i></p>
  }else {
    return <p>Websocket:&nbsp;&nbsp;&nbsp;<i className="red spinner loading icon"></i></p>
  }
}



