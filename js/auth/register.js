if (typeof window !== "undefined") {
	document.addEventListener("submit", async function (e) {
		if (e.target && e.target.id === "registerForm") {
			e.preventDefault();
			const name = document.getElementById("registerName").value.trim();
			const nickname = document.getElementById("registerNickname").value.trim();
			const email = document.getElementById("registerEmail").value.trim();
			const password = document.getElementById("registerPassword").value;
			const errorDiv = document.getElementById("registerError");
			errorDiv.textContent = "";
			if (!name) {
				errorDiv.textContent = "Name is required.";
				return;
			}
			try {
				const cred = await auth.createUserWithEmailAndPassword(email, password);
				await db
					.collection("users")
					.doc(cred.user.uid)
					.set({ Name: name, Nickname: nickname });
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

	const registerModalEl = document.getElementById("registerModal");
	if (registerModalEl) {
		registerModalEl.addEventListener("hidden.bs.modal", clearRegisterModal);
		registerModalEl.addEventListener("hide.bs.modal", clearRegisterModal);
	}
}
