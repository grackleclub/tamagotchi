import { activityTemplateAdd, resetForm, toggleArchived } from "./formHandlers.js";
import { clearLocalStorage, clearLog } from "./clearStorage.js";
import { activityTemplateList, populateOptions, renderCategoryList } from "./ui.js";
import { logCreate, logInterpret, logList, renderLogList, pruneOldLogs } from "./log.js";
import { fetchDefaults, usage } from "./storage.js"; 
import { DEBUG } from "./config.js";

function addEventListeners() {
  document.getElementById("addActivity").addEventListener("submit", activityTemplateAdd);
  document.getElementById("clearStorage").addEventListener("click", clearLocalStorageClick);
  document.getElementById("logCreate").addEventListener("submit", logCreate);
  document.getElementById("clearLog").addEventListener("click", clearLog);
  document.getElementById("toggleArchived").addEventListener("click", toggleArchived);
}

// Clears local storage and refreshes the activity list and options
function clearLocalStorageClick() {
  clearLocalStorage();
  activityTemplateList();
  populateOptions();
}

function initializeApp() {
  resetForm("logCreate");
  resetForm("addActivity");
  pruneOldLogs();
  activityTemplateList();
  populateOptions();
  renderLogList();
  renderCategoryList();
  addEventListeners();
}

document.addEventListener("DOMContentLoaded", initializeApp);
if (DEBUG) console.log("App initialized");

// prints some basic debug information to the console after load
if (DEBUG) logList();
if (DEBUG) logInterpret();


const used = usage();
if (DEBUG) console.log(`Used storage: ${used}%`);

// Fetches default activities and categories
fetchDefaults();
