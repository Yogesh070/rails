import style from './App.module.css';
import classNames from 'classnames';
import { ArrowRightIcon } from "@heroicons/react/24/outline"
const Footer = () => {
  return (
    <div id="Footer" >
      <div className={classNames(style.footer)}>
        <div>
        <h1 className={classNames(style.center)}>Contact Us</h1>
        <p className={classNames(style.center)}>Send us a message</p>
        <div className={classNames(style.flex,style.contact)}>
        <input type="text" placeholder="Name" className={classNames(style.input)} />
        <input type="email" placeholder="Email" className={classNames(style.input)} />
        <input type="text" placeholder="Subject" className={classNames(style.input)} />
        <textarea rows={"5"} cols={"23"} placeholder="Message" className={classNames(style.input)}></textarea>
        <button className={classNames(style.btnStart,style.btnSend,style.flex,style.gap1,style.center)}>Send <ArrowRightIcon height={20} /></button>
      </div>
      </div>
      </div>
      </div>
  )
}
export default Footer