import React,{useEffect} from 'react'
import 'aos/dist/aos.css'
import Aos from "aos"
const Features = () => {
  useEffect(()=>{
  Aos.init({duration:2500});
  },[])
  return (
    <div id="Features">
    <h2>Features</h2>
        <div className="flex features-body" >
        <span>
        <h3>Scrum Board</h3>
        <p>Scrum boards help agile teams break large, complex projects into manageable pieces of work so focused teams, working in sprints, ship faster.</p>
        </span>
        <img src="scrum.png" alt="" className="hero-img" data-aos="fade-left"/>
        </div>
        <div className="flex features-body"  >
        <span><h3>List View</h3>
        <p>With lists, teams see immediately what they need to do, which tasks are a priority, and when work is due.</p>
        </span>
        <img src="scrum.png" alt="" className="hero-img" data-aos="fade-left"/>
        </div>
        <div className="flex features-body" >
        <span>
        <h3>Reports and Insights</h3>
        <p>Reports and dashboards offer critical insights within the context of your work to ensure your teams are always up to date and set up for success.</p>
        </span>
        <img src="scrum.png" alt="" className="hero-img" data-aos="fade-left"/>
        </div>
      </div>
  )
}

export default Features