import { removeActivity } from "./clearStorage.js";
import { isRecentRecord } from "./record.js";

const GOAL = 2;
const NEUTRAL = 0;

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
  const selectMenu = document.getElementById("recordItem");
  selectMenu.innerHTML = '<option value="">Select an activity</option>';

  // Use cached defaults
  const defaults = JSON.parse(localStorage.getItem("defaults")) || {};
  const defaultActivities = Object.values(defaults.activities || {});
  const customActivities = JSON.parse(localStorage.getItem("activities")) || [];

  // Combine and deduplicate by name
  const allActivities = [...defaultActivities, ...customActivities].reduce((acc, activity) => {
    if (!acc.some(a => a.name === activity.name)) acc.push(activity);
    return acc;
  }, []);

  allActivities.forEach(addOption);
}

function addOption(activity) {
  const selectMenu = document.getElementById("recordItem");
  const option = document.createElement("option");
  option.value = activity.name;
  option.textContent = activity.name;
  selectMenu.appendChild(option);
}

export async function renderCategoryList() {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  const categories = JSON.parse(localStorage.getItem("categories")) || {};
  const customActivities = JSON.parse(localStorage.getItem("activities")) || [];

  const activityMap = buildActivityMap(customActivities);

  const records = JSON.parse(localStorage.getItem("records")) || [];
  const recentRecords = records.filter(record => isRecentRecord(record));
  const categoryCounts = countCategoriesInRecords(recentRecords, activityMap);

  Object.values(categories).forEach(renderCategoryCountItem.bind(null, categoryCounts, categoryList));
  updateLittleGuy(categoryCounts);
}

function updateLittleGuy(categoryCounts) {
  const littleGuy = document.getElementById("littleGuy");
  if (!littleGuy) return;

  const categories = JSON.parse(localStorage.getItem("categories")) || {};
  const categoryNames = Object.keys(categories);

  const categoryCounts_values = categoryNames.map(name => categoryCounts[name] || 0);
  const totalPoints = categoryCounts_values.reduce((sum, points) => sum + points, 0);
  const averagePoints = categoryNames.length > 0 ? totalPoints / categoryNames.length : 0;

  if (averagePoints > GOAL) {
    littleGuy.textContent = "😊";
  } else if (averagePoints > NEUTRAL) {
    littleGuy.textContent = "😐";
  } else if (averagePoints === NEUTRAL) {
    littleGuy.textContent = "😢";
  } else {
    littleGuy.textContent = "🫥";
  }
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

function countCategoriesInRecords(records, activityMap) {
  const counts = {};
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const activity = activityMap[record.activity];
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
  
  const nameSpan = document.createElement("span");
  nameSpan.className = "category-name";
  nameSpan.textContent = `${category.icon ? category.icon + " " : ""}${category.name}`;

  const colonSpan = document.createElement("span");
  colonSpan.className = "category-colon";
  colonSpan.textContent = ": ";

  const countSpan = document.createElement("span");
  countSpan.className = "category-count";
  countSpan.textContent = count;

  li.appendChild(nameSpan);
  li.appendChild(colonSpan);
  li.appendChild(countSpan);
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