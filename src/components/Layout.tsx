
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FileText, 
  Calendar, 
  Settings, 
  Menu, 
  X, 
  Sun, 
  Moon 
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", icon: <Home size={20} />, label: "Dashboard" },
    { path: "/jobs", icon: <Calendar size={20} />, label: "Jobs" },
    { path: "/invoices", icon: <FileText size={20} />, label: "Invoices" },
    { path: "/settings", icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-40
        w-64 bg-sidebar text-sidebar-foreground flex flex-col`}
      >
        <div className="p-4 flex items-center justify-center border-b border-sidebar-border">
          <img src="/logo.svg" alt="Dammit Bobby LLC" className="h-12 w-auto" />
        </div>
        
        <nav className="flex-1 pt-6">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors
                    ${
                      isActive(item.path)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50"
                    }
                  `}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-sidebar-border flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
          
          <div className="text-sm opacity-75">
            &copy; {new Date().getFullYear()} 
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-0 p-4 md:p-8">
        {/* Content header - space for mobile menu button */}
        <div className="h-12 md:h-0" />
        {children}
      </div>
    </div>
  );
};

export default Layout;
