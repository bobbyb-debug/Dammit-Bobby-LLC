
import { Outlet } from "react-router-dom";
import { Separator } from "./ui/separator";
import { ModeToggle } from "./ui/mode-toggle";
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "./ui/sidebar";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile"; // Fixed the import
import { Button } from "./ui/button";
import { Menu, Home, FileText, Calendar, Settings, BarChart3 } from "lucide-react";

export default function Layout() {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="flex h-screen antialiased text-foreground">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 border-r">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        ) : (
          <Sidebar>
            <SidebarHeader>
              <h2 className="px-4 text-lg font-semibold">Dammit Bobby LLC</h2>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/dashboard">
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/jobs">
                      <FileText className="h-4 w-4" />
                      <span>Jobs</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/calendar">
                      <Calendar className="h-4 w-4" />
                      <span>Calendar</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/invoices">
                      <FileText className="h-4 w-4" />
                      <span>Invoices</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/finance">
                      <BarChart3 className="h-4 w-4" />
                      <span>Finance</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/settings">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <div className="px-4 text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Dammit Bobby LLC
              </div>
            </SidebarFooter>
          </Sidebar>
        )}
        <Separator orientation="vertical" className="hidden md:flex" />
        <div className="flex-1 p-4">
          <div className="flex items-center justify-end space-x-2">
            <ModeToggle />
          </div>
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
