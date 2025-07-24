import { DEBUG } from "./config.js";
import { renderArchivedRecordTable } from "./record.js";
import { activityTemplateList, populateOptions } from "./ui.js";

function getActivityFormData() {
  const activityName = document.getElementById("Name").value.trim();
  const categoriesObj = JSON.parse(localStorage.getItem("categories")) || {};
  const categoryNames = Object.keys(categoriesObj);

  const categoryValues = categoryNames.map(cat => {
    const value = document.getElementById(cat)?.value.trim() || "";
    return { category: cat, points: parseInt(value || "0", 10) };
  });
  
  return { activityName, categoryValues };
}

function validateActivityData({ activityName, categoryValues}) {
  if (!activityName) {
    return { isValid: false, message: "Enter an activity name." };
  }
  if (categoryValues.every(c => !c.points)) {
    return { isValid: false, message: "Add a value to at least one category." };
  }
  return { isValid: true };
}

function activityExists(activityName) {
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  return activities.some(activity => 
    activity.name.toLowerCase() === activityName.toLowerCase()
  );
}

function createActivityObject(activityName, categoryValues) {
  return {
    name: activityName,
    categories: categoryValues
    };
  }

function saveActivity(activity) {
  const activities = JSON.parse(localStorage.getItem("activities")) || [];
  activities.push(activity);
  localStorage.setItem("activities", JSON.stringify(activities));
  if (DEBUG) console.log(`Adding activity: ${activity.name}`, activity);
}

function updateActivityUI() {
  resetForm("addActivity");
  renderAddActivityFields();
  activityTemplateList();
  populateOptions();
}

export function activityTemplateAdd(event) {
  event.preventDefault();

  const formData = getActivityFormData();
  const validation = validateActivityData(formData);
  if (!validation.isValid) {
    alert(validation.message);
    return;
  }

  if (activityExists(formData.activityName)) {
    alert("That activity exists. Choose a different name.");
    return;
  }

  const activity = createActivityObject(formData.activityName, formData.categoryValues);
  saveActivity(activity);
  updateActivityUI();
  alert(`"${activity.name}" added successfully!`);
}

export function renderAddActivityFields() {
  const form = document.getElementById("addActivity");
  if (!form) return;
  
  while (form.children.length > 2) {
    form.removeChild(form.children[form.children.length - 2]);
  }

  const categoriesObj = JSON.parse(localStorage.getItem("categories"));
  if (!categoriesObj) return;

  form.insertBefore(document.createElement("br"), form.lastElementChild);

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