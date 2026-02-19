import * as Yup from "yup";
import { validateExpiryDate } from "../../../../utils/expiryDateValidation";

const expiryDateValidation = (Yup) => {
  return Yup.string()
    .required("Expiry date required")
    .test(
      "expiryDate",
      "Invalid expiry date. Use MM/YY format and ensure it is a future date.",
      validateExpiryDate,
    );
};

const cvvValidation = (Yup) => {
  return Yup.string()
    .required("CVV is required")
    .test("cvv", "CVV must be 3 or 4 digits", (value = "", context) => {
      const cardNumber = context.parent.cardNumber?.replace(/\s/g, ""); // Assuming cardNumber is accessible here
      const isAmexCard =
        cardNumber?.startsWith("34") || cardNumber?.startsWith("37");
      return isAmexCard ? value.length === 4 : value.length === 3;
    });
};

const cardNumberValidation = (Yup) => {
  return Yup.string()
    .required("Please enter your card number.")
    .test(
      "cardNumberFormat",
      "Card number is invalid", // Default error message, will be overridden
      (value = "", context) => {
        const justNumbers = value.replace(/\s/g, "");
        // American Express
        if (justNumbers.startsWith("34") || justNumbers.startsWith("37")) {
          if (justNumbers.length === 15) return true;
          return context.createError({
            message:
              "Card number must be in the format XXXX XXXXXX XXXXX for American Express",
          });
        }
        // Diners Club
        else if (justNumbers.startsWith("30") || justNumbers.startsWith("38")) {
          if (justNumbers.length === 14) return true;
          return context.createError({
            message:
              "Card number must be in the format XXXX XXXX XXXX XX for Diners Club",
          });
        }
        // Other cards
        else if (justNumbers.startsWith("42")) {
          if (justNumbers.length === 16) return true; // Assuming a specific format for "42" prefix Visa cards, which wasn't clear from the original code
          return context.createError({
            message:
              "Card number must be in the format XXXX XXXX XXXX XXXX for Visa that starts with 42",
          });
        } else {
          if (justNumbers.length === 16) return true;
          return context.createError({
            message:
              "Card number must be in the format XXXX XXXX XXXX XXXX for Visa",
          });
        }
      },
    );
};

const nameOnCardValidation = (Yup) => {
  return Yup.string()
    .required("Card name required")
    .test(
      "has-first-and-last-name",
      "Please enter both first and last name",
      (value) => value && value.trim().split(" ").length > 1,
    );
};

export const getSaveCardFormValidationSchema = (isEdit) => {
  let schema = {
    cardNumber: cardNumberValidation(Yup),
    nameOnCard: nameOnCardValidation(Yup),
    expiryDate: expiryDateValidation(Yup),
  };

  if (!isEdit) {
    schema = {
      ...schema,
      cvv: cvvValidation(Yup),
    };
  }

  return Yup.object().shape(schema);
};
