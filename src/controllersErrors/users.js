const usersErrors = (error) => {
  if (error.code === "23505") {
    if (error.detail.includes("email")) {
      return {
        status: 400,
        message: "Email already exists",
      };
    }

    if (error.detail.includes("username")) {
      return {
        status: 400,
        message: "Username already exists",
      };
    }
  } else {
    return {
      status: 500,
      message: error.message,
    };
  }
};

module.exports = usersErrors;
