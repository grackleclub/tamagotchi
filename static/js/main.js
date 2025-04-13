import { handleAddActivitySubmit, resetForm } from "./formHandlers.js";
import { clearLocalStorage } from "./clearStorage.js";
import { displayActivities, populateOptions } from "./ui.js";
import { logCreate } from "./log.js";

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