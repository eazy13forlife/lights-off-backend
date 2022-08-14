const validator = require("validator");
const bcrypt = require("bcryptjs");

class UserData {
  constructor(userData, requiredFields) {
    this.email = userData.email;
    this.username = userData.username;
    this.password = userData.password;
    this.requiredFields = requiredFields;
  }

  //returns undefined if all fields are provided
  checkAllRequiredFields() {
    if (!this.email && this.requiredFields.email) {
      return {
        statusCode: 400,
        errorMessage: "Email field is required",
      };
    } else if (!this.username && this.requiredFields.username) {
      return {
        statusCode: 400,
        errorMessage: "Username field is required",
      };
    } else if (!this.password && this.requiredFields.password) {
      return {
        statusCode: 400,
        errorMessage: "Password field is required",
      };
    }

    return;
  }

  //returns undefined if email is valid
  validateEmail() {
    if (!validator.isEmail(this.email)) {
      return {
        statusCode: 400,
        errorMessage: "Invalid email",
      };
    }

    return;
  }

  validateUsername() {
    if (this.username.length < 4) {
      return {
        statusCode: 400,
        errorMessage: "Username must be at least 4 characters",
      };
    }

    return;
  }

  validatePassword() {
    if (this.password.length < 4) {
      return {
        statusCode: 400,
        errorMessage: "Password must be at least 4 characters",
      };
    }

    return;
  }

  //returns first truthy value,otherwise returns last thing in expression. So if all the validation codes don't return anything, we set checkIfErrors to false
  checkIfDataErrors() {
    return (
      this.checkAllRequiredFields() ||
      this.validateEmail() ||
      this.validatePassword() ||
      this.validateUsername() ||
      false
    );
  }

  async hashPassword() {
    return await bcrypt.hash(this.password, 8);
  }
}

module.exports = UserData;
