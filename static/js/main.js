import * as formHandlers from "./formHandlers.js";
import * as clearStorage from "./clearStorage.js";
import * as ui from "./ui.js";
import * as record from "./record.js";
import * as storage from "./storage.js"; 
import { DEBUG } from "./config.js";

function addEventListeners() {
  document.getElementById("addActivity").addEventListener("submit", formHandlers.activityTemplateAdd);
  document.getElementById("clearStorage").addEventListener("click", clearLocalStorageClick);
  document.getElementById("recordCreate").addEventListener("submit", record.recordCreate);
  document.getElementById("clearRecord").addEventListener("click", clearStorage.clearRecords);
  document.getElementById("toggleArchived").addEventListener("click", formHandlers.toggleArchived);
}

// Clears local storage and refreshes the activity list and options
function clearLocalStorageClick() {
  clearStorage.clearLocalStorage();
  ui.activityTemplateList();
  record.renderRecordList();
  ui.renderCategoryList();
  ui.populateOptions();
}

async function initializeApp() {
  await storage.fetchDefaults();
  formHandlers.resetForm("recordCreate");
  formHandlers.resetForm("addActivity");
  formHandlers.renderAddActivityFields();
  record.pruneOldRecords();
  ui.activityTemplateList();
  ui.populateOptions();
  record.renderRecordList();
  ui.renderCategoryList();
  addEventListeners();
}

document.addEventListener("DOMContentLoaded", initializeApp);
if (DEBUG) console.log("App initialized");

// prints some basic debug information to the console after load
if (DEBUG) record.recordInterpret();
if (DEBUG) record.recordList();


const used = storage.usage();
if (DEBUG) console.log(`Used storage: ${used}%`);