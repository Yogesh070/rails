import React, {useEffect} from 'react';
import 'aos/dist/aos.css';
import Aos from 'aos';

import style from './App.module.css';
import Image from 'next/image';
import classNames from 'classnames';

const Features = () => {
  useEffect(() => {
    Aos.init({duration: 2500});
  }, []);
  return (
    <div id="Features">
      <h1 className={classNames(style.center)}>Features</h1>
      <div className={classNames(style.flex,style.featuresBody)}>
        <span>
          <h3>Scrum Board</h3>
          <p>
            Scrum boards help agile teams break large, complex projects into
            manageable pieces of work so focused teams, working in sprints, ship
            faster.
          </p>
        </span>
        <Image
          src="/scrum.png"
          alt=""
          height={400}
          width={400}
          className={classNames(style.heroImg,)}
          data-aos="fade-left"
        />
      </div>
      <div className={classNames(style.flex, style.featuresBody2)}>
        <Image
          src="/scrum.png"
          alt=""
          height={400}
          width={400}
          className={classNames(style.heroImg,)}
          data-aos="fade-right"
        />
        <span>
          <h3>List View</h3>
          <p>
            With lists, teams see immediately what they need to do, which tasks
            are a priority, and when work is due.
          </p>
        </span>
      </div>
      <div className={classNames(style.flex, style.featuresBody)}>
        <span>
          <h3>Reports and Insights</h3>
          <p>
            Reports and dashboards offer critical insights within the context of
            your work to ensure your teams are always up to date and set up for
            success.
          </p>
        </span>
        <Image
          height={400}
          width={400}
          src="/scrum.png"
          alt=""
          className={classNames(style.heroImg,)}
          data-aos="fade-left"
        />
      </div>
    </div>
  );
};

export default Features;
