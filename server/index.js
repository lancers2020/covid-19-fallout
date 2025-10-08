const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { redisClient } = require("./redisClient");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- ENDPOINT MODIFICATION ---
// Create or load player state
app.post("/api/start", async (req, res) => {
  const { name } = req.body;
  const key = `player:${name}`;

  let player = await redisClient.get(key, "json");
  
  // Check if player data exists AND if the game is already finished
  if (player && player.isFinished) {
    // If finished, return the ending status so the frontend can display it.
    return res.json({ 
      isFinished: true, 
      finalStatus: player.finalStatus || "This survivor's fate is sealed.",
      stats: {
        health: player.health,
        supplies: player.supplies,
        hunger: player.hunger,
        infected: player.infected
      }
    });
  }

 if (!player) {
  player = {
   name,
   day: 1,
   health: 100,
   hunger: 50,
   supplies: 3,
   infected: false,
      isFinished: false, // New flag
      finalStatus: null, // New field
  };
  await redisClient.set(key, player, "json");
 }
 res.json(player);
});

// Handle player actions
app.post("/api/action", async (req, res) => {
 const { name, action } = req.body;
 const key = `player:${name}`;

 let player = await redisClient.get(key, "json");
 if (!player) return res.status(404).json({ error: "Player not found" });

 switch (action) {
  case "search":
   player.supplies += Math.floor(Math.random() * 2);
   player.hunger += 5;
   if (Math.random() < 0.1) player.infected = true;
   break;
  case "rest":
   player.health = Math.min(100, player.health + 10);
   player.hunger += 10;
   break;
  case "eat":
   if (player.supplies > 0) {
    player.supplies--;
    player.hunger = Math.max(0, player.hunger - 20);
   }
   break;
  default:
   break;
 }

 player.day++;
 if (player.hunger >= 100) player.health -= 15;
 if (player.infected) player.health -= 5;
 
  let finalStatus = null;

 if (player.health <= 0) {
    finalStatus = "died";
 } else if (player.day > 6) { // Assuming Day 6 is the final day check
    // Determine success status based on health/supplies
    if (player.health > 70 && player.supplies > 5 && player.hunger < 50 && !player.infected) {
      finalStatus = "reached the sanctuary and is now saved and doing great in the community";
    } else if (player.health > 30 && !player.infected) {
      finalStatus = "reached the sanctuary and is now saved, but with lingering health issues";
    } else {
      finalStatus = "barely survived to reach the sanctuary, collapsing at the gate";
    }
  }

  // --- Game Over/Finished Logic ---
  if (finalStatus) {
    player.isFinished = true;
    player.finalStatus = finalStatus;
    // We keep the player object in Redis to maintain the record of their fate
    await redisClient.set(key, player, "json"); 
    return res.json({ 
        gameOver: true, 
        isFinished: true, 
        finalStatus: finalStatus,
        // Return current state so the frontend can display final stats if needed
        ...player
    }); 
  }

 await redisClient.set(key, player, "json");
 res.json(player);
});

// Endpoint to delete player data (for 'quit to instantly die')
app.post("/api/quit", async (req, res) => {
    const { name } = req.body;
    const key = `player:${name}`;
    
    // Deleting the record completely allows a "full restart" with that name
    const result = await redisClient.del(key); 
    
    if (result > 0) {
        return res.json({ success: true, message: `Data for ${name} deleted.` });
    } else {
        return res.json({ success: false, message: `No data found for ${name}.` });
    }
});

const PORT = 4000;
app.listen(PORT, async () => {
 await redisClient.connect();
 console.log(`✅ Pandemic Survival backend running on port ${PORT}`);
});
