import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.2 };

const baseItems = ["apple", "banana", "mango", "kiwi", "orange"];

const functionExamples = [
  {
    id: "append",
    label: "append()",
    code: 'fruits.append("grape")',
    apply: (items: string[]) => [...items, "grape"],
    explanation: "Adds one item to the end of the list.",
  },
  {
    id: "insert",
    label: "insert()",
    code: 'fruits.insert(1, "pear")',
    apply: (items: string[]) => {
      const next = [...items];
      next.splice(1, 0, "pear");
      return next;
    },
    explanation: "Places a new item at a specific position.",
  },
  {
    id: "remove",
    label: "remove()",
    code: 'fruits.remove("banana")',
    apply: (items: string[]) => items.filter((item) => item !== "banana"),
    explanation: "Removes the first matching value from the list.",
  },
  {
    id: "pop",
    label: "pop()",
    code: "last_item = fruits.pop()",
    apply: (items: string[]) => items.slice(0, -1),
    explanation: "Removes and returns the last item by default.",
  },
  {
    id: "sort",
    label: "sort()",
    code: "fruits.sort()",
    apply: (items: string[]) => [...items].sort(),
    explanation: "Reorders the list in place.",
  },
];

const lessonTabs = [
  { id: "create", title: "Create" },
  { id: "functions", title: "Functions" },
  { id: "indexing", title: "Indexing" },
  { id: "slicing", title: "Slicing" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const ListChip = ({
  item,
  index,
  active,
}: {
  item: string;
  index: number;
  active?: boolean;
}) => (
  <motion.div
    layout
    transition={transition}
    className={`min-w-[86px] rounded-lg p-3 text-center interactive-shadow ${
      active ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
    }`}
  >
    <div className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
      [{index}]
    </div>
    <div className="font-mono text-sm mt-1">"{item}"</div>
  </motion.div>
);

const ListsPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("create");
  const [activeFunction, setActiveFunction] = useState(functionExamples[0]);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [sliceStart, setSliceStart] = useState(1);
  const [sliceEnd, setSliceEnd] = useState(4);

  const functionResult = useMemo(() => activeFunction.apply(baseItems), [activeFunction]);
  const selectedItem = baseItems[selectedIndex];
  const negativeIndex = selectedIndex - baseItems.length;
  const sliceResult = useMemo(() => baseItems.slice(sliceStart, sliceEnd), [sliceStart, sliceEnd]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Lists</h2>
        <p className="body-text text-sm">
          Learn how Python lists store many values in order. Explore creation, common list functions,
          positive and negative indexing, and slicing.
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
            <pre className="text-foreground whitespace-pre-wrap">{`fruits = ["apple", "banana", "mango"]\ncolors = list(("red", "blue", "green"))`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">List Memory</p>
            <div className="flex gap-3 flex-wrap">
              {baseItems.slice(0, 3).map((item, index) => (
                <ListChip key={item} item={item} index={index} />
              ))}
            </div>
            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What to Notice</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Lists use square brackets, keep their order, and can hold multiple values in one variable.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "functions" && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {functionExamples.map((example) => (
              <button
                key={example.id}
                onClick={() => setActiveFunction(example)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-smooth ${
                  example.id === activeFunction.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {example.label}
              </button>
            ))}
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`fruits = ${JSON.stringify(baseItems)}\n${activeFunction.code}`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Before</p>
            <div className="flex gap-3 flex-wrap mb-5">
              {baseItems.map((item, index) => (
                <ListChip key={`${item}-${index}`} item={item} index={index} />
              ))}
            </div>

            <p className="label-text mb-3">After</p>
            <div className="flex gap-3 flex-wrap">
              {functionResult.map((item, index) => (
                <ListChip key={`${item}-${index}`} item={item} index={index} active />
              ))}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Effect</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{activeFunction.explanation}</p>
            </div>
          </div>
        </>
      )}

      {activeTab === "indexing" && (
        <>
          <div className="mb-4">
            <span className="label-text block mb-1">Choose an index: {selectedIndex}</span>
            <input
              type="range"
              min="0"
              max={baseItems.length - 1}
              step="1"
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`fruits = ${JSON.stringify(baseItems)}\nfruits[${selectedIndex}]   # "${selectedItem}"\nfruits[${negativeIndex}]  # "${selectedItem}"`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Index Map</p>
            <div className="grid gap-3">
              <div className="flex gap-3 flex-wrap">
                {baseItems.map((item, index) => (
                  <div key={`normal-${item}`} className="text-center">
                    <div className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${index === selectedIndex ? "text-primary" : "text-muted-foreground"}`}>
                      [{index}]
                    </div>
                    <ListChip item={item} index={index} active={index === selectedIndex} />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap">
                {baseItems.map((item, index) => (
                  <div key={`negative-${item}`} className="text-center">
                    <div className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${index === selectedIndex ? "text-primary" : "text-muted-foreground"}`}>
                      [{index - baseItems.length}]
                    </div>
                    <ListChip item={item} index={index} active={index === selectedIndex} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Selected Value</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Positive indexing counts from the left starting at <span className="font-mono text-foreground">0</span>.
                Negative indexing counts from the right starting at <span className="font-mono text-foreground">-1</span>.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "slicing" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <label>
              <span className="label-text block mb-1">Start: {sliceStart}</span>
              <input
                type="range"
                min="0"
                max={baseItems.length}
                step="1"
                value={sliceStart}
                onChange={(e) => setSliceStart(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </label>

            <label>
              <span className="label-text block mb-1">End: {sliceEnd}</span>
              <input
                type="range"
                min="0"
                max={baseItems.length}
                step="1"
                value={sliceEnd}
                onChange={(e) => setSliceEnd(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`fruits = ${JSON.stringify(baseItems)}\nfruits[${sliceStart}:${sliceEnd}]  # ${JSON.stringify(sliceResult)}`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Slice Selection</p>
            <div className="flex gap-3 flex-wrap">
              {baseItems.map((item, index) => {
                const inSlice = index >= sliceStart && index < sliceEnd;
                return <ListChip key={`slice-${item}`} item={item} index={index} active={inSlice} />;
              })}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Result</p>
              <p className="font-mono text-sm text-foreground">{JSON.stringify(sliceResult)}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Slicing includes the start index and stops before the end index.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ListsPlayground;
