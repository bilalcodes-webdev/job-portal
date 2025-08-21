import { JobPostSchemaType } from "@/lib/zodSchema";
import { ControllerRenderProps } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { listingPlans } from "@/lib/jobListingPrice";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

type JobListingProps = {
  field: ControllerRenderProps<JobPostSchemaType, "listingDuration">;
};

const JobListingPrice = ({ field }: JobListingProps) => {
  return (
    <RadioGroup
      value={field.value.toString()}
      onValueChange={(value) => field.onChange(parseInt(value))}
      className="flex flex-col gap-4 w-full"
    >
      {listingPlans.map((listing) => (
        <div key={listing.id} className="w-full">
          <RadioGroupItem
            value={listing.days.toString()}
            id={listing.days.toString()}
            className="sr-only"
          />
          <Label
            htmlFor={listing.days.toString()}
            className="w-full cursor-pointer"
          >
            <Card
              className={cn(
                field.value == listing.days
                  ? "border-primary bg-primary/10"
                  : "hover:bg-secondary/50",
                "w-full p-4 border-2 transition-all"
              )}
            >
              <div className="flex w-full justify-between items-start">
                {/* Left side */}
                <div className="flex flex-col">
                  <p className="font-semibold text-lg">{listing.days} Days</p>
                  <p className="text-sm text-muted-foreground">
                    {listing.description}
                  </p>
                </div>

                {/* Right side */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-lg">{listing.price}</p>
                  <p className="text-sm text-muted-foreground">
                    ${(listing.price / listing.days).toFixed(2)}/day
                  </p>
                </div>
              </div>
            </Card>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
export default JobListingPrice;
