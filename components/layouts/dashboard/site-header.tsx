"use client"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { IoNotifications } from "react-icons/io5";

export function SiteHeader() {
  const { user, logout } = useAuth();
  const userName = user?.name || "Guest";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">
          Documents
        </Button>
      </div>

      <div className="flex-1 space-x-4" />
      <div className="space-x-4 flex items-center">
        <IoNotifications className="text-xl text-[#929EAE]" />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {userInitial}
              </span>
            </div>
            <span className="text-sm font-medium">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
