/**
 * Created by Ben on 2016/12/14.
 */
import React, { Component } from 'react';
import { Tabs } from 'antd-mobile';
import Interest from'./Interest'
import styles from './index.scss';

const TabPane = Tabs.TabPane;

export default class DetailTab extends Component {

    render() {
        const { description, data, handleClick, activeKey, openCartModal} = this.props;
        let richDetail = description.introduction ? description.introduction : description;
        return (
            <div className={styles.root}>
                <Tabs defaultActiveKey="1" swipeable={false} onChange={handleClick} activeKey={activeKey}>
                    <TabPane tab="图文详情" key="1">
                        <div className={styles.detail} dangerouslySetInnerHTML={{__html: richDetail}}/>
                    </TabPane>
                    <TabPane tab="猜你喜欢" key="2">
                        <Interest data={data} openModal={openCartModal}/>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
