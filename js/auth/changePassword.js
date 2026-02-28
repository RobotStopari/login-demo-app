if (typeof window !== "undefined") {
	document.addEventListener("submit", async function (e) {
		if (e.target && e.target.id === "changePasswordForm") {
			e.preventDefault();
			const currentPassword = document.getElementById("currentPassword").value;
			const newPassword = document.getElementById("newPassword").value;
			const errorDiv = document.getElementById("changePasswordError");
			const successDiv = document.getElementById("changePasswordSuccess");
			errorDiv.textContent = "";
			successDiv.textContent = "";
			const user = auth.currentUser;
			if (user) {
				try {
					// reauthenticate before updating password
					const cred = firebase.auth.EmailAuthProvider.credential(
						user.email,
						currentPassword,
					);
					await user.reauthenticateWithCredential(cred);
					await user.updatePassword(newPassword);
					successDiv.textContent = "Password changed successfully.";
					setTimeout(() => {
						bootstrap.Modal.getInstance(
							document.getElementById("changePasswordModal"),
						).hide();
					}, 1000);
				} catch (err) {
					errorDiv.textContent = err.message;
				}
			}
		}
	});

	function clearChangeModal() {
		const form = document.getElementById("changePasswordForm");
		if (form) form.reset();
		const errorDiv = document.getElementById("changePasswordError");
		if (errorDiv) errorDiv.textContent = "";
		const successDiv = document.getElementById("changePasswordSuccess");
		if (successDiv) successDiv.textContent = "";
	}

	function attachChangeModalListeners() {
		const changeModalEl = document.getElementById("changePasswordModal");
		if (changeModalEl) {
			changeModalEl.addEventListener("hidden.bs.modal", clearChangeModal);
			changeModalEl.addEventListener("hide.bs.modal", clearChangeModal);
			return true;
		}
		return false;
	}

	// Try to attach listeners immediately; if modal isn't present yet, poll until it is.
	if (!attachChangeModalListeners()) {
		let attempts = 0;
		const maxAttempts = 50; // ~5s
		const waiter = setInterval(() => {
			attempts++;
			if (attachChangeModalListeners() || attempts >= maxAttempts) {
				clearInterval(waiter);
			}
		}, 100);
	}
}
