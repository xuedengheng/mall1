import React, {Component} from 'react'
import {Link} from 'react-router'
import {SetHelmet} from 'components'

export default class NotFoundPage extends Component {
  render() {
    return (
      <div className="center-center-column" style={{height: '100vh'}}>
        <SetHelmet title="404!!"/>
        <span className="font-26">404!页面没有找到，请</span>
        <Link to="/" className="font-36 color-fe5">返回首页</Link>
      </div>
    )
  }
}