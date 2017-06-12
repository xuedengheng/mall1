import React from 'react'
import {Provider} from 'react-redux'
import RootRouter from '../RootRouter'
import '../../styles/normalize.scss'
import '../../styles/app.scss'
import '../../styles/antdStyleReset.scss'
import '../../styles/font.scss'
import '../../styles/animations.scss'
import '../../styles/yiwu.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const Root = ({store, history}) => (
    <Provider store={store}>
      <RootRouter history={history} />
    </Provider>
)

export default Root
