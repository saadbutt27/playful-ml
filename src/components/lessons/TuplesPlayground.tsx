import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.2 };

const tupleItems = ["Monday", "Tuesday", "Wednesday", "Thursday"];

const lessonTabs = [
  { id: "create", title: "Create" },
  { id: "immutability", title: "Immutability" },
  { id: "indexing", title: "Indexing" },
  { id: "slicing", title: "Slicing" },
] as const;

type LessonTab = (typeof lessonTabs)[number]["id"];

const TupleChip = ({
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
    className={`min-w-[92px] rounded-lg border p-3 text-center interactive-shadow ${
      active
        ? "border-primary bg-primary text-primary-foreground"
        : "border-border bg-card text-foreground"
    }`}
  >
    <div className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
      ({index})
    </div>
    <div className="mt-1 font-mono text-sm">"{item}"</div>
  </motion.div>
);

const TuplesPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("create");
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [sliceStart, setSliceStart] = useState(1);
  const [sliceEnd, setSliceEnd] = useState(3);

  const selectedItem = tupleItems[selectedIndex];
  const negativeIndex = selectedIndex - tupleItems.length;
  const sliceResult = useMemo(() => tupleItems.slice(sliceStart, sliceEnd), [sliceStart, sliceEnd]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">Tuples</h2>
        <p className="body-text text-sm">
          Tuples are ordered collections like lists, but they cannot be changed after creation.
          Use them when the data should stay fixed.
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
            <pre className="text-foreground whitespace-pre-wrap">{`days = ("Monday", "Tuesday", "Wednesday")\npoint = (3, 7)\nsingle_value = ("apple",)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Tuple Structure</p>
            <div className="flex items-center gap-2 flex-wrap text-2xl text-muted-foreground font-mono">
              <span>(</span>
              {tupleItems.slice(0, 3).map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <TupleChip item={item} index={index} />
                  {index < 2 && <span>,</span>}
                </div>
              ))}
              <span>)</span>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What to Notice</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tuples use parentheses. A one-item tuple needs a trailing comma so Python knows it is still a tuple.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "immutability" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`days = ${JSON.stringify(tupleItems).replace("[", "(").replace("]", ")")}\ndays[1] = "Friday"\n# TypeError: 'tuple' object does not support item assignment`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Fixed Values</p>
            <div className="flex gap-3 flex-wrap mb-4">
              {tupleItems.map((item, index) => (
                <TupleChip key={`${item}-${index}`} item={item} index={index} />
              ))}
            </div>

            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 interactive-shadow">
              <p className="label-text mb-2 text-destructive">Immutability</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You can read values from a tuple, but you cannot replace, append, or remove items from it.
              </p>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Common Uses</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tuples are useful for coordinates, RGB colors, days of the week, or any record that should stay stable.
              </p>
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
              max={tupleItems.length - 1}
              step="1"
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`days = ${JSON.stringify(tupleItems).replace("[", "(").replace("]", ")")}\ndays[${selectedIndex}]   # "${selectedItem}"\ndays[${negativeIndex}]  # "${selectedItem}"`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Index Map</p>
            <div className="grid gap-3">
              <div className="flex gap-3 flex-wrap">
                {tupleItems.map((item, index) => (
                  <div key={`tuple-normal-${item}`} className="text-center">
                    <div className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${index === selectedIndex ? "text-primary" : "text-muted-foreground"}`}>
                      [{index}]
                    </div>
                    <TupleChip item={item} index={index} active={index === selectedIndex} />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 flex-wrap">
                {tupleItems.map((item, index) => (
                  <div key={`tuple-negative-${item}`} className="text-center">
                    <div className={`mb-1 text-[10px] font-bold uppercase tracking-widest ${index === selectedIndex ? "text-primary" : "text-muted-foreground"}`}>
                      [{index - tupleItems.length}]
                    </div>
                    <TupleChip item={item} index={index} active={index === selectedIndex} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Selected Value</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tuple indexing works the same way as list indexing: from the left with positive indices and from the right with negative indices.
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
                max={tupleItems.length}
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
                max={tupleItems.length}
                step="1"
                value={sliceEnd}
                onChange={(e) => setSliceEnd(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </label>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`days = ${JSON.stringify(tupleItems).replace("[", "(").replace("]", ")")}\ndays[${sliceStart}:${sliceEnd}]  # ${JSON.stringify(sliceResult).replace("[", "(").replace("]", ")")}`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Slice Selection</p>
            <div className="flex gap-3 flex-wrap">
              {tupleItems.map((item, index) => {
                const inSlice = index >= sliceStart && index < sliceEnd;
                return <TupleChip key={`tuple-slice-${item}`} item={item} index={index} active={inSlice} />;
              })}
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Result</p>
              <p className="font-mono text-sm text-foreground">
                {JSON.stringify(sliceResult).replace("[", "(").replace("]", ")")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Tuple slicing returns a new tuple containing the selected range.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TuplesPlayground;
