import { renderCategoryList } from "./ui.js";
import { DEBUG } from "./config.js";

// create a log entry and place in localStorage
export function logCreate(event) {
    event.preventDefault();
    const logs = JSON.parse(localStorage.getItem("log")) || [];
    const activityName = document.getElementById("logItem").value.trim();
    if (DEBUG) console.log(`logging activity: ${activityName}`);
    logs.push(
        {
            activity: activityName,
            date: new Date().toISOString(),
        }
    )
    localStorage.setItem("log", JSON.stringify(logs));
    document.getElementById("logCreate").reset();
    renderLogList();
    renderCategoryList();
}

export function logList() {
    if (DEBUG) console.log("Displaying log entries...");
    const logs = JSON.parse(localStorage.getItem("log")) || [];
    if (DEBUG) console.log(logs);
}

export function logDelete() {
    if (DEBUG) console.log("Deleting log entry...");
    // TODO delete any "expired" log entries when storage is low
    // and alert user if exceeding storage limit with non-expired activities
}

export function logInterpret() {
    if (DEBUG) console.log("Interpreting log entries...");
    // TODO interpret log entries and display results
    const logs = JSON.parse(localStorage.getItem("log")) || [];
    for (let log of logs) {
        if (DEBUG) console.log(`logged: ${log.activity} @ ${log.date}`);
    }

    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    for (let activity of activities) {
        if (DEBUG) console.log(`Activity: ${activity.name}`);
        for (let category of activity.categories) {
            if (DEBUG) console.log(`  - ${category.category}: ${category.points}`);
        }
    }
}

function hoursBetween(startTimestamp, endTimestamp) {
    const startDate = new Date(startTimestamp);
    const endDate = new Date(endTimestamp);

    const durationMs = endDate - startDate;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    return { hours, days };
}

export function renderLogList() {
  const logList = document.getElementById("logList");
  logList.innerHTML = "";

  const logs = JSON.parse(localStorage.getItem("log")) || [];
  if (logs.length === 0) {
    logList.innerHTML = "<li>No log entries found</li>";
    return;
  }

  logs.slice().reverse().forEach(renderLogEntry);
}

function renderLogEntry(log) {
  const logList = document.getElementById("logList");
  const li = document.createElement("li");
  const now = new Date().toISOString();
  const { hours, days } = hoursBetween(log.date, now);
  li.textContent = hours < 24
    ? `${log.activity} : ${hours} hours ago`
    : `${log.activity} : ${days} days ago`;
  logList.appendChild(li);
}