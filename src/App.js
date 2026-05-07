import React, { useState } from "react";
import "./App.css";
import { saveFlowApi } from "./api";

function App() {

  const [steps, setSteps] = useState([]);

  // ================= ADD STEP =================

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

  // ================= UPDATE STEP =================

  const updateStep = (index, field, value) => {

    const updated = [...steps];

    updated[index][field] = value;

    setSteps(updated);
  };

  // ================= DELETE STEP =================

  const deleteStep = (index) => {

    const updated = [...steps];

    updated.splice(index, 1);

    setSteps(updated);
  };

  // ================= ADD OPTION =================

  const addOption = (stepIndex) => {

    const updated = [...steps];

    updated[stepIndex].options.push({
      id: "",
      label: "",
      nextStep: ""
    });

    setSteps(updated);
  };

  // ================= UPDATE OPTION =================

  const updateOption = (stepIndex, optIndex, field, value) => {

    const updated = [...steps];

    updated[stepIndex].options[optIndex][field] = value;

    setSteps(updated);
  };

  // ================= DELETE OPTION =================

  const deleteOption = (stepIndex, optIndex) => {

    const updated = [...steps];

    updated[stepIndex].options.splice(optIndex, 1);

    setSteps(updated);
  };

  // ================= SAVE FLOW =================

  const saveFlow = async () => {

    if (!steps.length) {
      alert("Please add at least one step");
      return;
    }

    try {

      // Remove frontend ids
      const cleanedSteps = steps.map(({ id, ...rest }) => ({
        ...rest,
        options:
          rest.options && rest.options.length > 0
            ? rest.options
            : null
      }));

      const response = await saveFlowApi(cleanedSteps);

      alert(response);

    } catch (error) {

      console.error(error);

      alert("Error saving flow ❌");
    }
  };

  return (
    <div className="container">

      <h1>WhatsApp Flow Builder 🚀</h1>

      <button className="add-btn" onClick={addStep}>
        + Add Step
      </button>

      {steps.map((step, index) => (

        <div key={step.id} className="card">

          <div className="header">

            <h3>Step {index + 1}</h3>

            <button
              className="delete-btn"
              onClick={() => deleteStep(index)}
            >
              Delete
            </button>

          </div>

          {/* STEP KEY */}

          <label>Step Key</label>

          <input
            placeholder="START"
            value={step.stepKey}
            onChange={(e) =>
              updateStep(
                index,
                "stepKey",
                e.target.value.toUpperCase()
              )
            }
          />

          {/* TYPE */}

          <label>Type</label>

          <select
            value={step.type}
            onChange={(e) =>
              updateStep(index, "type", e.target.value)
            }
          >
            <option value="TEXT">TEXT</option>
            <option value="INPUT">INPUT</option>
            <option value="BUTTON">BUTTON</option>
            <option value="LIST">LIST</option>
          </select>

          {/* MESSAGE */}

          <label>Message</label>

          <textarea
            rows="4"
            placeholder="Enter message"
            value={step.message}
            onChange={(e) =>
              updateStep(index, "message", e.target.value)
            }
          />

          {/* OPTIONS */}

          {(step.type === "BUTTON" ||
            step.type === "LIST") && (

            <div className="options">

              <div className="option-header">

                <h4>Options</h4>

                <button
                  className="small-btn"
                  onClick={() => addOption(index)}
                >
                  + Add Option
                </button>

              </div>

              {step.options.map((opt, optIndex) => (

                <div
                  key={optIndex}
                  className="option-card"
                >

                  <input
                    placeholder="Option ID"
                    value={opt.id}
                    onChange={(e) =>
                      updateOption(
                        index,
                        optIndex,
                        "id",
                        e.target.value.toUpperCase()
                      )
                    }
                  />

                  <input
                    placeholder="Label"
                    value={opt.label}
                    onChange={(e) =>
                      updateOption(
                        index,
                        optIndex,
                        "label",
                        e.target.value
                      )
                    }
                  />

                  <input
                    placeholder="Next Step"
                    value={opt.nextStep}
                    onChange={(e) =>
                      updateOption(
                        index,
                        optIndex,
                        "nextStep",
                        e.target.value.toUpperCase()
                      )
                    }
                  />

                  <button
                    className="delete-option"
                    onClick={() =>
                      deleteOption(index, optIndex)
                    }
                  >
                    X
                  </button>

                </div>
              ))}
            </div>
          )}

          {/* NEXT STEP */}

          {(step.type === "TEXT" ||
            step.type === "INPUT") && (

            <>
              <label>Next Step</label>

              <input
                placeholder="NEXT_STEP"
                value={step.nextStep}
                onChange={(e) =>
                  updateStep(
                    index,
                    "nextStep",
                    e.target.value.toUpperCase()
                  )
                }
              />
            </>
          )}

        </div>
      ))}

      {steps.length > 0 && (
        <button
          className="save-btn"
          onClick={saveFlow}
        >
          Save Flow 💾
        </button>
      )}

      {/* FLOW PREVIEW */}

      {steps.length > 0 && (

        <div className="preview">

          <h2>Flow JSON Preview</h2>

          <pre>
            {JSON.stringify(steps, null, 2)}
          </pre>

        </div>
      )}
    </div>
  );
}

export default App;