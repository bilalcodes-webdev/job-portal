import { Button } from "@/components/ui/button";
import { Building2, User } from "lucide-react";

type UserType = "jobSeeker" | "company";

type UserSelectProps = {
    onSelect: (type: UserType) => void;
};

const UserSelectionForm = ( {onSelect} : UserSelectProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Let's Get Started 🚀</h2>
        <p className="text-muted-foreground">
          Choose how you would like to use our platform.
        </p>
      </div>

      <div className="grid gap-3">
        <Button
          onClick={() => onSelect("company")}
          variant="outline"
          className="w-full p-6 h-auto flex items-start gap-4 border-2 border-border transition-all duration-300 hover:border-primary hover:bg-primary/5 dark:hover:border-primary dark:hover:bg-primary/5"
        >
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="size-7 text-primary" />
          </div>
          <div className="flex flex-col justify-center text-left">
            <h3 className="font-semibold text-lg">Company / Organization</h3>
            <p className="text-sm text-muted-foreground">
              Post jobs and find exceptional talent
            </p>
          </div>
        </Button>

        <Button
          variant="outline"
          onClick={() => onSelect("jobSeeker")}
          className="w-full p-6 h-auto flex items-start gap-4 border-2 border-border transition-all duration-300 hover:border-primary hover:bg-primary/5 dark:hover:border-primary dark:hover:bg-primary/5"
        >
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="size-7 text-primary" />
          </div>
          <div className="flex flex-col justify-center text-left">
            <h3 className="font-semibold text-lg">Job Seeker</h3>
            <p className="text-sm text-muted-foreground">Find your dream job</p>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default UserSelectionForm;
