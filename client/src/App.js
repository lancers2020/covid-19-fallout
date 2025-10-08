import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- API FUNCTIONS (Merged from api.js) ---

const API_URL = "http://localhost:4000/api";

async function startGame(name) {
  const res = await fetch(`${API_URL}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

async function performAction(name, action) {
  const res = await fetch(`${API_URL}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, action }),
  });
  return res.json();
}

// New function to clear the player's data from the Redis-like app
async function quitGame(name) {
  const res = await fetch(`${API_URL}/quit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  // We just need confirmation, the response content isn't strictly necessary
  return res.json(); 
}

// --- STORYLINE DATA (Merged from storyline.js) ---

const storyline = [
  {
    id: 1,
    title: "Day 1: The Silence",
    text: "You wake up in your small apartment. The streets outside are eerily quiet. The pandemic has reached your city. You must decide what to do first.",
    choices: [
      { text: "Search for supplies in the kitchen", action: "search", consequence: "You find some canned goods and a dusty first aid kit. You feel better prepared, but slightly more hungry." },
      { text: "Rest to recover your strength", action: "rest", consequence: "You take a long nap, regaining some energy. The day passes uneventfully, but your hunger increases." },
      { text: "Look outside the window to assess the situation", action: "search", consequence: "You see a distant commotion. You quickly retreat, but the sight leaves you unsettled. You find a few spare batteries." },
    ],
  },
  {
    id: 2,
    title: "Day 2: The Empty Streets",
    text: "You venture outside. The streets are deserted except for a few stray dogs and abandoned cars. A loudspeaker repeats: 'Stay indoors.'",
    choices: [
      { text: "Search nearby convenience store", action: "search", consequence: "The store is mostly looted, but you manage to grab a few items. You cut yourself slightly on broken glass." },
      { text: "Return home quickly", action: "rest", consequence: "You hurry back to your apartment. Safety is paramount, but the decision leaves you low on supplies." },
      { text: "Call out for help", action: "search", consequence: "You shout into the void. No response. The loneliness sinks in, but you find a discarded water bottle." },
    ],
  },
  {
    id: 3,
    title: "Day 3: The Stranger",
    text: "Someone knocks on your door, coughing. They claim to need water. You can see the desperation in their eyes.",
    choices: [
      { text: "Give them water and food", action: "eat", consequence: "You share your rations. The stranger thanks you sincerely, but you've used up a portion of your vital supply." },
      { text: "Ignore the knocking and stay quiet", action: "rest", consequence: "They eventually leave. You feel guilt, but you preserved your resources and avoided contact." },
      { text: "Open the door cautiously", action: "search", consequence: "The stranger quickly grabs a bag of yours and runs. You are shocked and lose supplies, but you avoid immediate danger." },
    ],
  },
  {
    id: 4,
    title: "Day 4: Faint Hope",
    text: "You find an old radio working on weak batteries. A faint voice speaks: 'A safe zone has opened at the north bridge. Supplies required.'",
    choices: [
      { text: "Prepare to travel north", action: "search", consequence: "You pack heavier and mentally prepare. You find some extra food while checking inventory, but the effort drains you." },
      { text: "Stay home one more day to rest", action: "rest", consequence: "You rest your weary body, boosting your health slightly. You worry about losing time." },
      { text: "Eat a small meal before deciding", action: "eat", consequence: "You use a supply to clear your mind. The clarity helps, but the safe zone is still days away." },
    ],
  },
  {
    id: 5,
    title: "Day 5: The Journey",
    text: "You pack your few supplies and step into the cold morning. The city looks empty, broken. You move cautiously toward the bridge.",
    choices: [
      { text: "Search abandoned vehicles for fuel", action: "search", consequence: "You risk exposure but manage to find a few more supplies. A slight cough develops." },
      { text: "Hide from potential infected", action: "rest", consequence: "You spend the day hiding. You conserve energy but make little progress." },
      { text: "Eat to regain energy before moving", action: "eat", consequence: "A quick meal gives you the strength you need for the hard trek ahead." },
    ],
  },
  {
    id: 6,
    title: "Day 6: The Safe Zone",
    text: "You see the barricades ahead. Guards in hazmat suits scan survivors one by one. You’re weak, but still standing. You made it.",
    choices: [
      { text: "Wait patiently for inspection", action: "rest" },
      { text: "Offer the guards your remaining supplies", action: "eat" },
    ],
    ending: true,
  },
];

// --- STATUS PANEL COMPONENT (Merged from components/StatusPanel.js) ---

function StatusPanel({ player }) {
  const statStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 15px",
    borderRadius: "8px",
    margin: "0 5px",
    minWidth: "80px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: "bold",
    position: "relative",
  };

  const healthColor = player.health > 70 ? "#4CAF50" : player.health > 30 ? "#FFC107" : "#F44336";
  const suppliesColor = player.supplies > 5 ? "#4CAF50" : player.supplies > 1 ? "#FFC107" : "#F44336";
  const hungerColor = player.hunger < 30 ? "#4CAF50" : player.hunger < 70 ? "#FFC107" : "#F44336";

  const barContainer = {
    width: '100%', 
    height: '6px', 
    backgroundColor: '#333', 
    borderRadius: '3px', 
    marginTop: '4px'
  };

  const barStyle = (value, color) => ({
    width: `${value}%`, 
    height: '100%', 
    backgroundColor: color, 
    borderRadius: '3px'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        zIndex: 5,
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: "15px 20px",
        borderRadius: "12px",
        maxWidth: "90%",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <div style={{ ...statStyles, backgroundColor: "#000", border: '1px solid #666', minWidth: '150px' }}>
        <p style={{ margin: 0, fontSize: "1.1rem", color: "#FFEB3B" }}>{player.name}</p>
        <p style={{ margin: 0, fontSize: "0.7rem", color: "#ccc" }}>Day {player.day}</p>
      </div>

      <motion.div
        key="health"
        // animate={{ backgroundColor: healthColor }}
        animate={{ backgroundColor: 'black' }}
        transition={{ duration: 0.5 }}
        style={{ ...statStyles, backgroundColor: 'rgba(244, 67, 54, 0.1)' }}
      >
        <span style={{ color: healthColor }}>❤️ Health: {player.health}</span>
        <div style={barContainer}><motion.div style={barStyle(player.health, healthColor)} /></div>
      </motion.div>

      <motion.div
        key="supplies"
        // animate={{ backgroundColor: suppliesColor }}
        animate={{ backgroundColor: 'black' }}
        transition={{ duration: 0.5 }}
        style={{ ...statStyles, backgroundColor: 'rgba(76, 175, 80, 0.1)' }}
      >
        <span style={{ color: suppliesColor }}>📦 Supplies: {player.supplies}</span>
        <div style={barContainer}><motion.div style={barStyle(Math.min(100, player.supplies * 10), suppliesColor)} /></div>
      </motion.div>

      <motion.div
        key="hunger"
        // animate={{ backgroundColor: hungerColor }}
        animate={{ backgroundColor: 'black' }}
        transition={{ duration: 0.5 }}
        style={{ ...statStyles, backgroundColor: 'rgba(255, 193, 7, 0.1)' }}
      >
        <span style={{ color: hungerColor }}>🍽️ Hunger: {player.hunger}%</span>
        <div style={barContainer}><motion.div style={barStyle(100 - player.hunger, hungerColor)} /></div>
      </motion.div>

      <motion.div
        key="infected"
        style={{ 
          ...statStyles, 
          backgroundColor: player.infected ? 'rgba(244, 67, 54, 0.3)' : 'rgba(76, 175, 80, 0.3)',
          // border: player.infected ? '1px solid #F44336' : '1px solid #4CAF50',
        }}
      >
        <span>
          ☣️ Infected? <br/>{player.infected ? "YES" : "NO"}
        </span>
      </motion.div>
    </motion.div>
  );
}

// --- MAIN APP COMPONENT ---

export default function App() {
  const [player, setPlayer] = useState(null);
  const [name, setName] = useState("");
  const [scene, setScene] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [ending, setEnding] = useState("");
  const [actionFeedback, setActionFeedback] = useState(null); 
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextPlayerState, setNextPlayerState] = useState(null);
  const [isFinished, setIsFinished] = useState(false); // New state to hold finished status
  const [finalStatus, setFinalStatus] = useState(null); // New state for final outcome text
  const [finalStats, setFinalStats] = useState(null); // New state for displaying final stats on start screen

  useEffect(() => {
    if (player) {
      const currentScene = storyline.find((s) => s.id === player.day);
      setScene(currentScene);
      
      // --- DEATH CONDITIONS ---
      let deathReason = null;
      if (player.health <= 0) {
        deathReason = "Your survivor succumbed to exhaustion and disease. The unforgiving pandemic claimed another life.";
        setFinalStatus("died");
      } else if (player.infected && player.day > 3) {
        deathReason = "The infection has taken hold. You were too weak to fight it and succumbed to the disease. A tragic end.";
        setFinalStatus("died");
      } else if (player.hunger >= 100) {
          deathReason = "Total starvation. Your body finally gave out from lack of sustenance. You failed to manage your food supply.";
          setFinalStatus("died");
      }

      if (deathReason) {
        setGameOver(true);
        setEnding(deathReason);
        // Note: The backend will handle setting isFinished and finalStatus for persistence
      } 
      // Check for successful end condition (Day 6)
      else if (currentScene?.ending && player.day === storyline.length) {
        setGameOver(true);
        let successMessage = "";
        if (player.health > 70 && player.supplies > 5 && player.hunger < 50 && !player.infected) {
          successMessage = "You entered the safe zone, strong and well-equipped. Your intelligence and resilience made you a valuable asset immediately. A new life begins.";
          setFinalStatus("reached the sanctuary and is now saved and doing great in the community");
        } else if (player.health > 30 && !player.infected) {
          successMessage = "You made it to safety, but barely. You are weak and have little to offer, but you have survived. Now, the rebuilding begins.";
          setFinalStatus("reached the sanctuary and is now saved, but with lingering health issues");
        } else {
          successMessage = "You dragged yourself to the checkpoint, collapsing at the gate. You're alive, but your future within the safe zone is uncertain and dependent on the kindness of strangers.";
          setFinalStatus("barely survived to reach the sanctuary, collapsing at the gate");
        }
        setEnding(successMessage);
      }
    }
  }, [player]);

  const handleStart = async () => {
    // Reset temporary states before checking persistence
    setPlayer(null);
    setGameOver(false);
    setEnding("");
    setActionFeedback(null);
    setIsTransitioning(false);
    setNextPlayerState(null);
    setIsFinished(false);
    setFinalStatus(null);
    setFinalStats(null);
    
    try {
        const data = await startGame(name);
        console.log(':::data', data);

        if (data.isFinished) {
            // Player is already finished (dead or saved)
            setIsFinished(true);
            setFinalStatus(data.finalStatus);
            setFinalStats(data.stats);
        } else {
            // New game or continuing game
            setPlayer(data);
        }
    } catch (error) {
        console.error("Failed to start game.", error);
    }
  };

  const doAction = async (action, consequenceText) => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActionFeedback(consequenceText);

    try {
        const updated = await performAction(player.name, action);
        
        if (updated.gameOver) {
            // This is the immediate death condition that came from the server
            // The effect hook handles setting finalStatus based on player.health <= 0
            setGameOver(true);
            setEnding("Your survivor succumbed to exhaustion and disease. The unforgiving pandemic claimed another life.");
        } else if (updated && updated.name) {
             setNextPlayerState(updated);
        }
    } catch (error) {
        console.error("Critical error during action.", error);
    } finally {
        setIsTransitioning(false);
    }
  };

  const handleNext = () => {
    if (nextPlayerState) {
        setPlayer(nextPlayerState);
        setActionFeedback(null);
        setNextPlayerState(null);
    }
  }

  const handleQuit = async () => {
    if (name) {
        try {
            // Call the new quit endpoint to clear Redis data
            await quitGame(name);
            console.log(`Player data for ${name} cleared from storage.`);
        } catch (error) {
            console.error("Failed to clear player data on quit.", error);
        }
    }
    // Regardless of API success, reset the local state
    restart(); 
  }

  const restart = () => {
    setPlayer(null);
    setName("");
    setGameOver(false);
    setEnding("");
    setNextPlayerState(null);
    setIsFinished(false); // Reset persistence status
    setFinalStatus(null);
    setFinalStats(null);
  };

  // === STYLES ===
  
  const container = {
    position: "relative",
    backgroundColor: "#0b0b0b",
    color: "#fff",
    minHeight: "100vh",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
    textAlign: "center",
    paddingTop: '20px', 
  };

  const fogLayer = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "radial-gradient(circle at 50% 50%, rgba(100,0,0,0.15), transparent 70%)",
    zIndex: 0,
    pointerEvents: "none",
  };

  const storyBox = {
    zIndex: 2,
    backgroundColor: "rgba(20,20,20,0.85)",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "700px",
    margin: "40px auto 20px auto",
    lineHeight: "1.7",
    boxShadow: "0 0 20px rgba(255,0,0,0.3)",
    border: "1px solid rgba(255,0,0,0.2)",
    minHeight: '200px', 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '95%',
  };

  const button = {
    backgroundColor: "#b22222",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    margin: "10px",
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 4px #8b1a1a',
    transition: 'all 0.1s ease',
    display: 'inline-block',
  };
  
  const buttonActive = {
      backgroundColor: "#8b1a1a",
      boxShadow: '0 2px #6e1515',
      transform: 'translateY(2px)',
  };

  const gameOverScreen = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.95)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#ff5555",
    zIndex: 10,
    padding: '20px',
  };

  const feedbackStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: '#ff9800',
    padding: '20px',
    borderRadius: '10px',
    border: '2px solid #ff9800',
    fontSize: '1.2em',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const textTitleStyle = {
    fontSize: "2.5em", 
    color: "#F44336",
    marginTop: "20vh",
  };
  
  const textSubtitleStyle = {
    color: '#fff',
    fontSize: '1.125em',
    marginBottom: '2rem',
  };
  
  const inputStyle = {
    marginTop: "20px",
    padding: "12px",
    borderRadius: "6px",
    border: "2px solid #555",
    backgroundColor: "#222",
    color: '#fff',
    width: '80%',
    maxWidth: '300px',
    boxSizing: 'border-box',
  };

  const gameOverTitleStyle = {
    fontSize: '2.5rem', 
    marginBottom: '1rem', 
    fontWeight: 'bold',
  };

  const gameOverTextStyle = {
    fontSize: '1.25rem', 
    maxWidth: '40rem', 
    margin: '0 auto 2.5rem auto', 
    color: '#ccc', 
  };

  const finalStatsStyle = {
    fontSize: '0.875rem', 
    color: '#999', 
    marginBottom: '1.5rem',
  };

  const feedbackHelperStyle = {
    color: '#999',
    marginTop: '1rem', 
  };
  
  const sceneTitleStyle = {
    fontSize: '1.5rem', 
    fontWeight: 'bold',
    marginBottom: '1rem', 
    color: '#ff5555',
  };
  
  const sceneTextStyle = {
    fontSize: '1.125rem', 
    marginBottom: '1.5rem', 
  };

  const choicesContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
  };
  
  const quitButtonStyle = {
    ...button,
    backgroundColor: '#333',
    color: '#888',
    boxShadow: '0 4px #1a1a1a',
    margin: '10px 0 0 0',
    fontSize: '0.75rem',
    padding: '8px 16px',
  };

  const quitButtonActive = {
    backgroundColor: "#1a1a1a",
    boxShadow: '0 2px #000',
    transform: 'translateY(2px)',
  };


  // --- New Screen for Finished Players ---
  // for now this is not going to work. this still needs refactoring as far as the logic flow is concerned.
  const finishedScreen = (
      <motion.div
        style={gameOverScreen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 style={gameOverTitleStyle}>⚠️ {name} has already made their journey.</h1>
        <p style={gameOverTextStyle}>
          This survivor **{name}** has already **{finalStatus}**. 
          You must choose a new name to begin a new story, or you can clear their record to start over.
        </p>
        {finalStats && (
            <p style={finalStatsStyle}>
                Final Stats: Health {finalStats.health}, Supplies {finalStats.supplies}, Hunger {finalStats.hunger}%, Infected: {finalStats.infected ? "Yes" : "No"}
            </p>
        )}
        <motion.button 
            style={button} 
            onClick={restart} 
            whileHover={{ scale: 1.05 }} 
            whileTap={buttonActive}
        >
          Choose Another Name
        </motion.button>
        <motion.button 
            style={{...button, backgroundColor: '#555', marginTop: '20px'}} 
            onClick={handleQuit} 
            whileHover={{ scale: 1.05 }} 
            whileTap={buttonActive}
        >
          FORCE START (Clear {name}'s Record)
        </motion.button>
      </motion.div>
  );


  // === UI ===
  if (!player)
    return (
      <div style={container}>
        {/* see comment in line 533 */}
        {isFinished && name && finishedScreen}
        
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={textTitleStyle}
        >
          🦠 THE LAST LIGHT 
        </motion.h1>
        <p style={textSubtitleStyle}>A Pandemic Survival Text Adventure</p>
        <input
          style={inputStyle}
          placeholder="Enter your survivor's name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isFinished} // Disable input if a finished status is displayed
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={buttonActive}
          style={button}
          onClick={handleStart}
          disabled={name.length < 1 || isFinished}
        >
          {isFinished ? `View ${name}'s Fate` : "Begin the Fight"}
        </motion.button>
        {isFinished && (
            <p style={{color: '#aaa', fontSize: '0.9rem', marginTop: '10px'}}>
                Please click 'Begin the Fight' to check {name}'s final status.
            </p>
        )}
      </div>
    );

  if (gameOver)
    return (
      <motion.div
        style={gameOverScreen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 style={gameOverTitleStyle}>{player.health <= 0 || player.infected || player.hunger >= 100 ? "☠️ FAILED TO SURVIVE" : "✅ SANCTUARY REACHED"}</h1>
        <p style={gameOverTextStyle}>{ending}</p>
        <p style={finalStatsStyle}>Final Stats: Health {player.health}, Supplies {player.supplies}, Hunger {player.hunger}%, Infected: {player.infected ? "Yes" : "No"}</p>
        <motion.button style={button} onClick={handleQuit} whileHover={{ scale: 1.05 }} whileTap={buttonActive}>
          Play Again (Clear Data)
        </motion.button>
      </motion.div>
    );

  return (
    <div style={container}>
      <motion.div
        style={fogLayer}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      
      <StatusPanel player={player} /> 
      
      {/* New Quit Button */}
      <motion.button
          whileHover={{ color: '#fff', scale: 1.02 }}
          whileTap={quitButtonActive}
          style={quitButtonStyle}
          onClick={handleQuit}
          disabled={isTransitioning}
        >
          Quit to Instantly Die
      </motion.button>
      {/* End New Quit Button */}

      <AnimatePresence mode="wait">
        {actionFeedback ? (
          <motion.div
            key="feedback"
            style={storyBox}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <p style={feedbackStyle}>{actionFeedback}</p>
            <p style={feedbackHelperStyle}>...The consequences have been determined. Move on to Day {nextPlayerState?.day || player.day + 1}.</p>
            
            <motion.button 
              key="next-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ ...buttonActive, backgroundColor: '#388E3C' }}
              style={{ 
                ...button, 
                backgroundColor: '#4CAF50',
                boxShadow: '0 4px #388E3C', 
                marginTop: '20px', 
                minWidth: '200px'
              }}
              onClick={handleNext}
              disabled={isTransitioning || !nextPlayerState}
            >
              {isTransitioning ? "Calculating..." : "Okay, Next Day"}
            </motion.button>
            
          </motion.div>
        ) : (
          scene && (
            <motion.div
              key={scene.id}
              style={storyBox}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
            >
              <h2 style={sceneTitleStyle}>{scene.title}</h2>
              <p style={sceneTextStyle}>{scene.text}</p>
              <div style={choicesContainerStyle}>
                {scene.choices.map((c, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={buttonActive}
                    style={button}
                    onClick={() => {
                      doAction(c.action, c.consequence); 
                    }}
                    disabled={isTransitioning}
                  >
                    {c.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
