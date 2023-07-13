import React from 'react'
import Image from "next/image"
const FooterNav = () => {
  return (
    <div className="footer-nav center">  
    <div>
    <Image src="logo.svg" alt="logo"  className="logo" height={24} width={24}/>
    <p>2023 &copy; All rights reserved.</p>
    </div>
    </div>
  )
}

export default FooterNav