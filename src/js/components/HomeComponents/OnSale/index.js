/**
 * Created by Ben on 2017/1/3.
 */
import React from 'react'
import Timer from './Timer'
import styles from './index.scss'

export default class OnSale extends React.Component {



    render() {
        const { data, targetClick } = this.props;
        let view = [];
        data.map((item, index) => {
            view.push(
                <Timer data={item} key={index} targetClick={targetClick} />
            )
        })
        return (
            <div className={styles.root}>
                {view}
            </div>
        )
    }


}