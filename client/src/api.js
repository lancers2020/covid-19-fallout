const API_URL = "http://localhost:4000/api";

export async function startGame(name) {
  const res = await fetch(`${API_URL}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function performAction(name, action) {
  const res = await fetch(`${API_URL}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, action }),
  });
  return res.json();
}

// New function to clear the player's data from the Redis-like app
export async function quitGame(name) {
  const res = await fetch(`${API_URL}/quit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}
