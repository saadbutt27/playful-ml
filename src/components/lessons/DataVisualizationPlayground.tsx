import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.2 };

const lineData = [
  { month: "Jan", value: 20 },
  { month: "Feb", value: 28 },
  { month: "Mar", value: 35 },
  { month: "Apr", value: 40 },
  { month: "May", value: 52 },
];

const barData = [
  { team: "Sales", value: 84 },
  { team: "Marketing", value: 67 },
  { team: "Ops", value: 53 },
  { team: "Support", value: 72 },
];

const histogramData = [42, 44, 48, 52, 55, 58, 61, 63, 65, 67, 69, 72];

const lessonTabs = [
  { id: "intro", title: "Matplotlib" },
  { id: "line", title: "Line Charts" },
  { id: "bar", title: "Bar Charts" },
  { id: "histogram", title: "Histograms" },
  { id: "business", title: "Business Insights" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const W = 460;
const H = 240;
const PAD = 28;

const DataVisualizationPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("intro");

  const maxLine = Math.max(...lineData.map((item) => item.value));
  const maxBar = Math.max(...barData.map((item) => item.value));
  const minHist = Math.min(...histogramData);
  const maxHist = Math.max(...histogramData);

  const histogramBins = useMemo(() => {
    const bins = [
      { label: "40-49", count: 0 },
      { label: "50-59", count: 0 },
      { label: "60-69", count: 0 },
      { label: "70-79", count: 0 },
    ];

    histogramData.forEach((value) => {
      if (value < 50) bins[0].count++;
      else if (value < 60) bins[1].count++;
      else if (value < 70) bins[2].count++;
      else bins[3].count++;
    });

    return bins;
  }, []);

  const histogramMax = Math.max(...histogramBins.map((bin) => bin.count));

  const linePath = useMemo(() => {
    return lineData
      .map((point, index) => {
        const x = PAD + (index / (lineData.length - 1)) * (W - 2 * PAD);
        const y = H - PAD - (point.value / maxLine) * (H - 2 * PAD);
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }, [maxLine]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Data Visualization</h2>
        <p className="body-text text-sm">
          Learn how charts help explain data. This lesson introduces Matplotlib, common chart types,
          and how visualizations support business insights.
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

      {activeTab === "intro" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`import matplotlib.pyplot as plt\n\nplt.plot(x, y)\nplt.title("Monthly Revenue")\nplt.xlabel("Month")\nplt.ylabel("Revenue")\nplt.show()`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Introduction To Matplotlib</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">What It Is</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Matplotlib is Python's foundational plotting library for creating charts and visual reports.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Typical Flow</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Choose a chart type, pass data, label the axes, add a title, and render the figure.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Common Use Cases</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Trend analysis, category comparisons, distribution checks, and quick EDA.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Why Visualize</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Charts help people notice patterns faster than raw tables.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "line" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`months = ["Jan", "Feb", "Mar", "Apr", "May"]\nrevenue = [20, 28, 35, 40, 52]\nplt.plot(months, revenue)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Line Chart</p>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[240px]">
              <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="hsl(215 16% 75%)" strokeWidth={1} />
              <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="hsl(215 16% 75%)" strokeWidth={1} />
              <path d={linePath} fill="none" stroke="hsl(221 83% 53%)" strokeWidth={3} />
              {lineData.map((point, index) => {
                const x = PAD + (index / (lineData.length - 1)) * (W - 2 * PAD);
                const y = H - PAD - (point.value / maxLine) * (H - 2 * PAD);
                return (
                  <g key={point.month}>
                    <circle cx={x} cy={y} r={5} fill="hsl(221 83% 53%)" stroke="white" strokeWidth={1.5} />
                    <text x={x} y={H - 10} textAnchor="middle" className="text-[10px] fill-muted-foreground">{point.month}</text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">When To Use</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use line charts to show change over time, such as revenue, traffic, demand, or conversions by month.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "bar" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`teams = ["Sales", "Marketing", "Ops", "Support"]\nperformance = [84, 67, 53, 72]\nplt.bar(teams, performance)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Bar Chart</p>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[240px]">
              <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="hsl(215 16% 75%)" strokeWidth={1} />
              {barData.map((item, index) => {
                const barWidth = 60;
                const gap = 28;
                const x = PAD + 26 + index * (barWidth + gap);
                const height = (item.value / maxBar) * (H - 2 * PAD);
                const y = H - PAD - height;
                return (
                  <g key={item.team}>
                    <rect x={x} y={y} width={barWidth} height={height} rx={8} fill="hsl(221 83% 53%)" />
                    <text x={x + barWidth / 2} y={H - 10} textAnchor="middle" className="text-[10px] fill-muted-foreground">{item.team}</text>
                    <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="text-[10px] fill-foreground">{item.value}</text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">When To Use</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use bar charts to compare categories directly, such as departments, products, regions, or campaigns.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "histogram" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`scores = [42, 44, 48, 52, 55, 58, 61, 63, 65, 67, 69, 72]\nplt.hist(scores, bins=4)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Histogram</p>
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
              <p className="label-text mb-2">When To Use</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Histograms show distribution. They help answer questions like "where do most values cluster?" and "is the data spread out or tight?"
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "business" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`# Example business questions\n# Which team is underperforming?\n# Is revenue trending upward?\n# How are customer scores distributed?`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Data Visualization For Business Insights</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Line Chart Insight</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Revenue is trending upward over time, which suggests sustained growth rather than a one-time spike.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Bar Chart Insight</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Operations is the weakest-performing team here, so it may need process or staffing attention.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Histogram Insight</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Most scores sit in the middle-to-upper range, with fewer values at the low end.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Decision Support</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Good visualization helps teams spot trends, compare groups, and make faster business decisions.
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Practical Rule</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose the chart based on the question: trend over time, category comparison, or value distribution.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataVisualizationPlayground;
