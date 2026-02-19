import { useState } from "react";
import { checkPasswordStrength } from "../utils/helpers";

const useCheckWeakPassword = () => {
	const [passwordStrength, setPasswordStrength] = useState({
		isWeak: false,
		msg: "",
		length: 0,
	});

	const testPassword = (password) => {
		const passwordStrengthTest = checkPasswordStrength(password);

		if (passwordStrengthTest.id < 2) {
			setPasswordStrength({
				isWeak: true,
				msg: passwordStrengthTest.value,
				length: passwordStrengthTest.length,
			});
		} else {
			setPasswordStrength({
				isWeak: false,
				msg: passwordStrengthTest.value,
				length: passwordStrengthTest.length,
			});
		}
	};
	const isPasswordWeak = passwordStrength.isWeak;
	const passwordStrengthInWords = passwordStrength.msg;
	const passwordLength = passwordStrength.length;
	return {
		isPasswordWeak,
		passwordStrengthInWords,
		testPassword,
		passwordLength,
	};
};

export default useCheckWeakPassword;
