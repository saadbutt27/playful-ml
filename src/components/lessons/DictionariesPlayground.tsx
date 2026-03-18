import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.2 };

const baseDictionary = {
  name: "Ava",
  role: "Student",
  level: "Beginner",
  score: "92",
};

const dictionaryEntries = Object.entries(baseDictionary);

const methodExamples = [
  {
    id: "update",
    label: "update()",
    code: 'profile.update({"level": "Intermediate"})',
    apply: () => ({ ...baseDictionary, level: "Intermediate" }),
    explanation: "Changes existing keys or adds new ones from another dictionary.",
  },
  {
    id: "add",
    label: "Add key",
    code: 'profile["city"] = "Lahore"',
    apply: () => ({ ...baseDictionary, city: "Lahore" }),
    explanation: "Assigning to a new key adds a fresh key-value pair.",
  },
  {
    id: "pop",
    label: "pop()",
    code: 'profile.pop("score")',
    apply: () => {
      const { score, ...rest } = baseDictionary;
      return rest;
    },
    explanation: "Removes a key and returns its value.",
  },
  {
    id: "keys",
    label: "keys()",
    code: "profile.keys()",
    apply: () => ({ keys: Object.keys(baseDictionary).join(", ") }),
    explanation: "Returns a view of all dictionary keys.",
  },
];

const lessonTabs = [
  { id: "create", title: "Create" },
  { id: "lookup", title: "Lookup" },
  { id: "methods", title: "Methods" },
  { id: "update", title: "Update" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const DictionaryRow = ({
  entryKey,
  value,
  active,
}: {
  entryKey: string;
  value: string;
  active?: boolean;
}) => (
  <motion.div
    layout
    transition={transition}
    className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border p-3 interactive-shadow ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-foreground"
    }`}
  >
    <span className={`font-mono text-sm ${active ? "text-primary-foreground" : "text-primary"}`}>{entryKey}</span>
    <span className={`${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>:</span>
    <span className="font-mono text-sm text-right">"{value}"</span>
  </motion.div>
);

const DictionariesPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("create");
  const [selectedKey, setSelectedKey] = useState<(typeof dictionaryEntries)[number][0]>("role");
  const [activeMethod, setActiveMethod] = useState(methodExamples[0]);
  const [nameValue, setNameValue] = useState("Ava");

  const selectedValue = baseDictionary[selectedKey];
  const methodResult = useMemo(() => activeMethod.apply(), [activeMethod]);
  const updatePreview = useMemo(() => ({ ...baseDictionary, name: nameValue }), [nameValue]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Dictionaries</h2>
        <p className="body-text text-sm">
          Dictionaries store data as key-value pairs. Instead of using numeric positions, you look up values by their keys.
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

      {activeTab === "create" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`profile = {\n  "name": "Ava",\n  "role": "Student",\n  "level": "Beginner"\n}`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Key-Value Pairs</p>
            <div className="grid gap-3">
              {dictionaryEntries.slice(0, 3).map(([entryKey, value]) => (
                <DictionaryRow key={entryKey} entryKey={entryKey} value={value} />
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What to Notice</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dictionaries use curly braces. Each key points to a value, which makes them useful for named data.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "lookup" && (
        <>
          <div className="mb-4">
            <span className="label-text block mb-2">Choose a key</span>
            <div className="flex gap-2 flex-wrap">
              {dictionaryEntries.map(([entryKey]) => (
                <button
                  key={entryKey}
                  onClick={() => setSelectedKey(entryKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-smooth ${
                    entryKey === selectedKey
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {entryKey}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`profile = ${JSON.stringify(baseDictionary, null, 2)}\nprofile["${selectedKey}"]   # "${selectedValue}"\nprofile.get("${selectedKey}")  # "${selectedValue}"`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Dictionary Lookup</p>
            <div className="grid gap-3">
              {dictionaryEntries.map(([entryKey, value]) => (
                <DictionaryRow
                  key={entryKey}
                  entryKey={entryKey}
                  value={value}
                  active={entryKey === selectedKey}
                />
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Selected Value</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dictionary access uses keys, not numeric indexes. <span className="font-mono text-foreground">get()</span> is useful when a key might be missing.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "methods" && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {methodExamples.map((example) => (
              <button
                key={example.id}
                onClick={() => setActiveMethod(example)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-smooth ${
                  example.id === activeMethod.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {example.label}
              </button>
            ))}
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`profile = ${JSON.stringify(baseDictionary, null, 2)}\n${activeMethod.code}`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Before</p>
            <div className="grid gap-3 mb-5">
              {dictionaryEntries.map(([entryKey, value]) => (
                <DictionaryRow key={`before-${entryKey}`} entryKey={entryKey} value={value} />
              ))}
            </div>

            <p className="label-text mb-3">After</p>
            <div className="grid gap-3">
              {Object.entries(methodResult).map(([entryKey, value]) => (
                <DictionaryRow key={`after-${entryKey}`} entryKey={entryKey} value={String(value)} active />
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Effect</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{activeMethod.explanation}</p>
            </div>
          </div>
        </>
      )}

      {activeTab === "update" && (
        <>
          <div className="mb-4">
            <label className="block">
              <span className="label-text block mb-1">Change the name value</span>
              <input
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`profile = ${JSON.stringify(baseDictionary, null, 2)}\nprofile["name"] = "${nameValue}"`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Updated Dictionary</p>
            <div className="grid gap-3">
              {Object.entries(updatePreview).map(([entryKey, value]) => (
                <DictionaryRow
                  key={`update-${entryKey}`}
                  entryKey={entryKey}
                  value={String(value)}
                  active={entryKey === "name"}
                />
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Update Rule</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Assigning to an existing key changes its value. Assigning to a new key creates a new entry.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DictionariesPlayground;
