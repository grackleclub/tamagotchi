import { activityTemplateAdd, resetForm, toggleArchived, renderAddActivityFields } from "./formHandlers.js";
import { clearLocalStorage, clearRecords } from "./clearStorage.js";
import { activityTemplateList, populateOptions, renderCategoryList } from "./ui.js";
import { recordCreate, recordInterpret, recordList, renderRecordList, pruneOldRecords } from "./record.js";
import { fetchDefaults, usage } from "./storage.js"; 
import { DEBUG } from "./config.js";

function addEventListeners() {
  document.getElementById("addActivity").addEventListener("submit", activityTemplateAdd);
  document.getElementById("clearStorage").addEventListener("click", clearLocalStorageClick);
  document.getElementById("recordCreate").addEventListener("submit", recordCreate);
  document.getElementById("clearRecord").addEventListener("click", clearRecords);
  document.getElementById("toggleArchived").addEventListener("click", toggleArchived);
}

// Clears local storage and refreshes the activity list and options
function clearLocalStorageClick() {
  clearLocalStorage();
  activityTemplateList();
  populateOptions();
}

async function initializeApp() {
  await fetchDefaults();
  resetForm("recordCreate");
  resetForm("addActivity");
  renderAddActivityFields();
  pruneOldRecords();
  activityTemplateList();
  populateOptions();
  renderRecordList();
  renderCategoryList();
  addEventListeners();
}

document.addEventListener("DOMContentLoaded", initializeApp);
if (DEBUG) console.log("App initialized");

// prints some basic debug information to the console after load
if (DEBUG) recordList();
if (DEBUG) recordInterpret();


const used = usage();
if (DEBUG) console.log(`Used storage: ${used}%`);