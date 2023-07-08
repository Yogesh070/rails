import { ArrowRightIcon } from "@heroicons/react/24/outline"
import Image from "next/image"

const Navbar = () => {
return (
    <div className="flex header">
    <Image src="logo.svg" alt="logo"  className="logo" height={24} width={24}/>
     <nav>
      <ul className="listed-items">
        <li><a href="#Home">Home</a></li>
        <li><a href="#Features">Features</a></li>
        <li><a href="#About">About Us</a></li>
        <li><a href="#Footer">Contact Us</a></li>
      </ul>
     </nav>
     <button className="btn-signin flex gap-1">Sign in <ArrowRightIcon height={20}/> </button>
    </div>
  )
}
export default Navbar