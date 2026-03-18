import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.25 };

const LoopPlayground = () => {
  const [maxIter, setMaxIter] = useState(5);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const runLoop = () => {
    setIsRunning(true);
    setCurrentStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= maxIter) {
        clearInterval(interval);
        setIsRunning(false);
      }
      setCurrentStep(step);
    }, 600);
  };

  const reset = () => {
    setCurrentStep(-1);
    setIsRunning(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Loops</h2>
        <p className="body-text text-sm">
          Watch a loop execute step by step. Each iteration highlights the current value.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-4">
        <span className="label-text block mb-1">Iterations: {maxIter}</span>
        <input
          type="range"
          min="2"
          max="8"
          step="1"
          value={maxIter}
          onChange={(e) => { setMaxIter(parseInt(e.target.value)); reset(); }}
          className="w-full accent-primary"
        />
      </div>

      {/* Code */}
      <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
        <div className="text-muted-foreground">
          for i in range(<span className="text-primary font-semibold">{maxIter}</span>):
        </div>
        <div className="ml-4 text-foreground">
          print(f"Step {"{i}"}")
        </div>
      </div>

      {/* Run button */}
      <button
        onClick={isRunning ? reset : runLoop}
        className="mb-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity duration-200 ease-smooth self-start"
      >
        {isRunning ? "Reset" : "Run Loop"}
      </button>

      {/* Visualization */}
      <div className="flex-1 lab-stage rounded-xl p-4">
        <p className="label-text mb-3">Iteration Counter</p>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: maxIter }).map((_, i) => (
            <motion.div
              key={i}
              className="w-12 h-12 rounded-lg flex items-center justify-center font-mono text-sm font-semibold"
              animate={{
                backgroundColor: i <= currentStep ? "hsl(221, 83%, 53%)" : "hsl(210, 40%, 96%)",
                color: i <= currentStep ? "white" : "hsl(215, 16%, 47%)",
                scale: i === currentStep ? 1.15 : 1,
              }}
              transition={transition}
            >
              {i}
            </motion.div>
          ))}
        </div>

        {/* Output console */}
        <div className="mt-4 bg-card rounded-lg p-3 interactive-shadow max-h-32 overflow-y-auto">
          <p className="label-text mb-2">Console Output</p>
          <AnimatePresence>
            {currentStep >= 0 && Array.from({ length: Math.min(currentStep + 1, maxIter) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-mono text-xs text-foreground"
              >
                Step {i}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LoopPlayground;
