import { ArrowRightIcon } from "@heroicons/react/24/outline"

const Footer = () => {
  return (
    <div id="Footer" >
      <div className="footer">
        <div>
        <h2>Contact Us</h2>
        <p className="center">Send us a message</p>
        <div className="flex contact">
        <input type="text" placeholder="Name" className="input" />
        <input type="email" placeholder="Email" className="input" />
        <input type="text" placeholder="Subject" className="input" />
        <textarea rows={"5"} cols={"23"} placeholder="Message" className="input"></textarea>
        <button className="btn-start btn-send flex gap-1 center">Send <ArrowRightIcon height={20} /></button>
      </div>
      </div>
      </div>
      </div>
  )
}
export default Footer