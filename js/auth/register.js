if (typeof window !== "undefined") {
	function renderRegisterExtraFields() {
		const container = document.getElementById("registerExtraFields");
		if (!container) return;
		const fields = window.AUTH_FIELDS || [];
		container.innerHTML = "";
		fields.forEach((f) => {
			if (f.key === "email" || f.key === "password") return;
			const mb = document.createElement("div");
			mb.className = "mb-3";
			const label = document.createElement("label");
			label.className = "form-label";
			label.htmlFor = `register_${f.key}`;
			label.textContent = f.label + (f.required ? "" : " (optional)");
			const input = document.createElement("input");
			input.type = f.type || "text";
			input.className = "form-control";
			input.id = `register_${f.key}`;
			if (f.required) input.required = true;
			mb.appendChild(label);
			mb.appendChild(input);
			container.appendChild(mb);
		});
	}

	document.addEventListener("submit", async function (e) {
		if (e.target && e.target.id === "registerForm") {
			e.preventDefault();
			const errorDiv = document.getElementById("registerError");
			errorDiv.textContent = "";
			const fields = window.AUTH_FIELDS || [];
			const payload = {};
			let email = "";
			let password = "";
			for (const f of fields) {
				if (f.key === "email") {
					const el = document.getElementById("registerEmail");
					email = el ? el.value.trim() : "";
					if (f.required && !email) {
						errorDiv.textContent = `${f.label} is required.`;
						return;
					}
					continue;
				}
				if (f.key === "password") {
					const el = document.getElementById("registerPassword");
					password = el ? el.value : "";
					if (f.required && !password) {
						errorDiv.textContent = `${f.label} is required.`;
						return;
					}
					continue;
				}
				const el = document.getElementById(`register_${f.key}`);
				const val = el ? el.value.trim() : "";
				if (f.required && !val) {
					errorDiv.textContent = `${f.label} is required.`;
					return;
				}
				const prop = f.key.charAt(0).toUpperCase() + f.key.slice(1);
				payload[prop] = val;
			}

			try {
				const cred = await auth.createUserWithEmailAndPassword(email, password);
				await db.collection("users").doc(cred.user.uid).set(payload);
				bootstrap.Modal.getInstance(
					document.getElementById("registerModal"),
				).hide();
			} catch (err) {
				errorDiv.textContent = err.message;
			}
		}
	});

	function clearRegisterModal() {
		const form = document.getElementById("registerForm");
		if (form) form.reset();
		const errorDiv = document.getElementById("registerError");
		if (errorDiv) errorDiv.textContent = "";
	}

	function initRegisterModal() {
		const el = document.getElementById("registerModal");
		if (el) {
			el.addEventListener("hidden.bs.modal", clearRegisterModal);
			el.addEventListener("hide.bs.modal", clearRegisterModal);
			el.addEventListener("shown.bs.modal", renderRegisterExtraFields);
			renderRegisterExtraFields();
			return true;
		}
		return false;
	}

	if (!initRegisterModal()) {
		const waitInterval = setInterval(() => {
			if (initRegisterModal()) clearInterval(waitInterval);
		}, 150);
	}
}
