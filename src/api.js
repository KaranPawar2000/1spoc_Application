const BASE_URL = "http://localhost:8080";

export const saveFlowApi = async (steps) => {
  const response = await fetch(`${BASE_URL}/api/flow/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(steps)
  });

  if (!response.ok) {
    throw new Error("Failed to save flow");
  }

  return response.text();
};