import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.2 };

const rawRows = [
  { name: "Ava", age: 21, income: 50000, city: "Lahore", purchased: "Yes" },
  { name: "Bilal", age: null, income: 62000, city: "Karachi", purchased: "No" },
  { name: "Hina", age: 22, income: null, city: "Islamabad", purchased: "Yes" },
  { name: "Omar", age: 25, income: 47000, city: "Lahore", purchased: "No" },
];

const lessonTabs = [
  { id: "missing", title: "Missing Values" },
  { id: "filter-sort", title: "Filter & Sort" },
  { id: "transform", title: "Transform" },
  { id: "features", title: "Feature Selection" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const Cell = ({
  value,
  active,
}: {
  value: string | number | null;
  active?: boolean;
}) => (
  <motion.div
    layout
    transition={transition}
    className={`rounded-lg px-3 py-2 text-sm font-mono ${
      active ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
    }`}
  >
    {value === null ? "NaN" : value}
  </motion.div>
);

const DataCleaningPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("missing");
  const [ageThreshold, setAgeThreshold] = useState(22);
  const [sortDescending, setSortDescending] = useState(true);

  const filledRows = useMemo(
    () =>
      rawRows.map((row) => ({
        ...row,
        age: row.age ?? 23,
        income: row.income ?? 53000,
      })),
    [],
  );

  const filteredSortedRows = useMemo(() => {
    const filtered = rawRows.filter((row) => (row.age ?? 0) >= ageThreshold);
    return [...filtered].sort((a, b) =>
      sortDescending
        ? (b.income ?? 0) - (a.income ?? 0)
        : (a.income ?? 0) - (b.income ?? 0),
    );
  }, [ageThreshold, sortDescending]);

  const transformedRows = useMemo(
    () =>
      filledRows.map((row) => ({
        ...row,
        income_k: Number((Number(row.income) / 1000).toFixed(1)),
        purchased_flag: row.purchased === "Yes" ? 1 : 0,
      })),
    [filledRows],
  );

  const selectedFeatures = ["age", "income", "purchased_flag"];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Data Cleaning And Preprocessing</h2>
        <p className="body-text text-sm">
          Before modeling, data usually needs cleanup and preparation. This lesson covers missing values,
          filtering and sorting, transformations, and basic feature selection.
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

      {activeTab === "missing" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`df.isnull().sum()\ndf["age"] = df["age"].fillna(23)\ndf["income"] = df["income"].fillna(53000)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Handling Missing Values</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="label-text mb-2">Before</p>
                <div className="grid gap-2">
                  {rawRows.map((row, index) => (
                    <div key={`raw-${index}`} className="grid grid-cols-2 gap-2">
                      <Cell value={row.age} />
                      <Cell value={row.income} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="label-text mb-2">After Fill</p>
                <div className="grid gap-2">
                  {filledRows.map((row, index) => (
                    <div key={`filled-${index}`} className="grid grid-cols-2 gap-2">
                      <Cell value={row.age} active />
                      <Cell value={row.income} active />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Why This Matters</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Missing values can break analysis or bias models. Common strategies are dropping rows or filling them with a meaningful value.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "filter-sort" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <label>
              <span className="label-text block mb-1">Minimum age: {ageThreshold}</span>
              <input
                type="range"
                min="20"
                max="25"
                step="1"
                value={ageThreshold}
                onChange={(e) => setAgeThreshold(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
            <div>
              <span className="label-text block mb-2">Sort income</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortDescending(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${sortDescending ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                >
                  Desc
                </button>
                <button
                  onClick={() => setSortDescending(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${!sortDescending ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
                >
                  Asc
                </button>
              </div>
            </div>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`df[df["age"] >= ${ageThreshold}].sort_values("income", ascending=${sortDescending ? "False" : "True"})`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Data Filtering And Sorting</p>
            <div className="grid gap-2">
              {filteredSortedRows.map((row, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  <Cell value={row.name} active />
                  <Cell value={row.age} active />
                  <Cell value={row.income} active />
                  <Cell value={row.city} active />
                </div>
              ))}
            </div>

            {filteredSortedRows.length === 0 && (
              <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow text-sm text-muted-foreground">
                No rows match the current filter.
              </div>
            )}

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Use Case</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Filtering narrows the dataset to relevant records. Sorting helps you inspect highest, lowest, earliest, or latest values quickly.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "transform" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`df["income_k"] = df["income"] / 1000\ndf["purchased_flag"] = (df["purchased"] == "Yes").astype(int)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Data Transformation</p>
            <div className="grid gap-2">
              {transformedRows.map((row, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  <Cell value={row.name} />
                  <Cell value={row.income_k} active />
                  <Cell value={row.purchased} />
                  <Cell value={row.purchased_flag} active />
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Why Transform</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Transformations convert raw values into more useful forms, such as scaling numbers or turning categories into numeric flags.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "features" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`X = df[["age", "income", "purchased_flag"]]\ny = df["purchased_flag"]`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Feature Selection Basics</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Selected Features</p>
                <div className="space-y-2">
                  {selectedFeatures.map((feature) => (
                    <div key={feature} className="rounded-lg bg-primary px-3 py-2 text-sm font-mono text-primary-foreground">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Goal</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Keep columns that are useful for prediction and drop columns that are irrelevant, noisy, or duplicated.
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Practical Rule</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Basic feature selection starts with domain sense: choose columns likely to influence the target and remove identifiers or weak signals.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataCleaningPlayground;
