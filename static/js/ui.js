import { removeActivity } from "./clearStorage.js";

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