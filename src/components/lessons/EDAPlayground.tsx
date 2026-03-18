import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.2 };

const salesData = [
  { month: "Jan", revenue: 42, customers: 120, rating: 3.8 },
  { month: "Feb", revenue: 48, customers: 132, rating: 4.0 },
  { month: "Mar", revenue: 55, customers: 148, rating: 4.1 },
  { month: "Apr", revenue: 61, customers: 160, rating: 4.3 },
  { month: "May", revenue: 67, customers: 176, rating: 4.4 },
  { month: "Jun", revenue: 72, customers: 189, rating: 4.6 },
];

const revenueValues = salesData.map((item) => item.revenue);
const customerValues = salesData.map((item) => item.customers);

const lessonTabs = [
  { id: "summary", title: "Summary Stats" },
  { id: "distribution", title: "Distribution" },
  { id: "patterns", title: "Patterns" },
  { id: "correlation", title: "Correlation" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const W = 460;
const H = 240;
const PAD = 28;

const meanRevenue = revenueValues.reduce((acc, value) => acc + value, 0) / revenueValues.length;
const minRevenue = Math.min(...revenueValues);
const maxRevenue = Math.max(...revenueValues);

const histogramBins = [
  { label: "40-49", count: revenueValues.filter((value) => value >= 40 && value < 50).length },
  { label: "50-59", count: revenueValues.filter((value) => value >= 50 && value < 60).length },
  { label: "60-69", count: revenueValues.filter((value) => value >= 60 && value < 70).length },
  { label: "70-79", count: revenueValues.filter((value) => value >= 70 && value < 80).length },
];

const histogramMax = Math.max(...histogramBins.map((bin) => bin.count));

const EDAPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("summary");

  const linePath = useMemo(() => {
    return salesData
      .map((point, index) => {
        const x = PAD + (index / (salesData.length - 1)) * (W - 2 * PAD);
        const y = H - PAD - ((point.revenue - minRevenue) / (maxRevenue - minRevenue)) * (H - 2 * PAD);
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }, []);

  const correlationTrend = useMemo(() => {
    return salesData.map((point, index) => {
      const x = PAD + ((point.customers - Math.min(...customerValues)) / (Math.max(...customerValues) - Math.min(...customerValues))) * (W - 2 * PAD);
      const y = H - PAD - ((point.revenue - minRevenue) / (maxRevenue - minRevenue)) * (H - 2 * PAD);
      return { x, y, label: salesData[index].month };
    });
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Exploratory Data Analysis</h2>
        <p className="body-text text-sm">
          EDA is the first structured look at a dataset. Use it to summarize data, inspect distributions,
          spot patterns, and check relationships before modeling.
        </p>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {lessonTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-smooth ${
              tab.id === activeTab
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {activeTab === "summary" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`df["revenue"].mean()   # ${meanRevenue.toFixed(2)}\ndf["revenue"].min()    # ${minRevenue}\ndf["revenue"].max()    # ${maxRevenue}\ndf.describe()`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Summary Statistics</p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Mean Revenue</p>
                <p className="font-mono text-sm text-foreground">{meanRevenue.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Minimum</p>
                <p className="font-mono text-sm text-foreground">{minRevenue}</p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Maximum</p>
                <p className="font-mono text-sm text-foreground">{maxRevenue}</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What Summary Stats Do</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Summary statistics give you a fast numeric overview of central tendency and spread before deeper analysis.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "distribution" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`plt.hist(df["revenue"])\n# Check where values cluster\n# Look for spread, skew, or unusual gaps`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Data Distribution Analysis</p>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[240px]">
              <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="hsl(215 16% 75%)" strokeWidth={1} />
              {histogramBins.map((bin, index) => {
                const barWidth = 72;
                const gap = 18;
                const x = PAD + 20 + index * (barWidth + gap);
                const height = (bin.count / histogramMax) * (H - 2 * PAD);
                const y = H - PAD - height;
                return (
                  <g key={bin.label}>
                    <rect x={x} y={y} width={barWidth} height={height} rx={6} fill="hsl(142 71% 45%)" />
                    <text x={x + barWidth / 2} y={H - 10} textAnchor="middle" className="text-[10px] fill-muted-foreground">{bin.label}</text>
                    <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="text-[10px] fill-foreground">{bin.count}</text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What To Look For</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Distribution analysis helps you see clustering, spread, skew, and whether values are concentrated or widely dispersed.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "patterns" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`# Look for changes over time\nplt.plot(df["month"], df["revenue"])\n# Ask: Is there an upward or downward trend?`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Identifying Patterns In Data</p>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[240px]">
              <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="hsl(215 16% 75%)" strokeWidth={1} />
              <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="hsl(215 16% 75%)" strokeWidth={1} />
              <path d={linePath} fill="none" stroke="hsl(221 83% 53%)" strokeWidth={3} />
              {salesData.map((point, index) => {
                const x = PAD + (index / (salesData.length - 1)) * (W - 2 * PAD);
                const y = H - PAD - ((point.revenue - minRevenue) / (maxRevenue - minRevenue)) * (H - 2 * PAD);
                return (
                  <g key={point.month}>
                    <circle cx={x} cy={y} r={5} fill="hsl(221 83% 53%)" stroke="white" strokeWidth={1.5} />
                    <text x={x} y={H - 10} textAnchor="middle" className="text-[10px] fill-muted-foreground">{point.month}</text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Pattern Insight</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This dataset shows a consistent upward pattern in revenue over time, which may suggest improving demand or execution.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "correlation" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`df[["customers", "revenue"]].corr()\n# Check whether higher customer counts move with higher revenue`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Correlation Analysis</p>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[240px]">
              <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="hsl(215 16% 75%)" strokeWidth={1} />
              <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="hsl(215 16% 75%)" strokeWidth={1} />
              {correlationTrend.map((point) => (
                <g key={point.label}>
                  <circle cx={point.x} cy={point.y} r={6} fill="hsl(221 83% 53%)" />
                  <text x={point.x + 8} y={point.y - 8} className="text-[10px] fill-muted-foreground">{point.label}</text>
                </g>
              ))}
            </svg>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Correlation Insight</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Here, higher customer counts tend to come with higher revenue, which suggests a positive relationship between the two variables.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EDAPlayground;
