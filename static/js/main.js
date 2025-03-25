function handleSelectActivitySubmit(event) {
  event.preventDefault();
  // Handle the form submission logic here
  console.log("Select Activity Form Submitted");
}

function handleAddActivitySubmit(event) {
  event.preventDefault();

  const activityName = document.getElementById("Name").value.trim();
  const categories = document.querySelectorAll("#category");
  const points = document.querySelectorAll("#points");

  if (activityName && categories.length === 4 && points.length === 4) {
    const activity = {
      name: activityName,
      categories: []
    };

    for (let i = 0; i < 4; i++) {
      const category = categories[i].value.trim();
      const point = points[i].value.trim();

      if (category && point) {
        activity.categories.push({
          category: category,
          points: parseInt(point, 10)
        });
      } else {
        alert("Please fill in all fields.");
        return;
      }
    }

    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.push(activity);
    localStorage.setItem("activities", JSON.stringify(activities));

    alert("Activity added successfully!");
  } else {
    alert("Please fill in all fields.");
  }
}

function addEventListeners() {
  document.getElementById("selectActivity").addEventListener("submit", handleSelectActivitySubmit);
  document.getElementById("addActivity").addEventListener("submit", handleAddActivitySubmit);
}

document.addEventListener("DOMContentLoaded", addEventListeners);