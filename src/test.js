// Hàm giả lập tải dữ liệu mất 2 giây
function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: "Lam" });
    }, 2000);
  });
}

// Sử dụng async/await
async function showUser() {
  console.log("Đang tải...");

  // Dừng ở đây 2 giây cho đến khi fetchUser() chạy xong
  const user = await fetchUser();

  console.log("Đã tải xong:", user.name);
}

showUser();