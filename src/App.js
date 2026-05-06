import React, { useState } from "react";
import "./App.css";

function App() {
  const [steps, setSteps] = useState([]);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: Date.now(),
        stepKey: "",
        type: "TEXT",
        message: "",
        nextStep: "",
        options: []
      }
    ]);
  };

  const updateStep = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const addOption = (index) => {
    const updated = [...steps];
    updated[index].options.push({
      id: "",
      label: "",
      nextStep: ""
    });
    setSteps(updated);
  };

  const updateOption = (stepIndex, optIndex, field, value) => {
    const updated = [...steps];
    updated[stepIndex].options[optIndex][field] = value;
    setSteps(updated);
  };

  const saveFlow = async () => {
    if (!steps.length) {
      alert("Add at least one step");
      return;
    }

    try {
      // 🔥 Clean data before sending
      const cleanedSteps = steps.map(({ id, ...rest }) => ({
        ...rest,
        options: rest.options?.length ? rest.options : null
      }));

      const response = await fetch("http://localhost:8080/api/flow/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cleanedSteps)
      });

      const data = await response.text();
      alert(data);

    } catch (error) {
      console.error(error);
      alert("Error saving flow ❌");
    }
  };

  return (
    <div className="container">
      <h1>WhatsApp Flow Builder 🚀</h1>

      <button onClick={addStep}>+ Add Step</button>

      {steps.map((step, index) => (
        <div key={step.id} className="card">
          <input
            placeholder="Step Key (START)"
            value={step.stepKey}
            onChange={(e) =>
              updateStep(index, "stepKey", e.target.value.toUpperCase())
            }
          />

          <select
            value={step.type}
            onChange={(e) =>
              updateStep(index, "type", e.target.value)
            }
          >
            <option value="TEXT">Text</option>
            <option value="INPUT">Input</option>
            <option value="BUTTON">Button</option>
            <option value="LIST">List</option>
          </select>

          <textarea
            placeholder="Message"
            value={step.message}
            onChange={(e) =>
              updateStep(index, "message", e.target.value)
            }
          />

          {(step.type === "BUTTON" || step.type === "LIST") && (
            <div className="options">
              <h4>Options</h4>

              {step.options.map((opt, i) => (
                <div key={i} className="option-row">
                  <input
                    placeholder="ID (REGISTER)"
                    value={opt.id}
                    onChange={(e) =>
                      updateOption(index, i, "id", e.target.value.toUpperCase())
                    }
                  />
                  <input
                    placeholder="Label"
                    value={opt.label}
                    onChange={(e) =>
                      updateOption(index, i, "label", e.target.value)
                    }
                  />
                  <input
                    placeholder="Next Step"
                    value={opt.nextStep}
                    onChange={(e) =>
                      updateOption(index, i, "nextStep", e.target.value.toUpperCase())
                    }
                  />
                </div>
              ))}

              <button onClick={() => addOption(index)}>
                + Add Option
              </button>
            </div>
          )}

          <input
            placeholder="Next Step"
            value={step.nextStep}
            onChange={(e) =>
              updateStep(index, "nextStep", e.target.value.toUpperCase())
            }
          />
        </div>
      ))}

      {steps.length > 0 && (
        <button className="save-btn" onClick={saveFlow}>
          Save Flow 💾
        </button>
      )}
    </div>
  );
}

export default App;