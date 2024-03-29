import style from './App.module.css';
import classNames from 'classnames';
import React from 'react'
import styles from './App.module.css'

const AboutCard = ({logo,title,descp}) => {
  return (
    <div className={classNames(style.aboutCard)}>
      <span>{logo}</span>
      <h3>{title}</h3>
      <p>{descp}</p>
    </div>
  )
}

export default AboutCard