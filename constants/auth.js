// List of user fields for registration and profile editing
// Each entry: { key, label, required, type }
// Email and password are included for clarity but will be handled by existing inputs.
window.AUTH_FIELDS = [
	{ key: "email", label: "Email", required: true, type: "email" },
	{ key: "password", label: "Password", required: true, type: "password" },
	{ key: "name", label: "Name", required: true, type: "text" },
	{ key: "nickname", label: "Nickname", required: false, type: "text" },
	{ key: "phone", label: "Phone", required: true, type: "text" },
];
