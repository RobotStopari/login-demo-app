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
}
