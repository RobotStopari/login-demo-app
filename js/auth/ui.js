function setupAuthUI() {
	auth.onAuthStateChanged(async (user) => {
		const authArea = document.getElementById("auth-navbar-area");
		if (!authArea) return;
		const registerBtn = document.getElementById("showRegisterBtn");
		const loginBtn = document.getElementById("showLoginBtn");
		// Remove any existing dropdown
		const existingDropdown = document.getElementById("userDropdownContainer");
		if (existingDropdown) existingDropdown.remove();
		if (user) {
			// Hide login/register buttons
			if (registerBtn) registerBtn.style.display = "none";
			if (loginBtn) loginBtn.style.display = "none";
			// Fetch user profile from Firestore
			let nickname = "";
			let name = "";
			try {
				const doc = await db.collection("users").doc(user.uid).get();
				if (doc.exists) {
					const data = doc.data();
					nickname = data.Nickname || "";
					name = data.Name || "";
				}
			} catch (e) {}
			let displayName = nickname || name.split(" ")[0] || user.email;
			const dropdownHTML = `
        <div class="dropdown" id="userDropdownContainer">
          <button class="btn btn-outline-primary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            ${displayName}
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
            <li><a class="dropdown-item" href="#" id="changePasswordBtn">Change password</a></li>
          </ul>
        </div>
      `;
			authArea.insertAdjacentHTML("beforeend", dropdownHTML);
			document.getElementById("logoutBtn").onclick = logoutUser;
			document.getElementById("changePasswordBtn").onclick = () => {
				new bootstrap.Modal(document.getElementById("changePasswordModal")).show();
			};
		} else {
			// Show login/register buttons
			if (registerBtn) registerBtn.style.display = "";
			if (loginBtn) loginBtn.style.display = "";
			// Attach modal openers
			if (registerBtn)
				registerBtn.onclick = () => {
					new bootstrap.Modal(document.getElementById("registerModal")).show();
				};
			if (loginBtn)
				loginBtn.onclick = () => {
					new bootstrap.Modal(document.getElementById("loginModal")).show();
				};
		}
	});
}

// DOMContentLoaded handler
if (typeof window !== "undefined") {
	document.addEventListener("DOMContentLoaded", function () {
		const navbarInterval = setInterval(() => {
			const authArea = document.getElementById("auth-navbar-area");
			if (authArea) {
				clearInterval(navbarInterval);
				setupAuthUI();
			}
		}, 100);
	});
}
