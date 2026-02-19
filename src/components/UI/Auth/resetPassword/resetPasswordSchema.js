import * as Yup from "yup";

export const resetPasswordValidator = Yup.object().shape({
  password: Yup.string()
    .required("Enter your password")
    .min(12, "Password must be at least 12 characters long")
    .matches(/[a-zA-Z]/, "Password must contain letters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/\d/, "Password must contain a number")
    .matches(/(?=.*[!.@#$%^&*])/, "Password must contain a special character"),

  confirmPassword: Yup.string()
    .required("Please confirm your password.")
    .oneOf([Yup.ref("password"), null], "Passwords must match."),
});
