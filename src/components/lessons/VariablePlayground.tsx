import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Variable {
  name: string;
  value: string | number;
  type: string;
}

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.2 };

const lessonTabs = [
  { id: "assign", title: "Assign" },
  { id: "print", title: "Print" },
  { id: "input", title: "Input" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

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
  const [activeTab, setActiveTab] = useState<LessonTab>("assign");
  const [activeExample, setActiveExample] = useState(0);
  const [inputName, setInputName] = useState("Ava");
  const currentVars = presetExamples[activeExample].vars;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Variables</h2>
        <p className="body-text text-sm">
          Variables are named memory boxes. This lesson also shows how variables connect to
          basic input and output through <span className="font-mono text-foreground">print()</span> and
          <span className="font-mono text-foreground"> input()</span>.
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

      {activeTab === "assign" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{presetExamples[activeExample].code}</pre>
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            {presetExamples.map((_, i) => (
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
        </>
      )}

      {activeTab === "print" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`name = "Alice"\nage = 21\nprint(name)\nprint(age)\nprint("Hello", name)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Memory And Output</p>
            <div className="space-y-2 mb-4">
              <VariableBox variable={{ name: "name", value: "Alice", type: "str" }} />
              <VariableBox variable={{ name: "age", value: 21, type: "int" }} />
            </div>

            <div className="bg-card rounded-lg p-3 interactive-shadow">
              <p className="label-text mb-2">Console Output</p>
              <div className="space-y-1 font-mono text-xs text-foreground">
                <div>Alice</div>
                <div>21</div>
                <div>Hello Alice</div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What print() Does</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-mono text-foreground">print()</span> sends values to the screen.
                It does not change the variable, it only shows the value stored inside it.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "input" && (
        <>
          <div className="mb-4">
            <label className="block">
              <span className="label-text block mb-1">Type what the user enters</span>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`name = input("Enter your name: ")\nprint("Hello", name)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Input Flow</p>
            <div className="bg-card rounded-lg p-3 interactive-shadow mb-4">
              <p className="label-text mb-2">Console</p>
              <div className="space-y-1 font-mono text-xs text-foreground">
                <div>Enter your name: {inputName}</div>
                <div>Hello {inputName}</div>
              </div>
            </div>

            <div className="space-y-2">
              <VariableBox variable={{ name: "name", value: inputName, type: "str" }} />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What input() Does</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-mono text-foreground">input()</span> reads text from the user and stores it in a variable.
                By default, the result is a string.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VariablePlayground;
