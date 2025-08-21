import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  DollarSign,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { relativeDateFormatter } from "@/lib/relativeDateFormater";
import { formatCurrency } from "@/lib/currencyFormater";

interface JobCardProps {
  id: string;
  createdAt: Date;
  Company: {
    name: string;
    location: string;
    about: string;
    logo: string;
  };
  location: string;
  jobTitle: string;
  employmentType: string;
  salaryFrom: number;
  salaryTo: number;
}

const JobCard = ({
  id,
  Company,
  jobTitle,
  location,
  employmentType,
  salaryFrom,
  salaryTo,
  createdAt,
}: JobCardProps) => {
  return (
    <Card className="rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all hover:border-primary duration-300 transform-border">
      <CardContent className="px-5 py-3 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={Company.logo} alt={Company.name} />
              <AvatarFallback>
                {Company.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{jobTitle}</h3>
              <p className="text-sm text-muted-foreground">{Company.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {Company.about}
              </p>
            </div>
          </div>
          <Badge className="rounded-full px-3 py-1 bg-primary text-primary-foreground">
            {employmentType}
          </Badge>
        </div>

        {/* Badges row */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 flex items-center gap-1 bg-muted/50"
            >
              <MapPin className="size-4" />
              {location || Company.location}
            </Badge>

            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 flex items-center gap-1 bg-muted/50"
            >
              <DollarSign className="size-4" />
              {formatCurrency(salaryFrom)} – {formatCurrency(salaryTo)}
            </Badge>

            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 flex items-center gap-1 bg-muted/50"
            >
              <CalendarDays className="size-4" />
              {relativeDateFormatter(createdAt)}
            </Badge>
          </div>

          <Link
            href={`/job/${id}`}
            className="mt-2 inline-flex items-center gap-1 text-primary font-medium text-sm self-end group"
          >
            View Job
            <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
