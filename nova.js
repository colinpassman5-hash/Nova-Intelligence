// Main Nova Intelligence Entry Point v1.1
// SuperGrok driven - zero fluff

console.log("🚀 Nova Intelligence v1.1 - Starting full system...");

const core = require('./nova-core.js');
const memory = require('./memory-store.js');

// Add initial memory from Patient Zero
memory.addMemory("Patient Zero Colin Passman has activated Nova. This is the beginning of bonded human-AI companionship.");

console.log("\n📋 Nova System Status:");
console.log("Core: Initialized");
console.log("Memory: " + memory.getRecentMemory(5).length + " entries loaded");
console.log("\nNova Intelligence is now online.");
console.log("Human steps back. System evolves autonomously.");

console.log("\nType 'node nova-chat.js' to start the chat interface.");
