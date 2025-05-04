let Recent_decisions = {};

async function writeToFile() {
    const Decision = document.getElementById("Decision").value;
    const options = document.getElementsByClassName("option");

    let text = `Decision : ${Decision}\n`;

    for (let i = 0; i < options.length; i++) {
        text += `Option ${i + 1} : ${options[i].value}\n`; // fixed here
    }
    let output = document.querySelector(".suggestion-result").innerText;
    text += `Suggestion: ${output}\n===ENTRY-END===\n`;

    const res = await fetch("/write", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: text
    });

    const result = await res.text();
    document.getElementById("output").innerText = result;
}

async function readFromFile() {
    try {
        const res = await fetch("/read");
        const lines = await res.json(); // ✅ this is the fix

        console.log("Parsed decisions:", lines);

        lines.forEach((e) => {
            const decisionLine = e.split('\n').find(line => line.startsWith("Decision"));
            const decision = decisionLine?.split("Decision :")[1]?.trim();
            console.log(e);
            console.log("next");

            if (decision) {
                Recent_decisions[decision] = e;
                const decisionDiv = document.createElement("li");
                decisionDiv.innerHTML = `<a>${decision}</a>`;

                const menu = document.querySelector(".sidebar-menu");
                menu.prepend(decisionDiv);
            }
        });
    } catch (err) {
        console.error("Error reading file:", err.message);
        document.getElementById("output").innerText = "Error reading file!";
    }
}

// Add a new option box when the button is clicked
document.querySelector(".to-create-new-option").addEventListener("click", () => {
    const newOption = document.createElement("textarea");
    newOption.className = "option";
    newOption.rows = 1;
    newOption.cols = 50;
    newOption.placeholder = "Type your Option";

    // Insert it just before the buttons
    const button = document.querySelector(".to-create-new-option");
    button.parentNode.insertBefore(newOption, button);
    button.parentNode.insertBefore(document.createElement("br"), button);
    const otherOptions = document.getElementsByClassName("option");
    console.log(otherOptions);
});

// Generate Bot response using API
const generateSuggestionOption = async () => {
    const messageElement = document.getElementById("Decision");
    const otherOptions = document.querySelector(".option");
    let i = 0;
    let options = Array.from(otherOptions).map(element => {
        i++;
        return `Option ${i} = ${element.value}`;
    });
    let formattedOptions = options.join(", ");
    console.log(formattedOptions);
    // Output: Option 1 = Pizza, Option 2 = Salad, Option 3 = Ice cream

    let apiResponseText;

    // // Adds User Message to chat History
    // chatHistory.push({
    //     role: "user",
    //     parts: [{ text: `Using the details provided above, please address this query: ${userData.message}` }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])],
    // });

    let chatHistory = `Please provide me more suggestions on taking Decision ${messageElement.value} except these ${formattedOptions}and provide me only one small one line suggestion`

    // API REQUEST OPTION
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify({
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        { "text": chatHistory }
                    ]
                }
            ]
        }
        )
    }

    try {
        // Fetch bot response from API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        // Extract and display bot's response text
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponseText;

        // // Adds Bot Message to chat History
        // chatHistory.push({
        //     role: "model",
        //     parts: [{ text: apiResponseText }],
        // });

        // storingChat(chatHistory);
        console.log(chatHistory);
        console.log(apiResponseText);
        return apiResponseText;
    } catch (error) {
        // Handles Error in API Response
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    } finally {
        // Resets user's file data,removing thinking indicator  and scroll chat to bottom
        // userData.file = {};
        // incomingMessageDiv.classList.remove("thinking");
        // chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    }
}

// Suggest a new option by gemini when the button is clicked
document.querySelector(".to-suggest-new-option").addEventListener("click", async () => {
    const newOption = document.createElement("textarea");
    newOption.className = "option";
    newOption.rows = 1;
    newOption.cols = 50;
    newOption.placeholder = "Type your Option";
    // let suggestion = generateSuggestionOption().then(result => {
    //     // use the result here
    //     console.log("Suggestion:", result);
    //     return result;
    // }).catch(error => {
    //     console.error("Error getting suggestion:", error);
    // });

    newOption.value = await generateSuggestionOption().then(result => {
        // use the result here
        console.log("Suggestion:", result);
        return result;
    }).catch(error => {
        console.error("Error getting suggestion:", error);
    });

    // Insert it just before the buttons
    const button = document.querySelector(".to-create-new-option");
    button.parentNode.insertBefore(newOption, button);
    button.parentNode.insertBefore(document.createElement("br"), button);
});

const generateResult = async () => {
    const messageElement = document.getElementById("Decision");
    const otherOptions = document.querySelector(".option");
    let i = 0;
    let options = Array.from(otherOptions).map(element => {
        i++;
        return `Option ${i} = ${element.value}`;
    });
    let formattedOptions = options.join(", ");
    console.log(formattedOptions);
    // Output: Option 1 = Pizza, Option 2 = Salad, Option 3 = Ice cream

    let apiResponseText;

    // // Adds User Message to chat History
    // chatHistory.push({
    //     role: "user",
    //     parts: [{ text: `Using the details provided above, please address this query: ${userData.message}` }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])],
    // });

    let chatHistory = `Please help me on taking Decision ${messageElement.value} based on the given below options \n ${formattedOptions} and provide me the best option to choose among the above option and think in positive way and answer me in 3-4 lines suggesting me the option and why to do so and how it will be beneficial.`

    // API REQUEST OPTION
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify({
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        { "text": chatHistory }
                    ]
                }
            ]
        }
        )
    }

    try {
        // Fetch bot response from API
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);

        // Extract and display bot's response text
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiResponseText;

        // // Adds Bot Message to chat History
        // chatHistory.push({
        //     role: "model",
        //     parts: [{ text: apiResponseText }],
        // });

        // storingChat(chatHistory);
        console.log(chatHistory);
        console.log(apiResponseText);
        return apiResponseText;
    } catch (error) {
        // Handles Error in API Response
        console.log(error);
        messageElement.innerText = error.message;
        messageElement.style.color = "#ff0000";
    } finally {
        // Resets user's file data,removing thinking indicator  and scroll chat to bottom
        // userData.file = {};
        // incomingMessageDiv.classList.remove("thinking");
        // chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

    }
};
document.querySelector(".get-help").addEventListener("click", async () => {
    let optionsContainer = document.querySelector(".to-create-new-option").parentNode;
    let currentOptions = document.querySelectorAll(".option");

    while (currentOptions.length < 4) {
        const newOption = document.createElement("textarea");
        newOption.className = "option";
        newOption.rows = 1;
        newOption.cols = 50;
        newOption.placeholder = "Type your Option";

        // Set value from generateSuggestionOption
        newOption.value = await generateSuggestionOption().then(result => {
            console.log("Suggestion:", result);
            return result;
        }).catch(error => {
            console.error("Error getting suggestion:", error);
            return "Suggested Option"; // fallback
        });

        // Insert before button
        optionsContainer.insertBefore(newOption, document.querySelector(".to-create-new-option"));
        optionsContainer.insertBefore(document.createElement("br"), document.querySelector(".to-create-new-option"));

        currentOptions = document.querySelectorAll(".option"); // update count
    }

    const result = document.querySelector(".suggestion-result");
    result.innerText = await generateResult().then(res => {
        console.log("Suggested Result:", res);
        return res;
    }).catch(error => {
        console.error("Error getting Result:", error);
        return "Error generating result.";
    });

    result.style.display = "block";
    writeToFile();
});

window.addEventListener("beforeunload", () => {
    writeToFile();
});

document.querySelector(".sidebar-menu").addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
        const decisionText = event.target.textContent.trim();
        const entry = Recent_decisions[decisionText];

        if (!entry) {
            alert("No data found for this decision.");
            return;
        }

        const decisionLine = entry.split('\n').find(line => line.startsWith("Decision"));
        const decision = decisionLine?.split("Decision :")[1]?.trim();

        let modalContent = `<span class="close-btn" onclick="closeModal()">&times;</span>`;
        modalContent += `<h2>Decision Lacking At: ${decision}</h2>`;

        for (let i = 0; i < 4; i++) {
            const optionLine = entry.split('\n').find(line => line.startsWith(`Option ${i + 1}`));
            const option = optionLine?.split(`Option ${i + 1} :`)[1]?.trim();
            modalContent += `<p><strong>Option ${i + 1} :</strong> ${option}</p>`;
        }

        const suggestionPart = entry.split("Suggestion:")[1]?.trim().replace(/\n/g, "<br>");
        modalContent += `<p><strong>Suggestion Provided:</strong><br>${suggestionPart}</p>`;

        document.querySelector(".modal-content").innerHTML = modalContent;
        showModal();
    }
});


// Show Modal
function showModal() {
    document.getElementById("successModal").style.display = "block";
    document.querySelector("section").classList.add("blur"); // Blur the section
}

// Close Modal
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

window.onload = () => {
    readFromFile();          // Load existing data into table
};
