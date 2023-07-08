import {ArrowRightIcon} from '@heroicons/react/24/outline';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <div id="Hero" className="flex hero">
      <div>
        <h1>
          Impossible alone,
          <br />
          Possible together.
        </h1>
        <p>The modern project management tool for your business.</p>
        <button className="btn-start flex gap-1">
          Start now <ArrowRightIcon height={20} />{' '}
        </button>
      </div>
      <div className="glass">
        <Image src="/scrum.png" alt="hero-image" className="hero-img" height={300} width={400}/>
      </div>
    </div>
  );
};

export default HeroSection;
