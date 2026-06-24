import { getQuestionsForPosition } from "./data.js";
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const position = params.get("position");

  if (!position) {
    window.location.href = "index.html";
    return;
  }

  const formView = document.getElementById("form-view");
  const successView = document.getElementById("success-view");
  const positionTitle = document.getElementById("position-title");
  const successPosition = document.getElementById("success-position");
  const dynamicQuestionsContainer =
    document.getElementById("dynamic-questions");
  const form = document.getElementById("apply-form");
  const submitBtn = document.getElementById("submit-btn");
  const errorMessage = document.getElementById("error-message");

  formView.classList.remove("hidden");
  positionTitle.textContent = position;
  successPosition.textContent = position;

  const questions = getQuestionsForPosition(position);

  questions.forEach((q) => {
    const wrapper = document.createElement("div");
    wrapper.className = "space-y-2";

    const label = document.createElement("label");
    label.className = "block font-bold";
    label.textContent = q.label;
    wrapper.appendChild(label);

    let input;
    if (q.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = 4;
    } else {
      input = document.createElement("input");
      input.type = q.type;
    }

    input.required = true;
    input.placeholder = q.placeholder || "";
    input.className = "mc-input";
    input.dataset.questionId = q.id;

    wrapper.appendChild(input);
    dynamicQuestionsContainer.appendChild(wrapper);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMessage.classList.add("hidden");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const discordUsername = document.getElementById("discordUsername").value;
    const discordUserId = document.getElementById("discordUserId").value;
    const gamertag = document.getElementById("gamertag").value;

    const answers = {};
    const dynamicInputs =
      dynamicQuestionsContainer.querySelectorAll(".mc-input");
    dynamicInputs.forEach((input) => {
      answers[input.dataset.questionId] = input.value;
    });

    try {
      await addDoc(collection(db, "applications"), {
        position,
        discordUsername,
        discordUserId,
        gamertag,
        status: "pending",
        answers,
        createdAt: new Date().toISOString(),
      });

      formView.classList.add("hidden");
      successView.classList.remove("hidden");
      successView.classList.add("flex");
    } catch (err) {
      errorMessage.textContent =
        err.message || "An error occurred while submitting.";
      errorMessage.classList.remove("hidden");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Application";
    }
  });
});
