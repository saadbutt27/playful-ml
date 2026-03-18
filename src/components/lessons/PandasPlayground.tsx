import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.2 };

const rows = [
  { name: "Ava", age: 21, score: 92, city: "Lahore" },
  { name: "Bilal", age: 24, score: 85, city: "Karachi" },
  { name: "Hina", age: 22, score: 96, city: "Islamabad" },
  { name: "Omar", age: 23, score: 78, city: "Lahore" },
];

const lessonTabs = [
  { id: "intro", title: "Intro" },
  { id: "series", title: "Series" },
  { id: "dataframe", title: "DataFrame" },
  { id: "csv", title: "Read CSV" },
  { id: "columns", title: "Columns" },
  { id: "selection", title: "Selection" },
  { id: "filtering", title: "Filtering" },
  { id: "exploration", title: "Explore" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];
type ColumnKey = keyof (typeof rows)[number];

const DataCell = ({
  value,
  active,
}: {
  value: string | number;
  active?: boolean;
}) => (
  <motion.div
    layout
    transition={transition}
    className={`rounded-lg px-3 py-2 text-sm font-mono ${
      active ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
    }`}
  >
    {value}
  </motion.div>
);

const PandasPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("intro");
  const [selectedColumn, setSelectedColumn] = useState<ColumnKey>("score");
  const [selectedRow, setSelectedRow] = useState(1);
  const [scoreThreshold, setScoreThreshold] = useState(85);

  const selectedColumnValues = useMemo(() => rows.map((row) => row[selectedColumn]), [selectedColumn]);
  const filteredRows = useMemo(() => rows.filter((row) => row.score >= scoreThreshold), [scoreThreshold]);
  const averageScore = useMemo(
    () => rows.reduce((acc, row) => acc + row.score, 0) / rows.length,
    [],
  );
  const maxScore = useMemo(() => Math.max(...rows.map((row) => row.score)), []);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Pandas</h2>
        <p className="body-text text-sm">
          Pandas is Python's main library for working with labeled tabular data. Learn the basics:
          Series, DataFrames, reading CSV files, selection, filtering, and quick data exploration.
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
            <pre className="text-foreground whitespace-pre-wrap">{`import pandas as pd\n\n# Pandas works with labeled data\n# Main objects: Series and DataFrame`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">What Pandas Is For</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Series</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A one-dimensional labeled column of data.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">DataFrame</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A two-dimensional table made of rows and columns.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Typical Uses</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  CSV files, spreadsheets, feature tables, and data cleaning.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Why It Matters</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Pandas helps you inspect, transform, and prepare real datasets before analysis or machine learning.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "series" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`scores = pd.Series([92, 85, 96, 78], name="score")\nprint(scores)\nprint(scores.mean())`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Series Example</p>
            <div className="grid gap-2 max-w-sm">
              {rows.map((row, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr] gap-2">
                  <div className="rounded-lg bg-secondary px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {index}
                  </div>
                  <DataCell value={row.score} active />
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Series Idea</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A Series is like one named column from a table, with an index on the left and values on the right.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "dataframe" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`import pandas as pd\n\ndf = pd.DataFrame({\n  "name": ["Ava", "Bilal", "Hina", "Omar"],\n  "age": [21, 24, 22, 23],\n  "score": [92, 85, 96, 78]\n})`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">DataFrame Layout</p>
            <div className="grid gap-2">
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(rows[0]).map((key) => (
                  <div key={key} className="rounded-lg bg-secondary px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {key}
                  </div>
                ))}
              </div>
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-4 gap-2">
                  {Object.values(row).map((value, colIndex) => (
                    <DataCell key={`${rowIndex}-${colIndex}`} value={value} />
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What To Notice</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A DataFrame is a table with labeled columns and indexed rows. It is ideal for datasets, CSV files, and feature tables.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "csv" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`import pandas as pd\n\ndf = pd.read_csv("students.csv")\nprint(df.head())`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Reading A Dataset</p>
            <div className="p-4 bg-card rounded-xl interactive-shadow mb-4">
              <p className="label-text mb-2">CSV File</p>
              <p className="font-mono text-sm text-foreground">students.csv</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                CSV stands for comma-separated values. Pandas can load it directly into a DataFrame with one line.
              </p>
            </div>

            <div className="grid gap-2">
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(rows[0]).map((key) => (
                  <div key={key} className="rounded-lg bg-secondary px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {key}
                  </div>
                ))}
              </div>
              {rows.slice(0, 3).map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-4 gap-2">
                  {Object.values(row).map((value, colIndex) => (
                    <DataCell key={`${rowIndex}-${colIndex}`} value={value} />
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Common Pattern</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A common workflow is: read the CSV, inspect the first rows, then clean or analyze the data.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "columns" && (
        <>
          <div className="mb-4">
            <span className="label-text block mb-2">Choose a column</span>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(rows[0]) as ColumnKey[]).map((column) => (
                <button
                  key={column}
                  onClick={() => setSelectedColumn(column)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-smooth ${
                    column === selectedColumn
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {column}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`df["${selectedColumn}"]\n# ${JSON.stringify(selectedColumnValues)}`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Column View</p>
            <div className="grid gap-2 max-w-sm">
              {selectedColumnValues.map((value, index) => (
                <DataCell key={`${selectedColumn}-${index}`} value={value} active />
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Column Access</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Selecting a column gives you one labeled series of values from the table.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "selection" && (
        <>
          <div className="mb-4">
            <span className="label-text block mb-1">Row index: {selectedRow}</span>
            <input
              type="range"
              min="0"
              max={rows.length - 1}
              step="1"
              value={selectedRow}
              onChange={(e) => setSelectedRow(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`df.iloc[${selectedRow}]      # row by position\ndf.loc[${selectedRow}]       # row by label in this simple example\ndf.iloc[${selectedRow}, 2]   # ${rows[selectedRow].score}`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Selected Row</p>
            <div className="grid gap-2">
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(rows[0]).map((key) => (
                  <div key={key} className="rounded-lg bg-secondary px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {key}
                  </div>
                ))}
              </div>
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-4 gap-2">
                  {Object.values(row).map((value, colIndex) => (
                    <DataCell key={`${rowIndex}-${colIndex}`} value={value} active={rowIndex === selectedRow} />
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Selection Rule</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use <span className="font-mono text-foreground">iloc</span> for position-based selection and
                <span className="font-mono text-foreground"> loc</span> for label-based selection.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "filtering" && (
        <>
          <div className="mb-4">
            <span className="label-text block mb-1">Keep scores greater than or equal to: {scoreThreshold}</span>
            <input
              type="range"
              min="70"
              max="100"
              step="1"
              value={scoreThreshold}
              onChange={(e) => setScoreThreshold(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`df[df["score"] >= ${scoreThreshold}]`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Filtered Rows</p>
            <div className="grid gap-2">
              <div className="grid grid-cols-4 gap-2">
                {Object.keys(rows[0]).map((key) => (
                  <div key={key} className="rounded-lg bg-secondary px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {key}
                  </div>
                ))}
              </div>
              {filteredRows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-4 gap-2">
                  {Object.values(row).map((value, colIndex) => (
                    <DataCell key={`${rowIndex}-${colIndex}`} value={value} active />
                  ))}
                </div>
              ))}
            </div>

            {filteredRows.length === 0 && (
              <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow text-sm text-muted-foreground">
                No rows match this filter.
              </div>
            )}

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Filtering Idea</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Boolean filtering keeps only the rows that satisfy a condition.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "exploration" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`df.head()\ndf.info()\ndf.describe()\ndf["score"].mean()   # ${averageScore.toFixed(2)}`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Basic Data Exploration</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">head()</p>
                <p className="text-sm text-muted-foreground">Shows the first few rows so you can quickly inspect the dataset.</p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">info()</p>
                <p className="text-sm text-muted-foreground">Shows column names, row count, and data types.</p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">describe()</p>
                <p className="text-sm text-muted-foreground">Summarizes numeric columns with count, mean, min, max, and more.</p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Mean Score</p>
                <p className="font-mono text-sm text-foreground">{averageScore.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Max Score</p>
                <p className="font-mono text-sm text-foreground">{maxScore}</p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Rows</p>
                <p className="font-mono text-sm text-foreground">{rows.length}</p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Columns</p>
                <p className="font-mono text-sm text-foreground">{Object.keys(rows[0]).length}</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Exploration Workflow</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A practical first pass is: load the dataset, run <span className="font-mono text-foreground">head()</span>,
                check <span className="font-mono text-foreground">info()</span>, and then use
                <span className="font-mono text-foreground"> describe()</span> or column summaries to understand the data.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PandasPlayground;
