"use client";

import Image from "next/image";
import logo from "../../../../public/logo.png";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import UserSelectionForm from "./UserSelectionForm";
import CompanyForm from "./CompanyForm";
import UserForm from "./UserForm";

type UserSelectionType = "company" | "jobSeeker" | null;
const OnboardingForm = () => {
  const [userType, setUserType] = useState<UserSelectionType>(null);
  const [step, setStep] = useState(1);

  const handleUserSelection = (type: UserSelectionType) => {
    setUserType(type);
    setStep(2);
  };

  function renderStep() {
    switch (step) {
      case 1:
        return <UserSelectionForm onSelect={handleUserSelection} />;
      case 2:
        return userType === "company" ? <CompanyForm /> : <UserForm />;
      default:
        return null;
    }
  }

  return (
    <>
      <div className="flex  items-center mb-10 gap-2">
        <Image
          src={logo}
          alt="logo-image"
          height={40}
          width={40}
          className="rounded-md"
        />
        <h2 className="text-4xl font-bold">
          JOB<span className="text-primary">BILAL</span>
        </h2>
      </div>

      <Card className="max-w-lg w-full">
        <CardContent>{renderStep()}</CardContent>
      </Card>
    </>
  );
};
export default OnboardingForm;
