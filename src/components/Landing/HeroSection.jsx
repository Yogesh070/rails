import { ArrowRight } from "react-feather"
const HeroSection = () => {
  return (
    <div id="Hero" className="flex hero"> 
      <div>
      <h1>Impossible alone,<br />Possible together.</h1>
     <p>The modern project management tool for your business.</p> 
      <button className="btn-start flex gap-1">Start now <ArrowRight /> </button> 
     </div>
      <div className="glass">
      <img src="scrum.png" alt="" className="hero-img" />
      </div>
    </div>
  )
}

export default HeroSection