import forge from "node-forge";

const passwordEncryption = (password) => {
	// Extract the RSA public key from the environment variable
	const publicKeyPem = process.env.NEXT_PUBLIC_PEM_FILE;
	if (!publicKeyPem) {
		console.error("Public key not found in environment");
		return;
	}

	// Convert the PEM formatted public key to a Forge public key object
	const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

	// Encrypt the password
	const encryptedData = publicKey.encrypt(password, "RSA-OAEP", {
		md: forge.md.sha256.create(),
	});

	// Encode the encrypted data in base64 format
	const encryptedPassword = forge.util.encode64(encryptedData);

	return encryptedPassword;
};

export default passwordEncryption;
