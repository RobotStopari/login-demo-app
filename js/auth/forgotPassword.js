if (typeof window !== "undefined") {
	// handle submission from the forgot password modal form
	document.addEventListener("submit", function (e) {
		if (e.target && e.target.id === "forgotPasswordForm") {
			e.preventDefault();
			const email = document.getElementById("forgotEmail").value.trim();
			const errorDiv = document.getElementById("forgotPasswordError");
			const successDiv = document.getElementById("forgotPasswordSuccess");
			errorDiv.textContent = "";
			successDiv.textContent = "";
			if (!email) {
				errorDiv.textContent = "Please enter your email to reset password.";
				return;
			}
			auth
				.sendPasswordResetEmail(email)
				.then(() => {
					successDiv.textContent = "Password reset email sent.";
				})
				.catch((err) => {
					errorDiv.textContent = err.message;
				});
		}
	});

	function clearForgotModal() {
		const form = document.getElementById("forgotPasswordForm");
		if (form) form.reset();
		const errorDiv = document.getElementById("forgotPasswordError");
		if (errorDiv) errorDiv.textContent = "";
		const successDiv = document.getElementById("forgotPasswordSuccess");
		if (successDiv) successDiv.textContent = "";
	}

	const forgotModalEl = document.getElementById("forgotPasswordModal");
	if (forgotModalEl) {
		forgotModalEl.addEventListener("hidden.bs.modal", clearForgotModal);
		forgotModalEl.addEventListener("hide.bs.modal", clearForgotModal);
	}
}
