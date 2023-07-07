import { ArrowRight } from "react-feather"
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
        <button className="btn-start btn-send flex gap-1 center">Send <ArrowRight /></button>
      </div>
      </div>
      <div>
      <img src="logo.svg" alt=""  className="logo"/>
      <p>2023 &copy; All rights reserved.</p>
      </div>
      </div>
      </div>
  )
}
export default Footer