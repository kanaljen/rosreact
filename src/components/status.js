import React from 'react';
import { server } from '../App';

export default () => (
  <div className="ui icon message">
    <i className="notched circle loading icon"></i>
    <div className="content">
      <div className="header">Websocket not connected</div>
      <p>Trying to reconnect at {server}</p>
    </div>
  </div>
);
