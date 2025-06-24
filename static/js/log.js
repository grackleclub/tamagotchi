import { renderCategoryList } from "./ui.js";
import { usage } from "./storage.js";
import { DEBUG } from "./config.js";

// create a log entry and place in localStorage
export function logCreate(event) {
    pruneOldLogs();
    event.preventDefault();
    const logs = JSON.parse(localStorage.getItem("log")) || [];
    const activityName = document.getElementById("logItem").value.trim();

    if (!activityName) {
        alert("Please select an activity to log.");
        return;
    }

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
    logDelete();
}

export function logList() {
    if (DEBUG) console.log("Displaying log entries...");
    const logs = JSON.parse(localStorage.getItem("log")) || [];
    if (DEBUG) console.log(logs);
}

export function logDelete() {
    if (DEBUG) console.log("Deleting log entry...");
    const percentUsed = usage();
    if (percentUsed < 95) {
      return;
    }

    alert("Local storage is almost full. Deleting 20 oldest log entries.");

    let logs = JSON.parse(localStorage.getItem("log")) || [];
    if (logs.length > 0) {
      logs = logs.slice(20);
      localStorage.setItem("log", JSON.stringify(logs));
      renderLogList();
      renderCategoryList();
    }
}

export function logInterpret() {
    if (DEBUG) console.log("Interpreting log entries...");
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

export function isRecentLog(log) {
    const now = new Date();
    const logDate = new Date(log.date);
    const diffDays = (now - logDate) / (1000 * 60 * 60 * 24);
    return diffDays < 8; 
}

export function renderLogList() {
  const logList = document.getElementById("logList");
  logList.innerHTML = "";

  const logs = JSON.parse(localStorage.getItem("log")) || [];
  
  const recentLogs = logs.filter(isRecentLog);
  
  if (logs.length === 0) {
    logList.innerHTML = "<li>No log entries found</li>";
    return;
  }

  recentLogs.slice().reverse().forEach(renderLogEntry);
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

function isArchivedLog(log, now) {
  const logDate = new Date(log.date);
  const diffDays = (now - logDate) / (1000 * 60 * 60 * 24);
  return diffDays < 366;
}

function renderArchivedLogRow(log, now, archivedLogBody) {
  const logDate = new Date(log.date);
  const diffDays = Math.floor((now - logDate) / (1000 * 60 * 60 * 24));
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${log.activity}</td>
    <td>${logDate.toLocaleDateString()}</td>
    <td>${diffDays} days ago</td>`;
  archivedLogBody.appendChild(tr);
}

export function renderArchivedLogTable() {
  const archivedLogBody = document.getElementById("archivedLogBody");
  archivedLogBody.innerHTML = "";

  const logs = JSON.parse(localStorage.getItem("log")) || [];
  const now = new Date();

  function filterArchived(log) {
    return isArchivedLog(log, now);
  }

  function compareByDateDesc(a, b) {
    return new Date(b.date) - new Date(a.date);
  }

  const archivedLogs = logs.filter(filterArchived);


  if (archivedLogs.length === 0) {
    archivedLogBody.innerHTML = "<tr><td colspan='3'>No archived log entries found</td></tr>";
    return;
  }

  archivedLogs.sort(compareByDateDesc);
  archivedLogs.forEach(log => renderArchivedLogRow(log, now, archivedLogBody));
}

// Deletes logs older than 1 year
export function pruneOldLogs() {
  const logs = JSON.parse(localStorage.getItem("log")) || [];
  const now = new Date();

  const freshLogs = logs.filter(log => isArchivedLog(log, now));

  if (freshLogs.length !== logs.length) {
    localStorage.setItem("log", JSON.stringify(freshLogs));
  }
}