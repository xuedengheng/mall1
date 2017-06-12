/**
 * Created by Ben on 2017/1/3.
 */
import React, { Component } from 'react';
import { LazyLoadComponent } from 'components'
import styles from './index.scss'

export default class Timer extends Component {
    constructor(props) {
        super(props);
        this.timer = 0;
        this.state = {
            type: 'will',
            day: 0,
            hour: 0,
            min: 0,
            sec: 0
        }
    }

    start = () => {
        const { start, end } = this.props.data;
        let startTime = new Date(start.replace(/-/g,'/')).getTime();
        let endTime = new Date(end.replace(/-/g,'/')).getTime();
        let that = this;
        this.timer = setInterval(() => {
            let now = new Date().getTime();
            //还没开始
            if (now < startTime) {
                let leftTime=startTime-now;
                let dd = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
                let hh = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
                let mm = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟数
                let ss = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
                dd = that.checkTime(dd);
                hh = that.checkTime(hh);
                mm = that.checkTime(mm);
                ss = that.checkTime(ss);//小于10的话加0
                that.setState({
                    type: 'will',
                    day: dd,
                    hour: hh,
                    min: mm,
                    sec: ss
                })
            } else if(now > startTime && now < endTime) { //开始中
                let leftTime=endTime-now;
                let dd = parseInt(leftTime / 1000 / 60 / 60 / 24, 10);//计算剩余的天数
                let hh = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
                let mm = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟数
                let ss = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
                dd = that.checkTime(dd);
                hh = that.checkTime(hh);
                mm = that.checkTime(mm);
                ss = that.checkTime(ss);//小于10的话加0
                that.setState({
                    type: 'ing',
                    day: dd,
                    hour: hh,
                    min: mm,
                    sec: ss
                })
            } else if(now > endTime) { //已经结束
                that.setState({
                    type: 'did',
                })
                clearInterval(this.timer)
            }
        }, 1000)
    }

    componentDidMount() {
        this.start()
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer)
    }

    checkTime = (time) => {
        if (time < 10) {
            time = "0" + time;
        }
        return time;
    }

    render() {
        const { targetClick } = this.props
        const { type, day, hour, min, sec } = this.state;
        const { id, target, title, url } = this.props.data;
        if (type === 'will') {
            return (
                <div className={styles.panel}>
                    <div className={styles.imgDiv}>
                        <LazyLoadComponent>
                            <img src={url} className="img-responsive"/>
                        </LazyLoadComponent>
                        <div className={`triangle ${styles.triangle}`}></div>
                    </div>
                    <div className={styles.detail}>
                        <p className={`font-28 color333 text-overflow-1 ${styles.title}`}>{title}</p>
                        <p className={styles.counter}>
                            <i className={styles.saling}/>
                            <small>距活动开始还剩</small>
                            <small className={styles.time}>{day}天{hour}时{min}分{sec}秒</small>
                        </p>
                    </div>
                </div>
            )
        } else if (type == 'ing') {
            return (
                <div className={styles.panel} onClick={targetClick.bind(this, target, id)}>
                    <div className={styles.imgDiv}>
                        <LazyLoadComponent>
                            <img src={url} className="img-responsive"/>
                        </LazyLoadComponent>
                        <div className={`triangle ${styles.triangle}`}></div>
                    </div>
                    <div className={styles.detail}>
                        <p className={`font-28 color333 text-overflow-1 ${styles.title}`}>{title}</p>
                        <p className={styles.counter}>
                            <i className={styles.saling}/>
                            <span>距活动结束还剩</span>
                            <span className={styles.time}>{day}天{hour}时{min}分{sec}秒</span>
                        </p>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={styles.panel}>
                    <div className={styles.imgDiv}>
                        <LazyLoadComponent>
                            <img src={url} className="img-responsive"/>
                        </LazyLoadComponent>
                        <div className={`triangle ${styles.triangle}`}></div>
                    </div>
                    <div className={styles.detail}>
                        <p className={`font-28 color333 text-overflow-1 ${styles.title}`}>{title}</p>
                        <p className={styles.counter}>
                            <i className={styles.saling}/>
                            <span>活动已结束</span>
                        </p>
                    </div>
                </div>
            )
        }
    }

}