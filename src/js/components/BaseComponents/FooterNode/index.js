/**
 * Created by Ben on 2017/4/6.
 */
import React from 'react'
import {STATS} from 'react-pullload'
import {Icon} from 'antd-mobile'

const FooterNode = ({loaderState, hasMore}) => {
    let view = [];
    if (!hasMore) {
        view =
            <p className="text-center" style={{
                width: '100%',
                height: '1rem',
                lineHeight: '1rem',
                background: '#ffffff',
                borderTop: '1px solid #ddd'
            }}>
                没有更多
            </p>;
    } else if (loaderState == STATS.loading) {
        view =
            <p className="text-center" style={{
                width: '100%',
                height: '1rem',
                lineHeight: '1rem',
                fontSize: '.75rem'
            }}>
                <Icon type="loading" />
            </p>
    }
    return (
        <div>
            {view}
        </div>
    )
}
export default FooterNode;