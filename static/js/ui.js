import { removeActivity } from "./clearStorage.js";

export function displayActivities() {
  const activityList = document.getElementById("activityList");
  activityList.innerHTML = "";

  const activities = JSON.parse(localStorage.getItem("activities")) || [];

  if (activities.length === 0) {
    activityList.innerHTML = "<li>No activities found</li>";
    return;
  }

  activities.forEach(renderActivity);
}

export function populateOptions() {
  const selectMenu = document.getElementById("activity");
  selectMenu.innerHTML = '<option value="">Select an activity</option>';

  const activities = JSON.parse(localStorage.getItem("activities")) || [];

  activities.forEach(addOption);
}

function addOption(activity) {
  const selectMenu = document.getElementById("activity");
  const option = document.createElement("option");
  option.value = activity.name;
  option.textContent = activity.name;
  selectMenu.appendChild(option);
}

function renderActivity(activity, index) {
  const activityList = document.getElementById("activityList");

  const listItem = document.createElement("li");

  const activityName = document.createElement("span");
  activityName.textContent = activity.name;

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.dataset.index = index;
  removeButton.addEventListener("click", handleRemoveButtonClick);

  listItem.appendChild(activityName);
  listItem.appendChild(removeButton);
  activityList.appendChild(listItem);
}

function handleRemoveButtonClick(event) {
  const index = event.target.dataset.index;
  removeActivity(Number(index));
  displayActivities();
  populateOptions();
}