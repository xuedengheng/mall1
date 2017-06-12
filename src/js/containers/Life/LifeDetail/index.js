/**
 * Created by Ben on 2017/1/13.
 */
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import styles from './index.scss'
import {Artical, Loading, SetHelmet} from 'components'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as LifeActions from 'actions/LifeActions'
import {api, urlApi} from 'service'

class LifeDetail extends Component {
  componentDidMount() {
    const {id} = this.props.params;
    let params = {url: urlApi.article.detail + '?id=' + id};
    this.props.lifeActions.fetchArticle(params);
  }

  back = () => {
    hashHistory.goBack();
  }

  render() {
    const {article, isFetching} = this.props;

    return (
      <div>
        <SetHelmet title={article.articles ? article.articles[0].title : ''}/>
        {
          isFetching && <Loading />
        }
        {/*<div className={styles.title} id="EWHiddenElement">*/}
        {/*<div className={styles.fHeight}/>*/}
        {/*<div className={`fixed-top ver-center ${styles.content}`}>*/}
        {/*<div className={`center-center ${styles.back}`} onClick={this::this.back}>*/}
        {/*<img src={require('../../../../images/base/search_icon_back.png')} alt=""/>*/}
        {/*</div>*/}
        {/*<p className="text-center font-32 text-overflow-1">*/}
        {/*{article.articles ? article.articles[0].title : ''}*/}
        {/*</p>*/}
        {/*</div>*/}
        {/*</div>*/}
        {article.articles ? <Artical data={article.articles} detail={true}/> : null}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.life.isFetching,
  article: state.life.article,
})

const mapDispatchToProps = dispatch => ({
  lifeActions: bindActionCreators(LifeActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LifeDetail)