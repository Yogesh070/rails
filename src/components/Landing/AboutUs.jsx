import React,{useEffect} from 'react'
import 'aos/dist/aos.css'
import Aos from "aos"
import AboutCard from "./AboutCard"
import { BookOpenIcon , FlagIcon } from '@heroicons/react/24/outline'

import style from "./App.module.css"
import classNames from 'classnames'
const AboutUs = () => {
  useEffect(()=>{
    Aos.init({duration:2200});
    },[])
  return (
    <div id="About">
      <h2>About Us</h2>
      <div className={classNames(style.flex,style.container)}>
     <div data-aos="flip-up" className={style.story}>
      <AboutCard logo={<BookOpenIcon height={40}/>} title="Our Story" descp=" Currently, we are Software Engineering Students and as a part of the curriculum it's mandatory to do a college project for everyone.Therefore we decided to build RAILS as our college project this year. "/>
     </div>
     <div data-aos="flip-up" className={style.story}>
     <AboutCard logo={<FlagIcon height={40}/>} title="Our Goal" descp=" Our main goal is to make the work for people more collaborartive, easier and scalable and Rails is the answer to that."/>
     </div>
     </div>
     </div>
  )
}
export default AboutUs