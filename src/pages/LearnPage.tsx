import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Variable, GitBranch, Repeat, List, BetweenHorizontalStart, BookKey, Braces, Boxes, Sigma, Table, LineChart, Search, SlidersHorizontal, GraduationCap, BarChart3, TrendingDown, Binary, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import VariablePlayground from "@/components/lessons/VariablePlayground";
import ControlFlowPlayground from "@/components/lessons/ControlFlowPlayground";
import LoopPlayground from "@/components/lessons/LoopPlayground";
import ListsPlayground from "@/components/lessons/ListsPlayground";
import TuplesPlayground from "@/components/lessons/TuplesPlayground";
import DictionariesPlayground from "@/components/lessons/DictionariesPlayground";
import FunctionsPlayground from "@/components/lessons/FunctionsPlayground";
import OOPPlayground from "@/components/lessons/OOPPlayground";
import NumpyPlayground from "@/components/lessons/NumpyPlayground";
import PandasPlayground from "@/components/lessons/PandasPlayground";
import DataVisualizationPlayground from "@/components/lessons/DataVisualizationPlayground";
import EDAPlayground from "@/components/lessons/EDAPlayground";
import DataCleaningPlayground from "@/components/lessons/DataCleaningPlayground";
import SupervisedLearningPlayground from "@/components/lessons/SupervisedLearningPlayground";
import ClassificationPlayground from "@/components/lessons/ClassificationPlayground";
import LinearRegressionLab from "@/components/lessons/LinearRegressionLab";
import GradientDescentLab from "@/components/lessons/GradientDescentLab";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const lessons = [
  { id: "variables", title: "Variables", icon: Variable, phase: "Python Foundations", component: VariablePlayground },
  { id: "control-flow", title: "Control Flow", icon: GitBranch, phase: "Python Foundations", component: ControlFlowPlayground },
  { id: "lists", title: "Lists", icon: List, phase: "Python Foundations", component: ListsPlayground },
  { id: "tuples", title: "Tuples", icon: BetweenHorizontalStart, phase: "Python Foundations", component: TuplesPlayground },
  { id: "dictionaries", title: "Dictionaries", icon: BookKey, phase: "Python Foundations", component: DictionariesPlayground },
  { id: "loops", title: "Loops", icon: Repeat, phase: "Python Foundations", component: LoopPlayground },
  { id: "functions", title: "Functions", icon: Braces, phase: "Python Foundations", component: FunctionsPlayground },
  { id: "oop", title: "OOP", icon: Boxes, phase: "Python Foundations", component: OOPPlayground },
  { id: "numpy", title: "NumPy", icon: Sigma, phase: "Python Foundations", component: NumpyPlayground },
  { id: "pandas", title: "Pandas", icon: Table, phase: "Python Foundations", component: PandasPlayground },
  { id: "data-cleaning", title: "Data Cleaning", icon: SlidersHorizontal, phase: "Python Foundations", component: DataCleaningPlayground },
  { id: "data-visualization", title: "Data Visualization", icon: LineChart, phase: "Python Foundations", component: DataVisualizationPlayground },
  { id: "eda", title: "EDA", icon: Search, phase: "Python Foundations", component: EDAPlayground },
  { id: "supervised-learning", title: "Supervised Learning", icon: GraduationCap, phase: "Machine Learning", component: SupervisedLearningPlayground },
  { id: "linear-regression", title: "Linear Regression", icon: BarChart3, phase: "Machine Learning", component: LinearRegressionLab },
  { id: "gradient-descent", title: "Gradient Descent", icon: TrendingDown, phase: "Machine Learning", component: GradientDescentLab },
  { id: "classification", title: "Classification", icon: Binary, phase: "Machine Learning", component: ClassificationPlayground },
];

const phases = [...new Set(lessons.map((l) => l.phase))];

const LearnPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const activeId = searchParams.get("lesson") || "variables";
  const activeLesson = lessons.find((l) => l.id === activeId) || lessons[0];
  const ActiveComponent = activeLesson.component;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`border-r border-border p-4 flex flex-col shrink-0 transition-all duration-200 ease-smooth ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className={`flex items-center mb-6 ${isSidebarCollapsed ? "justify-center" : "justify-between gap-2"}`}>
          {!isSidebarCollapsed && (
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 min-w-0"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="truncate">Back to Home</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors duration-200"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        <div className={`flex items-center mb-6 ${isSidebarCollapsed ? "justify-center" : "gap-2"}`}>
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-[10px]">ML</span>
          </div>
          {!isSidebarCollapsed && (
            <span className="font-semibold text-sm text-foreground tracking-tight">Machine Learning</span>
          )}
        </div>

        {phases.map((phase) => (
          <div key={phase} className="mb-4">
            {isSidebarCollapsed ? (
              <div className="h-px bg-border mb-3 mx-2" />
            ) : (
              <p className="label-text mb-2">{phase}</p>
            )}
            <div className="space-y-0.5">
              {lessons
                .filter((l) => l.phase === phase)
                .map((lesson) => {
                  const isActive = lesson.id === activeId;
                  const lessonButton = (
                    <button
                      key={lesson.id}
                      onClick={() => setSearchParams({ lesson: lesson.id })}
                      className={`w-full flex items-center rounded-lg text-sm transition-all duration-200 ease-smooth ${
                        isSidebarCollapsed
                          ? "justify-center px-2 py-2.5"
                          : "gap-2.5 px-3 py-2"
                      } ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                      aria-label={lesson.title}
                    >
                      <lesson.icon className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && (
                        <>
                          {lesson.title}
                          {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                        </>
                      )}
                    </button>
                  );

                  return isSidebarCollapsed ? (
                    <Tooltip key={lesson.id}>
                      <TooltipTrigger asChild>{lessonButton}</TooltipTrigger>
                      <TooltipContent side="right">{lesson.title}</TooltipContent>
                    </Tooltip>
                  ) : (
                    lessonButton
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
