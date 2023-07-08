import { ArrowRightIcon } from "@heroicons/react/24/outline"
import Image from "next/image"

const Footer = () => {
  return (
    <div id="Footer" >
      <div className="flex footer">
        <div>
        <h3 className="center">Contact Us</h3>
        <p className="center">Send us a message</p>
        <div className="flex contact">
        <input type="text" placeholder="Name" className="input" />
        <input type="email" placeholder="Email" className="input" />
        <textarea rows={"5"} cols={"23"} placeholder="Message" className="input"></textarea>
        <button className="btn-start btn-send flex gap-1 center">Send <ArrowRightIcon /></button>
      </div>
      </div>
      <div>
      <Image src="logo.svg" alt="logo"  className="logo" height={24} width={24}/>
      <p>2023 &copy; All rights reserved.</p>
      </div>
      </div>
      </div>
  )
}
export default Footer