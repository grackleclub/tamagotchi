import { handleSelectActivitySubmit, handleAddActivitySubmit, resetForm } from "./formHandlers.js";
import { clearLocalStorage } from "./clearStorage.js";
import { displayActivities } from "./ui.js";

function addEventListeners() {
  document.getElementById("selectActivity").addEventListener("submit", handleSelectActivitySubmit);
  document.getElementById("addActivity").addEventListener("submit", handleAddActivitySubmit);
  document.getElementById("clearStorage").addEventListener("click", () => {
    clearLocalStorage();
    // displayActivities();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  resetForm("selectActivity");
  resetForm("addActivity");
  // displayActivities();
  addEventListeners();
});