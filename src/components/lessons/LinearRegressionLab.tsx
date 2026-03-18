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

const lessonTabs = [
  { id: "theory", title: "Theory" },
  { id: "sklearn", title: "Scikit-learn" },
  { id: "evaluation", title: "Evaluation" },
  { id: "lab", title: "Lab" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const LinearRegressionLab = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("theory");
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
          Learn the theory, then adjust the line yourself. This lesson explains the equation,
          residuals, and mean squared error before the interactive fitting lab.
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
            <pre className="text-foreground whitespace-pre-wrap">{`Prediction: y_hat = m*x + b\nResidual: y - y_hat\nMSE = (1/n) * sum((y - y_hat)^2)`}</pre>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">What The Model Does</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Linear regression fits a straight line to data. It tries to capture the overall trend
                between an input <span className="font-mono text-foreground">x</span> and an output
                <span className="font-mono text-foreground"> y</span>.
              </p>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Prediction Equation</p>
              <p className="font-mono text-sm text-foreground mb-2">y_hat = m*x + b</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The slope <span className="font-mono text-foreground">m</span> controls how steep the line is.
                The intercept <span className="font-mono text-foreground">b</span> controls where the line crosses the y-axis.
              </p>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Residuals</p>
              <p className="font-mono text-sm text-foreground mb-2">residual = y - y_hat</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A residual is the difference between the real value and the predicted value.
                In the lab, each dashed vertical line shows one residual.
              </p>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Loss Function</p>
              <p className="font-mono text-sm text-foreground mb-2">MSE = (1/n) * sum((y - y_hat)^2)</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Mean Squared Error averages the squared residuals. Squaring makes big mistakes matter more
                and prevents positive and negative errors from canceling each other.
              </p>
            </div>
          </div>

          <div className="lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Parameter Effects</p>
            <div className="grid gap-3">
              <div className="p-3 bg-card rounded-lg interactive-shadow">
                <p className="font-mono text-sm text-foreground mb-1">Increase m</p>
                <p className="text-sm text-muted-foreground">The line tilts upward more sharply from left to right.</p>
              </div>
              <div className="p-3 bg-card rounded-lg interactive-shadow">
                <p className="font-mono text-sm text-foreground mb-1">Decrease m</p>
                <p className="text-sm text-muted-foreground">The line becomes flatter or can even tilt downward.</p>
              </div>
              <div className="p-3 bg-card rounded-lg interactive-shadow">
                <p className="font-mono text-sm text-foreground mb-1">Change b</p>
                <p className="text-sm text-muted-foreground">The line shifts up or down without changing its tilt.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "sklearn" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm">
            <pre className="text-foreground whitespace-pre-wrap">{`from sklearn.linear_model import LinearRegression\n\nX = [[1], [1.5], [2], [2.5], [3]]\ny = [2.1, 2.8, 3.2, 3.9, 4.5]\n\nmodel = LinearRegression()\nmodel.fit(X, y)\npredictions = model.predict(X)`}</pre>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Step 1</p>
              <p className="font-mono text-sm text-foreground mb-2">Prepare X and y</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Scikit-learn expects input features in <span className="font-mono text-foreground">X</span> and target values in
                <span className="font-mono text-foreground"> y</span>.
              </p>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Step 2</p>
              <p className="font-mono text-sm text-foreground mb-2">model.fit(X, y)</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The model learns the slope and intercept that best fit the data.
              </p>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Step 3</p>
              <p className="font-mono text-sm text-foreground mb-2">model.predict(X)</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                After training, the model can generate predictions for new or existing inputs.
              </p>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">What You Get</p>
              <p className="font-mono text-sm text-foreground mb-2">coef_ and intercept_</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Internally, scikit-learn stores the learned parameters of the line.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "evaluation" && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm">
            <pre className="text-foreground whitespace-pre-wrap">{`from sklearn.metrics import mean_squared_error, r2_score\n\nmse = mean_squared_error(y_true, y_pred)\nr2 = r2_score(y_true, y_pred)`}</pre>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Prediction</p>
              <p className="font-mono text-sm text-foreground mb-2">y_pred = model.predict(X_test)</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Prediction means using the learned line to estimate outputs for unseen inputs.
              </p>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Mean Squared Error</p>
              <p className="font-mono text-sm text-foreground mb-2">MSE = {mse.toFixed(4)}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Lower MSE means the predictions stay closer to the real points.
              </p>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Residual Check</p>
              <p className="font-mono text-sm text-foreground mb-2">residual = y - y_hat</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Residuals help you see where the model underpredicts or overpredicts.
              </p>
            </div>

            <div className="p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">R-squared</p>
              <p className="font-mono text-sm text-foreground mb-2">Higher is usually better</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                R-squared measures how much of the variation in the target is explained by the model.
              </p>
            </div>
          </div>

          <div className="lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Evaluation Workflow</p>
            <div className="grid gap-3">
              <div className="p-3 bg-card rounded-lg interactive-shadow">
                <p className="font-mono text-sm text-foreground mb-1">1. Train on training data</p>
                <p className="text-sm text-muted-foreground">Fit the line using known labeled examples.</p>
              </div>
              <div className="p-3 bg-card rounded-lg interactive-shadow">
                <p className="font-mono text-sm text-foreground mb-1">2. Predict on test data</p>
                <p className="text-sm text-muted-foreground">Generate outputs for unseen points.</p>
              </div>
              <div className="p-3 bg-card rounded-lg interactive-shadow">
                <p className="font-mono text-sm text-foreground mb-1">3. Measure error</p>
                <p className="text-sm text-muted-foreground">Use MSE or R-squared to judge fit quality.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "lab" && (
        <>
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

          <div className="flex-1 lab-stage rounded-xl p-4 flex items-center justify-center">
            <svg
              viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
              className="w-full h-auto max-h-[300px]"
            >
              <line x1={PADDING} y1={CANVAS_H - PADDING} x2={CANVAS_W - PADDING} y2={CANVAS_H - PADDING} stroke="hsl(215 16% 75%)" strokeWidth={1} />
              <line x1={PADDING} y1={PADDING} x2={PADDING} y2={CANVAS_H - PADDING} stroke="hsl(215 16% 75%)" strokeWidth={1} />

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

              <line
                x1={lineX1}
                y1={lineY1}
                x2={lineX2}
                y2={lineY2}
                stroke="hsl(221 83% 53%)"
                strokeWidth={2}
              />

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

          <div className="mt-4 bg-foreground/[0.03] rounded-xl p-4 font-mono text-xs">
            <span className="text-muted-foreground">y_hat</span> = <span className="text-primary font-semibold">{slope.toFixed(2)}</span>
            <span className="text-muted-foreground"> * x + </span>
            <span className="text-primary font-semibold">{intercept.toFixed(2)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default LinearRegressionLab;
