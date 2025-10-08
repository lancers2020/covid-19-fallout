import React from "react";
import { motion } from "framer-motion";

export default function StatusPanel({ player }) {
  // Ensure player object is available before rendering
  if (!player) return null;
  
  const panelStyle = {
    backgroundColor: "#222",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    maxWidth: "400px",
    margin: "0 auto 20px auto", // Added margin-bottom for spacing
    border: "1px solid #00e0ff50"
  };

  const listStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    textAlign: "left",
    lineHeight: "1.8em",
    fontSize: "1.1em",
  };

  const titleStyle = {
    fontSize: "1.5em",
    marginBottom: "10px",
    color: "#00e0ff",
    borderBottom: "2px solid #00e0ff30",
    paddingBottom: "5px",
  };
  
  // Helper to determine text color for visual feedback
  const healthColor = player.health > 50 ? "#4CAF50" : player.health > 20 ? "#FFC107" : "#F44336";
  const hungerColor = player.hunger < 50 ? "#4CAF50" : player.hunger < 80 ? "#FFC107" : "#F44336";
  const moraleColor = player.morale > 50 ? "#8BC34A" : player.morale > 20 ? "#FF9800" : "#B71C1C";


  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={panelStyle}
    >
      <h2 style={titleStyle}>Day {player.day} - {player.name}</h2>
      <ul style={listStyle}>
        <li style={{ color: healthColor }}>❤️ Health: {player.health}</li>
        <li style={{ color: hungerColor }}>🍽️ Hunger: {player.hunger}%</li>
        <li style={{ color: moraleColor }}>🧠 Morale: {player.morale}</li>
        <li>📦 Supplies: {player.supplies}</li>
        <li style={{ color: player.infected ? "#F44336" : "#4CAF50", fontWeight: 'bold' }}>
            ☣️ Infected: {player.infected ? "Yes (DANGER!)" : "No (Safe)"}
        </li>
      </ul>
    </motion.div>
  );
}
