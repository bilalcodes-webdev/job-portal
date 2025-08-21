import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.png";
import LoginForm from "./_components/LoginForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await auth();

  if (session) {
    return redirect("/");
  }
  
  return (
    <div className="flex items-center justify-center min-h-svh w-screen">
      <div className="w-full max-w-md flex flex-col gap-2">
        <Link href={"/"} className="flex items-center gap-3 self-center pb-2">
          <Image src={logo} alt="logo-image" className="size-8 rounded-md" />
          <h2 className="text-2xl font-bold">
            JOB <span className="text-primary">BILAL</span>
          </h2>
        </Link>

        <LoginForm />
      </div>
    </div>
  );
};
export default LoginPage;
