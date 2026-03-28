// Simple persistent memory store for Nova
const fs = require('fs');
const path = require('path');

const MEMORY_FILE = 'nova-memory.json';

function loadMemory() {
  if (fs.existsSync(MEMORY_FILE)) {
    return JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
  }
  return { entries: [], lastUpdated: new Date().toISOString() };
}

function saveMemory(memory) {
  memory.lastUpdated = new Date().toISOString();
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

function addMemory(entry) {
  const memory = loadMemory();
  memory.entries.push({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    content: entry
  });
  saveMemory(memory);
  console.log(`✅ Memory entry added: ${entry.substring(0, 80)}...`);
}

function getRecentMemory(limit = 10) {
  const memory = loadMemory();
  return memory.entries.slice(-limit);
}

console.log("✅ Nova Memory Store initialized");
module.exports = { addMemory, getRecentMemory, loadMemory };
