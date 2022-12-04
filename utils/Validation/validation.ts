import * as Yup from "yup";

//Sign up validation backend.
export const signUpValidation = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid Email!")
    .max(100, "Too long email!"),

  username: Yup.string()
    .required("Usermail is required!")
    .matches(
      /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/gm,
      "Username must be between 5 to 20 characters."
    ),
  password: Yup.string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});

//Login validation backend.
export const loginValidation = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid Email!")
    .max(100, "Too long email!"),

  password: Yup.string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});
