import { renderRecordList } from "./record.js";

export function removeActivity(index) {
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.splice(index, 1);
  localStorage.setItem("activities", JSON.stringify(activities));
}

export function clearLocalStorage() {
  if (confirm("Are you sure you want to permanently clear all data?")) {
    localStorage.clear();
    console.log("localStorage cleared");
    alert("Local storage cleared!");
  }
}

export function clearRecords() {
  if (confirm("Are you sure you want to clear all recorded entries?")) {
    localStorage.removeItem("record");
    if (typeof renderRecordList === "function") {
      renderRecordList();
    }
    alert("Records cleared!");
  }
}
