"use client";

import {
  ChevronDownIcon,
  Heart,
  Home,
  Layers2Icon,
  LogOutIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { useLogout } from "@/app/hooks/signout";

type DropDownProps = {
  name?: string;
  email: string;
  image?: string;
  isCompany: boolean;
};

export default function UserDropDown({
  name,
  email,
  image,
  isCompany,
}: DropDownProps) {
  const { handleLogout } = useLogout();
  // Agar name nahi hai to email ka first part show karega
  const displayName = name || email.split("@")[0];

  // Agar image nahi hai to fallback Vercel avatar use hoga
  const avatarUrl =
    image || `https://avatar.vercel.sh/${encodeURIComponent(email)}.png`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={avatarUrl} alt="Profile image" />
            <AvatarFallback>
              {email.charAt(0).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {displayName}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={"/"} className="flex items-center gap-2">
              <Home
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Homepage</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={"/favourite-jobs"}>
              <Heart
                size={16}
                strokeWidth={2}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Favourite Jobs</span>
            </Link>
          </DropdownMenuItem>

          {isCompany && (
            <DropdownMenuItem asChild>
              <Link href={"/my-jobs"}>
                <Layers2Icon
                  size={16}
                  strokeWidth={2}
                  className="opacity-60"
                  aria-hidden="true"
                />
                <span>My Jobs Listing</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start"
          >
            <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
            <span>Logout</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
