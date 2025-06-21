import { removeActivity } from "./clearStorage.js";
import { isRecentLog } from "./log.js";

export function activityTemplateList() {
  const activityList = document.getElementById("activityList");
  activityList.innerHTML = "";

  const activities = JSON.parse(localStorage.getItem("activities")) || [];

  if (activities.length === 0) {
    activityList.innerHTML = "<li>No activities found</li>";
    return;
  }

  activities.forEach(renderActivityTemplate);
}

export async function populateOptions() {
  const selectMenu = document.getElementById("logItem");
  selectMenu.innerHTML = '<option value="">Select an activity</option>';

  // Fetch default activities
  let defaultActivities = [];
  try {
    const response = await fetch('/static/json/defaults.json');
    const defaults = await response.json();
    defaultActivities = Object.values(defaults.activities || {});
  } catch (e) {
    console.warn("Could not load default activities:", e);
  }

  // Get custom activities from localStorage
  const customActivities = JSON.parse(localStorage.getItem("activities")) || [];

  // Combine and deduplicate by name
  const allActivities = [...defaultActivities, ...customActivities].reduce((acc, activity) => {
    if (!acc.some(a => a.name === activity.name)) acc.push(activity);
    return acc;
  }, []);

  allActivities.forEach(addOption);
}

function addOption(activity) {
  const selectMenu = document.getElementById("logItem");
  const option = document.createElement("option");
  option.value = activity.name;
  option.textContent = activity.name;
  selectMenu.appendChild(option);
}

export async function renderCategoryList() {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  let categories = {};
  let defaultActivities = [];
  try {
    const response = await fetch('/static/json/defaults.json');
    const defaults = await response.json();
    categories = defaults.categories || {};
    defaultActivities = Object.values(defaults.activities || {});
  } catch (e) {
    categoryList.innerHTML = "<li>Could not load categories.</li>";
    console.warn("Could not load categories:", e);
    return;
  }

  const customActivities = JSON.parse(localStorage.getItem("activities")) || [];
  const allActivities = defaultActivities.concat(customActivities);

  const activityMap = buildActivityMap(allActivities);

  const logs = JSON.parse(localStorage.getItem("log")) || [];
  const now = new Date();
  const recentlogs = logs.filter(log => isRecentLog(log, now));
  const categoryCounts = countCategoriesInLogs(recentlogs, activityMap);

  Object.values(categories).forEach(renderCategoryCountItem.bind(null, categoryCounts, categoryList));
  updateLittleGuy(categoryCounts);
}

function updateLittleGuy(categoryCounts) {
  const littleGuy = document.getElementById("littleGuy");
  if (!littleGuy) return;

  const health = categoryCounts["health"] || 0;
  const peace = categoryCounts["peace"] || 0;

  if (health > 2 && peace > 2) {
    littleGuy.textContent = "😊";
  } else if (health > 0 || peace > 0) {
    littleGuy.textContent = "😐";
  } else if (health === 0 && peace === 0) {
    littleGuy.textContent = "😢";
  } else {
    littleGuy.textContent = "🫥";}  
}

function buildActivityMap(activities) {
  const map = {};
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    if (activity && activity.name) {
      map[activity.name] = activity;
    }
  }
  return map;
}

function countCategoriesInLogs(logs, activityMap) {
  const counts = {};
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const activity = activityMap[log.activity];
    if (activity && Array.isArray(activity.categories)) {
      for (let j = 0; j < activity.categories.length; j++) {
        const cat = activity.categories[j];
        if (cat && cat.category) {
          counts[cat.category] = (counts[cat.category] || 0) + (cat.points || 0);
        }
      }
    }
  }
  return counts;
}

function renderCategoryCountItem(categoryCounts, categoryList, category) {
  const li = document.createElement("li");
  const count = categoryCounts[category.name] || 0;
  li.textContent = `${category.icon ? category.icon + " " : ""}${category.name}: ${count}`;
  categoryList.appendChild(li);
}

function renderActivityTemplate(activity, index) {
  const activityList = document.getElementById("activityList");

  const listItem = document.createElement("li");

  const activityName = document.createElement("span");
  activityName.textContent = activity.name;

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.classList.add("btn");
  removeButton.dataset.index = index;
  removeButton.addEventListener("click", handleRemoveButtonClick);

  listItem.appendChild(activityName);
  listItem.appendChild(removeButton);
  activityList.appendChild(listItem);
}

function handleRemoveButtonClick(event) {
  const index = event.target.dataset.index;
  removeActivity(Number(index));
  activityTemplateList();
  populateOptions();
}