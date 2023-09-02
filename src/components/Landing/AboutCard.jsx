import React from 'react'
import styles from './App.module.css'

const AboutCard = ({logo,title,descp}) => {
  return (
    <div className={styles.aboutCard}>
      <span>{logo}</span>
      <h3>{title}</h3>
      <p>{descp}</p>
    </div>
  )
}

export default AboutCard