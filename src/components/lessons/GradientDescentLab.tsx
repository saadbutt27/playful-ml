import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

const GradientDescentLab = () => {
  const [theta, setTheta] = useState(4);
  const [learningRate, setLearningRate] = useState(0.1);
  const [history, setHistory] = useState<number[]>([4]);

  // Simple quadratic cost: J(θ) = (θ - 2)²
  const cost = (t: number) => (t - 2) * (t - 2);
  const gradient = (t: number) => 2 * (t - 2);

  const step = () => {
    const newTheta = theta - learningRate * gradient(theta);
    setTheta(newTheta);
    setHistory((prev) => [...prev, newTheta]);
  };

  const reset = () => {
    setTheta(4);
    setHistory([4]);
  };

  // SVG curve
  const W = 400;
  const H = 250;
  const PAD = 30;
  const scaleX = (val: number) => PAD + ((val + 1) / 7) * (W - 2 * PAD);
  const scaleY = (val: number) => H - PAD - (val / 10) * (H - 2 * PAD);

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let x = -1; x <= 6; x += 0.1) {
      const px = scaleX(x);
      const py = scaleY(cost(x));
      pts.push(`${pts.length === 0 ? "M" : "L"}${px},${py}`);
    }
    return pts.join(" ");
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Gradient Descent</h2>
        <p className="body-text text-sm">
          Watch the ball roll down the cost curve. Adjust the learning rate and step through the optimization.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-4">
        <span className="label-text block mb-1">Learning Rate: {learningRate.toFixed(2)}</span>
        <input
          type="range"
          min="0.01"
          max="0.5"
          step="0.01"
          value={learningRate}
          onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={step}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity duration-200"
        >
          Step
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors duration-200"
        >
          Reset
        </button>
      </div>

      {/* Info */}
      <div className="flex gap-4 mb-4">
        <div className="p-3 bg-card rounded-lg interactive-shadow flex-1">
          <span className="label-text block mb-1">θ (Parameter)</span>
          <span className="font-mono text-sm font-semibold text-primary tabular-nums">{theta.toFixed(4)}</span>
        </div>
        <div className="p-3 bg-card rounded-lg interactive-shadow flex-1">
          <span className="label-text block mb-1">Cost J(θ)</span>
          <span className={`font-mono text-sm font-semibold tabular-nums ${cost(theta) < 0.1 ? "text-accent" : "text-foreground"}`}>
            {cost(theta).toFixed(4)}
          </span>
        </div>
      </div>

      {/* Visualization */}
      <div className="flex-1 lab-stage rounded-xl p-4 flex items-center justify-center">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[220px]">
          <path d={curvePath} fill="none" stroke="hsl(215 16% 75%)" strokeWidth={2} />

          {/* History trail */}
          {history.map((t, i) => (
            <circle
              key={i}
              cx={scaleX(t)}
              cy={scaleY(cost(t))}
              r={i === history.length - 1 ? 0 : 2.5}
              fill="hsl(221 83% 53%)"
              opacity={0.3}
            />
          ))}

          {/* Current position */}
          <motion.circle
            cx={scaleX(theta)}
            cy={scaleY(cost(theta))}
            r={7}
            fill="hsl(221 83% 53%)"
            stroke="white"
            strokeWidth={2}
            animate={{ cx: scaleX(theta), cy: scaleY(cost(theta)) }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />

          {/* Minimum marker */}
          <line
            x1={scaleX(2)}
            y1={scaleY(0) - 5}
            x2={scaleX(2)}
            y2={scaleY(0) + 5}
            stroke="hsl(142 71% 45%)"
            strokeWidth={2}
          />
          <text
            x={scaleX(2)}
            y={scaleY(0) + 18}
            textAnchor="middle"
            className="text-[10px] fill-muted-foreground"
          >
            minimum
          </text>
        </svg>
      </div>
    </div>
  );
};

export default GradientDescentLab;
