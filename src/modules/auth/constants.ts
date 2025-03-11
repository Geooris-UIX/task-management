// Stores all constants like Error message and other things

export const AUTH_ERRORS = {
    BAD_REQUEST: {message: "Recieved Bad request", code: 400},
    USER_EXISTS: {message: "User with this email already exists.", code: 422},
    PASSWORD_MISMATCH: {message: "Passwords mismatch", code: 422},
    USER_NOT_FOUND: {message: "User not found.", code: 404},
    VERIFICATION_FAILED: {message: "Verification Failed", code: 401},
    FAILED_USER_UPDATE: {message: "Failed to Update User", code: 422},
    INVALID_CREDENTIALS: {message: "Invalid email or password.", code: 401},
    OTP_ALREADY_PRESENT: {message: "OTP for this email already present", code: 401},
    ALREADY_VERIFIED: {message: "User is already verified", code: 422}
};