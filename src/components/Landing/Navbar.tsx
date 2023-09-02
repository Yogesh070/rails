import style from './App.module.css';
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import classNames from "classnames"
import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
  return (
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
  )
}
export default Navbar