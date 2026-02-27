if (typeof window !== "undefined") {
	document.addEventListener("submit", async function (e) {
		if (e.target && e.target.id === "changePasswordForm") {
			e.preventDefault();
			const newPassword = document.getElementById("newPassword").value;
			const errorDiv = document.getElementById("changePasswordError");
			const successDiv = document.getElementById("changePasswordSuccess");
			errorDiv.textContent = "";
			successDiv.textContent = "";
			const user = auth.currentUser;
			if (user) {
				try {
					await user.updatePassword(newPassword);
					successDiv.textContent = "Password changed successfully.";
					setTimeout(() => {
						bootstrap.Modal.getInstance(
							document.getElementById("changePasswordModal"),
						).hide();
					}, 1200);
				} catch (err) {
					errorDiv.textContent = err.message;
				}
			}
		}
	});
}
