"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaChartLine,
  FaGraduationCap,
  FaUsers,
  FaHeartbeat,
  FaFistRaised,
  FaBalanceScale,
  FaDatabase,
  FaProjectDiagram,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { usePathname } from "next/navigation";

const cn = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

export interface NavItem {
  href?: string;
  external?: boolean;
  matchPath?: string;
  pillar?: string;
  icon: React.ReactNode;
  label: string;
  roles?: string[];
  children?: NavItem[]; // ✅ add nested items
}

export const HealthIcon = "/svg/healthIcon.svg";
export const AgricIcon = "/svg/agricIcon.svg";
export const EducationIcon = "/svg/eduIcon.svg";

export const navItem: NavItem[] = [
  {
    href: "/dashboard",
    matchPath: "/dashboard/data",
    pillar: "overview",
    icon: <FaTachometerAlt />,
    label: "Dashboard",
  },
  {
    href: "/dashboard/data?pillar=econ",
    matchPath: "/dashboard/data",
    pillar: "econ",
    icon: <FaChartLine />,
    label: "Economic Participation",
  },
  {
    href: "/dashboard/data?pillar=edu",
    matchPath: "/dashboard/data",
    pillar: "edu",
    icon: <FaGraduationCap />,
    label: "Education and Training",
  },
  {
    href: "/dashboard/data?pillar=soc",
    matchPath: "/dashboard/data",
    pillar: "soc",
    icon: <FaUsers />,
    label: "Sociocultural",
  },
  {
    href: "/dashboard/data?pillar=health",
    matchPath: "/dashboard/data",
    pillar: "health",
    icon: <FaHeartbeat />,
    label: "Health",
  },
  {
    href: "/dashboard/data?pillar=pol",
    matchPath: "/dashboard/data",
    pillar: "pol",
    icon: <FaFistRaised />,
    label: "Political empowerment",
  },
  {
    href: "/dashboard/data?pillar=legal",
    matchPath: "/dashboard/data",
    pillar: "legal",
    icon: <FaBalanceScale />,
    label: "Legal",
  },
  {
    href: "/dashboard/data?pillar=data",
    matchPath: "/dashboard/data",
    pillar: "data",
    icon: <FaDatabase />,
    label: "Data",
  },
  {
    href: "https://nfwp.gov.ng",
    external: true,
    icon: <FaProjectDiagram />,
    label: "NFWP-SU",
  },
];

interface SidebarProps {
  collapsed: boolean;
  hovered?: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navItems?: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  hovered = false,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  navItems = navItem,
}) => {
  const isViewCollapsed = (collapsed && !hovered && !mobileOpen);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const pathname = usePathname();
  const activePillar =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("pillar")
      : null;

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, [setMobileOpen]);

  const toggleExpand = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Mobile Close Button (only when open) */}
      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          onClick={closeMobile}
          className="md:hidden fixed top-4 right-4 z-50 bg-white text-ngf-green p-2 rounded shadow-lg"
        >
          <FaTimes size={24} />
        </button>
      )}

      {/* Sidebar container */}
      <div
        aria-label="Sidebar"
        className={cn(
          "h-full min-h-screen relative transition-all duration-300 border-r shadow-2xl z-40",
          "bg-ngf-green text-white md:bg-white md:text-black",
          isViewCollapsed ? "w-20" : "w-64 min-w-[256px]",
        )}
      >
        {/* Collapse toggle (desktop) */}
        <button
          aria-label={isViewCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center absolute top-4 right-[-16px] text-white bg-ngf-green border border-white rounded-full w-8 h-8 z-50 shadow"
        >
          {isViewCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>

        <div className="h-full overflow-y-auto p-6 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className={cn("flex", isViewCollapsed ? "py-2" : "py-5")}>
              <Image
                src="/logo.png"
                alt="NGF Logo"
                width={isViewCollapsed ? 70 : 180}
                height={isViewCollapsed ? 70 : 60}
                priority
                className={cn(
                  "object-contain transition-all duration-300 h-auto",
                  "md:invert-0", // Logo white on mobile, original on desktop
                  isViewCollapsed ? "w-10" : "w-36",
                )}
              />
            </div>

            {navItems.map((item) => {
              if (item.children && item.children.length > 0) {
                const isOpen = expanded[item.label];
                return (
                  <div key={item.label} className="space-y-1">
                    {/* Parent item */}
                    <button
                      onClick={() => toggleExpand(item.label)}
                      className="w-full flex items-center justify-between p-2 rounded hover:bg-ngf-green-dark hover:text-[#ecfdf3] cursor-pointer "
                    >
                      <div className="flex items-center space-x-2">
                        {typeof item.icon === "string" ? (
                          <Image
                            src={item.icon}
                            alt={item.label}
                            width={isViewCollapsed ? 20 : 24}
                            height={isViewCollapsed ? 20 : 24}
                            priority
                            className={cn(
                              "object-contain transition-all duration-300 h-auto brightness-0 invert md:brightness-0 md:invert-0 hover:invert",
                              isViewCollapsed ? "w-5" : "w-6",
                            )}
                          />
                        ) : (
                          <span>{item.icon as React.ReactNode}</span>
                        )}
                        {!isViewCollapsed && <span>{item.label}</span>}
                      </div>
                      {!isViewCollapsed && (
                        <span>
                          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                        </span>
                      )}
                    </button>

                    {/* Children */}
                    {isOpen && !isViewCollapsed && (
                      <div className="ml-6 flex flex-col space-y-1">
                        {item.children.map((child) => {
                          const isActive =
                            pathname === child.href ||
                            pathname.startsWith(child.href + "/");

                          return (
                            <Link
                              key={child.label}
                              href={child.href!}
                              className={`p-2 rounded flex items-center space-x-2 hover:bg-ngf-green-dark hover:text-[#ecfdf3] ${isActive ? "bg-ngf-green-light text-[#f0fdf4]" : ""
                                }`}
                              onClick={closeMobile}
                            >
                              {typeof child.icon === "string" ? (
                                <Image
                                  src={child.icon}
                                  alt={child.label}
                                  width={20}
                                  height={20}
                                  priority
                                  className="object-contain transition-all duration-300 h-auto w-5"
                                />
                              ) : (
                                <span>{child.icon as React.ReactNode}</span>
                              )}
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Normal single item
              const isActive = item.href
                ? !item.external &&
                ((item.matchPath
                  ? pathname === item.matchPath
                  : pathname === item.href || pathname.startsWith(item.href + "/")) &&
                  (item.pillar ? activePillar === item.pillar : true))
                : false;
              return (
                <Link
                  key={item.label}
                  href={item.href!}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={`p-2 rounded flex items-center space-x-2 hover:bg-ngf-green-dark hover:text-[#ecfdf3] ${isActive ? "bg-ngf-green-light text-[#f0fdf4]" : ""}`}
                  onClick={closeMobile}
                >
                  {typeof item.icon === "string" ? (
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={isViewCollapsed ? 20 : 24}
                      height={isViewCollapsed ? 20 : 24}
                      priority
                      className={cn(
                        "object-contain transition-all duration-300 h-auto",
                        isViewCollapsed ? "w-5" : "w-6",
                      )}
                    />
                  ) : (
                    <span>{item.icon as React.ReactNode}</span>
                  )}
                  {!isViewCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>

        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={closeMobile}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
