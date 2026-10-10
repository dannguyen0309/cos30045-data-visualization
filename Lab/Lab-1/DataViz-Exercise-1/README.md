# Lab 1 — Portable KNIME workflow

Workflow `DataViz-Exercise-1` được cập nhật trực tiếp. Mở lại workflow trong KNIME và chạy lại các node chuẩn hóa tên cùng các nhánh phía sau để tạo kết quả mới.

## Câu hỏi và dữ liệu

**Mỗi brand có bao nhiêu bản ghi TV được đánh dấu Available và đăng ký bán tại Australia trong snapshot ngày 15/02/2026?**

- Dữ liệu: `data/tv_2026_02_15.csv`, bản dùng trong Exercise 1 trên Canvas.
- Nguồn: Australian Government Energy Rating registration dataset. Bản gốc được giữ nguyên byte.
- Một dòng là một bản ghi đăng ký TV. `Brand_Reg`, `SoldIn` và `Availability Status` là categorical/nominal.
- `Available` là trạng thái trong cơ sở dữ liệu tại snapshot, không bảo đảm hàng còn bán ngày hôm nay.
- Ba cột phân tích không có giá trị thiếu trong file này. Workflow vẫn loại giá trị thiếu khi lọc trạng thái và thị trường.

## Những phần đã hoàn thiện

1. Đưa CSV gốc vào `data/`; CSV Reader dùng **Relative to → Current workflow data area**.
2. Giữ bước lọc Australia đã sửa: giữ cả bốn giá trị `SoldIn` có Australia, gồm các tổ hợp nhiều nước.
3. Giữ cleaning lowercase/whitespace và phép gộp `samsung electronics` thành `samsung`.
4. Dùng String Replacer để chuẩn hóa `q.bell` thành `qbell`, `s vision` thành `svision`, và nhóm `hubbl glass` vào thương hiệu `hubbl`, trước khi lọc và GroupBy.
5. Bar Chart dùng `Brand_Reg` làm category, `Count(SoldIn)` làm value; Sorter giảm dần; hướng horizontal giúp đọc tên brand.
6. Thêm annotation cho mọi node và mô tả câu hỏi, nguồn, phạm vi cùng giới hạn của workflow.
7. CSV Writer xuất `data/COS30045-Exercise1.csv`; cho phép overwrite file tổng hợp khi chạy lại. CSV gốc không bị ghi đè.

### Căn cứ chuẩn hóa Q.Bell

Trong CSV, `Q.Bell` và `QBELL` đều trỏ tới `http://www.ayonz.com/`. Model `QT50WX8A` xuất hiện dưới cả hai cách viết, với registration number khác nhau. Website chính thức dùng tiêu đề Q.BELL và nội dung/logo QBELL:

- [Q.BELL Australia — Televisions](https://www.qbell.com.au/televisions)
- [Q.BELL Australia — Tizen](https://www.qbell.com.au/tizen)

Phép gộp chỉ chuẩn hóa tên brand; không xóa hoặc gộp các dòng đăng ký.

### Căn cứ chuẩn hóa SVISION

CSV có 1 dòng `S VISION` và 6 dòng `SVISION`; cả 7 đều Available và đăng ký bán tại Australia. Hai tên chỉ khác khoảng trắng và đều trỏ tới `http://www.ayonz.com/`. [Manual SVISION](https://www.andoo.com.au/manuals/ak/5/a/5/8/5a58521d713eb73a27d0e85814efd328a808e997_SVU5000G_User_Manual.pdf) ghi liên hệ Ayonz. String Cleaner không xóa khoảng trắng giữa `s` và `vision`, nên cần String Replacer riêng.

### Nhóm Hubbl Glass vào thương hiệu Hubbl

Trong dataset, `Hubbl Glass` có 2 bản ghi (`LT043A-04-FXTL`, `LT055A-04-FXTL`); `Hubbl` có 1 bản ghi (`LT065A-04-FXTL`). Cả 3 đều Available và đăng ký bán tại Australia. [Hướng dẫn chính thức của Hubbl](https://help.hubbl.com.au/hc/en-au/articles/33163104834717-Setting-up-Hubbl-Glass) xác nhận Glass là dòng TV thuộc Hubbl.

Vì câu hỏi phân tích theo thương hiệu, String Replacer chuyển `hubbl glass` thành `hubbl`. Đây là quyết định nhóm dòng sản phẩm vào thương hiệu mẹ, không phải sửa lỗi chính tả. Giữ nguyên cả 3 dòng đăng ký và dữ liệu nguồn. Sau tất cả phép chuẩn hóa, tổng vẫn là 4.508 bản ghi, thuộc 73 brand.

## Kiểm tra trước khi nộp

Các số dưới đây được tính độc lập từ CSV để đối chiếu. Chúng **chưa phải bằng chứng workflow mới đã chạy trong KNIME**.

| Bước | Kết quả cần đối chiếu |
|---|---:|
| CSV Reader | 4.724 dòng, 32 cột |
| Availability Status = Available | 4.710 dòng |
| SoldIn có Australia | 4.508 dòng |
| GroupBy sau chuẩn hóa tên | 73 brand |
| Tổng Count(SoldIn) | 4.508 |
| samsung | 1.096 |
| kogan | 788 |
| lg | 677 |
| hisense | 263 |
| eko | 189 |
| qbell | 13 |
| svision | 7 |
| hubbl | 3 |

1. Mở lại workflow `DataViz-Exercise-1` trong KNIME để nạp cấu hình đã cập nhật.
2. Chạy **Execute all**. CSV Reader phải đọc file từ workflow data area.
3. Đối chiếu số dòng sau các filter và số brand sau GroupBy với bảng trên.
4. Mở Bar Chart và Pie Chart; kiểm tra category, số liệu, tiêu đề và baseline của Bar Chart.
5. Kiểm tra CSV Writer đã tạo `data/COS30045-Exercise1.csv`: 73 dòng dữ liệu, hai cột `Brand_Reg` và `Count(SoldIn)`; tổng count = 4.508. `hubbl` có 3 bản ghi và không còn category `hubbl glass`.
6. Save và export lại `.knwf`, thêm tên sinh viên vào filename theo slide Week 2.
7. Import bản export vào vị trí mới, chạy lại để xác nhận dữ liệu đi kèm và đường dẫn hoạt động.
8. Đọc, bổ sung và xác nhận `GenAI-Declaration.md`, đặc biệt các lần dùng AI trước phiên chuẩn bị này.

## Cách đọc chart và giới hạn

Bar Chart so sánh số bản ghi theo brand, sắp giảm dần. Pie Chart thể hiện tỷ trọng bản ghi theo brand; các brand nhỏ có thể được gom vào Other bởi cấu hình chart.

Kết quả dự kiến: samsung có nhiều bản ghi nhất (1.096), tiếp theo là kogan (788). Đây không phải số TV đã bán hoặc sales market share.

Sau chuẩn hóa tên, 4.508 dòng tương ứng 4.258 tổ hợp brand + model duy nhất; có 250 dòng vượt số tổ hợp này. Exercise 1 chưa xử lý model lặp, nên phép đếm vẫn là số bản ghi. Không tự loại bản ghi có registration number khác nhau. Nếu đổi câu hỏi thành số model duy nhất, cần giữ Model_No và thiết kế một nhánh phân tích riêng.

Không lọc ExpDate trong bài này: workflow theo điều kiện Available và Australia của Exercise 1. Snapshot tháng 2 không được diễn giải là danh mục thị trường hiện tại tháng 10.

## Nguồn yêu cầu

- [Exercise 1 — Introduction to Data processing with KNIME](https://swinburne.instructure.com/courses/78028/pages/exercise-1-introduction-to-data-processing-with-knime?module_item_id=5905215)
- [Demonstration 1 submission](https://swinburne.instructure.com/courses/78028/assignments/803535)
- `Course Materials/Week 1/COS30045 W1 Class.pdf`
- `Course Materials/Week 2/COS30045 W2 Class.pdf`

Máy hiện chưa có Batch Executor. File được chuẩn bị và kiểm tra cấu trúc, dữ liệu nguồn, đường dẫn và phép đếm độc lập; vẫn cần thực hiện các bước chạy/import trên KNIME trước khi nộp.
