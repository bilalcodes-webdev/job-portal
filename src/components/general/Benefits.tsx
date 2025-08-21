import { benefits } from "@/app/(main)/post-job/_components/ListOfbenefits";
import { Badge } from "../ui/badge";
import { ControllerRenderProps } from "react-hook-form";
import { JobPostSchemaType } from "@/lib/zodSchema";

type BenefitsProps = {
  field: ControllerRenderProps<JobPostSchemaType, "benefits">;
};

const Benefits = ({ field }: BenefitsProps) => {
  const toggleBenefits = (benefitId: string) => {
    let currentBenefits = field.value || [];

    let newBenefits = currentBenefits.includes(benefitId)
      ? currentBenefits.filter((id: string) => id !== benefitId)
      : [...currentBenefits, benefitId];

    field.onChange(newBenefits);
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          const isSelected = (field.value || []).includes(benefit.id);
          return (
            <Badge
              className="cursor-pointer transition-all hover:scale-105 active:scale-95 px-2 py-1.5 rounded-full"
              key={benefit.id}
              variant={isSelected ? "default" : "outline"}
              onClick={() => toggleBenefits(benefit.id)}
            >
              <span key={benefit.id} className="flex items-center gap-2">
                <Icon className="w-3 h-3" />
                {benefit.label}
              </span>
            </Badge>
          );
        })}
      </div>

      <div className="text-sm text-muted-foreground font-bold">
        <span className="text-primary">Selected Benefits:</span>{" "}
        {(field.value || []).length}
      </div>
    </div>
  );
};

export default Benefits;
