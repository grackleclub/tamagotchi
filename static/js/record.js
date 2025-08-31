import { renderCategoryList } from "./ui.js";
import { usage } from "./storage.js";
import { DEBUG } from "./config.js";

// create a record entry and place in localStorage
export function recordCreate(event) {
    pruneOldRecords();
    event.preventDefault();
    const records = JSON.parse(localStorage.getItem("records")) || [];
    const activityName = document.getElementById("recordItem").value.trim();

    if (!activityName) {
        alert("Please select an activity to record.");
        return;
    }

    if (DEBUG) console.log(`recording activity: ${activityName}`);
    records.push(
        {
            activity: activityName,
            date: new Date().toISOString(),
        }
    )
    localStorage.setItem("records", JSON.stringify(records));
    document.getElementById("recordCreate").reset();
    renderRecordList();
    renderCategoryList();
    recordDelete();
}

export function recordList() {
    if (DEBUG) console.log("Displaying recorded entries...");
    const records = JSON.parse(localStorage.getItem("records")) || [];
    if (DEBUG) console.log(records);
}

export function recordDelete() {
    const percentUsed = usage();
    if (percentUsed < 95) {
      return;
    }

    let records = JSON.parse(localStorage.getItem("records")) || [];
    const twentyPercent = Math.ceil(records.length * 0.2);

    alert(`Local storage is almost full. Deleting ${twentyPercent} oldest record entries.`);

    records = records.slice(twentyPercent);
    localStorage.setItem("records", JSON.stringify(records));
    renderRecordList();
    renderCategoryList();
}

export function recordInterpret() {
    if (DEBUG) console.log("Interpreting recorded entries...");
    const records = JSON.parse(localStorage.getItem("records")) || [];
    for (let record of records) {
        if (DEBUG) console.log(`recorded: ${record.activity} @ ${record.date}`);
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

export function isRecordWithinWeek(record) {
    const now = new Date();
    const recordDate = new Date(record.date);
    const diffDays = (now - recordDate) / (1000 * 60 * 60 * 24);
    return diffDays < 8; 
}

export function renderRecordList() {
  const recordList = document.getElementById("recordList");
  recordList.innerHTML = "";

  const records = JSON.parse(localStorage.getItem("records")) || [];

  const recentRecords = records.filter(isRecordWithinWeek);

  if (recentRecords.length === 0) {
    recordList.innerHTML = "<li>No recent record entries found</li>";
    return;
  }

  recentRecords.slice().reverse().forEach(renderRecordEntry);
}


function renderRecordEntry(record) {
  const recordList = document.getElementById("recordList");
  const li = document.createElement("li");
  const now = new Date().toISOString();
  const { hours, days } = hoursBetween(record.date, now);
  li.textContent = hours < 24
    ? `${record.activity} : ${hours} hours ago`
    : `${record.activity} : ${days} days ago`;
  recordList.appendChild(li);
}

function isArchivedRecord(record, now) {
  const recordDate = new Date(record.date);
  const diffDays = (now - recordDate) / (1000 * 60 * 60 * 24);
  return diffDays < 366;
}

function renderArchivedRecordRow(record, now, archivedRecordBody) {
  const recordDate = new Date(record.date);
  const diffDays = Math.floor((now - recordDate) / (1000 * 60 * 60 * 24));
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${record.activity}</td>
    <td>${recordDate.toLocaleDateString()}</td>
    <td>${diffDays} days ago</td>`;
  archivedRecordBody.appendChild(tr);
}

export function renderArchivedRecordTable() {
  const archivedRecordBody = document.getElementById("archivedRecordBody");
  archivedRecordBody.innerHTML = "";

  const records = JSON.parse(localStorage.getItem("records")) || [];
  const now = new Date();

  function filterArchived(record) {
    return isArchivedRecord(record, now);
  }

  function compareByDateDesc(a, b) {
    return new Date(b.date) - new Date(a.date);
  }

  const archivedRecords = records.filter(filterArchived);


  if (archivedRecords.length === 0) {
    archivedRecordBody.innerHTML = "<tr><td colspan='3'>No archived record entries found</td></tr>";
    return;
  }

  archivedRecords.sort(compareByDateDesc);
  archivedRecords.forEach(record => renderArchivedRecordRow(record, now, archivedRecordBody));
}

// Deletes records older than 1 year
export function pruneOldRecords() {
  const records = JSON.parse(localStorage.getItem("records")) || [];
  const now = new Date();

  const freshRecords = records.filter(record => isArchivedRecord(record, now));

  if (freshRecords.length !== records.length) {
    localStorage.setItem("records", JSON.stringify(freshRecords));
  }
}