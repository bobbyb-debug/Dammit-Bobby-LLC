
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CreditCard,
  FileText,
  Home,
  Menu,
  X,
  DollarSign,
  ClipboardList
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  const location = useLocation();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Close sidebar by default on mobile
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const isActiveRoute = (route: string) => {
    if (route === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(route);
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${theme}`}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background transition-all duration-300 md:relative md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Logo" className="h-9 w-9" />
              <span className="font-bold">Dammit Bobby LLC</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-accent",
                    isActiveRoute("/dashboard") && "bg-accent font-medium"
                  )}
                >
                  <Home size={20} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-accent",
                    isActiveRoute("/jobs") && "bg-accent font-medium"
                  )}
                >
                  <ClipboardList size={20} />
                  <span>Jobs</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/calendar"
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-accent",
                    isActiveRoute("/calendar") && "bg-accent font-medium"
                  )}
                >
                  <Calendar size={20} />
                  <span>Calendar</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/invoices"
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-accent",
                    isActiveRoute("/invoices") && "bg-accent font-medium"
                  )}
                >
                  <FileText size={20} />
                  <span>Invoices</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/finance"
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-accent",
                    isActiveRoute("/finance") && "bg-accent font-medium"
                  )}
                >
                  <DollarSign size={20} />
                  <span>Finance</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 hover:bg-accent",
                    isActiveRoute("/settings") && "bg-accent font-medium"
                  )}
                >
                  <CreditCard size={20} />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          {/* Top bar */}
          <header className="flex h-16 items-center border-b px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </header>

          {/* Page content */}
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
