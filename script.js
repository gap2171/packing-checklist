// Each packing item has a name and a packed state.
let items = [
  { name: "Clothes", packed: false },
  { name: "Comfortable shoes", packed: false },
  { name: "Toothbrush and toothpaste", packed: false },
  { name: "Phone charger", packed: false },
  { name: "Water bottle", packed: false },
  { name: "Wallet and ID", packed: false }
];
let suggestions = ["Sunscreen", "Headphones", "Rain jacket", "Travel documents"];

// localStorage remembers this browser's list between visits.
const storageKey = "packing-checklist-v1";
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (saved && Array.isArray(saved.items) && Array.isArray(saved.suggestions)
      && saved.items.every(item => item && typeof item.name === "string" && typeof item.packed === "boolean")
      && saved.suggestions.every(name => typeof name === "string")) {
    items = saved.items;
    suggestions = saved.suggestions;
  }
} catch (error) {
  storageAvailable = false;
}

function saveList() {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ items, suggestions }));
  } catch (error) {
    storageAvailable = false;
  }
  document.querySelector("#save-note").textContent = storageAvailable
    ? "Your list saves automatically in this browser. Clearing browser data removes it."
    : "Saving is unavailable in this browser. Keep this page open to retain your changes.";
}

const packingList = document.querySelector("#packing-list");
const suggestionList = document.querySelector("#suggestion-list");
const newItem = document.querySelector("#new-item");
const actionMessage = document.querySelector("#action-message");

// Progress is packed items divided by all items, converted to a percentage.
function updateProgress() {
  const packed = items.filter(item => item.packed).length;
  const percent = items.length === 0 ? 0 : Math.round(packed / items.length * 100);
  document.querySelector("#packing-progress").value = percent;
  document.querySelector("#progress-text").textContent =
    `${percent}% packed · ${packed} of ${items.length} items`;
  saveList();
}

// A text field lets visitors rename an item directly.
function makeNameField(name, label, saveName) {
  const field = document.createElement("input");
  field.type = "text";
  field.className = "item-name";
  field.value = name;
  field.maxLength = 80;
  field.setAttribute("aria-label", label);
  field.addEventListener("change", () => {
    const updatedName = field.value.trim();
    if (updatedName === "") {
      field.value = name;
      return;
    }
    name = updatedName;
    saveName(updatedName);
    saveList();
  });
  return field;
}

// Draw the main list from the items array.
function renderPackingList() {
  packingList.replaceChildren();
  items.forEach((item, index) => {
    const row = document.createElement("li");
    row.className = "item-row";
    row.classList.toggle("packed", item.packed);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.packed;
    checkbox.setAttribute("aria-label", `Mark ${item.name} as packed`);
    checkbox.addEventListener("change", () => {
      item.packed = checkbox.checked;
      row.classList.toggle("packed", item.packed);
      updateProgress();
    });

    const nameField = makeNameField(item.name, `Edit packing item ${index + 1}`, name => {
      item.name = name;
      checkbox.setAttribute("aria-label", `Mark ${name} as packed`);
      removeButton.setAttribute("aria-label", `Remove ${name}`);
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${item.name}`);
    removeButton.addEventListener("click", () => {
      items.splice(index, 1);
      renderPackingList();
      const nextField = packingList.querySelectorAll(".item-name")[Math.min(index, items.length - 1)];
      (nextField || newItem).focus();
      actionMessage.textContent = `${item.name} removed from your list.`;
    });

    row.append(checkbox, nameField, removeButton);
    packingList.append(row);
  });
  document.querySelector("#empty-message").hidden = items.length > 0;
  document.querySelector("#reset-button").disabled = items.length === 0;
  updateProgress();
}

// Each suggestion can be edited and then moved into the main list.
function renderSuggestions() {
  suggestionList.replaceChildren();
  suggestions.forEach((suggestion, index) => {
    const row = document.createElement("li");
    row.className = "item-row";
    const nameField = makeNameField(suggestion, `Edit suggestion ${index + 1}`, name => {
      suggestions[index] = name;
    });
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "secondary";
    addButton.textContent = "Add to my list ↑";
    addButton.addEventListener("click", () => {
      const name = suggestions[index];
      items.push({ name: name, packed: false });
      suggestions.splice(index, 1);
      renderPackingList();
      renderSuggestions();
      const addedField = packingList.lastElementChild.querySelector(".item-name");
      addedField.focus();
      actionMessage.textContent = `${name} added to your packing list.`;
    });
    row.append(nameField, addButton);
    suggestionList.append(row);
  });
  document.querySelector("#suggestions-empty").hidden = suggestions.length > 0;
}

// Submitting the form adds a new, unpacked item without reloading the page.
document.querySelector("#add-item-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = newItem.value.trim();
  if (name === "") {
    newItem.value = "";
    newItem.focus();
    return;
  }
  items.push({ name: name, packed: false });
  renderPackingList();
  newItem.value = "";
  newItem.focus();
  actionMessage.textContent = `${name} added to your packing list.`;
});

document.querySelector("#reset-button").addEventListener("click", () => {
  items.forEach(item => item.packed = false);
  renderPackingList();
});

renderPackingList();
renderSuggestions();
