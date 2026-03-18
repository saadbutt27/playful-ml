import { useState } from "react";
import { motion } from "framer-motion";

const lessonTabs = [
  { id: "if-else", title: "If / Else" },
  { id: "if-elif", title: "If / Elif / Else" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const ControlFlowPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("if-else");
  const [xValue, setXValue] = useState(3);
  const isTrueBranch = xValue > 5;
  const gradeValue = xValue >= 8 ? "A" : xValue >= 5 ? "B" : "C";

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Control Flow</h2>
        <p className="body-text text-sm">
          Change the value of <code className="font-mono text-primary text-xs bg-primary/5 px-1 py-0.5 rounded">x</code> and watch which branch executes.
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

      <div className="mb-4">
        <span className="label-text block mb-1">x = {xValue}</span>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={xValue}
          onChange={(e) => setXValue(parseInt(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {activeTab === "if-else" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <div className="text-muted-foreground">x = <span className="text-primary font-semibold">{xValue}</span></div>
            <div className={`mt-1 ${isTrueBranch ? "text-foreground" : "text-muted-foreground/40"}`}>
              if x &gt; 5:
            </div>
            <div className={`ml-4 ${isTrueBranch ? "text-accent font-semibold" : "text-muted-foreground/40"}`}>
              print("Big number")
            </div>
            <div className={`${!isTrueBranch ? "text-foreground" : "text-muted-foreground/40"}`}>
              else:
            </div>
            <div className={`ml-4 ${!isTrueBranch ? "text-accent font-semibold" : "text-muted-foreground/40"}`}>
              print("Small number")
            </div>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-6 flex flex-col items-center justify-center gap-4">
            <motion.div
              className="px-4 py-2 rounded-lg bg-card interactive-shadow text-sm font-mono"
              animate={{ borderColor: "hsl(221, 83%, 53%)" }}
            >
              x &gt; 5 ?
            </motion.div>

            <div className="flex gap-12 items-start">
              <div className="flex flex-col items-center gap-2">
                <span className="label-text text-accent">True</span>
                <motion.div
                  className="px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200"
                  animate={{
                    backgroundColor: isTrueBranch ? "hsl(142, 71%, 45%)" : "hsl(210, 40%, 96%)",
                    color: isTrueBranch ? "white" : "hsl(215, 16%, 47%)",
                    scale: isTrueBranch ? 1.05 : 1,
                  }}
                  transition={{ type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.2 }}
                >
                  "Big number"
                </motion.div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="label-text text-destructive">False</span>
                <motion.div
                  className="px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200"
                  animate={{
                    backgroundColor: !isTrueBranch ? "hsl(142, 71%, 45%)" : "hsl(210, 40%, 96%)",
                    color: !isTrueBranch ? "white" : "hsl(215, 16%, 47%)",
                    scale: !isTrueBranch ? 1.05 : 1,
                  }}
                  transition={{ type: "tween", ease: [0.25, 0.1, 0.25, 1], duration: 0.2 }}
                >
                  "Small number"
                </motion.div>
              </div>
            </div>

            <motion.div
              key={isTrueBranch ? "true" : "false"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 px-4 py-2 bg-card interactive-shadow rounded-lg font-mono text-sm"
            >
              Output: {isTrueBranch ? '"Big number"' : '"Small number"'}
            </motion.div>
          </div>
        </>
      )}

      {activeTab === "if-elif" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <div className="text-muted-foreground">x = <span className="text-primary font-semibold">{xValue}</span></div>
            <div className={`${xValue >= 8 ? "text-foreground" : "text-muted-foreground/40"}`}>
              if x &gt;= 8:
            </div>
            <div className={`ml-4 ${xValue >= 8 ? "text-accent font-semibold" : "text-muted-foreground/40"}`}>
              print("Grade A")
            </div>
            <div className={`${xValue >= 5 && xValue < 8 ? "text-foreground" : "text-muted-foreground/40"}`}>
              elif x &gt;= 5:
            </div>
            <div className={`ml-4 ${xValue >= 5 && xValue < 8 ? "text-accent font-semibold" : "text-muted-foreground/40"}`}>
              print("Grade B")
            </div>
            <div className={`${xValue < 5 ? "text-foreground" : "text-muted-foreground/40"}`}>
              else:
            </div>
            <div className={`ml-4 ${xValue < 5 ? "text-accent font-semibold" : "text-muted-foreground/40"}`}>
              print("Grade C")
            </div>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-6 flex flex-col gap-4">
            <p className="label-text">If / Elif / Else Example</p>

            <div className="grid gap-3 md:grid-cols-3">
              <motion.div
                className="px-4 py-3 rounded-lg text-sm font-mono transition-all duration-200"
                animate={{
                  backgroundColor: gradeValue === "A" ? "hsl(142, 71%, 45%)" : "hsl(0 0% 100%)",
                  color: gradeValue === "A" ? "white" : "hsl(215, 16%, 47%)",
                  scale: gradeValue === "A" ? 1.04 : 1,
                }}
              >
                if x &gt;= 8 → "Grade A"
              </motion.div>

              <motion.div
                className="px-4 py-3 rounded-lg text-sm font-mono transition-all duration-200"
                animate={{
                  backgroundColor: gradeValue === "B" ? "hsl(142, 71%, 45%)" : "hsl(0 0% 100%)",
                  color: gradeValue === "B" ? "white" : "hsl(215, 16%, 47%)",
                  scale: gradeValue === "B" ? 1.04 : 1,
                }}
              >
                elif x &gt;= 5 → "Grade B"
              </motion.div>

              <motion.div
                className="px-4 py-3 rounded-lg text-sm font-mono transition-all duration-200"
                animate={{
                  backgroundColor: gradeValue === "C" ? "hsl(142, 71%, 45%)" : "hsl(0 0% 100%)",
                  color: gradeValue === "C" ? "white" : "hsl(215, 16%, 47%)",
                  scale: gradeValue === "C" ? 1.04 : 1,
                }}
              >
                else → "Grade C"
              </motion.div>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">How Elif Works</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Python checks conditions from top to bottom. As soon as one condition is true, that branch runs and the remaining branches are skipped.
              </p>
            </div>

            <motion.div
              key={gradeValue}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-2 bg-card interactive-shadow rounded-lg font-mono text-sm self-start"
            >
              Output: "Grade {gradeValue}"
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default ControlFlowPlayground;
