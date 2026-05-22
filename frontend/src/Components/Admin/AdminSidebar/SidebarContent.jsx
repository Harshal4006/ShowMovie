import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import SidebarUserSection from "./SidebarUserSection";

const SidebarContent = ({ isMobile, navItems, locationPath, onNavClick, onCloseMobile, onLogout }) => (
  <div className={`flex h-full flex-col ${isMobile ? "w-72" : "w-64"}`}>
    <SidebarLogo isMobile={isMobile} onCloseMobile={onCloseMobile} />
    <SidebarNav items={navItems} locationPath={locationPath} onNavClick={onNavClick} />
    <SidebarUserSection onLogout={onLogout} />
  </div>
);

export default SidebarContent;
