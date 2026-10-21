# Kiểm thử tự động SauceDemo với Selenium

Project thực hành kiểm thử tự động end-to-end cho website [SauceDemo](https://www.saucedemo.com/) bằng **Selenium WebDriver**, **Node.js** và test runner tích hợp `node:test`.

## 1. Mục tiêu

- Xây dựng tối thiểu 5 test case tự động cho một website thương mại điện tử mẫu.
- Áp dụng Page Object Model để tách mã kiểm thử khỏi logic thao tác giao diện.
- Sử dụng explicit wait thay vì thời gian chờ cố định để tăng độ ổn định.
- Chạy được ở chế độ headless trên máy cá nhân và GitHub Actions.
- Xuất kết quả kiểm thử theo chuẩn JUnit XML khi cần.

## 2. Website và công nghệ

| Hạng mục | Thông tin |
| --- | --- |
| Website kiểm thử | `https://www.saucedemo.com/` |
| Ngôn ngữ | JavaScript (Node.js 22) |
| Công cụ tự động | Selenium WebDriver |
| Test runner | `node:test` |
| Trình duyệt | Google Chrome |
| Mẫu thiết kế | Page Object Model (POM) |
| CI | GitHub Actions |

Tài khoản mẫu do SauceDemo cung cấp:

- Username: `standard_user`
- Password: `secret_sauce`

## 3. Danh sách test case

| ID | Chức năng | Bước kiểm thử chính | Kết quả mong đợi |
| --- | --- | --- | --- |
| TC01 | Đăng nhập hợp lệ | Nhập tài khoản hợp lệ và bấm Login | Chuyển đến trang Products |
| TC02 | Đăng nhập không hợp lệ | Nhập mật khẩu sai và bấm Login | Hiển thị đúng thông báo lỗi |
| TC03 | Sắp xếp sản phẩm | Chọn `Price (low to high)` | Danh sách giá tăng dần |
| TC04 | Thêm vào giỏ hàng | Thêm Sauce Labs Backpack và mở giỏ hàng | Badge bằng 1 và đúng sản phẩm xuất hiện trong giỏ |
| TC05 | Xóa khỏi giỏ hàng | Thêm rồi xóa Sauce Labs Backpack | Giỏ hàng không còn sản phẩm |
| TC06 | Thanh toán | Thêm sản phẩm, nhập thông tin và hoàn tất đơn hàng | Hiển thị `Thank you for your order!` |
| TC07 | Đăng xuất | Mở menu và bấm Logout | Trở về trang đăng nhập |

## 4. Cấu trúc project

```text
selenium-saucedemo-tests/
├── .github/workflows/selenium-tests.yml
├── reports/
├── src/
│   ├── pages/
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   ├── InventoryPage.js
│   │   └── LoginPage.js
│   └── support/
│       ├── config.js
│       └── driver.js
├── tests/saucedemo.test.js
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

## 5. Cài đặt và chạy

### Yêu cầu

- Node.js 22 trở lên
- Google Chrome
- Kết nối Internet để truy cập SauceDemo

Selenium Manager sẽ tự tìm Chrome và quản lý ChromeDriver phù hợp.

### Cài dependency

```bash
npm ci
```

### Chạy toàn bộ test ở chế độ headless

```bash
npm test
```

### Chạy có hiển thị trình duyệt trên Windows

```bash
npm run test:headed
```

### Xuất báo cáo JUnit XML

```bash
npm run test:report
```

Kết quả được lưu tại `reports/junit.xml`.

## 6. Cấu hình tùy chọn

Có thể ghi đè cấu hình bằng biến môi trường:

| Biến | Giá trị mặc định | Ý nghĩa |
| --- | --- | --- |
| `BASE_URL` | `https://www.saucedemo.com` | URL website kiểm thử |
| `SAUCE_USERNAME` | `standard_user` | Tài khoản đăng nhập |
| `SAUCE_PASSWORD` | `secret_sauce` | Mật khẩu đăng nhập |
| `WAIT_TIMEOUT` | `10000` | Thời gian explicit wait (ms) |
| `HEADLESS` | `true` | Đặt `false` để hiện trình duyệt |

## 7. Kỹ thuật đã áp dụng

- **Page Object Model:** mỗi trang có một lớp riêng, giúp test dễ đọc và bảo trì.
- **Explicit wait:** chờ URL, phần tử hoặc nội dung mong đợi; không dùng `sleep` cố định.
- **Test độc lập:** mỗi test mở một phiên trình duyệt mới và luôn đóng phiên sau khi chạy.
- **Locator ổn định:** ưu tiên `id` và thuộc tính `data-test` do website dành cho kiểm thử.
- **Chạy tuần tự:** tránh các phiên Selenium cạnh tranh tài nguyên trên máy hoặc CI.
- **Continuous Integration:** workflow tự chạy khi push hoặc tạo pull request vào nhánh `main`.

## 8. Kết quả thực thi

Bộ test đã được chạy xác minh thực tế ngày **21/10/2026**:

| Chỉ số | Kết quả |
| --- | --- |
| Tổng số test | 7 |
| Passed | 7 |
| Failed | 0 |
| Skipped | 0 |
| Thời gian của lần chạy báo cáo | 11,50 giây |
| Môi trường | Node.js 22.23.2, Selenium WebDriver 4.51.0, Chrome 155.0.8059.85 |

```text
tests 7
suites 1
pass 7
fail 0
cancelled 0
skipped 0
todo 0
```

File JUnit XML có thể được tạo lại bất kỳ lúc nào bằng `npm run test:report`.

## 9. Phạm vi và hạn chế

- Project kiểm thử website demo công khai; dữ liệu có thể bị reset bởi nhà cung cấp.
- Bộ test tập trung vào luồng chức năng chính, chưa bao gồm hiệu năng, bảo mật và kiểm thử trực quan.
- TC06 dùng dữ liệu khách hàng giả, không phát sinh giao dịch thật.

