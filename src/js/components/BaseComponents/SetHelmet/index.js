/**
 * Created by Ben on 2017/5/8.
 */
import React from "react"
import {Helmet} from 'react-helmet'

const SetHelmet = ({title, keywords}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="keywords" content={keywords}/>
    </Helmet>
  )
}

export default SetHelmet