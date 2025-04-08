export function handleSelectActivitySubmit(event) {
  event.preventDefault();
  resetForm("selectActivity");
  console.log("Select Activity Form Submitted");
}

export function handleAddActivitySubmit(event) {
  event.preventDefault();

  const activityName = document.getElementById("Name").value.trim();
  const health = document.getElementById("health").value.trim();
  const education = document.getElementById("education").value.trim();
  const joy = document.getElementById("joy").value.trim();
  const peace = document.getElementById("peace").value.trim();

  if (!activityName) {
    alert("Please enter an activity name.");
    return;
  }

  if (!health && !education && !joy && !peace) {
    alert("Please enter at least one category.");
    return;
  }

  const activity = {
    name: activityName,
    categories: [
      { category: "health", points: parseInt(health || "0", 10) },
      { category: "education", points: parseInt(education || "0", 10) },
      { category: "joy", points: parseInt(joy || "0", 10) },
      { category: "peace", points: parseInt(peace || "0", 10) }
    ]
  };

    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.push(activity);
    localStorage.setItem("activities", JSON.stringify(activities));

    resetForm("addActivity");
    alert("Activity added successfully!");
}

export function resetForm(formId) {
  document.getElementById(formId).reset();
}