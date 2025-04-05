const reportEmoji = {
  health: "🥵",
  education: "🤤",
  joy: "😭",
  peace: "🤬",
  default: "🫥"
};

function updateReportEmoji(pointsByCategory) {
  const emojiDisplay = document.querySelector("#reportEmoji");

  if (!emojiDisplay) {
    console.error("Emoji display element not found");
    return;
  }

  let leastCategory = null;
  let minPoints = Infinity;

  for (const [category, points] of Object.entries(pointsByCategory)) {
    if (points < minPoints) {
      minPoints = points;
      leastCategory = category;
    }
  }

  emojiDisplay.textContent = reportEmoji[leastCategory] || reportEmoji.default;
}

function getCategoryPointsFromTable() {
  const pointsByCategory = {};
  const tableRows = document.querySelectorAll("table:nth-of-type(1) tr");

  if (!tableRows.length) {
    console.error("No rows found in category points table");
    return pointsByCategory;
  }

  tableRows.forEach((row, index)=> {
    if (index === 0) return;
    const cells = row.querySelectorAll("td");
    const category = cells[0]?.textContent.trim();
    const points = parseInt(cells[1]?.textContent.trim(), 10);
    if (category && !isNaN(points)) {
      pointsByCategory[category] = points;
    }
  });

  return pointsByCategory;
}

function initializeReportEmoji() {
  const pointsByCategory = getCategoryPointsFromTable();
  updateReportEmoji(pointsByCategory);
}


function handleSelectActivitySubmit(event) {
  event.preventDefault();y = docu
  // Handle the form submission logic here
  console.log("Select Activity Form Submitted");
}

function resetForm() {
  document.getElementById("addActivity").reset();
}

function displayActivities() {
  const activityList = document.getElementById("activityList");
  activityList.innerHTML = "";

  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.forEach((activity, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = activity.name;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", handleRemoveButtonClick.bind(null, index));

    listItem.appendChild(removeButton);
    activityList.appendChild(listItem);
  });
}

function handleRemoveButtonClick(index) {
  removeActivity(index);
}

function removeActivity(index) {
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.splice(index, 1);
  localStorage.setItem("activities", JSON.stringify(activities));
  displayActivities();
}

function handleAddActivitySubmit(event) {
  event.preventDefault();

  const activityName = document.getElementById("Name").value.trim();
  const health = document.getElementById("health").value.trim();
  const education = document.getElementById("education").value.trim();
  const joy = document.getElementById("joy").value.trim();
  const peace = document.getElementById("peace").value.trim();

  if (activityName && health && education && joy && peace) {
    const activity = {
      name: activityName,
      categories: [
        { category: "health", points: parseInt(health, 10) },
        { category: "education", points: parseInt(education, 10) },
        { category: "joy", points: parseInt(joy, 10) },
        { category: "peace", points: parseInt(peace, 10) }
      ]
    };

    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.push(activity);
    localStorage.setItem("activities", JSON.stringify(activities));

    resetForm();
    alert("Activity added successfully!");
    displayActivities();
  } else {
    alert("Please fill in all fields.");
  }
}

function clearLocalStorage() {
  localStorage.clear();
  alert("Local storage cleared!");
  displayActivities();
}

function forceReport () {
  initializeReportEmoji();
}


function addEventListeners() {
  document.getElementById("selectActivity").addEventListener("submit", handleSelectActivitySubmit);
  document.getElementById("addActivity").addEventListener("submit", handleAddActivitySubmit);
  document.getElementById("clearStorage").addEventListener("click", clearLocalStorage);
  document.getElementById("forceReport").addEventListener("click", forceReport);
}

document.addEventListener("DOMContentLoaded", () => {
  resetForm();
  addEventListeners();
  initializeReportEmoji();
});