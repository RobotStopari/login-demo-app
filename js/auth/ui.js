function setupAuthUI() {
	auth.onAuthStateChanged(async (user) => {
		const authArea = document.getElementById("auth-navbar-area");
		if (!authArea) return;
		const registerBtn = document.getElementById("showRegisterBtn");
		const loginBtn = document.getElementById("showLoginBtn");
		const removeIf = (id) => {
			const el = document.getElementById(id);
			if (el) el.remove();
		};
		removeIf("userDropdownContainer");

		const setVisible = (el, visible) => {
			if (!el) return;
			el.style.display = visible ? "" : "none";
		};
		if (!user) {
			setVisible(registerBtn, true);
			setVisible(loginBtn, true);
			if (registerBtn)
				registerBtn.onclick = () =>
					new bootstrap.Modal(document.getElementById("registerModal")).show();
			if (loginBtn)
				loginBtn.onclick = () =>
					new bootstrap.Modal(document.getElementById("loginModal")).show();
			return;
		}

		setVisible(registerBtn, false);
		setVisible(loginBtn, false);

		let displayName = user.email || "";
		try {
			const doc = await db.collection("users").doc(user.uid).get();
			if (doc.exists) {
				const data = doc.data() || {};
				displayName =
					data.Nickname || (data.Name && data.Name.split(" ")[0]) || displayName;
			}
		} catch (e) {}

		try {
			const resp = await fetch("components/user-nav-dropdown.html");
			const html = await resp.text();
			authArea.insertAdjacentHTML("beforeend", html);
			const nameEl = document.getElementById("userDropdownDisplayName");
			if (nameEl) nameEl.textContent = displayName;

			const bind = (id, fn) => {
				const el = document.getElementById(id);
				if (el) el.onclick = fn;
			};
			bind("logoutBtn", logoutUser);
			bind("changePasswordBtn", () =>
				new bootstrap.Modal(document.getElementById("changePasswordModal")).show(),
			);
			bind("editInfoBtn", async () => {
				const cur = auth.currentUser;
				if (cur) {
					try {
						const doc = await db.collection("users").doc(cur.uid).get();
						if (doc.exists) {
							const data = doc.data() || {};
							const n = document.getElementById("updateName");
							const nn = document.getElementById("updateNickname");
							if (n) n.value = data.Name || "";
							if (nn) nn.value = data.Nickname || "";
						}
					} catch (e) {}
				}
				new bootstrap.Modal(document.getElementById("updateInfoModal")).show();
			});
		} catch (e) {
			console.error("Failed to load user dropdown HTML", e);
		}
	});
}

// DOMContentLoaded handler
if (typeof window !== "undefined") {
	document.addEventListener("DOMContentLoaded", function () {
		const interval = setInterval(() => {
			if (document.getElementById("auth-navbar-area")) {
				clearInterval(interval);
				setupAuthUI();
			}
		}, 100);
	});
}
