// Dịch lỗi Postgres (lỗi hạ tầng) sang lỗi ứng dụng có statusCode.
// Chỉ dùng ở tầng errorHandler — service/controller không cần biết tới file này.

// Mã lỗi Postgres -> status + message mặc định
const PG_ERRORS = {
  "23503": { statusCode: 400, message: "Related record does not exist" }, // foreign_key_violation
  "23505": { statusCode: 409, message: "Record already exists" }, // unique_violation
  "23502": { statusCode: 400, message: "Missing required field" }, // not_null_violation
  "23514": { statusCode: 400, message: "Invalid value" }, // check_violation
  "22P02": { statusCode: 400, message: "Invalid input syntax" }, // invalid_text_representation
};

// Message riêng theo tên ràng buộc, để giữ được thông báo cụ thể
const CONSTRAINT_MESSAGES = {
  posts_user_fk: "user_id does not exist",
  users_email_unique: "Email already exists",
};

export function mapDbError(err) {
  const mapped = PG_ERRORS[err.code];

  if (!mapped) {
    return err;
  }

  const appErr = new Error(CONSTRAINT_MESSAGES[err.constraint] || mapped.message);
  appErr.statusCode = mapped.statusCode;
  appErr.cause = err;

  return appErr;
}
