import { useState } from "react";
import { motion } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.2 };

const lessonTabs = [
  { id: "concept", title: "Concept" },
  { id: "split", title: "Train/Test" },
  { id: "sklearn", title: "Scikit-learn" },
  { id: "workflow", title: "Workflow" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const StepCard = ({
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
    <p className="mt-1 text-sm font-mono">{value}</p>
  </motion.div>
);

const SupervisedLearningPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("concept");

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Supervised Learning</h2>
        <p className="body-text text-sm">
          Supervised learning uses labeled examples to learn a mapping from inputs to outputs.
          This lesson covers the core idea, train/test splits, scikit-learn, and the standard model-training workflow.
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
            <pre className="text-foreground whitespace-pre-wrap">{`# Input features -> target label\nX = [[120, 3], [140, 4], [160, 5]]\ny = [0, 1, 1]`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Concept Of Supervised Learning</p>
            <div className="grid gap-3">
              <StepCard label="Input" value="Features X" />
              <StepCard label="Known Answer" value="Labels y" active />
              <StepCard label="Goal" value="Learn a rule from X to y" />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Main Idea</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The model learns from examples where the correct answer is already known.
                Later, it uses that learned pattern to predict outputs for new inputs.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "split" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`from sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Training And Testing Datasets</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Training Set</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Used to teach the model by exposing it to labeled examples.
                </p>
              </div>
              <div className="p-4 bg-card rounded-xl interactive-shadow">
                <p className="label-text mb-2">Test Set</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Held back until the end so you can check how well the model generalizes.
                </p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Why Split Data</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you evaluate on the same data used for training, you can overestimate how good the model really is.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "sklearn" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`from sklearn.linear_model import LinearRegression\n\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Introduction To Scikit-learn</p>
            <div className="grid gap-3">
              <StepCard label="Create" value="model = LinearRegression()" />
              <StepCard label="Train" value="model.fit(X_train, y_train)" active />
              <StepCard label="Predict" value="model.predict(X_test)" />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What Scikit-learn Provides</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Scikit-learn gives a clean, consistent API for splitting data, training models, making predictions, and evaluating performance.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "workflow" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`1. Collect data\n2. Clean and preprocess features\n3. Split train/test\n4. Fit model\n5. Predict\n6. Evaluate`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Model Training Workflow</p>
            <div className="grid gap-3">
              <StepCard label="Step 1" value="Collect and inspect data" />
              <StepCard label="Step 2" value="Clean and preprocess features" />
              <StepCard label="Step 3" value="Split into train and test sets" />
              <StepCard label="Step 4" value="Train the model on X_train and y_train" active />
              <StepCard label="Step 5" value="Predict on X_test" />
              <StepCard label="Step 6" value="Evaluate performance with metrics" />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Why Workflow Matters</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reliable supervised learning depends on the full workflow, not just the model choice.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SupervisedLearningPlayground;
