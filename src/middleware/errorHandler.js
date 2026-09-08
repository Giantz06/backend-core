import { sendJson } from "../utils/response.js";
import { mapDbError } from "../utils/dbError.js";

export function errorHandler(err, req, res) {
  // Lỗi nghiệp vụ đã có statusCode thì giữ nguyên,
  // còn lại thử dịch từ lỗi Postgres sang lỗi ứng dụng.
  const error = err.statusCode ? err : mapDbError(err);

  console.error(error.cause || error);

  // Chỉ lộ message của lỗi mình chủ động tạo ra;
  // lỗi lạ -> 500 với message chung, tránh lộ chi tiết nội bộ.
  if (!error.statusCode) {
    sendJson(res, 500, {
      message: "Internal Server Error",
    });
    return;
  }

  sendJson(res, error.statusCode, {
    message: error.message,
  });
}
