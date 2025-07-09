import { renderArchivedRecordTable } from "./record.js";
import { activityTemplateList, populateOptions } from "./ui.js";

export function activityTemplateAdd(event) {
  event.preventDefault();

  const activityName = document.getElementById("activityName").value.trim();
  const categoriesObj = JSON.parse(localStorage.getItem("categories")) || {};
  const categoryNames = Object.keys(categoriesObj);
  const categoryValues = categoryNames.map(cat => {
    const vale = document.getElementById(cat)?.value.trim() || "";
    return { category: cat, points: parseInt(value || "0", 10) };
  });

  if (!activityName) {
    alert("Enter an activity name.");
    return;
  }

  if (categoryValues.every(c => !c.points)) {
    alert("Add a value to at least one category.");
    return;
  }
  
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  const existingActivity = activities.some(activity => activity.name.toLowerCase() === activityName.toLowerCase());
  if (existingActivity) {
    alert("That activity exists. Choose a different name.");
    return;
  }

  const activity = {
    name: activityName,
    categories: categoryValues
  };

    activities.push(activity);
    console.log(`Adding activity: ${activityName}`, activity);
    localStorage.setItem("activities", JSON.stringify(activities));

    resetForm("addActivity");
    renderAddActivityFields();
    activityTemplateList();
    populateOptions();
    alert("Activity added successfully!");
}

export function renderAddActivityFields() {
  const form = document.getElementById("addActivity");
  if (!form) return;
  
  while (form.children.length > 2) {
    form.removeChild(form.children[form.children.length - 2]);
  }

  const categoriesObj = JSON.parse(localStorage.getItem("categories"));
  if (!categoriesObj) return;
  Object.values(categoriesObj).forEach(cat => {
    const label = document.createElement("label");
    label.textContent = cat.name;
    const input = document.createElement("input");
    input.className = "field";
    input.type = "number";
    input.id = cat.name;
    input.name = cat.name;
    input.placeholder = "Points";
    form.insertBefore(label, form.lastElementChild);
    form.insertBefore(input, form.lastElementChild);
    form.insertBefore(document.createElement("br"), form.lastElementChild);
  })
}

export function resetForm(formId) {
  document.getElementById(formId).reset();
}

export function toggleArchived(event) {
  event.preventDefault();

  const table = document.getElementById("archivedRecordTable");
  const button = event.currentTarget;
  if (table.style.display === "none") {
    renderArchivedRecordTable();
    table.style.display = "block";
    button.textContent = "Hide Records";
  } else {
    table.style.display = "none";
    button.textContent = "Show All Records";
  }
}