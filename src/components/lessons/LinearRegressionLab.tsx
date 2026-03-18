import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

const CANVAS_W = 500;
const CANVAS_H = 350;
const PADDING = 40;

const initialPoints = [
  { x: 1, y: 2.1 }, { x: 1.5, y: 2.8 }, { x: 2, y: 3.2 },
  { x: 2.5, y: 3.9 }, { x: 3, y: 4.5 }, { x: 3.5, y: 4.2 },
  { x: 4, y: 5.1 }, { x: 4.5, y: 5.8 }, { x: 5, y: 6.2 },
  { x: 5.5, y: 6.9 }, { x: 6, y: 7.1 }, { x: 6.5, y: 7.8 },
];

const scaleX = (val: number) => PADDING + ((val - 0) / 8) * (CANVAS_W - 2 * PADDING);
const scaleY = (val: number) => CANVAS_H - PADDING - ((val - 0) / 10) * (CANVAS_H - 2 * PADDING);

const LinearRegressionLab = () => {
  const [slope, setSlope] = useState(1.1);
  const [intercept, setIntercept] = useState(0.8);

  const predict = useCallback((x: number) => slope * x + intercept, [slope, intercept]);

  const mse = useMemo(() => {
    const sum = initialPoints.reduce((acc, p) => {
      const err = p.y - predict(p.x);
      return acc + err * err;
    }, 0);
    return sum / initialPoints.length;
  }, [predict]);

  const mseColor = mse < 0.3 ? "text-accent" : mse < 1 ? "text-yellow-500" : "text-destructive";

  const lineX1 = scaleX(0);
  const lineY1 = scaleY(predict(0));
  const lineX2 = scaleX(8);
  const lineY2 = scaleY(predict(8));

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Linear Regression</h2>
        <p className="body-text text-sm">
          Adjust the slope and intercept to fit a line through the data. Watch the error change in real-time.
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-6 mb-4">
        <label className="flex-1">
          <span className="label-text block mb-1">Slope: {slope.toFixed(2)}</span>
          <input
            type="range"
            min="-2"
            max="4"
            step="0.01"
            value={slope}
            onChange={(e) => setSlope(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
        </label>
        <label className="flex-1">
          <span className="label-text block mb-1">Intercept: {intercept.toFixed(2)}</span>
          <input
            type="range"
            min="-3"
            max="5"
            step="0.01"
            value={intercept}
            onChange={(e) => setIntercept(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
        </label>
      </div>

      {/* MSE display */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-card rounded-lg interactive-shadow">
        <span className="label-text">Mean Squared Error</span>
        <motion.span
          key={mse.toFixed(3)}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className={`font-mono font-semibold tabular-nums text-sm ${mseColor}`}
        >
          {mse.toFixed(4)}
        </motion.span>
        {mse < 0.3 && <span className="text-xs text-accent font-medium ml-auto">Great fit!</span>}
      </div>

      {/* Visualization */}
      <div className="flex-1 lab-stage rounded-xl p-4 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          className="w-full h-auto max-h-[300px]"
        >
          {/* Axes */}
          <line x1={PADDING} y1={CANVAS_H - PADDING} x2={CANVAS_W - PADDING} y2={CANVAS_H - PADDING} stroke="hsl(215 16% 75%)" strokeWidth={1} />
          <line x1={PADDING} y1={PADDING} x2={PADDING} y2={CANVAS_H - PADDING} stroke="hsl(215 16% 75%)" strokeWidth={1} />

          {/* Residuals */}
          {initialPoints.map((p, i) => (
            <line
              key={`res-${i}`}
              x1={scaleX(p.x)}
              y1={scaleY(p.y)}
              x2={scaleX(p.x)}
              y2={scaleY(predict(p.x))}
              stroke="hsl(0 84% 60%)"
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.4}
            />
          ))}

          {/* Regression line */}
          <line
            x1={lineX1}
            y1={lineY1}
            x2={lineX2}
            y2={lineY2}
            stroke="hsl(221 83% 53%)"
            strokeWidth={2}
          />

          {/* Points */}
          {initialPoints.map((p, i) => (
            <circle
              key={i}
              cx={scaleX(p.x)}
              cy={scaleY(p.y)}
              r={5}
              fill="hsl(221 83% 53%)"
              stroke="white"
              strokeWidth={1.5}
            />
          ))}
        </svg>
      </div>

      {/* Code preview */}
      <div className="mt-4 bg-foreground/[0.03] rounded-xl p-4 font-mono text-xs">
        <span className="text-muted-foreground">y</span> = <span className="text-primary font-semibold">{slope.toFixed(2)}</span>
        <span className="text-muted-foreground"> × x + </span>
        <span className="text-primary font-semibold">{intercept.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default LinearRegressionLab;
