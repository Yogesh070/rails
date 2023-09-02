import style from './App.module.css';
import classNames from 'classnames';
import {ArrowRightIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
const HeroSection = () => {
  return (
    <div className={classNames(style.topSection)}>
   <div className={classNames(style.flex,style.header)}>
    <Image src="logo.svg" alt="logo" className={classNames(style.logo)} height={24} width={24} />
    <nav>
      <ul className={classNames(style.listedItems)}>
        <li><Link href="#Home">Home</Link></li>
        <li><Link href="#Features">Features</Link></li>
        <li><Link href="#About">About Us</Link></li>
        <li><Link href="#Footer">Contact Us</Link></li>
      </ul>
    </nav>
    <Link href="auth/signin">
      <button className={classNames(style.btnSignin,style.flex,style.gap1)}>Sign in <ArrowRightIcon height={20} /></button>
    </Link>
  </div>
    <div id="Hero" className={classNames(style.flex,style.hero)}>
      <div>
        <h1>
          Impossible alone,
          <br />
          Possible together.
        </h1>
        <p>The modern project management tool for your business.</p>
        <Link href="auth/signin">
        <button className={classNames(style.btnStart,style.flex,style.gap1)}>
          Start now <ArrowRightIcon height={20} />{' '}
        </button>
        </Link>
      </div>
      <div className={classNames(style.glass)}>
        <Image src="/scrum.png" alt="hero-image" className={classNames(style.heroImg)} height={300} width={400}/>
      </div>
    </div>
    </div>
  );
};

export default HeroSection;
