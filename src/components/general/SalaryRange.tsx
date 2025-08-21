import { Control, useController } from "react-hook-form";
import { Slider } from "../ui/slider";
import { formatCurrency } from "@/lib/currencyFormater";
import { useEffect, useState } from "react";

type SalaryRangeProps = {
  control: Control<any>;
  minSalary: number;
  maxSalary: number;
  currency: string;
  step: number;
};

const SalaryRange = ({
  control,
  currency,
  maxSalary,
  minSalary,
  step,
}: SalaryRangeProps) => {
  const { field: salaryFrom } = useController({
    name: "salaryFrom",
    control,
  });

  const { field: salaryTo } = useController({
    name: "salaryTo",
    control,
  });

  // Local state for slider range
  const [range, setRange] = useState<[number, number]>([
    salaryFrom.value ?? minSalary,
    salaryTo.value ?? maxSalary / 2,
  ]);


  const handleChange = (newRange: [number, number]) => {
    setRange(newRange);
    salaryFrom.onChange(newRange[0]);
    salaryTo.onChange(newRange[1]);
  };

  return (
    <div className="space-y-3">
      <Slider
        min={minSalary}
        max={maxSalary}
        step={step}
        value={range}
        onValueChange={handleChange}
      />
      <div className="flex items-center justify-between mt-2 text-sm font-medium">
        <span>{formatCurrency(range[0])}</span>
        <span>{formatCurrency(range[1])}</span>
      </div>
    </div>
  );
};

export default SalaryRange;
