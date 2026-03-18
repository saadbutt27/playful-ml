import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.2 };

const vector = [2, 4, 6, 8];
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
];

const lessonTabs = [
  { id: "arrays", title: "Arrays" },
  { id: "attributes", title: "Attributes" },
  { id: "indexing", title: "Indexing" },
  { id: "slicing", title: "Slicing" },
  { id: "math", title: "Math Ops" },
  { id: "statistics", title: "Statistics" },
  { id: "vectorized", title: "Vectorized Ops" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const ArrayCell = ({
  value,
  label,
  active,
}: {
  value: number;
  label?: string;
  active?: boolean;
}) => (
  <motion.div
    layout
    transition={transition}
    className={`min-w-[72px] rounded-lg p-3 text-center interactive-shadow ${
      active ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
    }`}
  >
    {label && (
      <div className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
        {label}
      </div>
    )}
    <div className="font-mono text-sm mt-1">{value}</div>
  </motion.div>
);

const NumpyPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("arrays");
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [rowIndex, setRowIndex] = useState(1);
  const [colIndex, setColIndex] = useState(2);
  const [sliceStart, setSliceStart] = useState(1);
  const [sliceEnd, setSliceEnd] = useState(3);
  const [activeMathOp, setActiveMathOp] = useState<"add" | "subtract" | "multiply" | "square">("add");
  const [activeStat, setActiveStat] = useState<"sum" | "mean" | "max" | "min" | "std">("sum");
  const [multiplier, setMultiplier] = useState(2);

  const scaledVector = useMemo(() => vector.map((value) => value * multiplier), [multiplier]);
  const selectedValue = vector[selectedIndex];
  const selectedMatrixValue = matrix[rowIndex][colIndex];
  const slicedVector = useMemo(() => vector.slice(sliceStart, sliceEnd), [sliceEnd, sliceStart]);
  const mathResult = useMemo(() => {
    switch (activeMathOp) {
      case "add":
        return vector.map((value) => value + 2);
      case "subtract":
        return vector.map((value) => value - 1);
      case "multiply":
        return vector.map((value) => value * 3);
      case "square":
        return vector.map((value) => value ** 2);
    }
  }, [activeMathOp]);
  const statResult = useMemo(() => {
    switch (activeStat) {
      case "sum":
        return vector.reduce((acc, value) => acc + value, 0);
      case "mean":
        return vector.reduce((acc, value) => acc + value, 0) / vector.length;
      case "max":
        return Math.max(...vector);
      case "min":
        return Math.min(...vector);
      case "std": {
        const mean = vector.reduce((acc, value) => acc + value, 0) / vector.length;
        const variance = vector.reduce((acc, value) => acc + (value - mean) ** 2, 0) / vector.length;
        return Math.sqrt(variance);
      }
    }
  }, [activeStat]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">NumPy</h2>
        <p className="body-text text-sm">
          NumPy is the core Python library for numerical computing. Learn how arrays work,
          how shapes describe dimensions, and why vectorized operations are powerful.
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

      {activeTab === "arrays" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`import numpy as np\narr = np.array([2, 4, 6, 8])\nmat = np.array([[1, 2, 3],\n                [4, 5, 6]])`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">1D And 2D Arrays</p>
            <div className="flex gap-3 flex-wrap mb-5">
              {vector.map((value, index) => (
                <ArrayCell key={`arr-${index}`} value={value} label={`arr[${index}]`} />
              ))}
            </div>

            <div className="grid gap-3 max-w-fit">
              {matrix.map((row, rowIdx) => (
                <div key={`row-${rowIdx}`} className="flex gap-3">
                  {row.map((value, colIdx) => (
                    <ArrayCell key={`cell-${rowIdx}-${colIdx}`} value={value} label={`[${rowIdx},${colIdx}]`} />
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What To Notice</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                NumPy arrays store numeric data in a structured form. They are designed for fast math and multidimensional data.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "attributes" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`arr.shape   # (4,)\narr.ndim    # 1\narr.size    # 4\narr.dtype   # int64\nmat.shape   # (2, 3)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Array Attributes</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">shape</p>
                <p className="font-mono text-sm text-foreground mb-2">shape = (4,)</p>
                <p className="text-sm text-muted-foreground">Tells you the size of each dimension.</p>
              </div>

              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">ndim</p>
                <p className="font-mono text-sm text-foreground mb-2">ndim = 1</p>
                <p className="text-sm text-muted-foreground">How many dimensions the array has.</p>
              </div>

              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">size</p>
                <p className="font-mono text-sm text-foreground mb-2">size = 4</p>
                <p className="text-sm text-muted-foreground">Total number of elements in the array.</p>
              </div>

              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">dtype</p>
                <p className="font-mono text-sm text-foreground mb-2">dtype = int64</p>
                <p className="text-sm text-muted-foreground">The type of data stored in the array.</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Why Attributes Matter</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Array attributes help you inspect structure quickly before doing math, reshaping data, or feeding arrays into ML models.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "indexing" && (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <label>
              <span className="label-text block mb-1">Vector index: {selectedIndex}</span>
              <input
                type="range"
                min="0"
                max={vector.length - 1}
                step="1"
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </label>

            <label>
              <span className="label-text block mb-1">Row: {rowIndex}</span>
              <input
                type="range"
                min="0"
                max={matrix.length - 1}
                step="1"
                value={rowIndex}
                onChange={(e) => setRowIndex(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </label>

            <label>
              <span className="label-text block mb-1">Column: {colIndex}</span>
              <input
                type="range"
                min="0"
                max={matrix[0].length - 1}
                step="1"
                value={colIndex}
                onChange={(e) => setColIndex(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`arr = np.array(${JSON.stringify(vector)})\nmat = np.array(${JSON.stringify(matrix)})\narr[${selectedIndex}]      # ${selectedValue}\nmat[${rowIndex}, ${colIndex}]   # ${selectedMatrixValue}\narr[1:3]        # [4 6]`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Selected Elements</p>
            <div className="flex gap-3 flex-wrap mb-5">
              {vector.map((value, index) => (
                <ArrayCell key={`vec-${index}`} value={value} label={`arr[${index}]`} active={index === selectedIndex} />
              ))}
            </div>

            <div className="grid gap-3 max-w-fit">
              {matrix.map((row, rowIdx) => (
                <div key={`mat-row-${rowIdx}`} className="flex gap-3">
                  {row.map((value, colIdx) => (
                    <ArrayCell
                      key={`mat-${rowIdx}-${colIdx}`}
                      value={value}
                      label={`[${rowIdx},${colIdx}]`}
                      active={rowIdx === rowIndex && colIdx === colIndex}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Indexing Rule</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                NumPy uses comma-separated indices for multiple dimensions: row first, then column.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "slicing" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <label>
              <span className="label-text block mb-1">Start: {sliceStart}</span>
              <input
                type="range"
                min="0"
                max={vector.length}
                step="1"
                value={sliceStart}
                onChange={(e) => setSliceStart(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </label>

            <label>
              <span className="label-text block mb-1">End: {sliceEnd}</span>
              <input
                type="range"
                min="0"
                max={vector.length}
                step="1"
                value={sliceEnd}
                onChange={(e) => setSliceEnd(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`arr = np.array(${JSON.stringify(vector)})\narr[${sliceStart}:${sliceEnd}]   # [${slicedVector.join(" ")}]\nmat[:, 1:]        # take all rows, columns from index 1 onward`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Slice Selection</p>
            <div className="flex gap-3 flex-wrap">
              {vector.map((value, index) => (
                <ArrayCell
                  key={`slice-${index}`}
                  value={value}
                  label={`arr[${index}]`}
                  active={index >= sliceStart && index < sliceEnd}
                />
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Slice Result</p>
              <p className="font-mono text-sm text-foreground">[{slicedVector.join(" ")}]</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                NumPy slicing follows Python slicing rules: include the start index, stop before the end index.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "math" && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {(["add", "subtract", "multiply", "square"] as const).map((op) => (
              <button
                key={op}
                onClick={() => setActiveMathOp(op)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-smooth ${
                  op === activeMathOp
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {op}
              </button>
            ))}
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`arr = np.array(${JSON.stringify(vector)})\n${
              activeMathOp === "add"
                ? "arr + 2"
                : activeMathOp === "subtract"
                  ? "arr - 1"
                  : activeMathOp === "multiply"
                    ? "arr * 3"
                    : "arr ** 2"
            }   # [${mathResult.join(" ")}]`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Mathematical Operations On Arrays</p>
            <div className="flex gap-3 flex-wrap mb-4">
              {vector.map((value, index) => (
                <ArrayCell key={`fn-${index}`} value={value} />
              ))}
            </div>

            <div className="mb-4">
              <p className="label-text mb-2">Result</p>
              <div className="flex gap-3 flex-wrap">
                {mathResult.map((value, index) => (
                  <ArrayCell key={`math-${index}`} value={value} active />
                ))}
              </div>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Why This Matters</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                NumPy applies arithmetic element-by-element across the whole array, which is much faster and cleaner than looping manually.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "statistics" && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {(["sum", "mean", "max", "min", "std"] as const).map((fn) => (
              <button
                key={fn}
                onClick={() => setActiveStat(fn)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-smooth ${
                  fn === activeStat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                np.{fn}()
              </button>
            ))}
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`arr = np.array(${JSON.stringify(vector)})\nnp.${activeStat}(arr)   # ${typeof statResult === "number" ? statResult.toFixed(activeStat === "std" || activeStat === "mean" ? 2 : 0) : statResult}`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Basic Statistical Operations</p>
            <div className="flex gap-3 flex-wrap mb-4">
              {vector.map((value, index) => (
                <ArrayCell key={`stat-${index}`} value={value} />
              ))}
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Result</p>
              <p className="font-mono text-sm text-foreground mb-2">
                np.{activeStat}(arr) = {typeof statResult === "number" ? statResult.toFixed(activeStat === "std" || activeStat === "mean" ? 2 : 0) : statResult}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                NumPy provides fast built-in statistical operations for totals, averages, extremes, and spread.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "vectorized" && (
        <>
          <div className="mb-4">
            <span className="label-text block mb-1">Multiply every value by: {multiplier}</span>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={multiplier}
              onChange={(e) => setMultiplier(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`arr = np.array(${JSON.stringify(vector)})\narr * ${multiplier}   # [${scaledVector.join(" ")}]`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Vectorized Operation</p>
            <div className="mb-4">
              <p className="label-text mb-2">Original</p>
              <div className="flex gap-3 flex-wrap">
                {vector.map((value, index) => (
                  <ArrayCell key={`orig-${index}`} value={value} />
                ))}
              </div>
            </div>

            <div>
              <p className="label-text mb-2">After arr * {multiplier}</p>
              <div className="flex gap-3 flex-wrap">
                {scaledVector.map((value, index) => (
                  <ArrayCell key={`scaled-${index}`} value={value} active />
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Why NumPy Matters</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vectorized operations apply math to the whole array at once. That is one reason NumPy is central to data science and machine learning.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NumpyPlayground;
