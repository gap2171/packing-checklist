# Packing Checklist

An introductory webpage project by Gillian Parris, created with ChatGPT/Codex assistance.

## Design decisions

Gillian chose the packing checklist concept and green-and-cream colors. After reviewing the first version, she requested editable items, adding custom items, editable suggestions that move into the main list, and a completion percentage. Codex generated the code and suggested browser-local saving and clearer Remove buttons.

## Files

- `index.html`: semantic HTML structure and controls.
- `style.css`: colors, spacing, typography, and responsive layout.
- `script.js`: adding, editing, removing, suggestion transfer, progress, and localStorage.
- `source.html`: readable source code view.

## Use

Open `index.html` in a browser, or visit the GitHub Pages site once enabled. No installation or build step is needed.

Changes save in the same browser. They do not sync between devices. Clearing browser data removes them. When browser storage is unavailable, the page displays a notice and still works for the current visit.

## Tested with browser controls

- Add a custom item; edit an existing name.
- Edit a suggestion and transfer it to the main list.
- Check items and verify the progress calculation (1 of 8 = 13%, rounded).
- Uncheck all while keeping list items.
- Add and check an item, reload, and verify persistence.
- Remove the temporary test item.

HTML and CSS form the assignment foundation. JavaScript is an extra for the requested interactions. The project uses AI-generated code and does not claim independent student authorship of that code.
