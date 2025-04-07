export function removeActivity(index) {
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.splice(index, 1);
  localStorage.setItem("activities", JSON.stringify(activities));
}

export function clearLocalStorage() {
  localStorage.clear();
  alert("Local storage cleared!");
}