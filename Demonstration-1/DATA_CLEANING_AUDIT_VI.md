# Rà soát tên hãng trong dữ liệu TV

Nguồn: `tv_2026_10_04.csv`, 5.030 bản ghi. Không sửa file gốc. Các quy tắc bên dưới áp dụng cho cột `Brand_Reg` trước khi tạo bảng tổng hợp và dữ liệu website.

## 1. Chữ hoa/thường không nhất quán

Có 11 nhóm tên chỉ khác chữ hoa/thường: PHILIPS, KOGAN, BLAUPUNKT, VEON, SONY, SMARTTECH, YOKOHAMA, SYLVOX, SAMSUNG, COOCAA và XIAOMI.

Ví dụ: `kogan`, `KOGAN`, `Kogan` đều thành `KOGAN`. Node **String Cleaner** chọn riêng `Brand_Reg`, đổi thành chữ hoa, bỏ khoảng trắng đầu/cuối và khoảng trắng lặp. Giữ dấu câu: không xóa dấu `+` trong `PRISM+` hoặc tự gộp tên dựa trên độ giống nhau.

## 2. Tên thay thế cần quyết định theo ngữ cảnh

| Tên trước khi thay | Tên thống nhất | Bằng chứng và quyết định |
|---|---|---|
| SAMSUNG ELECTRONICS | SAMSUNG | Quyết định phân tích ở cấp thương hiệu TV: Samsung Electronics là doanh nghiệp kinh doanh TV Samsung. Đây cũng là ví dụ được lab yêu cầu xem xét. |
| Q.BELL | QBELL | Hai tên cùng dùng website Ayonz và cùng mã TV `QT50WX8A` trong file gốc. Có 2 dòng Q.Bell và 13 dòng QBELL. Đây là ví dụ bổ sung rõ nhất ngoài Samsung. |
| S VISION | SVISION | 1 dòng S VISION và 6 dòng SVISION cùng dùng website Ayonz. Mã `SVU550WOS`, `SVU50WOS`, `SV43FWOS` có cùng cách đặt tên. Suy luận rằng đây là biến thể có khoảng trắng của cùng thương hiệu, có hỗ trợ từ danh mục thương hiệu Svision của Ayonz. |
| HUBBL GLASS | HUBBL | Glass là dòng TV của Hubbl. Dữ liệu ghi mẫu 65 inch `LT065A-04-FXTL` dưới tên Hubbl; tài liệu chính thức gọi đúng mã này là Hubbl Glass 65 inch. Gộp ở cấp thương hiệu, vẫn giữ nguyên mã mẫu TV. |

Mỗi cặp có một node **String Replacer** riêng, thay toàn bộ giá trị bằng mẫu literal chính xác. Không dùng phép thay chuỗi con trên tên hãng.

Nguồn đối chiếu:

- [Trang thương hiệu QBELL](https://www.qbell.pl/).
- [Danh mục thương hiệu trên trang doanh nghiệp Ayonz](https://www.linkedin.com/company/ayonz): có QBELL và Svision; Ayonz phân phối nhiều thương hiệu khác nhau.
- [Điều khoản thiết bị chính thức của Hubbl](https://help.hubbl.com.au/hc/en-au/articles/34641975967389-Hubbl-Device-Supply-Terms): liệt kê mã TV Hubbl Glass.
- [Hướng dẫn xử lý chuỗi của KNIME](https://www.knime.com/files/data-wrangling-with-knime.pdf): phân biệt String Cleaner và String Replacer.

Không gộp EKO, BLAUPUNKT, QBELL hay SVISION với nhau chỉ vì có cùng website Ayonz. Cùng doanh nghiệp phân phối không đồng nghĩa cùng thương hiệu.

## 3. Kết quả và phạm vi

- Sau bộ lọc thị trường: 4.839 bản ghi, 88 cách viết tên hãng.
- Sau chuẩn hóa chữ hoa/thường: 77 tên.
- Sau gộp Samsung: 76 tên.
- Sau gộp thêm QBELL, SVISION và Hubbl: **73 thương hiệu**.
- Samsung có **1.199 bản ghi**, Kogan có **842 bản ghi**.
- Tổng số bản ghi vẫn là **4.839**; công suất chờ hợp lệ vẫn là **3.985**.

Chuẩn hóa hãng không phải xóa mẫu TV. Các lần đăng ký khác nhau vẫn được giữ; các mã đăng ký giúp phân biệt bản ghi. Script kiểm tra khóa hãng + mã TV + mã đăng ký không bị trùng sau khi gộp.

Workflow dùng `String Cleaner`, rồi bốn `String Replacer`, trước các bước tổng hợp. Script Python áp dụng cùng quy tắc và xuất lại dữ liệu KNIME, website và bảng hãng.
