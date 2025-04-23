import { Outlet } from "react-router-dom";
import { Separator } from "./ui/separator";
import { ModeToggle } from "./ui/mode-toggle";
import { Sidebar } from "./ui/sidebar";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile"; // Fixed the import
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export default function Layout() {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen antialiased text-foreground">
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-3/4 border-r">
            <Sidebar />
          </SheetContent>
        </Sheet>
      ) : (
        <Sidebar />
      )}
      <Separator orientation="vertical" className="hidden md:flex" />
      <div className="flex-1 p-4">
        <div className="flex items-center justify-end space-x-2">
          <ModeToggle />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
