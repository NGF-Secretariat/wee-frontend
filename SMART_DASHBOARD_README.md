# Smart Visualization Dashboard - Economic Participation

## Overview

A comprehensive Next.js dashboard that intelligently renders economic participation indicators using the most appropriate visualization type for each metric.

## Architecture

### Core Components

#### 1. **Indicator Metadata System** (`lib/indicator-config.ts`)
Defines all 23+ economic participation indicators with metadata:
- ID and label
- Category (labour, agriculture, entrepreneurship, finance)
- Type (female, male, gap, mixed)
- Preferred visualization (map, bar, pie, line, kpi)
- Description and help text
- Unit of measurement
- Data source

**Key Features:**
- Get all indicators or filter by category
- Type-safe TypeScript interfaces
- Extensible for new indicators

#### 2. **SmartChart Component** (`components/SmartChart.tsx`)
Main visualization engine that automatically selects the best chart type:

- **Bar Chart**: For comparisons (gender gaps, state-level variations)
- **Pie Chart**: For distributions (employment sectors, proportion data)
- **Line Chart**: For time-series data (trends over years)
- **KPI Card**: For single key metrics (national averages)
- **Map**: For geographic data (uses existing NigeriaMap/StateMap/LGAMap)

**Features:**
- Automatic chart type selection based on indicator
- Responsive sizing
- Interactive tooltips
- Color-coded visualizations
- Built-in help text

#### 3. **Indicator Selector** (`components/IndicatorSelector.tsx`)
Dropdown component for selecting indicators:
- Search functionality
- Category filtering
- Visual indicator previews
- Selected indicator details display

#### 4. **Insights Panel** (`components/InsightsPanel.tsx`)
Displays key statistics about selected indicator:
- National average
- Top performing state
- Bottom performing state
- Gender comparison cards
- Trend analysis

#### 5. **KPI Card Component** (`components/KPICard.tsx`)
Reusable card for displaying single metrics:
- Large value display
- Optional trend indicators
- Custom colors
- Grid layout support

### Data Layer

#### Mock Data (`lib/mock-data.ts`)
Realistic Nigerian data structure:
```typescript
- NATIONAL_DATA: National-level aggregates
- STATE_DATA: 11+ states with 15+ metrics each
- LGA_DATA: Local government area breakdowns
- EMPLOYMENT_SECTOR_DISTRIBUTION: Sector distribution data
- GENDER_COMPARISON_DATA: Gender comparison overview
- TIME_SERIES_DATA: Historical trends
```

#### Data Utilities (`lib/data-utils.ts`)
Helper functions:
```typescript
- transformForBarChart()      // Prepare data for bar charts
- transformForGenderComparison()  // Gender comparison formatting
- transformForPieChart()      // Distribution data formatting
- calculateNationalAverage()  // Aggregate statistics
- getTopPerformers()         // Ranking analysis
- generateInsights()         // Create insight cards
- formatValue()              // Format output with units
```

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 Economic Participation Dashboard                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📈 National Overview (KPI Grid)                             │
│ [Female Labour] [Male Labour] [Business] [Banking]          │
└─────────────────────────────────────────────────────────────┘

┌─────────────┬──────────────────────────┬──────────────────┐
│ LEFT PANEL  │   CENTER PANEL           │  RIGHT PANEL     │
│             │                          │                  │
│ 🎯 Select   │  SmartChart              │ 📊 Key Insights  │
│ Indicator   │  (Dynamic Viz)           │                  │
│             │                          │ - National Avg   │
│ 🗺️ Drill-   │  • Bar Chart             │ - Top State      │
│ Down Levels │  • Pie Chart             │ - Bottom State   │
│             │  • Line Chart            │                  │
│             │  • KPI Card              │ ⚖️ Gender Gap    │
│             │  • Map                   │                  │
└─────────────┴──────────────────────────┴──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ⚖️ Gender Comparison Overview                               │
│ [Labour] [Agriculture] [Business] [Banking] [Vocational]    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 💼 Employment Distribution by Sector                        │
│ [Female Distribution Pie] [Male Distribution Pie]           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ 📊 Key Gender Gaps (Comparison Cards)                       │
│ [Labour Gap] [Business Gap] [Banking Gap] [Income Gap]      │
└─────────────────────────────────────────────────────────────┘
```

## Indicators Included

### Labour Force (4 indicators)
- Female Labour Force Participation Rate
- Male Labour Force Participation Rate
- Gender Gap in Labour Participation
- Female Average Monthly Income

### Agriculture (2 indicators)
- Female Agricultural Employment
- Male Agricultural Employment

### Entrepreneurship (3 indicators)
- Female Business Ownership Rate
- Male Business Ownership Rate
- Gender Gap in Entrepreneurship

### Finance (3 indicators)
- Female Bank Account Access
- Male Bank Account Access
- Gender Gap in Financial Inclusion

### Employment & Distribution (3 indicators)
- Female Employment by Sector (pie distribution)
- Male Employment by Sector (pie distribution)
- Vocational Training Access

### Leadership & Management (1 indicator)
- Female in Decision-Making Roles

## Usage

### Basic Usage
```tsx
import { SmartChart } from '@/app/components/SmartChart';
import { getIndicatorById } from '@/app/lib/indicator-config';
import { STATE_DATA } from '@/app/lib/mock-data';

const indicator = getIndicatorById('female_labour_force_participation');
const data = STATE_DATA.map(state => ({
  state: state.state,
  value: state.female_lfpr
}));

<SmartChart 
  indicator={indicator}
  data={data}
  height={400}
/>
```

### Selecting an Indicator
```tsx
import { IndicatorSelector } from '@/app/components/IndicatorSelector';

<IndicatorSelector
  onSelect={(indicator) => setSelectedIndicator(indicator)}
  selectedIndicator={selectedIndicator}
/>
```

### Displaying Insights
```tsx
import { InsightsPanel } from '@/app/components/InsightsPanel';

<InsightsPanel 
  indicator={selectedIndicator}
  data={STATE_DATA}
/>
```

### KPI Display
```tsx
import { KPICard, KPIGrid } from '@/app/components/KPICard';

<KPIGrid 
  cards={[
    {
      label: 'Female Labour Participation',
      value: 42.5,
      unit: '%',
      color: 'bg-gradient-to-br from-pink-50 to-rose-100'
    }
  ]}
  columns={4}
/>
```

## Customization

### Adding New Indicators
1. Add to `ECONOMIC_PARTICIPATION_INDICATORS` in `indicator-config.ts`
2. Decide on `preferredChart` type
3. Add mock data to `mock-data.ts`
4. Update data utilities if needed

### Changing Visualization Colors
Edit `COLORS` array in:
- `SmartChart.tsx` - chart colors
- `PieChartUi.tsx` - original pie colors
- `CustomBarChart.tsx` - bar colors

### Modifying Dashboard Layout
Edit `economic-participation/page.tsx`:
- Adjust grid columns: `grid-cols-1 lg:grid-cols-4`
- Change section order
- Add/remove comparison cards

## Performance Optimizations

✅ **Implemented:**
- `use client` for interactive components
- `useMemo` for expensive calculations
- Dynamic chart component loading
- Responsive container sizing

**Future:**
- Lazy load heavy charts on scroll
- Virtual scrolling for large datasets
- Component-level code splitting

## Data Flow

```
┌──────────────────┐
│ User Interaction │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ Select Indicator     │
│ (IndicatorSelector)  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Fetch Indicator      │
│ (getIndicatorById)   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Prepare Data         │
│ (data-utils)         │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ SmartChart           │
│ (Select vis type)    │
└────────┬─────────────┘
         │
    ┌────┴────┬──────┬──────┬─────┐
    ▼         ▼      ▼      ▼     ▼
  [Bar]    [Pie]  [Line] [KPI] [Map]
```

## Integration with Existing Maps

Current placeholder for map integration. To enable:

1. Import existing map components:
```tsx
import NigeriaMap from '@/app/components/Mapp';
import StateMap from '@/app/components/MapView';
```

2. Replace placeholder in `MapVisualization` component:
```tsx
<NigeriaMap
  choroplethData={transformToGeoJSONData(data, indicator.dataKey)}
  onStateClick={(state) => handleDrillDown(state)}
/>
```

3. Add choropleth color scale based on indicator values

## Dependencies

- **Next.js 16+** - App Router, Server Components
- **React 19+** - Hooks, Concurrent features
- **Recharts 3.6+** - Chart components
- **React Leaflet 5+** - Map integration
- **Tailwind CSS 4** - Styling
- **TypeScript 5** - Type safety

## Testing Checklist

- [ ] All 23+ indicators render correctly
- [ ] Chart types auto-select properly
- [ ] Indicator selector search/filter works
- [ ] Insights calculate correctly
- [ ] Gender comparison displays accurately
- [ ] KPI grid is responsive
- [ ] Mobile layout (1 column) works
- [ ] Hover tooltips show values
- [ ] Colors are accessible (WCAG AA)

## Future Enhancements

1. **Map Integration**
   - Full NigeriaMap/StateMap/LGAMap integration
   - Choropleth coloring by value ranges
   - Click drill-down to states

2. **Time Series**
   - Line chart for historical trends
   - Year selector for comparison
   - Annual growth rate calculations

3. **Filtering & Export**
   - Filter by date range, state, category
   - Export as CSV/PDF reports
   - Print-friendly layouts

4. **Advanced Analytics**
   - Correlation analysis
   - Predictive trends
   - Benchmarking against national/regional targets

5. **Real Data Integration**
   - Connect to real API endpoints
   - Dynamic data refresh
   - Real-time updates

6. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - High contrast mode
   - Alternative text descriptions

## File Structure

```
app/
├── dashboard/
│   └── economic-participation/
│       └── page.tsx          # Main dashboard page
├── components/
│   ├── SmartChart.tsx        # Chart selection engine
│   ├── IndicatorSelector.tsx # Indicator dropdown
│   ├── InsightsPanel.tsx     # Statistics & insights
│   ├── KPICard.tsx           # KPI display component
│   ├── Mapp.tsx              # Existing map component
│   └── ...other components
├── lib/
│   ├── indicator-config.ts   # Indicator metadata
│   ├── mock-data.ts          # Sample data
│   └── data-utils.ts         # Data transformation
└── ...other app files
```

## Documentation & Support

- **Add new indicator**: Update `indicator-config.ts` + `mock-data.ts`
- **Modify chart appearance**: Edit `SmartChart.tsx` component
- **Change colors**: Update `COLORS` array in visualization components
- **Add filter logic**: Extend `IndicatorSelector.tsx`

## License & Attribution

Built for the NGF Wee-frontend project.
Data source: Mock data based on realistic Nigerian economic indicators.
