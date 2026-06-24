import { db, auth } from "./firebase.js";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  query,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginView = document.getElementById("login-view");
  const dashboardView = document.getElementById("dashboard-view");
  const loginForm = document.getElementById("login-form");
  const loginBtn = document.getElementById("login-btn");
  const loginError = document.getElementById("login-error");
  const passwordInput = document.getElementById("password-input");
  const refreshBtn = document.getElementById("refresh-btn");
  const loadingApps = document.getElementById("loading-apps");
  const container = document.getElementById("applications-container");
  const noApps = document.getElementById("no-apps");

  let applications = [];
  let selectedAppId = null;
  let actionType = null;

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.classList.add("hidden");
    loginBtn.disabled = true;
    loginBtn.textContent = "Connecting...";

    const password = passwordInput.value;

    try {
      if (!auth.currentUser) {
        throw new Error("Not connected to Firebase Auth");
      }

      await setDoc(doc(db, "sessions", auth.currentUser.uid), {
        password: password,
        createdAt: new Date().toISOString(),
      });

      await fetchApplications();

      loginView.classList.add("hidden");
      dashboardView.classList.remove("hidden");
    } catch (err) {
      console.error(err);
      loginError.textContent = "Invalid password or insufficient permissions.";
      loginError.classList.remove("hidden");
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }
  });

  refreshBtn.addEventListener("click", fetchApplications);

  async function fetchApplications() {
    loadingApps.classList.remove("hidden");
    container.innerHTML = "";
    noApps.classList.add("hidden");

    try {
      const q = query(collection(db, "applications"));
      const snapshot = await getDocs(q);
      const apps = [];
      snapshot.forEach((docSnap) => {
        apps.push({ id: docSnap.id, ...docSnap.data() });
      });

      apps.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      applications = apps;

      renderApplications();
    } catch (err) {
      console.error(err);
      alert("Failed to fetch applications. Ensure password is correct.");
    } finally {
      loadingApps.classList.add("hidden");
    }
  }

  function renderApplications() {
    container.innerHTML = "";
    if (applications.length === 0) {
      noApps.classList.remove("hidden");
      return;
    }

    applications.forEach((app) => {
      const card = document.createElement("div");
      card.className = "mc-panel-dark space-y-4";

      let statusColorClass =
        "bg-yellow-900/50 border-yellow-500 text-yellow-400";
      if (app.status === "accepted")
        statusColorClass = "bg-green-900/50 border-green-500 text-green-400";
      if (app.status === "denied")
        statusColorClass = "bg-red-900/50 border-red-500 text-red-400";

      let answersHtml = "";
      if (app.answers) {
        Object.entries(app.answers).forEach(([key, answer]) => {
          answersHtml += `
            <div class="bg-[#111] p-4 border-2 border-[#505051]">
              <span class="block text-[#a6a6a6] font-bold mb-2 uppercase text-xs tracking-wider">${key}</span>
              <p class="whitespace-pre-wrap">${escapeHtml(answer)}</p>
            </div>
          `;
        });
      }

      let actionAreaHtml = "";
      if (app.status !== "pending" && app.reason) {
        actionAreaHtml = `
          <div class="bg-[#222] p-4 border-l-4 border-l-mc-green mt-4">
            <span class="font-bold block mb-1">Reason for ${app.status}:</span>
            <p class="text-gray-300">${escapeHtml(app.reason)}</p>
          </div>
        `;
      } else if (app.status === "pending") {
        if (selectedAppId === app.id) {
          const isAccepting = actionType === "accepted";
          actionAreaHtml = `
            <div class="flex space-x-4 pt-4 border-t-4 border-[#505051] w-full">
              <div class="w-full space-y-4">
                <h4 class="font-bold">Provide a reason for ${isAccepting ? "Acceptance" : "Denial"}:</h4>
                <input type="text" id="reason-input-${app.id}" class="mc-input" placeholder="Reason (Optional but recommended)" />
                <div class="flex space-x-4">
                  <button class="mc-button py-2 px-4 flex-1 confirm-action-btn" data-id="${app.id}">Confirm</button>
                  <button class="mc-button-secondary py-2 px-4 cancel-action-btn">Cancel</button>
                </div>
              </div>
            </div>
          `;
        } else {
          actionAreaHtml = `
            <div class="flex space-x-4 pt-4 border-t-4 border-[#505051]">
              <button class="mc-button py-2 px-4 flex-1 flex justify-center space-x-2 accept-btn" data-id="${app.id}">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>Accept</span>
              </button>
              <button class="mc-button-danger py-2 px-4 flex-1 flex justify-center space-x-2 deny-btn" data-id="${app.id}">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span>Deny</span>
              </button>
            </div>
          `;
        }
      }

      card.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between md:items-start border-b-4 border-[#505051] pb-4">
          <div>
            <h3 class="text-2xl font-mc text-[#f2e624]">${escapeHtml(app.gamertag)} <span class="text-gray-400 text-lg">(${escapeHtml(app.position)})</span></h3>
            <p class="text-gray-400 font-bold">Discord: ${escapeHtml(app.discordUsername)} <span class="text-[#555] font-normal">(${escapeHtml(app.discordUserId)})</span></p>
            <p class="text-[#888] text-sm mt-1">Applied: ${new Date(app.createdAt).toLocaleString()}</p>
          </div>
          <div class="mt-4 md:mt-0 flex flex-col items-end">
            <span class="px-3 py-1 font-bold uppercase tracking-wider text-sm border-2 ${statusColorClass}">
              ${app.status}
            </span>
          </div>
        </div>
        <div class="space-y-4 py-2">
          ${answersHtml}
        </div>
        ${actionAreaHtml}
      `;

      container.appendChild(card);
    });

    // Attach event listeners to newly created buttons
    document.querySelectorAll(".accept-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        selectedAppId = e.currentTarget.dataset.id;
        actionType = "accepted";
        renderApplications();
      });
    });

    document.querySelectorAll(".deny-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        selectedAppId = e.currentTarget.dataset.id;
        actionType = "denied";
        renderApplications();
      });
    });

    document.querySelectorAll(".cancel-action-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedAppId = null;
        actionType = null;
        renderApplications();
      });
    });

    document.querySelectorAll(".confirm-action-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.currentTarget.dataset.id;
        const reasonInput = document.getElementById(`reason-input-${id}`);
        const reason = reasonInput ? reasonInput.value : "";

        try {
          await updateDoc(doc(db, "applications", id), {
            status: actionType,
            reason: reason,
          });

          applications = applications.map((app) =>
            app.id === id
              ? { ...app, status: actionType, reason: reason }
              : app,
          );

          selectedAppId = null;
          actionType = null;
          renderApplications();
        } catch (err) {
          alert("Failed to update application: " + err.message);
        }
      });
    });
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
