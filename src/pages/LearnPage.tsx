import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Variable, GitBranch, Repeat, BarChart3, TrendingDown, ChevronRight } from "lucide-react";
import VariablePlayground from "@/components/lessons/VariablePlayground";
import ControlFlowPlayground from "@/components/lessons/ControlFlowPlayground";
import LoopPlayground from "@/components/lessons/LoopPlayground";
import LinearRegressionLab from "@/components/lessons/LinearRegressionLab";
import GradientDescentLab from "@/components/lessons/GradientDescentLab";

const lessons = [
  { id: "variables", title: "Variables", icon: Variable, phase: "Python Foundations", component: VariablePlayground },
  { id: "control-flow", title: "Control Flow", icon: GitBranch, phase: "Python Foundations", component: ControlFlowPlayground },
  { id: "loops", title: "Loops", icon: Repeat, phase: "Python Foundations", component: LoopPlayground },
  { id: "linear-regression", title: "Linear Regression", icon: BarChart3, phase: "Machine Learning", component: LinearRegressionLab },
  { id: "gradient-descent", title: "Gradient Descent", icon: TrendingDown, phase: "Machine Learning", component: GradientDescentLab },
];

const phases = [...new Set(lessons.map((l) => l.phase))];

const LearnPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get("lesson") || "variables";
  const activeLesson = lessons.find((l) => l.id === activeId) || lessons[0];
  const ActiveComponent = activeLesson.component;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border p-4 flex flex-col shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-[10px]">L</span>
          </div>
          <span className="font-semibold text-sm text-foreground tracking-tight">Lumen ML</span>
        </div>

        {phases.map((phase) => (
          <div key={phase} className="mb-4">
            <p className="label-text mb-2">{phase}</p>
            <div className="space-y-0.5">
              {lessons
                .filter((l) => l.phase === phase)
                .map((lesson) => {
                  const isActive = lesson.id === activeId;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSearchParams({ lesson: lesson.id })}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ease-smooth ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <lesson.icon className="w-4 h-4 shrink-0" />
                      {lesson.title}
                      {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default LearnPage;
