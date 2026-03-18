import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Variable {
  name: string;
  value: string | number;
  type: string;
}

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1], duration: 0.2 };

const VariableBox = ({ variable }: { variable: Variable }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={transition}
    whileHover={{ y: -2 }}
    className="flex items-center gap-3 p-3 bg-card rounded-lg interactive-shadow"
  >
    <span className="label-text text-[10px]">var</span>
    <span className="font-mono text-primary font-semibold text-sm">{variable.name}</span>
    <span className="text-muted-foreground">=</span>
    <AnimatePresence mode="wait">
      <motion.span
        key={String(variable.value)}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={transition}
        className="font-mono tabular-nums text-sm text-foreground"
      >
        {typeof variable.value === "string" ? `"${variable.value}"` : variable.value}
      </motion.span>
    </AnimatePresence>
    <span className="ml-auto label-text text-[9px]">{variable.type}</span>
  </motion.div>
);

const presetExamples = [
  { code: 'name = "Alice"', vars: [{ name: "name", value: "Alice", type: "str" }] },
  { code: "price = 29.99", vars: [{ name: "price", value: 29.99, type: "float" }] },
  { code: "x = 10\ny = 20\ntotal = x + y", vars: [{ name: "x", value: 10, type: "int" }, { name: "y", value: 20, type: "int" }, { name: "total", value: 30, type: "int" }] },
  { code: 'items = ["apple", "banana"]\ncount = 2', vars: [{ name: "items", value: '["apple", "banana"]', type: "list" }, { name: "count", value: 2, type: "int" }] },
];

const VariablePlayground = () => {
  const [activeExample, setActiveExample] = useState(0);
  const currentVars = presetExamples[activeExample].vars;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Variables</h2>
        <p className="body-text text-sm">
          Variables are labeled memory boxes. Assign a value, and a box appears.
          Reassign — watch it animate.
        </p>
      </div>

      {/* Code area */}
      <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
        <pre className="text-foreground whitespace-pre-wrap">{presetExamples[activeExample].code}</pre>
      </div>

      {/* Example switcher */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {presetExamples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setActiveExample(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-smooth ${
              i === activeExample
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Example {i + 1}
          </button>
        ))}
      </div>

      {/* Variable visualization */}
      <div className="flex-1 lab-stage rounded-xl p-4">
        <p className="label-text mb-3">Memory</p>
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {currentVars.map((v) => (
              <VariableBox key={v.name + v.value} variable={v} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VariablePlayground;
