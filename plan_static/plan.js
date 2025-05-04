const Days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

async function writeToFile() {
    let plan = "";

    for (let i = 0; i < 7; i++) {
        const Day = document.querySelector(`.${Days[i]}`);
        const Tds = Day.querySelectorAll('td');

        const values = [];

        Tds.forEach((td) => {
            const element = td.querySelector('input, select');
            if (element) {
                values.push(element.value);
            } else {
                const text = td.textContent.trim();
                if (text) values.push(text);
            }
        });

        plan += `Day: ${values[0]}\nTask: ${values[1]}\nWhy: ${values[2]}\nStatus: ${values[3]}\n\n`;
    }

    // 🔥 Send once after collecting all 7 days
    const res = await fetch("/plan-write", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: plan
    });

    const result = await res.text();
    document.querySelector(".output").innerText = result;
}

document.querySelector(".save-btn").addEventListener("click", () => {
    writeToFile();
});

async function readFromFile() {
    try {
        const res = await fetch("/plan-read");
        const text = await res.text();

        console.log("Raw response:", text);

        const lines = JSON.parse(text); // already a flat array
        let index = 0;

        for (let i = 0; i < Days.length; i++) {
            const row = document.querySelector(`.${Days[i]}`);
            const inputs = row.querySelectorAll('input, select');

            // Safely extract each value from the JSON lines
            const day = lines[index]?.split(":")[1]?.trim();
            const task = lines[index + 1]?.split(":")[1]?.trim();
            const why = lines[index + 2]?.split(":")[1]?.trim();
            const status = lines[index + 3]?.split(":")[1]?.trim();

            if (inputs.length === 3) {
                inputs[0].value = task || "";
                inputs[1].value = why || "";
                inputs[2].value = status || "Select Status";
            }

            index += 5; // move to next block (4 lines + 1 empty)
        }

    } catch (err) {
        console.error("Error reading file:", err.message);
        document.getElementById("output").innerText = "Error reading file!";
    }
}

function checkAllCompleted() {
    const allSelects = document.querySelectorAll("select");
    let allCompleted = true;

    allSelects.forEach(select => {
        if (select.value !== "Completed") {
            allCompleted = false;
        }
    });

    if (allCompleted) {
        showModal(); // Show modal if all tasks are completed
    }
}

// Function to show the modal
function showModal() {
    document.getElementById("successModal").style.display = "block";
    document.querySelector("section").classList.add("blur"); // Blur the section
}

// Function to close the modal
function closeModal() {
    document.getElementById("successModal").style.display = "none";
    document.querySelector("section").classList.remove("blur"); // Remove blur
}

// Close the modal if the user clicks anywhere outside of it
window.onclick = function (event) {
    const modal = document.getElementById("successModal");
    if (event.target === modal) {
        closeModal();
    }
}

function attachAutoSaveListeners() {
    const allInputs = document.querySelectorAll("input");
    const allSelects = document.querySelectorAll("select");

    allInputs.forEach(input => {
        input.addEventListener("input", debounce(() => {
            writeToFile();
            checkAllCompleted(); // Check if all tasks are completed
        }, 500));
    });

    allSelects.forEach(select => {
        select.addEventListener("change", debounce(() => {
            writeToFile();
            checkAllCompleted(); // Check if all tasks are completed
        }, 500));
    });
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

window.onload = () => {
    readFromFile();          // Load existing data into table
    attachAutoSaveListeners(); // Setup auto-save behavior
};


