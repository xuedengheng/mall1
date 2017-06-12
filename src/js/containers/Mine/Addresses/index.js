/**
 * Created by yiwu on 2017/2/20.
 */
import React, {Component} from 'react'
import {Address, Loading, SetHelmet} from 'components'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {urlApi} from 'service'
import * as AddressActions from 'actions/AddressActions'

class Addresses extends Component {
  state = {
    addresses: null
  }

  componentWillMount() {
    let params = {
      url: urlApi.address.query,
      search: {account: localStorage.account}
    };
    this.props.addressActions.queryAddress(params);
  }

  componentWillReceiveProps(nextProps) {
    const {addresses} = nextProps;
    if (addresses !== this.props.addresses) {
      this.setState({addresses})
    }
  }

  render() {
    return (
      <div>
        <SetHelmet title="地址管理"/>
        {
          this.props.isFetching && <Loading />
        }
        <Address addresses={this.state.addresses}/>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  isFetching: state.address.isFetching,
  addresses: state.address.addresses,
})

const mapDispatchToProps = dispatch => ({
  addressActions: bindActionCreators(AddressActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Addresses)