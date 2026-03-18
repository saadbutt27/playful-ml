import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.25 };

const lessonTabs = [
  { id: "for-range", title: "For Range" },
  { id: "while", title: "While" },
  { id: "list", title: "List Loop" },
  { id: "dictionary", title: "Dictionary Loop" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const listItems = ["apple", "banana", "mango", "kiwi"];
const dictionaryItems = [
  ["name", "Ava"],
  ["role", "Student"],
  ["level", "Beginner"],
  ["city", "Lahore"],
] as const;

const stepOptions = [-3, -2, -1, 1, 2, 3];

const buildRangeValues = (start: number, end: number, step: number) => {
  const values: number[] = [];
  if (step === 0) return values;

  if (step > 0) {
    for (let value = start; value < end; value += step) {
      values.push(value);
    }
  } else {
    for (let value = start; value > end; value += step) {
      values.push(value);
    }
  }

  return values;
};

const LoopPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("for-range");
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(5);
  const [rangeStep, setRangeStep] = useState(1);
  const [whileLimit, setWhileLimit] = useState(4);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rangeValues = useMemo(() => buildRangeValues(rangeStart, rangeEnd, rangeStep), [rangeEnd, rangeStart, rangeStep]);

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentStep(-1);
    setIsRunning(false);
  };

  const getTotalSteps = () => {
    switch (activeTab) {
      case "for-range":
        return rangeValues.length;
      case "while":
        return whileLimit;
      case "list":
        return listItems.length;
      case "dictionary":
        return dictionaryItems.length;
    }
  };

  const runLoop = () => {
    reset();
    const totalSteps = getTotalSteps();
    setIsRunning(true);
    setCurrentStep(0);
    let step = 0;

    intervalRef.current = setInterval(() => {
      step++;
      if (step >= totalSteps) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsRunning(false);
      }
      setCurrentStep(step);
    }, 600);
  };

  const totalSteps = getTotalSteps();

  const consoleLines = useMemo(() => {
    const visibleSteps = Math.min(currentStep + 1, totalSteps);
    if (visibleSteps <= 0) return [];

    switch (activeTab) {
      case "for-range":
        return rangeValues.slice(0, visibleSteps).map((value) => `i = ${value}`);
      case "while":
        return Array.from({ length: visibleSteps }, (_, index) => `count is ${index}`);
      case "list":
        return listItems.slice(0, visibleSteps).map((item) => `Fruit: ${item}`);
      case "dictionary":
        return dictionaryItems.slice(0, visibleSteps).map(([key, value]) => `${key} -> ${value}`);
    }
  }, [activeTab, currentStep, totalSteps]);

  const codeBlock = useMemo(() => {
    switch (activeTab) {
      case "for-range":
        return `for i in range(${rangeStart}, ${rangeEnd}, ${rangeStep}):\n    print(f"i = {i}")`;
      case "while":
        return `count = 0\nwhile count < ${whileLimit}:\n    print(f"count is {count}")\n    count += 1`;
      case "list":
        return `fruits = ${JSON.stringify(listItems)}\nfor fruit in fruits:\n    print(f"Fruit: {fruit}")`;
      case "dictionary":
        return `profile = {\n  "name": "Ava",\n  "role": "Student",\n  "level": "Beginner",\n  "city": "Lahore"\n}\nfor key, value in profile.items():\n    print(f"{key} -> {value}")`;
    }
  }, [activeTab, rangeEnd, rangeStart, rangeStep, whileLimit]);

  const stageTitle = useMemo(() => {
    switch (activeTab) {
      case "for-range":
        return "Iteration Counter";
      case "while":
        return "While Condition";
      case "list":
        return "List Iteration";
      case "dictionary":
        return "Dictionary Iteration";
    }
  }, [activeTab]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Loops</h2>
        <p className="body-text text-sm">
          Watch different kinds of loops execute step by step. Explore counting loops, while loops,
          and loops that walk through lists and dictionaries.
        </p>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {lessonTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              reset();
            }}
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

      {activeTab === "for-range" && (
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <label>
            <span className="label-text block mb-1">Start: {rangeStart}</span>
            <input
              type="range"
              min="-5"
              max="10"
              step="1"
              value={rangeStart}
              onChange={(e) => {
                setRangeStart(parseInt(e.target.value));
                reset();
              }}
              className="w-full accent-primary"
            />
          </label>
          <label>
            <span className="label-text block mb-1">End: {rangeEnd}</span>
            <input
              type="range"
              min="-5"
              max="10"
              step="1"
              value={rangeEnd}
              onChange={(e) => {
                setRangeEnd(parseInt(e.target.value));
                reset();
              }}
              className="w-full accent-primary"
            />
          </label>
          <div className="sm:col-span-2">
            <span className="label-text block mb-2">Step: {rangeStep}</span>
            <div className="flex gap-2 flex-wrap">
              {stepOptions.map((step) => (
                <button
                  key={step}
                  onClick={() => {
                    setRangeStep(step);
                    reset();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-smooth ${
                    step === rangeStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2 p-3 rounded-lg bg-card interactive-shadow">
            <p className="label-text mb-1">Generated Values</p>
            <p className="font-mono text-sm text-foreground">
              {rangeValues.length > 0 ? `[${rangeValues.join(", ")}]` : "No iterations with this range configuration"}
            </p>
          </div>
        </div>
      )}

      {activeTab === "while" && (
        <div className="mb-4">
          <span className="label-text block mb-1">Loop stops when count reaches: {whileLimit}</span>
          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={whileLimit}
            onChange={(e) => {
              setWhileLimit(parseInt(e.target.value));
              reset();
            }}
            className="w-full accent-primary"
          />
        </div>
      )}

      <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
        <pre className="text-foreground whitespace-pre-wrap">{codeBlock}</pre>
      </div>

      <button
        onClick={isRunning ? reset : runLoop}
        className="mb-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity duration-200 ease-smooth self-start"
      >
        {isRunning ? "Reset" : "Run Loop"}
      </button>

      <div className="flex-1 lab-stage rounded-xl p-4">
        <p className="label-text mb-3">{stageTitle}</p>

        {activeTab === "for-range" && (
          <div className="flex gap-2 flex-wrap">
            {rangeValues.map((value, index) => (
              <motion.div
                key={`${value}-${index}`}
                className="w-12 h-12 rounded-lg flex items-center justify-center font-mono text-sm font-semibold"
                animate={{
                  backgroundColor: index <= currentStep ? "hsl(221, 83%, 53%)" : "hsl(210, 40%, 96%)",
                  color: index <= currentStep ? "white" : "hsl(215, 16%, 47%)",
                  scale: index === currentStep ? 1.15 : 1,
                }}
                transition={transition}
              >
                {value}
              </motion.div>
            ))}
            {rangeValues.length === 0 && (
              <div className="p-3 rounded-lg bg-card interactive-shadow text-sm text-muted-foreground">
                This `range()` call produces no values.
              </div>
            )}
          </div>
        )}

        {activeTab === "while" && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="p-3 rounded-lg bg-card interactive-shadow">
              <p className="label-text mb-1">Count</p>
              <p className="font-mono text-sm text-primary">{currentStep < 0 ? 0 : Math.min(currentStep, whileLimit)}</p>
            </div>
            <div className="p-3 rounded-lg bg-card interactive-shadow">
              <p className="label-text mb-1">Condition</p>
              <p className="font-mono text-sm text-foreground">count &lt; {whileLimit}</p>
            </div>
            <motion.div
              className="p-3 rounded-lg interactive-shadow"
              animate={{
                backgroundColor: currentStep >= whileLimit && currentStep !== -1 ? "hsl(0 84% 60%)" : "hsl(142 71% 45%)",
                color: "white",
              }}
              transition={transition}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Loop State</p>
              <p className="font-mono text-sm mt-1">
                {currentStep === -1 ? "ready" : currentStep >= whileLimit ? "stopped" : "running"}
              </p>
            </motion.div>
          </div>
        )}

        {activeTab === "list" && (
          <div className="flex gap-3 flex-wrap">
            {listItems.map((item, index) => (
              <motion.div
                key={item}
                className="min-w-[88px] rounded-lg p-3 text-center interactive-shadow"
                animate={{
                  backgroundColor: index <= currentStep ? "hsl(221, 83%, 53%)" : "hsl(0 0% 100%)",
                  color: index <= currentStep ? "white" : "hsl(222 47% 11%)",
                  scale: index === currentStep ? 1.08 : 1,
                }}
                transition={transition}
              >
                <div className={`text-[10px] font-bold uppercase tracking-widest ${index <= currentStep ? "text-white/70" : "text-muted-foreground"}`}>
                  item
                </div>
                <div className="font-mono text-sm mt-1">"{item}"</div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "dictionary" && (
          <div className="grid gap-3">
            {dictionaryItems.map(([key, value], index) => (
              <motion.div
                key={key}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg p-3 interactive-shadow"
                animate={{
                  backgroundColor: index <= currentStep ? "hsl(221, 83%, 53%)" : "hsl(0 0% 100%)",
                  color: index <= currentStep ? "white" : "hsl(222 47% 11%)",
                  scale: index === currentStep ? 1.02 : 1,
                }}
                transition={transition}
              >
                <span className="font-mono text-sm">{key}</span>
                <span className={index <= currentStep ? "text-white/70" : "text-muted-foreground"}>:</span>
                <span className="font-mono text-sm text-right">"{value}"</span>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-4 bg-card rounded-lg p-3 interactive-shadow max-h-40 overflow-y-auto">
          <p className="label-text mb-2">Console Output</p>
          <AnimatePresence>
            {consoleLines.map((line, index) => (
              <motion.div
                key={`${activeTab}-${index}-${line}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-mono text-xs text-foreground"
              >
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LoopPlayground;
