import style from './App.module.css';
import classNames from 'classnames';
import React from 'react'
import Image from "next/image"
const FooterNav = () => {
  return (
    <div className={classNames(style.footerNav,style.center)}>  
    <div>
    <Image src="logo.svg" alt="logo"  className={classNames(style.logo)} height={24} width={24}/>
    <p>2023 &copy; All rights reserved.</p>
    </div>
    </div>
  )
}

export default FooterNav