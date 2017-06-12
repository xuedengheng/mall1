/**
 * Created by Ben on 2016/12/11.
 */
import React, {Component} from 'react';
import {
  NavBar,
  MineHeader,
  MyOrder,
  OrderType,
  SelectCard,
  SplitLine,
  Loading,
  SetHelmet
} from '../../components';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as MineActions from 'actions/MineActions'

class Mine extends Component {

  componentDidMount() {
    this.props.mineActions.getUserMsg()
  }

  render() {
    const {statusCount, balance, isFetching, couponCount, invitations} = this.props;
    return (
      <div>
        <SetHelmet title="我的"/>
        {
          isFetching && <Loading />
        }
        <MineHeader/>
        <MyOrder/>
        <OrderType statusCount={statusCount}/>
        <SplitLine />
        <SelectCard balance={balance > 0 ? balance.toFixed(2) : '0.00'}
                    couponCount={couponCount === 0 ? '0 张' : couponCount + ' 张'}
                    invitations={invitations}/>
        <NavBar />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.mine.isFetching,
  statusCount: state.mine.statusCount,
  balance: state.mine.balance,
  couponCount: state.mine.couponCount,
  invitations: state.mine.invitations
})

const mapDispatchToProps = dispatch => ({
  mineActions: bindActionCreators(MineActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mine)