import React from 'react';
import Disconnected from './status'

export default (props) => {
  let comp = null
  if(props.connected)comp = <div>Dashboard</div>
  else comp = <Disconnected/>
  return (
    <div>{comp}</div>
  )
}