if (typeof window !== "undefined") {
	// when the update modal is shown, populate current values
	const updateModalEl = document.getElementById("updateInfoModal");
	if (updateModalEl) {
		updateModalEl.addEventListener("show.bs.modal", async () => {
			const user = auth.currentUser;
			if (user) {
				try {
					const doc = await db.collection("users").doc(user.uid).get();
					if (doc.exists) {
						const data = doc.data();
						document.getElementById("updateName").value = data.Name || "";
						document.getElementById("updateNickname").value = data.Nickname || "";
					}
				} catch (e) {
					// ignore
				}
			}
		});
	}

	document.addEventListener("submit", async function (e) {
		if (e.target && e.target.id === "updateInfoForm") {
			e.preventDefault();
			const name = document.getElementById("updateName").value.trim();
			const nickname = document.getElementById("updateNickname").value.trim();
			const errorDiv = document.getElementById("updateInfoError");
			const successDiv = document.getElementById("updateInfoSuccess");
			errorDiv.textContent = "";
			successDiv.textContent = "";
			if (!name) {
				errorDiv.textContent = "Name is required.";
				return;
			}
			const user = auth.currentUser;
			if (user) {
				try {
					await db.collection("users").doc(user.uid).update({
						Name: name,
						Nickname: nickname,
					});
					successDiv.textContent = "Profile updated.";
					// update dropdown display name if visible
					const dropdownBtn = document.getElementById("userDropdown");
					if (dropdownBtn) {
						let displayName = nickname || name.split(" ")[0] || user.email;
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
