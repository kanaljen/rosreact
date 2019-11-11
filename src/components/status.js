import React from 'react';
import { server } from '../App'

export default () => (
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