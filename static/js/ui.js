import { removeActivity } from "./clearStorage.js";

export function displayActivities() {
  const activityList = document.getElementById("activityList");
  activityList.innerHTML = "";

  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.forEach((activity, index) => {
    const listItem = document.createElement("li");

    const activityName = document.createElement("span");
    activityName.textContent = activity.name;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      removeActivity(index);
      // displayActivities();
    });

    listItem.appendChild(activityName);
    listItem.appendChild(removeButton);
    activityList.appendChild(listItem);
  });
}