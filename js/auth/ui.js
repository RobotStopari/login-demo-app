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
				<li class="nav-item dropdown" id="userDropdownContainer">
					<a
						class="nav-link dropdown-toggle"
						href="#"
						id="userDropdown"
						role="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						${displayName}
					</a>
					<ul class="dropdown-menu dropdown-menu-end dropdown-animate" aria-labelledby="userDropdown">
						<li><a class="dropdown-item text-end" href="#" id="logoutBtn">Logout</a></li>
						<li><a class="dropdown-item text-end" href="#" id="changePasswordBtn">Change password</a></li>
						<li><a class="dropdown-item text-end" href="#" id="editInfoBtn">Edit profile</a></li>
					</ul>
				</li>
			`;
			authArea.insertAdjacentHTML("beforeend", dropdownHTML);
			document.getElementById("logoutBtn").onclick = logoutUser;
			document.getElementById("changePasswordBtn").onclick = () => {
				new bootstrap.Modal(document.getElementById("changePasswordModal")).show();
			};
			document.getElementById("editInfoBtn").onclick = async () => {
				const user = auth.currentUser;
				if (user) {
					try {
						const doc = await db.collection("users").doc(user.uid).get();
						if (doc.exists) {
							const data = doc.data();
							const nameEl = document.getElementById("updateName");
							const nickEl = document.getElementById("updateNickname");
							if (nameEl) nameEl.value = data.Name || "";
							if (nickEl) nickEl.value = data.Nickname || "";
						}
					} catch (e) {
						// ignore
					}
				}
				new bootstrap.Modal(document.getElementById("updateInfoModal")).show();
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
