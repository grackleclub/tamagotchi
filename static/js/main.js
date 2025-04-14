import { handleAddActivitySubmit, resetForm } from "./formHandlers.js";
import { clearLocalStorage } from "./clearStorage.js";
import { displayActivities, populateOptions } from "./ui.js";
import { logCreate, logInterpret, logList } from "./log.js";
import { fetchDefaults, usage } from "./storage.js"; 

function addEventListeners() {
  document.getElementById("addActivity").addEventListener("submit", handleAddActivitySubmit);
  document.getElementById("clearStorage").addEventListener("click", handleClearStorageClick);
  document.getElementById("logCreate").addEventListener("submit", logCreate);
}

function handleClearStorageClick() {
  clearLocalStorage();
  displayActivities();
  populateOptions();
}

function initializeApp() {
  resetForm("logCreate");
  resetForm("addActivity");
  displayActivities();
  populateOptions();
  addEventListeners();
}

document.addEventListener("DOMContentLoaded", initializeApp);
console.log("App initialized");

// print some basic debug information to the console after load
logList();
logInterpret();

const used = usage();
console.log(`Used storage: ${used}%`);

fetchDefaults();
