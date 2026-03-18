import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

const steps = [
  { condition: "x > 5", trueLabel: "Big number", falseLabel: "Small number", x: 3 },
  { condition: "x > 5", trueLabel: "Big number", falseLabel: "Small number", x: 8 },
];

const ControlFlowPlayground = () => {
  const [xValue, setXValue] = useState(3);
  const isTrueBranch = xValue > 5;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Control Flow</h2>
        <p className="body-text text-sm">
          Change the value of <code className="font-mono text-primary text-xs bg-primary/5 px-1 py-0.5 rounded">x</code> and watch which branch executes.
        </p>
      </div>

      {/* Value control */}
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

      {/* Code */}
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

      {/* Flowchart */}
      <div className="flex-1 lab-stage rounded-xl p-6 flex flex-col items-center justify-center gap-4">
        {/* Condition */}
        <motion.div
          className="px-4 py-2 rounded-lg bg-card interactive-shadow text-sm font-mono"
          animate={{ borderColor: "hsl(221, 83%, 53%)" }}
        >
          x &gt; 5 ?
        </motion.div>

        {/* Branches */}
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

        {/* Output */}
        <motion.div
          key={isTrueBranch ? "true" : "false"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 px-4 py-2 bg-card interactive-shadow rounded-lg font-mono text-sm"
        >
          Output: {isTrueBranch ? '"Big number"' : '"Small number"'}
        </motion.div>
      </div>
    </div>
  );
};

export default ControlFlowPlayground;
