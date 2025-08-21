"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { countryList } from "@/lib/CountryList";
import { XIcon, Filter } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const jobTypes = ["full-time", "part-time", "contract", "internship"];

const FilterSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleJobTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("jobType", value);
    } else {
      params.delete("jobType");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleLocationChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("location", value);
    } else {
      params.delete("location");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    router.push(pathname); // remove all filters
  };

  return (
    <Card className="col-span-1 rounded-2xl border bg-card/60 backdrop-blur-sm shadow-md">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Filter className="size-5 text-primary" />
          <CardTitle className="text-2xl font-bold">Filters</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="h-8 px-3 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
        >
          <XIcon className="size-4 mr-1" />
          Clear
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-8 mt-4">
        {/* Job Type (Radio) */}
        <div className="space-y-3">
          <Label className="text-base font-semibold tracking-wide">
            Job Type
          </Label>
          <RadioGroup
            defaultValue={searchParams.get("jobType") || ""}
            onValueChange={handleJobTypeChange}
            className="grid grid-cols-2 gap-3"
          >
            {jobTypes.map((jobtype) => (
              <label
                key={jobtype}
                htmlFor={jobtype}
                className="flex items-center space-x-2 rounded-lg border px-3 py-2 cursor-pointer hover:bg-muted/50 transition 
                   peer-data-[state=checked]:bg-primary/10 
                   peer-data-[state=checked]:border-primary"
              >
                <RadioGroupItem
                  value={jobtype}
                  id={jobtype}
                  className="peer h-5 w-5 rounded-full border border-primary
             data-[state=checked]:bg-primary
             data-[state=checked]:after:hidden
             dark:data-[state=checked]:bg-primary"
                />
                <span className="text-sm font-medium capitalize">
                  {jobtype}
                </span>
              </label>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-3">
          <Label className="text-base font-semibold tracking-wide">
            Location
          </Label>
          <Select
            onValueChange={handleLocationChange}
            defaultValue={searchParams.get("location") || ""}
          >
            <SelectTrigger className="w-full rounded-lg border px-3 py-2 bg-muted/30 hover:bg-muted/50 transition">
              <SelectValue placeholder="🌍 Select Location" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg">
              <SelectGroup>
                <SelectLabel className="text-sm font-semibold">
                  Worldwide
                </SelectLabel>
                <SelectItem value="worldwide">
                  <span>🌏</span>{" "}
                  <span className="pl-2">Worldwide / Remote</span>
                </SelectItem>
              </SelectGroup>
              <Separator className="my-1" />
              <SelectGroup>
                <SelectLabel className="text-sm font-semibold">
                  Locations
                </SelectLabel>
                {countryList.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    <Image
                      src={country.flagUrl}
                      alt={country.code}
                      height={15}
                      width={15}
                    />
                    <span className="pl-2">{country.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
