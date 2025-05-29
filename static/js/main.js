import { activityTemplateAdd, resetForm } from "./formHandlers.js";
import { clearLocalStorage } from "./clearStorage.js";
import { activityTemplateList, populateOptions } from "./ui.js";
import { logCreate, logInterpret, logList, renderLogList } from "./log.js";
import { fetchDefaults, usage } from "./storage.js"; 

function addEventListeners() {
  document.getElementById("addActivity").addEventListener("submit", activityTemplateAdd);
  document.getElementById("clearStorage").addEventListener("click", clearLocalStorageClick);
  document.getElementById("logCreate").addEventListener("submit", logCreate);
}

function clearLocalStorageClick() {
  clearLocalStorage();
  activityTemplateList();
  populateOptions();
}

function initializeApp() {
  resetForm("logCreate");
  resetForm("addActivity");
  activityTemplateList();
  populateOptions();
  renderLogList();
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
