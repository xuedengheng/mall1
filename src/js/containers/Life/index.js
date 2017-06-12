/**
 * Created by Ben on 2016/12/11.
 */
import React, {Component} from 'react'
import {
  NavBar,
  Artical,
  Loading,
  SetHelmet
} from 'components'
import styles from './index.scss'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as LifeActions from 'actions/LifeActions'
import {api, isObjectEqual, urlApi} from 'service'

class Life extends Component {

  componentDidMount() {
    let params = {url: urlApi.article.query}
    this.props.lifeActions.fetchLife(params)
  }

  render() {
    const {life, isFetching} = this.props;
    return (
      <div>
        <SetHelmet title="生活"/>
        {
          isFetching && <Loading />
        }
        <div className={styles.title}>
          <div className={styles.fHeight}/>
          <div className={`fixed-top ver-center ${styles.content}`}>
            <p className="text-center font-32">生活</p>
          </div>
        </div>
        {life.articles ? <Artical data={life.articles} detail={false}/> : ''}
        <NavBar/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.life.isFetching,
  life: state.life.life,
})

const mapDispatchToProps = dispatch => ({
  lifeActions: bindActionCreators(LifeActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Life)
