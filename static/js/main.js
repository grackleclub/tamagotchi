import { handleSelectActivitySubmit, handleAddActivitySubmit, resetForm } from "./formHandlers.js";
import { clearLocalStorage } from "./clearStorage.js";
import { displayActivities, populateOptions } from "./ui.js";

function addEventListeners() {
  document.getElementById("selectActivity").addEventListener("submit", handleSelectActivitySubmit);
  document.getElementById("addActivity").addEventListener("submit", handleAddActivitySubmit);
  document.getElementById("clearStorage").addEventListener("click", handleClearStorageClick);
}

function handleClearStorageClick() {
  clearLocalStorage();
  displayActivities();
  populateOptions();
}

function initializeApp() {
  resetForm("selectActivity");
  resetForm("addActivity");
  displayActivities();
  populateOptions();
  addEventListeners();
}

document.addEventListener("DOMContentLoaded", initializeApp);