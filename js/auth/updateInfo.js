if (typeof window !== "undefined") {
	function renderUpdateExtraFields() {
		const container = document.getElementById("updateExtraFields");
		if (!container) return;
		const fields = window.AUTH_FIELDS || [];
		container.innerHTML = "";
		fields.forEach((f) => {
			if (f.key === "email" || f.key === "password") return;
			const mb = document.createElement("div");
			mb.className = "mb-3";
			const label = document.createElement("label");
			label.className = "form-label";
			label.htmlFor = `update_${f.key}`;
			label.textContent = f.label + (f.required ? "" : " (optional)");
			const input = document.createElement("input");
			input.type = f.type || "text";
			input.className = "form-control";
			input.id = `update_${f.key}`;
			if (f.required) input.required = true;
			mb.appendChild(label);
			mb.appendChild(input);
			container.appendChild(mb);
		});
	}

	function initUpdateModal() {
		const el = document.getElementById("updateInfoModal");
		if (el) {
			el.addEventListener("show.bs.modal", async () => {
				renderUpdateExtraFields();
				const user = auth.currentUser;
				if (user) {
					try {
						const doc = await db.collection("users").doc(user.uid).get();
						if (doc.exists) {
							const data = doc.data();
							const fields = window.AUTH_FIELDS || [];
							fields.forEach((f) => {
								if (f.key === "email" || f.key === "password") return;
								const prop = f.key.charAt(0).toUpperCase() + f.key.slice(1);
								const el2 = document.getElementById(`update_${f.key}`);
								if (el2) el2.value = data[prop] || "";
							});
						}
					} catch (e) {
						// ignore
					}
				}
			});
			return true;
		}
		return false;
	}

	if (!initUpdateModal()) {
		const waitInterval = setInterval(() => {
			if (initUpdateModal()) clearInterval(waitInterval);
		}, 150);
	}

	document.addEventListener("submit", async function (e) {
		if (e.target && e.target.id === "updateInfoForm") {
			e.preventDefault();
			const errorDiv = document.getElementById("updateInfoError");
			const successDiv = document.getElementById("updateInfoSuccess");
			errorDiv.textContent = "";
			successDiv.textContent = "";
			const fields = window.AUTH_FIELDS || [];
			const payload = {};
			for (const f of fields) {
				if (f.key === "email" || f.key === "password") continue;
				const el = document.getElementById(`update_${f.key}`);
				const val = el ? el.value.trim() : "";
				if (f.required && !val) {
					errorDiv.textContent = `${f.label} is required.`;
					return;
				}
				const prop = f.key.charAt(0).toUpperCase() + f.key.slice(1);
				payload[prop] = val;
			}

			const user = auth.currentUser;
			if (user) {
				try {
					await db.collection("users").doc(user.uid).update(payload);
					successDiv.textContent = "Profile updated.";
					const dropdownBtn = document.getElementById("userDropdown");
					if (dropdownBtn) {
						const name = payload.Name || "";
						const nickname = payload.Nickname || "";
						let displayName = nickname || (name && name.split(" ")[0]) || user.email;
						dropdownBtn.textContent = displayName;
					}
					setTimeout(() => {
						bootstrap.Modal.getInstance(
							document.getElementById("updateInfoModal"),
						).hide();
					}, 1000);
				} catch (err) {
					errorDiv.textContent = err.message;
				}
			}
		}
	});

	function clearUpdateModal() {
		const form = document.getElementById("updateInfoForm");
		if (form) form.reset();
		const errorDiv = document.getElementById("updateInfoError");
		if (errorDiv) errorDiv.textContent = "";
		const successDiv = document.getElementById("updateInfoSuccess");
		if (successDiv) successDiv.textContent = "";
	}

	if (updateModalEl) {
		updateModalEl.addEventListener("hidden.bs.modal", clearUpdateModal);
		updateModalEl.addEventListener("hide.bs.modal", clearUpdateModal);
	}
}
