"use client";

import { useMemo } from "react";
import nigeriaWards from "@/app/lib/data/geojson/nigeria-wards.json";
import BaseMap from "./BaseMap";
import type { BaseMapWithThemeProps, RegionFeatureCollection, RegionProperties } from "./types";
import { filterByParentId } from "../../lib/maps/geojson";

type WardMapProps = Omit<BaseMapWithThemeProps, "data" | "onRegionClick" | "onRegionHover"> & {
  lgaId?: string;
  onWardClick?: (wardId: string, properties: RegionProperties) => void;
  onWardHover?: (wardId: string, properties: RegionProperties) => void;
  onRegionClick?: BaseMapWithThemeProps["onRegionClick"];
  onRegionHover?: BaseMapWithThemeProps["onRegionHover"];
};

export function WardMap({
  lgaId,
  onWardClick,
  onWardHover,
  onRegionClick,
  onRegionHover,
  ...rest
}: WardMapProps) {
  const filteredData = useMemo(() => {
    const allWards = nigeriaWards as RegionFeatureCollection;
    return filterByParentId(allWards, lgaId);
  }, [lgaId]);

  return (
    <BaseMap
      data={filteredData as RegionFeatureCollection}
      ariaLabel="Map of wards"
      onRegionClick={(id, properties) => {
        onRegionClick?.(id, properties);
        onWardClick?.(id, properties);
      }}
      onRegionHover={(id, properties) => {
        onRegionHover?.(id, properties);
        onWardHover?.(id, properties);
      }}
      {...rest}
    />
  );
}

export default WardMap;
