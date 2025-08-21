import OnboardingForm from "@/components/general/onboarding/OnboardingForm";
import { checkOnBoardingStatus, checkUser } from "../data/user/require-user";

const Onboarding = async () => {
  const session = await checkUser();

  const status = await checkOnBoardingStatus(session.user?.id as string);
  return (
    <div className="flex items-center flex-col justify-center min-h-screen w-screen py=10">
      <OnboardingForm />
    </div>
  );
};
export default Onboarding;
