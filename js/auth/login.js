if (typeof window !== "undefined") {
	document.addEventListener("submit", async function (e) {
		if (e.target && e.target.id === "loginForm") {
			e.preventDefault();
			const email = document.getElementById("loginEmail").value.trim();
			const password = document.getElementById("loginPassword").value;
			const errorDiv = document.getElementById("loginError");
			errorDiv.textContent = "";
			try {
				await auth.signInWithEmailAndPassword(email, password);
				bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
			} catch (err) {
				errorDiv.textContent = err.message;
			}
		}
	});

	function clearLoginModal() {
		const form = document.getElementById("loginForm");
		if (form) form.reset();
		const errorDiv = document.getElementById("loginError");
		if (errorDiv) errorDiv.textContent = "";
	}

	const loginModalEl = document.getElementById("loginModal");
	if (loginModalEl) {
		loginModalEl.addEventListener("hidden.bs.modal", clearLoginModal);
		loginModalEl.addEventListener("hide.bs.modal", clearLoginModal);
	}
}
