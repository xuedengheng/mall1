/**
 * Created by Ben on 2016/12/27.
 */
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {
  Loading,
  StaticSearch,
  Category,
  SetHelmet
} from 'components'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {urlApi} from 'service'
import * as CatelogActions from 'actions/CatelogActions'

class Catelog extends Component {
  componentDidMount() {
    if (this.props.params.id) {
      let params = {
        url: urlApi.category.querydoublev2,
        search: {parentId: this.props.params.id}
      }
      this.props.catelogActions.fetchCatelog(params);
    } else {
      let params = {url: urlApi.category.queryv2};
      this.props.catelogActions.fetchCatelog(params)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id && !nextProps.params.id) {
      let params = {
        url: urlApi.category.queryv2
      }
      this.props.catelogActions.fetchCatelog(params)
    } else if (nextProps.params.id && !this.props.params.id) {
      let params = {
        url: urlApi.category.querydoublev2,
        search: {parentId: nextProps.params.id}
      }
      this.props.catelogActions.fetchCatelog(params);
    }
  }

  render() {
    const {isFetching, catelog, queryActions, params} = this.props
    return (
      <div>
        <SetHelmet title="类目"/>
        {
          isFetching && <Loading />
        }
        <StaticSearch back={this.back}/>
        {
          catelog.result &&
          <Category from="catelog" id={params.id} data={catelog.result} margin={.4} {...queryActions}/>
        }
      </div>
    )
  }

  back = () => {
    hashHistory.goBack()
  }
}

const mapStateToProps = state => ({
  isFetching: state.catelog.isFetching,
  catelog: state.catelog.items
})

const mapDispatchToProps = dispatch => ({
  catelogActions: bindActionCreators(CatelogActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Catelog)