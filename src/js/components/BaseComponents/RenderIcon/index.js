/**
 * Created by Ben on 2017/2/9.
 */
import React from 'react'

const RenderIcon = () => {
    return (
        <div>
            <div className="refresh-text" />
            <div key="0" className="am-refresh-control-pull">
                <i className="refresh-icon"/>
                <span>下拉刷新</span>
            </div>
            <div key="1" className="am-refresh-control-release">
                <i className="refresh-icon" style={{transform: 'rotate(180deg)'}}/>
                <span>松开刷新</span>
            </div>
        </div>
    )
}

export default RenderIcon;