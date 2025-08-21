import Navbar from "@/components/general/Navbar";
import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="max-w-7xl px-4 md:px-6 lg:px-8 mx-auto">
      <Navbar />
      {children}
    </div>
  );
};
export default MainLayout;
