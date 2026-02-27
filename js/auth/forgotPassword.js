if (typeof window !== "undefined") {
	document.addEventListener("click", function (e) {
		if (e.target && e.target.id === "forgotPasswordLink") {
			e.preventDefault();
			const email = document.getElementById("loginEmail").value.trim();
			const errorDiv = document.getElementById("loginError");
			errorDiv.textContent = "";
			if (!email) {
				errorDiv.textContent = "Please enter your email to reset password.";
				return;
			}
			auth
				.sendPasswordResetEmail(email)
				.then(() => {
					errorDiv.textContent = "Password reset email sent.";
				})
				.catch((err) => {
					errorDiv.textContent = err.message;
				});
		}
	});
}
