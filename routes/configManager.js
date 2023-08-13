const fs = require('fs');

let config = {};

function loadConfig() {
  try {
    const data = fs.readFileSync('../config.json', 'utf8');
    config = JSON.parse(data);
  } catch (err) {
    console.error('Error loading config:', err);
  }
}

function getConfig() {
  return config;
}

function updateConfig(updates) {
  config = { ...config, ...updates };
  saveConfig();
}

function saveConfig() {
  try {
    fs.writeFileSync('../config.json', JSON.stringify(config, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving config:', err);
  }
}

module.exports = {
  loadConfig,
  getConfig,
  updateConfig,
};