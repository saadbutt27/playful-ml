import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.2 };

const lessonTabs = [
  { id: "define", title: "Define" },
  { id: "parameters", title: "Parameters" },
  { id: "return", title: "Return" },
  { id: "calls", title: "Calls" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const CallStep = ({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active?: boolean;
}) => (
  <motion.div
    layout
    transition={transition}
    className={`rounded-lg border p-3 interactive-shadow ${
      active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
    }`}
  >
    <p className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
      {label}
    </p>
    <p className="mt-1 font-mono text-sm">{value}</p>
  </motion.div>
);

const FunctionsPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("define");
  const [nameValue, setNameValue] = useState("Ava");
  const [aValue, setAValue] = useState(4);
  const [bValue, setBValue] = useState(3);
  const [callCount, setCallCount] = useState(3);

  const greeting = useMemo(() => `Hello, ${nameValue}!`, [nameValue]);
  const sumResult = useMemo(() => aValue + bValue, [aValue, bValue]);
  const callOutputs = useMemo(
    () => Array.from({ length: callCount }, (_, index) => `Hello, student ${index + 1}!`),
    [callCount],
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Functions</h2>
        <p className="body-text text-sm">
          Functions package reusable code into a named block. Define once, call many times, and optionally send data in or get data back.
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

      {activeTab === "define" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`def greet():\n    print("Hello!")\n\ngreet()`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Function Flow</p>
            <div className="grid gap-3">
              <CallStep label="Definition" value="def greet():" />
              <CallStep label="Body" value='print("Hello!")' />
              <CallStep label="Call" value="greet()" active />
              <CallStep label="Output" value='"Hello!"' />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What to Notice</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A function starts with <span className="font-mono text-foreground">def</span>, has a name, and runs only when it is called.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "parameters" && (
        <>
          <div className="mb-4">
            <label className="block">
              <span className="label-text block mb-1">Name argument</span>
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`def greet(name):\n    print(f"Hello, {name}!")\n\ngreet("${nameValue}")`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Argument Passing</p>
            <div className="grid gap-3">
              <CallStep label="Parameter" value="name" />
              <CallStep label="Argument" value={`"${nameValue}"`} active />
              <CallStep label="Output" value={`"${greeting}"`} />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">How It Works</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Parameters are placeholders inside the function. Arguments are the real values you send in when calling it.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "return" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <label>
              <span className="label-text block mb-1">a = {aValue}</span>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={aValue}
                onChange={(e) => setAValue(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </label>

            <label>
              <span className="label-text block mb-1">b = {bValue}</span>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={bValue}
                onChange={(e) => setBValue(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`def add(a, b):\n    return a + b\n\nresult = add(${aValue}, ${bValue})  # ${sumResult}`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Return Value</p>
            <div className="grid gap-3">
              <CallStep label="Input" value={`a = ${aValue}, b = ${bValue}`} />
              <CallStep label="Function" value="return a + b" active />
              <CallStep label="Result" value={`result = ${sumResult}`} />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Why Return Matters</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-mono text-foreground">return</span> sends a value back to the caller so it can be stored, printed, or reused later.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "calls" && (
        <>
          <div className="mb-4">
            <span className="label-text block mb-1">Number of calls: {callCount}</span>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={callCount}
              onChange={(e) => setCallCount(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`def greet_student(number):\n    return f"Hello, student {number}!"\n\n# Called ${callCount} times`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Repeated Calls</p>
            <div className="grid gap-3">
              {callOutputs.map((output, index) => (
                <CallStep
                  key={output}
                  label={`Call ${index + 1}`}
                  value={output}
                  active={index === callOutputs.length - 1}
                />
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Reuse</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Functions reduce repetition. The same logic can be reused many times with different inputs.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FunctionsPlayground;
