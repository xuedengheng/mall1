import React, {Component} from 'react';
import {withRouter} from 'react-router'

class App extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      sen.quick('autoTrack');
    }
  }

  render() {
    const {children} =this.props;
    return (
      <div style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: '#eee'}}>
        {children}
      </div>
    )
  }
}

export default withRouter(App)