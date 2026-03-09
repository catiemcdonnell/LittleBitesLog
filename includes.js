// includes little bites log

// DARK MODE / LIGHT MODE
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
    if (localStorageTheme !== null) {
      return localStorageTheme;
    }
  
    if (systemSettingDark.matches) {
      return "dark";
    }
  
    return "light";
  }
  
  function updateButton({ buttonEl, isDark }) {
    const newCta = isDark ? "Change to light theme" : "Change to dark theme";
    buttonEl.setAttribute("aria-label", newCta);
    buttonEl.innerText = newCta;
  }
  
  function updateThemeOnHtmlEl({ theme }) {
    document.querySelector("html").setAttribute("data-theme", theme);
  }
  
  const button = document.querySelector("[data-theme-toggle]");
  const localStorageTheme = localStorage.getItem("theme");
  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
  
  let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });
  

  function updateButton({ buttonEl, isDark }) {
    const newLabel = isDark ? "Change to light theme" : "Change to dark theme";
    buttonEl.setAttribute("aria-label", newLabel);
  
    // Update Font Awesome classes
    if (isDark) {
      buttonEl.classList.remove("fa-regular", "fa-moon");
      buttonEl.classList.add("fa-regular", "fa-sun");
    } else {
      buttonEl.classList.remove("fa-regular", "fa-sun");
      buttonEl.classList.add("fa-regular", "fa-moon");
    }
  }
  updateThemeOnHtmlEl({ theme: currentThemeSetting });
  
 
  button.addEventListener("click", (event) => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
  
    localStorage.setItem("theme", newTheme);
    updateButton({ buttonEl: button, isDark: newTheme === "dark" });
    updateThemeOnHtmlEl({ theme: newTheme });
  
    currentThemeSetting = newTheme;
  }); 

// MODAL 
// Get the modal, button, and close elements
var modal = document.getElementById("foodModal");
var btn = document.getElementById("addFood");
var span = document.getElementsByClassName("close")[0];



// FUNCTION: set today's date in local format
function setTodayDate() {
  const dateInput = document.getElementById("date");

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  dateInput.value = `${yyyy}-${mm}-${dd}`;
}

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
  setTodayDate(); // ⭐ Set today's date when modal opens
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



// FORM
document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from actually submitting

    // 1. Get form values
    const food = document.getElementById('food').value;
    const type = document.getElementById('type').value;
    const date = document.getElementById('date').value;

    const formattedDate = new Date(date).toLocaleDateString();
    const reaction = document.getElementById('reaction').value;
    const notes = document.getElementById('notes').value;
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const rating = ratingInput ? ratingInput.value : "";

    const newData = { food, type, formattedDate, rating, reaction, notes};

    // 2. Retrieve existing data from localStorage or initialize an empty array
    let storedData = JSON.parse(localStorage.getItem('formData')) || [];

    // 3. Add the new data
    storedData.push(newData);

    // 4. Save the updated array back to localStorage
    localStorage.setItem('formData', JSON.stringify(storedData));

    // 5. Update the displayed table
    displayData();
    updateProgress();

    // 6. Close the modal
    modal.style.display = "none";

    // 7. Reset the form
    e.target.reset();

    // ⭐ Reset date back to today for next time
    setTodayDate();

});

function displayData() {
    const dataTable = document.getElementById('dataTable');
    dataTable.innerHTML = ''; // Clear the table before re-rendering
  
    const storedData = JSON.parse(localStorage.getItem('formData')) || [];
  
    // Loop over each food item — notice we include the `index`
    storedData.forEach((item, index) => {  // ✅ This is Step 2
      const row = document.createElement('tr');

      
  
      // Create your cells
      const foodCell = document.createElement('td');
      foodCell.textContent = item.food;
      row.appendChild(foodCell);
  
      const typeCell = document.createElement('td');
      typeCell.textContent = item.type;
      row.appendChild(typeCell);
  
      const dateCell = document.createElement('td');
      dateCell.textContent = item.formattedDate;
      row.appendChild(dateCell);
  
      const ratingCell = document.createElement('td');
      ratingCell.textContent = item.rating;
      row.appendChild(ratingCell);
  
      const reactionCell = document.createElement('td');
      reactionCell.textContent = item.reaction;
      row.appendChild(reactionCell);
  
      const notesCell = document.createElement('td');
      notesCell.textContent = item.notes;
      row.appendChild(notesCell);
  
      const deleteCell = document.createElement('td');
    const deleteBtn = document.createElement('button');

    // Trash emoji instead of text
    deleteBtn.innerHTML = "🗑️ Delete";
    deleteBtn.className = "delete-btn";

    // Use the index to delete the correct item
    deleteBtn.onclick = function() {
    // Animate the row first
    row.style.transition = "opacity 0.4s, transform 0.4s";
    row.style.opacity = 0;
    row.style.transform = "translateX(-50px)";

    // Wait for animation to finish before actually removing
    setTimeout(() => {
        deleteFood(index);
    }, 400);
    };

    deleteCell.appendChild(deleteBtn);
    row.appendChild(deleteCell);
      dataTable.appendChild(row);
  
    });
    updateProgress();
    
  }

  function deleteFood(index) {

    let storedData = JSON.parse(localStorage.getItem('formData')) || [];
  
    // Remove the item at the correct index
    storedData.splice(index, 1);
  
    // Save the updated array back to localStorage
    localStorage.setItem('formData', JSON.stringify(storedData));
  
    // Refresh the table
    displayData();
  
  }
// Display data when the page loads
document.addEventListener('DOMContentLoaded', function() {
  displayData();
  updateProgress();
  setTodayDate();
});

function celebrateFoods() {
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.6 }
    });
  }

// PROGRESS BAR 
function updateProgress() {

    const storedData = JSON.parse(localStorage.getItem('formData')) || [];
  
    const uniqueFoods = [...new Set(storedData.map(item => item.food))];
    const count = uniqueFoods.length;
  
    const maxFoods = 100; // final goal
  
    const percentage = Math.min((count / maxFoods) * 100, 100);
  
    document.getElementById("progressFill").style.width = percentage + "%";
  
    document.getElementById("progressText").textContent =
      count + " / " + maxFoods + " foods";
  
  
    // 
    const milestones = [10, 25, 50, 100];
  
    milestones.forEach(milestone => {
  
      const milestoneKey = `celebrated_${milestone}`;
  
      if (count === milestone && !localStorage.getItem(milestoneKey)) {
  
        celebrateFoods();
  
        localStorage.setItem(milestoneKey, "true");
  
      }
  
    });
  
  }


 
  