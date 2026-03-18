import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Brain, Code2, Layers } from "lucide-react";

const HeroIllustration = () => (
  <div className="relative w-full max-w-lg mx-auto">
    <div className="lab-stage rounded-2xl p-8 card-shadow relative overflow-hidden h-72">
      {/* Scatter points */}
      {[
        { x: 15, y: 70 }, { x: 25, y: 55 }, { x: 35, y: 50 },
        { x: 45, y: 38 }, { x: 55, y: 30 }, { x: 65, y: 25 },
        { x: 75, y: 18 }, { x: 30, y: 60 }, { x: 50, y: 42 },
        { x: 60, y: 35 }, { x: 70, y: 22 }, { x: 40, y: 48 },
      ].map((point, i) => (
        <motion.div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-full bg-primary"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 + i * 0.06, duration: 0.3 }}
        />
      ))}
      {/* Regression line */}
      <motion.div
        className="absolute h-[2px] bg-primary origin-left"
        style={{ left: "10%", top: "72%", width: "75%", rotate: "-35deg" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      />
      {/* Labels */}
      <motion.div
        className="absolute bottom-4 right-4 label-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        MSE: 0.042
      </motion.div>
    </div>
  </div>
);

const features = [
  {
    icon: Code2,
    title: "Python Foundations",
    description: "Variables, loops, and functions — visualized as memory boxes and flow diagrams.",
  },
  {
    icon: BarChart3,
    title: "Linear Regression",
    description: "Drag a line through data points and watch the error update in real-time.",
  },
  {
    icon: Brain,
    title: "Classification",
    description: "Move decision boundaries and see how models separate data classes.",
  },
  {
    icon: Layers,
    title: "Decision Trees",
    description: "Build trees interactively and trace decision paths for any input.",
  },
];

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.5 };

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ML</span>
          </div>
          <span className="font-semibold text-foreground tracking-tight">Machine Learning</span>
        </div>
        <Link
          to="/learn"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 ease-smooth"
        >
          Start Learning
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, duration: 0.6 }}
          >
            <p className="label-text mb-4">Interactive Machine Learning</p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-[-0.04em] text-foreground leading-[1.1] mb-6">
              See the math.
              <br />
              Move the data.
            </h1>
            <p className="body-text max-w-md mb-8">
              Understand machine learning by interacting with live visualizations.
              No memorization — just intuition built through experimentation.
            </p>
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity duration-200 ease-smooth"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.2, duration: 0.6 }}
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 pb-32">
        <motion.p
          className="label-text mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          What you'll explore
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="p-5 rounded-xl bg-card card-shadow hover:card-shadow-hover transition-shadow duration-200 ease-smooth"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.5 + i * 0.1 }}
            >
              <feature.icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-semibold text-sm text-foreground mb-1.5">{feature.title}</h3>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-8 py-8 border-t border-border">
        <p className="text-[13px] text-muted-foreground">
          ML — Learn by doing, not by reading.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
