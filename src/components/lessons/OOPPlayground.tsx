import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const transition = { type: "tween" as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.2 };

const lessonTabs = [
  { id: "classes", title: "Classes" },
  { id: "objects", title: "Objects" },
  { id: "encapsulation", title: "Encapsulation" },
  { id: "inheritance", title: "Inheritance" },
  { id: "polymorphism", title: "Polymorphism" },
  { id: "abstraction", title: "Abstraction" },
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
    <p className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
      {label}
    </p>
    <p className="mt-1 font-mono text-sm">{value}</p>
  </motion.div>
);

const OOPPlayground = () => {
  const [activeTab, setActiveTab] = useState<LessonTab>("classes");
  const [studentName, setStudentName] = useState("Ava");
  const [studentLevel, setStudentLevel] = useState("Beginner");
  const [vehicleType, setVehicleType] = useState("Car");

  const speakResult = useMemo(() => {
    switch (vehicleType) {
      case "Car":
        return 'car.move() -> "Driving on the road"';
      case "Boat":
        return 'boat.move() -> "Sailing on water"';
      default:
        return 'plane.move() -> "Flying in the sky"';
    }
  }, [vehicleType]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight mb-1">OOP</h2>
        <p className="body-text text-sm">
          Object-oriented programming organizes code around classes and objects. Learn how Python models real-world things and the four main OOP pillars.
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

      {activeTab === "classes" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`class Student:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Class Blueprint</p>
            <div className="grid gap-3">
              <InfoCard label="Class Name" value="Student" active />
              <InfoCard label="Attribute" value="name" />
              <InfoCard label="Attribute" value="level" />
              <InfoCard label="Special Method" value="__init__(self, name, level)" />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What a Class Is</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A class is a blueprint. It defines what data an object will store and what behavior it can have.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "objects" && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <label className="block">
              <span className="label-text block mb-1">Student name</span>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <label className="block">
              <span className="label-text block mb-1">Student level</span>
              <input
                type="text"
                value={studentLevel}
                onChange={(e) => setStudentLevel(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`student = Student("${studentName}", "${studentLevel}")\nprint(student.name)\nprint(student.level)`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Object Instance</p>
            <div className="grid gap-3">
              <InfoCard label="Object" value="student" active />
              <InfoCard label="name" value={`"${studentName}"`} />
              <InfoCard label="level" value={`"${studentLevel}"`} />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">What an Object Is</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An object is a real instance of a class. You can create many objects from one class blueprint.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "encapsulation" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`class BankAccount:\n    def __init__(self, balance):\n        self.__balance = balance\n\n    def deposit(self, amount):\n        self.__balance += amount`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Encapsulation</p>
            <div className="grid gap-3">
              <InfoCard label="Private Data" value="self.__balance" active />
              <InfoCard label="Public Method" value="deposit(amount)" />
              <InfoCard label="Purpose" value="Protect internal state" />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Pillar 1</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Encapsulation bundles data and methods together, and hides sensitive internal details behind safe methods.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "inheritance" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`class Animal:\n    def speak(self):\n        return "sound"\n\nclass Dog(Animal):\n    def speak(self):\n        return "woof"`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Inheritance Tree</p>
            <div className="grid gap-3">
              <InfoCard label="Parent Class" value="Animal" />
              <InfoCard label="Child Class" value="Dog(Animal)" active />
              <InfoCard label="Inherited Idea" value="speak()" />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Pillar 2</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Inheritance lets one class reuse and extend the behavior of another class.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "polymorphism" && (
        <>
          <div className="mb-4">
            <span className="label-text block mb-2">Choose an object type</span>
            <div className="flex gap-2 flex-wrap">
              {["Car", "Boat", "Plane"].map((type) => (
                <button
                  key={type}
                  onClick={() => setVehicleType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-smooth ${
                    type === vehicleType
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`class Vehicle:\n    def move(self):\n        pass\n\nclass Car(Vehicle):\n    def move(self):\n        return "Driving on the road"`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Polymorphism</p>
            <div className="grid gap-3">
              <InfoCard label="Shared Method" value="move()" />
              <InfoCard label="Object Type" value={vehicleType} active />
              <InfoCard label="Result" value={speakResult} />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Pillar 3</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Polymorphism means different objects can respond to the same method name in their own way.
              </p>
            </div>
          </div>
        </>
      )}

      {activeTab === "abstraction" && (
        <>
          <div className="bg-foreground/[0.03] rounded-xl p-4 font-mono text-sm mb-4">
            <pre className="text-foreground whitespace-pre-wrap">{`class Shape:\n    def area(self):\n        raise NotImplementedError\n\nclass Circle(Shape):\n    def area(self):\n        return 3.14 * r * r`}</pre>
          </div>

          <div className="flex-1 lab-stage rounded-xl p-4">
            <p className="label-text mb-3">Abstraction</p>
            <div className="grid gap-3">
              <InfoCard label="General Idea" value="Shape" />
              <InfoCard label="Hidden Detail" value="How each area is calculated" active />
              <InfoCard label="Concrete Class" value="Circle" />
            </div>

            <div className="mt-4 p-3 bg-card rounded-lg interactive-shadow">
              <p className="label-text mb-2">Pillar 4</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Abstraction shows only the essential interface and hides implementation details that the user of the class does not need to see.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OOPPlayground;
