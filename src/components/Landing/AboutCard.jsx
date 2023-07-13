import React from 'react'
const AboutCard = ({logo,title,descp}) => {
  return (
    <div className="about-card">
      <span>{logo}</span>
      <h3>{title}</h3>
      <p>{descp}</p>
    </div>
  )
}

export default AboutCard