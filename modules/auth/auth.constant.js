module.exports = {
  SALT_LENGTH: 10,
  TOKEN_EXPIRED_IN_HOUR: 1 * 60 * 60,
  TOKEN_EXPIRED_IN_MINUTE: 60,
  LOGGER: {
    CONTROLLER: "AUTH_CONTROLLERS",
    SERVICE: "AUTH_SERVICES",
  },
  MESSAGES: {
    LOGIN: {
      MAIL_NOT_FOUND_OR_PASSWORD_NOT_MATCH:
        "MAIL_NOT_FOUND_OR_PASSWORD_NOT_MATCH",
      LOGIN_SUCCESSFULLY: "LOGIN_SUCCESSFULLY",
      ACCOUNT_HAS_NOT_BEEN_CONFIRMED: "ACCOUNT_HAS_NOT_BEEN_CONFIRMED",
      THE_ACCOUNT_HAS_BEEN_BLOCKED: "THE_ACCOUNT_HAS_BEEN_BLOCKED",
    },
    REFRESH_TOKEN: {
      REFRESH_TOKEN_SUCCESSFULLY: "REFRESH_TOKEN_SUCCESSFULLY",
      INVALID_REFRESH_TOKEN: "INVALID_REFRESH_TOKEN",
    },
    REGISTER: {
      EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
      PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH:
        "PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH",
      REGISTER_SUCCESS: "REGISTER_SUCCESS",
    },
    CONFIRM_OTP_CODE: {
      INVALID_OTP_CODE: "INVALID_OTP_CODE",
      SUCCESSFUL_AUTHENTICATION_OF_THE_OTP_CODE:
        "SUCCESSFUL_AUTHENTICATION_OF_THE_OTP_CODE",
    },
    CHANGE_PASS: {
      OLD_PASSWORD_INCORRECT: "OLD_PASSWORD_INCORRECT",
      PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH:
        "PASSWORD_AND_CONFIRM_PASSWORD_NOT_MATCH",
      CHANGE_PASSWORD_SUCCESSFULLY: "CHANGE_PASSWORD_SUCCESSFULLY",
    },
    RESEND_OTP_CODE: {
      EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
      SEND_OTP_CODE_SUCCESSFULLY: "SEND_OTP_CODE_SUCCESSFULLY",
    },
  },
};
