import { Ban, Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

type RenderEmptyStateProps = {
  title: string;
  description: string;
  href: string;
  buttonText: string;
};

const RenderEmptyState = ({
  buttonText,
  description,
  href,
  title,
}: RenderEmptyStateProps) => {
  return (
    <div className="flex flex-col h-full flex-1 items-center justify-center rounded-md border border-dashed p-8">
      <div className="flex items-center justify-center size-20 bg-primary/20 rounded-full">
        <Ban className="size-10 text-primary" />
      </div>

      <h4 className="text-xl font-semibold mt-5">{title}</h4>
      <p className="mb-8 mt-2 text-center leading-tight text-sm text-muted-foreground max-w-sm text-balance">
        {description}
      </p>

      <Link href={href} className={buttonVariants()}>
        <Plus />
        {buttonText}
      </Link>
    </div>
  );
};
export default RenderEmptyState;
