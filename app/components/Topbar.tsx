"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaBars } from "react-icons/fa";
import Image from "next/image";

import { useTopbarFilters } from "../context/TopbarFiltersContext";
import { NigeriaMap, StateMap } from "./maps";

export interface TopbarProps {
  collapsed?: boolean;
  userName?: string | null;
  onLogout?: () => void;
  title?: string;
  headerHeight?: string;
  logos?: Record<string, string | React.FC<React.SVGProps<SVGSVGElement>>>;
  state?: string[];
  onToggleSidebar?: () => void; // new
  showLogout?: boolean;
  onStateChange?: (state: string) => void;
  onYearChange?: (year: number) => void;
}

const Topbar: React.FC<TopbarProps> = ({
  collapsed,
  userName,
  onLogout,
  title = "WEE Dashboard",
  headerHeight = "h-16",
  logos = {},
  state = [],
  onToggleSidebar,
  showLogout = false,
  onStateChange,
  onYearChange,
}) => {
  // const [showConfirm, setShowConfirm] = useState(false);
  const [topBarTitle, setTopBarTitle] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const {
    selectedState,
    selectedYear,
    setSelectedYear,
    setSelectedState,
    selectedZone,
    showConfirm,
    setShowConfirm,
    selectedCompareStates,
  } = useTopbarFilters();

  useEffect(() => {
    if (!selectedYear) return;
    setTopBarTitle(
      pathname === "/dashboard"
        ? `Dashboard`
        : pathname === "/dashboard/economic-participation"
          ? `Economic Participation`
          : pathname === "/dashboard/education-training"
            ? `Education and Training`
            : pathname === "/dashboard/sociocultural"
              ? `Sociocultural`
              : pathname === "/dashboard/health"
                ? `Health`
                : pathname === "/dashboard/political-empowerment"
                  ? `Political Empowerment`
                  : pathname === "/dashboard/score-card"
                    ? `NFG Scorecard`
                    : pathname === "/dashboard/legal"
                      ? `Legal Framework`
                      : pathname === "/dashboard/data"
                        ? `NGF Gender Dashboard`
                        : pathname === "/dashboard/nfwp-su"
                          ? `NFWP Support Unit`
                          : title
    );
  }, [selectedYear, pathname, title, onYearChange, selectedZone]);

  const years = Array.from({ length: 10 }, (_, i) => 2025 - i);

  const handleLogout = () => setShowConfirm(true);

  const confirmLogout = () => {
    setShowConfirm(false);
    if (onLogout) onLogout();
  };

  const cancelPrompt = () => setShowConfirm(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const StateLogo = selectedState ? logos[selectedState] : null;

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setSelectedState(parsed?.state || "");
      }
    } catch (err) {
      console.warn("Invalid session user data:", err);
      setSelectedState("");
    }
  }, [setSelectedState]);

  return (
    <div className="w-full bg-[#F5F7FA] border-b px-4 py-4">

      {/* GRID CONTAINER */}
      <div className="grid grid-cols-3 gap-4 items-center">

        {/* COLUMN 1 — Hamburger + Filters (Filters hidden on mobile) */}
        <div className="flex items-center gap-2">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-200 rounded-md"
              aria-label="Toggle Menu"
            >
              <FaBars size={24} />
            </button>
          )}
          <div className="hidden md:flex gap-3 mx-2 flex-wrap justify-start">
            {/* State */}
            <select
              value={selectedState}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedState(value);
                onStateChange?.(value);
              }}
              className="bg-[#dadcde] text-black border border-[#dadcde] text-sm px-3 py-2 rounded-full cursor-pointer"
            >
              <option value="">Filter By State</option>
              {state.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Year */}
            <select
              value={selectedYear}
              onChange={(e) => {
                const value = Number(e.target.value);
                setSelectedYear(value);
                onYearChange?.(value);
              }}
              className="bg-[#dadcde] text-black border border-[#dadcde] text-sm px-3 py-2 rounded-full cursor-pointer"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* COLUMN 2 — CENTER INFO */}
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-black font-bold text-sm md:text-xl line-clamp-1">{topBarTitle}</p>
          <p className="text-xs md:text-lg text-black italic line-clamp-1">{currentDate}</p>
        </div>

        {/* COLUMN 3 — User + Filters (Hidden on mobile) */}
        <div className="hidden md:flex flex-col items-end gap-3">
          {/* User */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-green-600 text-white text-sm px-3 py-3 rounded-full">
              <Image
                src={'/svg/globe.svg'}
                alt={selectedState}
                width={20}
                height={20}
                className="object-contain invert brightness-0 animate-pulse"
              />
              {selectedState || "select a State"}
              {selectedCompareStates.length > 0 ?
                <NigeriaMap
                  choroplethData={{
                    ...(selectedCompareStates.reduce((acc, s) => ({ ...acc, [s]: 2 }), {})),
                    [selectedState]: 2
                  }}
                  // theme={{
                  //   defaultFill: "#000000",
                  //   selectedFill: "#00a63d",
                  //   strokeColor: "#00a63d",
                  //   strokeWidth: 10,
                  // }}
                  colorScale={["#00a63d", "#8fce00", "#b6e35a"]}// default, compare, selected
                  containerStyle={{ width: "60px", height: "60px" }}
                />
                : <StateMap stateId={selectedState}
                  containerStyle={{ width: "50px", height: "50px", backgroundColor: "#d0fae5", borderRadius: "50%" }}
                  theme={{
                    defaultFill: "#00a63d",
                    strokeWidth: 2,
                  }}
                />}

            </div>

            {/* {StateLogo && (
              <div className="w-12 h-12 relative bg-gray-300 rounded-2xl my-4">
                <Image
                  src={(StateLogo as any).src ?? StateLogo}
                  alt={selectedState}
                  fill
                  className="object-contain"
                />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
