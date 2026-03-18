import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const transition = {
  type: "tween" as const,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  duration: 0.2,
};

const lessonTabs = [
  { id: "concept", title: "Concept" },
  { id: "logistic", title: "Logistic Regression" },
  { id: "metrics", title: "Metrics" },
  { id: "lab", title: "Lab" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const InfoCard = ({
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
    <p
      className={`text-[10px] font-bold uppercase tracking-widest ${
        active ? "text-primary-foreground/70" : "text-muted-foreground"
      }`}
    >
      {label}
    </p>
    <p className="mt-1 text-sm font-mono">{value}</p>
  </motion.div>
);

const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const sampleHours = [1, 2, 3, 4, 5, 6, 7, 8];
const graphWidth = 420;
const graphHeight = 260;
const graphPadding = 32;

const scaleGraphX = (value: number) =>
  graphPadding + (value / 10) * (graphWidth - graphPadding * 2);
const scaleGraphY = (value: number) =>
  graphHeight - graphPadding - value * (graphHeight - graphPadding * 2);

const ClassificationPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("concept");
  const [hoursStudied, setHoursStudied] = useState(4);
  const [threshold, setThreshold] = useState(0.5);

  const probability = useMemo(() => sigmoid(-4 + hoursStudied), [hoursStudied]);
  const predictedClass = probability >= threshold ? 1 : 0;
  const confusion = {
    tp: 18,
    tn: 14,
    fp: 3,
    fn: 5,
  };
  const total = confusion.tp + confusion.tn + confusion.fp + confusion.fn;
  const accuracy = ((confusion.tp + confusion.tn) / total) * 100;
  const sigmoidPath = useMemo(() => {
    const points = Array.from({ length: 101 }, (_, index) => {
      const x = index / 10;
      const y = sigmoid(-4 + x);
      return `${index === 0 ? "M" : "L"} ${scaleGraphX(x)} ${scaleGraphY(y)}`;
    });
    return points.join(" ");
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Classification</h2>
        <p className="body-text text-sm">
          Classification predicts categories instead of continuous values.
          This lesson introduces classification, logistic regression, and the basic evaluation metrics used for classification models.
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

      {activeTab === "concept" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`# Example: will a student pass?\nX = [[2], [4], [6], [8]]\ny = [0, 0, 1, 1]  # 0 = fail, 1 = pass`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Introduction To Classification</p>
            <div className="grid gap-3">
              <InfoCard label="Input" value="Features X" />
              <InfoCard label="Output" value="Class label: 0 or 1" active />
              <InfoCard label="Goal" value="Assign each input to a category" />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Regression vs Classification</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Regression predicts numeric values such as prices or temperatures.
                  Classification predicts labels such as spam or not spam, pass or fail, fraud or not fraud.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Typical Output</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The model often estimates a probability first, then converts that probability into a class label using a decision threshold.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "logistic" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`from sklearn.linear_model import LogisticRegression\n\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)\nprobabilities = model.predict_proba(X_test)\npredictions = model.predict(X_test)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Logistic Regression</p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Core Equation</p>
                <p className="font-mono text-sm text-foreground mb-3">p = 1 / (1 + e^-z)</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Logistic regression takes a linear score <span className="font-mono text-foreground">z</span>
                  and pushes it through the sigmoid function so the output becomes a probability between 0 and 1.
                </p>
              </div>

              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">From Probability To Class</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  After computing a probability, the model compares it with a threshold such as
                  <span className="font-mono text-foreground"> 0.5</span>. If the probability is high enough,
                  the model predicts class 1. Otherwise it predicts class 0.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <InfoCard label="Step 1" value="Compute a linear score z = b0 + b1*x" />
              <InfoCard label="Step 2" value="Convert z into probability with the sigmoid function" active />
              <InfoCard label="Step 3" value="Use a threshold to assign class 0 or class 1" />
            </div>

            <div className="mt-4 p-4 bg-card rounded-xl interactive-shadow">
              <p className="label-text mb-2">Scikit-learn Workflow</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                In practice, you train with <span className="font-mono text-foreground">fit()</span>,
                inspect probabilities with <span className="font-mono text-foreground">predict_proba()</span>,
                and get final labels with <span className="font-mono text-foreground">predict()</span>.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "lab" && (
        <>
          <div className="flex gap-6 mb-4">
            <label className="flex-1">
              <span className="label-text block mb-1">Hours Studied: {hoursStudied}</span>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={hoursStudied}
                onChange={(e) => setHoursStudied(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
            <label className="flex-1">
              <span className="label-text block mb-1">Threshold: {threshold.toFixed(2)}</span>
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.05}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-3">
              <InfoCard label="Linear Score z" value={`-4 + ${hoursStudied} = ${(hoursStudied - 4).toFixed(1)}`} />
              <InfoCard label="Probability" value={`${probability.toFixed(3)} chance of class 1`} active />
              <InfoCard label="Prediction" value={predictedClass === 1 ? "1 = Pass" : "0 = Fail"} />
            </div>

            <div className="lab-stage rounded-xl p-4">
              <p className="label-text mb-3">Classification Lab</p>
              <div className="grid grid-cols-4 gap-2">
                {sampleHours.map((hour) => {
                  const pointProbability = sigmoid(-4 + hour);
                  const isPositive = pointProbability >= threshold;
                  const isSelected = hour === hoursStudied;

                  return (
                    <motion.div
                      key={hour}
                      layout
                      transition={transition}
                      className={`rounded-lg border p-3 text-center interactive-shadow ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card"
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">x = {hour}</p>
                      <p className={`mt-2 text-sm font-mono ${isPositive ? "text-primary" : "text-muted-foreground"}`}>
                        {pointProbability.toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{isPositive ? "Class 1" : "Class 0"}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl bg-card p-4 interactive-shadow">
                <p className="label-text mb-3">Sigmoid Probability Curve</p>
                <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-auto">
                  <line
                    x1={graphPadding}
                    y1={graphHeight - graphPadding}
                    x2={graphWidth - graphPadding}
                    y2={graphHeight - graphPadding}
                    stroke="hsl(215 16% 75%)"
                    strokeWidth={1}
                  />
                  <line
                    x1={graphPadding}
                    y1={graphPadding}
                    x2={graphPadding}
                    y2={graphHeight - graphPadding}
                    stroke="hsl(215 16% 75%)"
                    strokeWidth={1}
                  />

                  <line
                    x1={graphPadding}
                    y1={scaleGraphY(threshold)}
                    x2={graphWidth - graphPadding}
                    y2={scaleGraphY(threshold)}
                    stroke="hsl(0 84% 60%)"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                  />

                  <line
                    x1={scaleGraphX(hoursStudied)}
                    y1={graphPadding}
                    x2={scaleGraphX(hoursStudied)}
                    y2={graphHeight - graphPadding}
                    stroke="hsl(221 83% 53%)"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    opacity={0.7}
                  />

                  <path
                    d={sigmoidPath}
                    fill="none"
                    stroke="hsl(221 83% 53%)"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />

                  <motion.circle
                    key={`${hoursStudied}-${threshold}`}
                    initial={{ r: 5 }}
                    animate={{ r: 7 }}
                    cx={scaleGraphX(hoursStudied)}
                    cy={scaleGraphY(probability)}
                    fill={predictedClass === 1 ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)"}
                    stroke="white"
                    strokeWidth={2}
                  />

                  <text
                    x={graphPadding}
                    y={graphPadding - 8}
                    className="fill-muted-foreground"
                    fontSize="11"
                  >
                    Probability
                  </text>
                  <text
                    x={graphWidth - graphPadding - 36}
                    y={graphHeight - 10}
                    className="fill-muted-foreground"
                    fontSize="11"
                  >
                    Input x
                  </text>
                  <text
                    x={graphPadding + 8}
                    y={scaleGraphY(threshold) - 6}
                    fill="hsl(0 84% 60%)"
                    fontSize="11"
                  >
                    Threshold {threshold.toFixed(2)}
                  </text>
                </svg>
              </div>

              <div className="mt-4 p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">What To Watch</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Move the threshold higher to make class 1 harder to predict. Move the selected input left or right
                  to see how the sigmoid changes the probability before the final class decision is made.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "metrics" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`from sklearn.metrics import accuracy_score, confusion_matrix\n\naccuracy = accuracy_score(y_test, predictions)\ncm = confusion_matrix(y_test, predictions)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Model Evaluation Metrics</p>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <InfoCard label="True Positive" value={String(confusion.tp)} active />
              <InfoCard label="False Positive" value={String(confusion.fp)} />
              <InfoCard label="False Negative" value={String(confusion.fn)} />
              <InfoCard label="True Negative" value={String(confusion.tn)} />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-3">Confusion Matrix</p>
                <div className="grid grid-cols-2 gap-2 text-center text-sm font-mono">
                  <div className="rounded-lg bg-secondary p-3 text-muted-foreground">Pred 0</div>
                  <div className="rounded-lg bg-secondary p-3 text-muted-foreground">Pred 1</div>
                  <div className="rounded-lg bg-secondary p-3 text-muted-foreground">Actual 0: TN {confusion.tn}</div>
                  <div className="rounded-lg bg-secondary p-3 text-muted-foreground">Actual 0: FP {confusion.fp}</div>
                  <div className="rounded-lg bg-secondary p-3 text-muted-foreground">Actual 1: FN {confusion.fn}</div>
                  <div className="rounded-lg bg-primary/10 p-3 text-primary">Actual 1: TP {confusion.tp}</div>
                </div>
              </div>

              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Accuracy</p>
                <p className="text-2xl font-semibold text-foreground">{accuracy.toFixed(1)}%</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Accuracy is the proportion of correct predictions:
                  <span className="font-mono text-foreground"> (TP + TN) / Total </span>
                </p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  The confusion matrix gives more detail than accuracy alone because it shows where the model makes mistakes.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassificationPlayground;
