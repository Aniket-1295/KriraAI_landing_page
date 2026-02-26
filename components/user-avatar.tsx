"use client"

import { memo } from "react"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

function getInitials(name: string | null | undefined, email: string | null | undefined): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2)
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email && email.trim()) {
    const local = email.split("@")[0]
    return local.slice(0, 2).toUpperCase()
  }
  return "?"
}

interface UserAvatarProps {
  name?: string | null
  email?: string | null
  image?: string | null
  className?: string
}

const UserAvatarInner = ({ name, email, image, className }: UserAvatarProps) => {
  const initials = getInitials(name, email)
  const displayName = name || email || "User"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "rounded-full ring-offset-background focus:outline-none focus:ring-2 focus:ring-[#e78a53]/40 focus:ring-offset-2 focus:ring-offset-black",
            className
          )}
          aria-label="User menu"
        >
          <Avatar className="h-9 w-9 border border-border/50 bg-zinc-800/80 text-xs font-semibold text-white">
            {image && <AvatarImage src={image} alt="" />}
            <AvatarFallback className="bg-gradient-to-br from-[#e78a53]/90 to-[#e78a53]/70 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-[200px] border-zinc-800 bg-zinc-900/95 backdrop-blur-sm shadow-xl"
      >
        <DropdownMenuLabel className="text-zinc-300 font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground truncate">{displayName}</span>
            {email && (
              <span className="text-xs text-muted-foreground truncate">{email}</span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer text-zinc-300 focus:bg-zinc-800 focus:text-white"
          onSelect={() => signOut({ redirect: false })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const UserAvatar = memo(UserAvatarInner)
