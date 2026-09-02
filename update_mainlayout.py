import re

with open("client/src/components/layout/MainLayout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_logic = """  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#f4f7f6] dark:bg-[#0b1120] transition-colors overflow-hidden relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with mobile toggle logic */}
      <div className={ixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out }>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />"""

new_logic = """  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const location = useLocation();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleMenuClick = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopCollapsed(!desktopCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f7f6] dark:bg-[#0b1120] transition-colors overflow-hidden relative">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar with mobile toggle logic and desktop collapse */}
      <div className={ixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out }>
        <Sidebar collapsed={desktopCollapsed} />
      </div>

      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden">
        <Header onMenuClick={handleMenuClick} />"""

content = content.replace(old_logic, new_logic)

with open("client/src/components/layout/MainLayout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated MainLayout.tsx for desktop collapse")
