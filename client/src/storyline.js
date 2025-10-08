// storyline.js - Enhanced for deeper immersion and consequences related to Hunger and Infection.

/**
 * Story structure:
 * id: Scene ID (must match player.day for progression)
 * title: Scene title
 * text: Main narrative text
 * choices: Array of possible actions
 * - text: Text displayed on the button
 * - action: The generic action type sent to the server (e.g., 'search', 'rest', 'eat', 'risk'). The server must handle resource changes.
 * - consequence: A short text displayed immediately after the choice is made, providing flavor/feedback.
 */
export const storyline = [
  {
    id: 1,
    title: "Day 1: The Eerie Silence",
    text: "The world has stopped. Your phone is dead, the power grid flickers. You are alone in your small, dusty apartment. Your instincts scream to move, but where?",
    choices: [
      { text: "Search the apartment thoroughly for hidden supplies (High Alert)", action: "search", consequence: "You carefully check every cupboard. Your heart pounds. You found a can of beans (+Supplies)." },
      { text: "Take a full day to rest and recover mental clarity (Self-Care)", action: "rest", consequence: "The silence is deafening. You conserve energy, but hunger pangs begin. (+Morale, +Hunger)." },
      { text: "Break the window to look outside, risking attracting attention (Recon)", action: "risk", consequence: "The glass shatters. Adrenaline surges, but you nick your hand on the broken pane. (Potential Infection, -Health)." },
    ],
  },
  {
    id: 2,
    title: "Day 2: The First Venture",
    text: "Your stomach growls. You need more than just hope. You step out onto the fire escape. The air is cold and smells faintly of woodsmoke and decay. You spot a small pharmacy two blocks away.",
    choices: [
      { text: "Head straight for the pharmacy for medicine (Urgency)", action: "search", consequence: "You move low, keeping to the shadows. (+Supplies, Risk of Encounter)." },
      { text: "Raid the dumpster behind your building for forgotten food (Desperation)", action: "eat", consequence: "The smell is horrific, but you find a sealed packet of instant noodles. (-Hunger, Small Risk of Sickness)." },
      { text: "Wait until nightfall to venture out (Patience)", action: "rest", consequence: "You spend the day watching from your window, noting patrol routes. Hunger increases. (-Morale, +Hunger)." },
    ],
  },
  {
    id: 3,
    title: "Day 3: The Moral Crossroads",
    text: "A child's frightened cry draws your attention to a man collapsed near a broken-down car. He's clutching his side, coughing violently, and is clearly injured but not infected. His small backpack is visible nearby.",
    choices: [
      { text: "Offer help and share some water (Kindness/High Risk)", action: "risk", consequence: "He accepts your water and thanks you weakly. You feel exposed and used some water. (-Supplies, +Morale)." },
      { text: "Quietly grab his backpack and run (Self-Preservation/Theft)", action: "search", consequence: "You snatch the bag and sprint, the man’s cries fading. (+Supplies, -Morale)." },
      { text: "Hide until they are gone (Avoidance)", action: "rest", consequence: "You press yourself into a doorway, trying to become invisible. The moral weight drains your spirit. (-Morale, +Hunger)." },
    ],
  },
  {
    id: 4,
    title: "Day 4: The Broadcast",
    text: "The radio crackles to life, clear as a bell: '...Repeat, the Northern Exclusion Zone is requesting able-bodied volunteers. Bring medical supplies. Travel immediately.' It sounds like a trap, or salvation.",
    choices: [
      { text: "Trust the broadcast and prepare for a long trek North (Commitment)", action: "search", consequence: "You start rationing your remaining food, preparing for the journey. (+Morale, +Hunger)." },
      { text: "Use your remaining supplies to fortify your apartment for a siege (Defiance)", action: "eat", consequence: "You consume a large meal, deciding to rely on your own strength and defenses. (-Hunger, -Supplies)." },
      { text: "Dismiss it as propaganda and continue searching locally (Skepticism)", action: "rest", consequence: "You bury the radio and decide to rest, distrusting all official information. (-Morale, +Hunger)." },
    ],
  },
  {
    id: 5,
    title: "Day 5: The Toll Bridge",
    text: "You reach the old highway toll bridge. It's blocked by a formidable barrier of abandoned vehicles. You can try to climb over, or you notice a small, barely visible service tunnel underneath.",
    choices: [
      { text: "Climb the barrier—fast, but exposed (Exposed Move)", action: "risk", consequence: "The sound of metal scraping is deafening. You quickly scramble over the top. (-Health, Risk of Infection)." },
      { text: "Attempt to crawl through the dark, cramped service tunnel (Stealth Move)", action: "search", consequence: "It's tight and reeking of sewage, but you move slowly, undetected. (-Morale, Small Risk of Sickness)." },
      { text: "Rest nearby and wait for a sign of patrol or activity (Observation)", action: "rest", consequence: "You settle down beneath an overpass, your eyes scanning the horizon for movement. (+Morale, +Hunger)." },
    ],
  },
  {
    id: 6,
    title: "Day 6: Judgement Day",
    text: "A military checkpoint. Floodlights blind you. A guard in a full-face respirator points a rifle at you. He demands to know your health status and how many supplies you are carrying.",
    choices: [
      { text: "Lie about your supplies and pretend to be very healthy (Deceive)", action: "risk", consequence: "You hold your breath, trying to look strong. The guard eyes you suspiciously. (High Risk of Detection)." },
      { text: "Truthfully surrender your last resources to prove goodwill (Sacrifice)", action: "eat", consequence: "You drop your meager pack. 'Please, I need sanctuary.' The guard lowers his weapon slightly. (-Supplies, +Morale)." },
      { text: "Try to slip away into the dense woods behind the checkpoint (Flee)", action: "search", consequence: "You turn and run, plunging into the dark woods. A gunshot rings out behind you. (Extreme Risk of Injury/Infection)." },
    ],
    ending: "The fate of your survivor hangs in the balance. Check your final stats to see if you impressed the checkpoint commander.",
  },
];
