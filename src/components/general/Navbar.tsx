import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.png";
import { auth } from "@/lib/auth";
import NavbarActions from "./NavbarAction";

const Navbar = async () => {
  return (
    <nav className="flex items-center justify-between py-4">
      <Link href={"/"} className="flex items-center gap-4">
        <Image
          className="rounded-md"
          src={logo}
          alt="Job Bilal Logo"
          height={40}
          width={40}
        />
        <h2 className="text-3xl font-bold">
          JOB<span className="text-primary">BILAL</span>
        </h2>
      </Link>

      {/* 👇 client-only actions */}
      <NavbarActions />
    </nav>
  );
};

export default Navbar;
