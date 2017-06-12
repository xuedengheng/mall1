/**
 * Created by Ben on 2017/2/9.
 */
import React from 'react'
import { Icon } from 'antd-mobile'

const RenderLoading = () => {
    return (
        <div>
            <div className="refresh-text" />
            <div>
                <Icon type="loading" size="xxs" /><span style={{marginLeft: '.2rem'}}>正在刷新</span>
            </div>
        </div>
    )
}

export default RenderLoading;