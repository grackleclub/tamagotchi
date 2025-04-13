export function removeActivity(index) {
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.splice(index, 1);
  localStorage.setItem("activities", JSON.stringify(activities));
}

export function clearLocalStorage() {
  if (confirm("Are you sure you want to permanently clear all data?")) {
    localStorage.clear();
    // introduce a delay to make the change more aparent
    setTimeout(() => {
      console.log("localStorage cleared")
      alert("Local storage cleared!");
    }, 100);
  }
}