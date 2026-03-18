import { useState, useMemo } from "react";
import { motion } from "framer-motion";

const lessonTabs = [
  { id: "theory", title: "Theory" },
  { id: "lab", title: "Lab" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const GradientDescentLab = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("theory");
  const [theta, setTheta] = useState(4);
  const [learningRate, setLearningRate] = useState(0.1);
  const [history, setHistory] = useState<number[]>([4]);

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
          Learn how optimization works mathematically, then step through it visually.
          This lesson explains cost, gradients, and the update rule before the interactive lab.
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

      {activeTab === "theory" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm">
            <pre className="text-foreground whitespace-pre-wrap">{`Cost: J(theta) = (theta - 2)^2\nGradient: dJ/dtheta = 2(theta - 2)\nUpdate: theta = theta - alpha * dJ/dtheta`}</pre>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Core Idea</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Gradient descent is an optimization method. It repeatedly updates parameters to move toward a smaller cost value.
              </p>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Cost Function</p>
              <p className="font-mono text-sm text-foreground mb-2">J(theta) = (theta - 2)^2</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In this lesson, the cost curve is a simple bowl-shaped parabola. The minimum happens when
                <span className="font-mono text-foreground"> theta = 2</span>.
              </p>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Gradient</p>
              <p className="font-mono text-sm text-foreground mb-2">dJ/dtheta = 2(theta - 2)</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The gradient tells you the slope of the cost curve at the current parameter value.
                It tells you which direction is uphill.
              </p>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Update Rule</p>
              <p className="font-mono text-sm text-foreground mb-2">theta = theta - alpha * gradient</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We subtract the gradient because we want to move downhill. The learning rate
                <span className="font-mono text-foreground"> alpha</span> controls how large each step is.
              </p>
            </div>
          </div>

          <div className="lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Learning Rate Effects</p>
            <div className="grid gap-3">
              <div className="p-3 bg-card rounded-lg interactive-shadow">
                <p className="font-mono text-sm text-foreground mb-1">Small alpha</p>
                <p className="text-sm text-muted-foreground">The steps are safe but slow.</p>
              </div>
              <div className="p-3 bg-card rounded-lg interactive-shadow">
                <p className="font-mono text-sm text-foreground mb-1">Good alpha</p>
                <p className="text-sm text-muted-foreground">The parameter moves steadily toward the minimum.</p>
              </div>
              <div className="p-3 bg-card rounded-lg interactive-shadow">
                <p className="font-mono text-sm text-foreground mb-1">Large alpha</p>
                <p className="text-sm text-muted-foreground">The parameter can overshoot or bounce around the minimum.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "lab" && (
        <>
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

          <div className="flex gap-4 mb-4">
            <div className="p-3 bg-card rounded-lg interactive-shadow flex-1">
              <span className="label-text block mb-1">theta</span>
              <span className="font-mono text-sm font-semibold text-primary tabular-nums">{theta.toFixed(4)}</span>
            </div>
            <div className="p-3 bg-card rounded-lg interactive-shadow flex-1">
              <span className="label-text block mb-1">Cost J(theta)</span>
              <span className={`font-mono text-sm font-semibold tabular-nums ${cost(theta) < 0.1 ? "text-accent" : "text-foreground"}`}>
                {cost(theta).toFixed(4)}
              </span>
            </div>
            <div className="p-3 bg-card rounded-lg interactive-shadow flex-1">
              <span className="label-text block mb-1">Gradient</span>
              <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                {gradient(theta).toFixed(4)}
              </span>
            </div>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4 flex items-center justify-center">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-h-[220px]">
              <path d={curvePath} fill="none" stroke="hsl(215 16% 75%)" strokeWidth={2} />

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

          <div className="mt-4 bg-foreground/[0.03] rounded-xl p-4 font-mono text-xs">
            theta_next = theta - alpha * gradient(theta)
          </div>
        </>
      )}
    </div>
  );
};

export default GradientDescentLab;
