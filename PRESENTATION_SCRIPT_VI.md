# Kịch bản trình bày: Australian TV Energy Explorer

## Mục tiêu của bài trình bày

Trong 3–5 phút, phần trình bày cần trả lời ba câu hỏi:

1. Dữ liệu ban đầu được làm sạch và biến đổi như thế nào trong KNIME?
2. Mỗi biểu đồ trả lời câu hỏi phân tích nào, và vì sao chọn loại biểu đồ đó?
3. Website giúp người dùng đi từ dữ liệu tổng quan đến một danh sách TV phù hợp như thế nào?

### Các từ sẽ dùng trong bài

- **Mẫu TV**: một dòng sản phẩm TV trong dữ liệu.
- **Điện năng mỗi năm**: lượng điện TV tiêu thụ trong một năm, đơn vị kWh/năm. Trong dữ liệu, cột này có tên `Labelled energy consumption (kWh/year)`.
- **Hãng**: nhà sản xuất hoặc thương hiệu, tương ứng với cột `Brand_Reg`.
- **Công nghệ màn hình**: LCD, LCD dùng đèn nền LED, hoặc OLED, tương ứng với `Screen_Tech`.
- **Trung vị**: giá trị nằm giữa sau khi sắp xếp dữ liệu. Trung vị ít bị ảnh hưởng bởi một vài mẫu TV quá khác biệt.
- **Ngoại lệ**: giá trị khác xa phần lớn dữ liệu.

---

## Kịch bản nói trong 3–5 phút

### 0:00–0:30 — Giới thiệu vấn đề

> Project của tôi là **Australian TV Energy Explorer**. Mục tiêu là giúp người dùng hiểu kích thước, công nghệ màn hình và hiệu quả năng lượng liên quan với nhau như thế nào khi chọn TV tại Australia.
>
> Dữ liệu gốc có **5.030 bản ghi**. Sau khi làm sạch, tôi giữ lại **4.839 mẫu TV** phù hợp tại ngày chụp dữ liệu **04/10/2026**.

### 0:30–1:20 — Workflow làm sạch và biến đổi trong KNIME

> Workflow KNIME được chia thành hai phần: **Prepare Data** và **Visualise and Export**.
>
> `CSV Reader` đọc file và gán đúng kiểu cho các cột số. `Column Filter` chỉ giữ các cột cần cho phân tích. `Australian Market Filter` tiếp tục giữ sản phẩm bán tại Australia, có trạng thái `Available`, và chưa hết hạn tại ngày 04/10/2026.
>
> Với tên hãng, `String Cleaner` sửa chữ hoa/thường và khoảng trắng. `String Replacer` gộp những tên đã được đối chiếu. Ví dụ, `Q.Bell` và `QBELL` có cùng mã TV `QT50WX8A`, nên được xem là cùng thương hiệu. Sau bước này còn **73 thương hiệu**.
>
> Về biến đổi dữ liệu, tôi đổi kích thước từ centimet sang inch bằng cách chia cho **2,54**, rồi tạo bốn nhóm: **≤43**, **44–55**, **56–65** và **>65 inch**. Nhờ vậy, dữ liệu vừa dùng được để xem từng mẫu TV, vừa dễ so sánh theo nhóm.
>
> Riêng điện năng ở chế độ chờ có dấu `-` và ô trống. Workflow loại các giá trị này rồi chuyển phần còn lại sang số, còn **3.985 bản ghi hợp lệ**. Cuối cùng, workflow tổng hợp, sắp xếp và xuất dữ liệu sạch cho website.

### 1:20–4:15 — Câu chuyện trên website

> Trên website, người dùng chọn hãng, công nghệ, kích thước và số sao tối thiểu. Các biểu đồ cập nhật theo lựa chọn đó.
>
> **Biểu đồ 1 hỏi: màn hình lớn hơn có thường dùng nhiều điện hơn không? Kết luận là có.** Hệ số tương quan là **0,854**, cho thấy mối liên hệ mạnh. Biểu đồ phân tán phù hợp vì mỗi chấm là một mẫu TV.
>
> **Biểu đồ 2 kiểm tra lại bằng bốn nhóm kích thước.** Điện năng trung vị tăng lần lượt từ **148** lên **321**, **451** và **681 kWh/năm**. Biểu đồ cột giúp so sánh bốn nhóm nhanh hơn.
>
> **Biểu đồ 3 cho biết công nghệ nào xuất hiện nhiều nhất.** LCD dùng đèn nền LED chiếm **81,4%**, LCD chiếm **12,5%**, OLED chiếm **6%**. Tỷ lệ này chỉ nói về số mẫu TV, không nói công nghệ nào tốt hơn.
>
> **Biểu đồ 4 cho thấy công suất chờ thường thấp.** Trung vị là **0,4 W**, và **3.980 trên 3.985** giá trị hợp lệ không vượt quá 1 W. Biểu đồ phân bố giúp thấy nơi dữ liệu tập trung.
>
> **Biểu đồ 5 so sánh điện năng trung vị giữa 12 hãng có nhiều mẫu nhất.** Sau khi gộp các cách viết tên hãng, `SAMSUNG` có **1.199 mẫu**. Chênh lệch điện năng giữa các hãng có thể đến từ kích thước, nên cần chọn cùng nhóm kích thước trước khi so sánh.
>
> **Biểu đồ 6 kết hợp kích thước, điện năng và chỉ số sao.** Trong cùng nhóm kích thước, chỉ số sao cao thường đi cùng điện năng thấp hơn. Người dùng có thể tìm vùng vừa đúng kích thước, vừa có điện năng thấp và số sao tốt.
>
> Cuối cùng, bảng **Lower-energy matches** xếp tối đa 50 mẫu TV theo điện năng từ thấp đến cao trong điều kiện đã chọn. Đây là danh sách để tìm hiểu thêm, chưa phải quyết định mua vì dữ liệu không có giá và chất lượng hình ảnh.

### 4:15–4:40 — Kết luận

> Bài làm nối ba phần: **KNIME làm sạch dữ liệu**, **biểu đồ trả lời từng câu hỏi**, và **website giúp người dùng thu hẹp lựa chọn**. Website không chọn một TV tốt nhất cho tất cả, mà giúp mỗi người tìm nhóm TV phù hợp với nhu cầu của mình.

---

## Bản đồ workflow KNIME

```text
CSV Reader
  → Column Filter
  → Australian Market Filter
  → String Cleaner (chuẩn hóa chữ hoa/thường)
  → String Replacer - Samsung
  → String Replacer - QBELL
  → String Replacer - SVISION
  → String Replacer - Hubbl
  → String to Number
  → Screen Size in Inches
  → Screen Size Band
       ├─ Size vs Energy
       ├─ Technology Summary → Technology Pie Chart / CSV Writer
       ├─ Screen Band Summary → Sort → Bar Chart / CSV Writer
       ├─ Brand Summary → Sort → Brand Table / CSV Writer
       ├─ Sort Models (sắp xếp mẫu TV) → Model Table (bảng mẫu TV)
       ├─ Valid Standby Filter → Standby to Number → Histogram / CSV Writer
       └─ Write Clean TV Data
```

### Làm sạch và biến đổi dữ liệu cụ thể

| Giai đoạn | Node/logic | Dữ liệu có vấn đề gì? | Workflow xử lý thế nào? |
|---|---|---|---|
| Đọc dữ liệu | `CSV Reader` | File CSV có cả chữ, số và ngày tháng | Đọc mỗi cột theo đúng dạng để có thể tính toán và lọc |
| Chọn cột | `Column Filter` | File gốc có nhiều cột không cần cho câu hỏi của bài | Chỉ giữ mã TV, thị trường, kích thước, công nghệ, điện năng, công suất chờ, số sao, trạng thái và ngày hết hạn |
| Lọc thị trường | `Australian Market Filter` | Có TV ngoài Australia, không còn trạng thái `Available`, hoặc đã hết hạn | Chỉ giữ TV tại Australia, còn trạng thái `Available`, và chưa hết hạn vào ngày 04/10/2026 |
| Chuẩn hóa cách viết | `String Cleaner` | Cùng tên hãng nhưng chữ hoa/thường khác nhau, ví dụ `kogan`, `Kogan`, `KOGAN` | Đổi thành chữ hoa, bỏ khoảng trắng đầu/cuối và khoảng trắng lặp |
| Gộp tên tương đương | Bốn `String Replacer` | Hãng được ghi bằng nhiều tên | Gộp Samsung Electronics/Samsung, Q.Bell/QBELL, S VISION/SVISION và Hubbl Glass/Hubbl sau khi đối chiếu mã TV và nguồn thương hiệu |
| Chuyển dữ liệu thành số | `String to Number` | Các cột kích thước, điện năng và số sao đang được đọc dưới dạng chữ | Chuyển chúng thành số để có thể tính toán và vẽ biểu đồ |
| Đổi đơn vị | `Screen Size in Inches` | Kích thước gốc dùng centimet, trong khi người dùng quen inch | Tính `Screen Size (inches) = screensize / 2.54` |
| Chia nhóm kích thước | `Screen Size Band` | Hàng nghìn giá trị kích thước riêng lẻ khó so sánh | Chia thành bốn nhóm: ≤43, 44–55, 56–65 và >65 inch |
| Làm sạch công suất chờ | `Valid Standby Filter` | Cột `Pasv_stnd_power` có dấu `-` và ô trống | Loại các dòng không có giá trị hợp lệ |
| Chuyển công suất chờ thành số | `Standby to Number` | Giá trị hợp lệ vẫn đang được lưu dưới dạng chữ | Chuyển sang số để tính toán và vẽ biểu đồ phân bố |
| Tạo bảng tổng hợp | `GroupBy` | Dữ liệu từng mẫu TV quá chi tiết để nhìn xu hướng chung | Đếm số mẫu; tính trung bình và trung vị theo công nghệ, nhóm kích thước và hãng |
| Sắp xếp | `Sorter` | Nhóm và hãng chưa có thứ tự dễ đọc | Xếp nhóm kích thước từ nhỏ đến lớn; xếp hãng theo số mẫu; xếp mẫu TV theo điện năng mỗi năm |
| Xuất dữ liệu | `CSV Writer` | Website cần dữ liệu đã xử lý | Xuất `cleaned_tv.csv`, `standby_records.csv` và các bảng tổng hợp |

### Vì sao dùng cả trung bình và trung vị?

- **Trung bình** dùng toàn bộ giá trị, nhưng dễ bị một vài TV rất lớn hoặc dùng điện rất cao kéo lên.
- **Trung vị** là giá trị nằm giữa, nên mô tả một mẫu TV điển hình tốt hơn khi dữ liệu có ngoại lệ.
- Website ưu tiên trung vị khi so sánh nhóm kích thước và hãng để kết quả dễ hiểu, ít bị lệch.

---

## Phân tích từng biểu đồ

### 1. Biểu đồ phân tán: kích thước và điện năng mỗi năm

- **Câu hỏi:** Màn hình lớn hơn có thường dùng nhiều điện hơn không?
- **Kết luận:** Có. Hệ số tương quan là **0,854**, cho thấy mối liên hệ cùng chiều mạnh.
- **Bằng chứng:** Đám mây điểm đi lên từ trái sang phải. Khi tách theo công nghệ, kết quả vẫn cùng chiều: LCD dùng đèn nền LED là **0,864**, LCD là **0,788**, OLED là **0,847**.
- **Vì sao dùng biểu đồ này:** Cả kích thước và điện năng đều là số liên tục. Mỗi chấm đại diện một mẫu TV, nên ta thấy cả xu hướng chung và các mẫu khác biệt.
- **Giới hạn:** Biểu đồ cho thấy hai biến đi cùng nhau, nhưng không tự chứng minh kích thước là nguyên nhân duy nhất. Công nghệ, độ sáng và thiết kế phần cứng cũng có thể ảnh hưởng.

### 2. Biểu đồ cột: điện năng theo nhóm kích thước

- **Câu hỏi:** Mức điện năng điển hình thay đổi thế nào khi chuyển sang nhóm màn hình lớn hơn?
- **Kết luận:** Điện năng tăng đều theo kích thước. Trung vị của bốn nhóm lần lượt là **148**, **321**, **451** và **681 kWh/năm**.
- **Bằng chứng:** Bốn cột tăng liên tục từ nhóm ≤43 inch đến nhóm >65 inch. Số mẫu trong bốn nhóm lần lượt là **1.175**, **1.240**, **923** và **1.501**.
- **Vì sao dùng biểu đồ này:** Chỉ có bốn nhóm rõ ràng. Chiều cao cột giúp so sánh nhanh hơn một bảng nhiều số.
- **Ý nghĩa sử dụng:** Người dùng nên chọn kích thước trước, rồi mới so sánh số sao và điện năng giữa các TV có kích thước gần nhau.

### 3. Biểu đồ tròn: tỷ lệ công nghệ màn hình

- **Câu hỏi:** Công nghệ nào có nhiều mẫu TV nhất trong dữ liệu?
- **Kết luận:** LCD dùng đèn nền LED chiếm phần lớn với **3.940 mẫu, tương đương 81,4%**. LCD có **607 mẫu, 12,5%**; OLED có **292 mẫu, 6,0%**.
- **Vì sao dùng biểu đồ này:** Chỉ có ba nhóm và tổng của chúng bằng toàn bộ dữ liệu. Biểu đồ tròn làm phần chiếm ưu thế dễ nhận ra.
- **Giới hạn:** Tỷ lệ lớn chỉ có nghĩa là có nhiều mẫu hơn. Nó không chứng minh công nghệ đó tiết kiệm điện hơn hoặc tốt hơn.

### 4. Biểu đồ phân bố: công suất chờ

- **Câu hỏi:** Khi TV ở chế độ chờ, mức công suất thường nằm ở đâu?
- **Kết luận:** Công suất chờ nhìn chung thấp. Trung vị là **0,4 W**; **3.980 trên 3.985** giá trị hợp lệ không vượt quá **1 W**.
- **Vì sao dùng biểu đồ này:** Công suất chờ là một biến số liên tục. Các cột theo khoảng cho biết phần lớn TV tập trung ở đâu và có giá trị khác thường hay không.
- **Giới hạn:** Biểu đồ chỉ dùng 3.985 dòng hợp lệ. Các dòng có dấu `-` hoặc ô trống đã bị loại trước khi tính.

### 5. Biểu đồ cột ngang: điện năng theo hãng

- **Câu hỏi:** Trong 12 hãng có nhiều mẫu nhất, điện năng trung vị khác nhau thế nào?
- **Kết luận:** Có chênh lệch giữa các hãng, nhưng chưa thể dùng chênh lệch này để xếp hạng hãng tiết kiệm điện.
- **Bằng chứng:** Sau khi gộp các cách viết tên hãng, `KOGAN` có điện năng trung vị **395 kWh/năm** và kích thước trung vị **54,64 inch**. `SAMSUNG` có điện năng trung vị **499 kWh/năm** và kích thước trung vị **64,53 inch**. Hãng có nhiều TV lớn hơn thường có mức điện năng cao hơn.
- **Vì sao dùng biểu đồ này:** Cột ngang chứa được tên hãng dài và giúp so sánh thứ hạng dễ hơn.
- **Cách đọc đúng:** Chọn cùng một nhóm kích thước và công nghệ trước khi so sánh hãng.

### 6. Biểu đồ phân tán 3D: kích thước, điện năng và chỉ số sao

- **Câu hỏi:** Một mẫu TV có thể vừa đúng kích thước, dùng ít điện và có chỉ số sao cao không?
- **Kết luận:** Kích thước vẫn là yếu tố liên hệ mạnh với điện năng. Tuy nhiên, trong cùng nhóm kích thước, chỉ số sao cao thường đi cùng điện năng thấp hơn.
- **Bằng chứng:** Tương quan giữa chỉ số sao và điện năng trong bốn nhóm kích thước lần lượt là **-0,589**, **-0,916**, **-0,969** và **-0,740**. Dấu âm nghĩa là khi chỉ số sao tăng, điện năng thường giảm trong cùng nhóm kích thước.
- **Vì sao dùng biểu đồ này:** Ba trục cho phép xem đồng thời ba biến số. Màu sắc giúp phân biệt công nghệ màn hình.
- **Giới hạn:** Đây là biểu đồ khám phá. Khi dữ liệu lớn, website lấy khoảng **1.400 điểm** để giữ thao tác mượt; bảng kết quả mới phù hợp để đọc từng mẫu TV chính xác.

---

## Phân tích các thẻ số liệu và bảng kết quả

### Bốn thẻ số liệu ở đầu trang

- **Số mẫu TV:** cho biết còn bao nhiêu mẫu sau khi áp dụng bộ lọc.
- **Điện năng trung vị:** cho biết mức điện năng điển hình của nhóm đang xem.
- **Số sao trung bình:** tóm tắt hiệu quả năng lượng của nhóm đang xem.
- **Số công nghệ:** cho biết nhóm đang xem còn bao nhiêu loại màn hình.

Bốn thẻ đều thay đổi theo bộ lọc. Người dùng kiểm tra các thẻ trước để biết mình đang phân tích toàn bộ dữ liệu hay chỉ một nhóm nhỏ.

### Bảng `Lower-energy matches`

- **Câu hỏi:** Trong điều kiện đã chọn, những mẫu TV nào có điện năng mỗi năm thấp nhất?
- **Cách xếp:** Bảng sắp xếp điện năng từ thấp đến cao và hiển thị tối đa 50 mẫu.
- **Các cột:** hãng, mã mẫu TV, công nghệ, kích thước, điện năng mỗi năm và số sao.
- **Cách dùng:** Chọn kích thước tối thiểu, tối đa và số sao trước. Sau đó dùng bảng để tạo danh sách TV cần tìm hiểu thêm.
- **Giới hạn:** Bảng chưa có giá, chất lượng hình ảnh, tính năng và tồn kho. Vì vậy, đây là danh sách tham khảo, không phải quyết định mua hàng.

### Ba bảng tổng hợp do KNIME tạo

- **Bảng công nghệ:** đếm số mẫu và tính điện năng, số sao theo từng công nghệ. Bảng cho thấy cơ cấu thị trường, nhưng phải kiểm soát kích thước trước khi so sánh hiệu quả.
- **Bảng nhóm kích thước:** đếm số mẫu và tính điện năng trung vị cho bốn nhóm. Bảng xác nhận TV càng lớn thì điện năng điển hình càng cao.
- **Bảng hãng:** đếm số mẫu, tính kích thước và điện năng trung vị theo hãng. Bảng dùng để chọn 12 hãng có nhiều dữ liệu nhất; không dùng trực tiếp để tuyên bố hãng nào tốt nhất.

---

## Website và KNIME liên kết với nhau như thế nào?

- KNIME chịu trách nhiệm chuẩn bị, kiểm tra, tổng hợp và xuất dữ liệu.
- Website đọc `cleaned_tv.csv` và `standby_records.csv`.
- Các file tổng hợp từ KNIME dùng để kiểm tra kết quả.
- Khi người dùng thay đổi bộ lọc, website tính lại các thẻ số liệu và biểu đồ ngay.
- Câu chuyện của trang là: **chọn nhu cầu → hiểu ảnh hưởng của kích thước → xem công nghệ và công suất chờ → so sánh hãng → chọn danh sách TV cần tìm hiểu thêm**.

---

## Các lưu ý khi bị hỏi phản biện

### “Available” có phải đang bán tại cửa hàng không?

Không. Trong project, `Available` là trạng thái đăng ký trong nguồn dữ liệu, không phải bằng chứng về tồn kho tại retailer.

### Các nhóm kích thước có phải chuẩn chính thức của Australia không?

Không. Đây là nhóm do project định nghĩa để hỗ trợ so sánh và trình bày.

### Vì sao không dùng trung bình cho tất cả biểu đồ?

Vì một vài TV rất lớn hoặc dùng điện rất cao có thể kéo mức trung bình lên. Trung vị mô tả một mẫu TV điển hình tốt hơn.

### Vì sao hãng có điện năng trung vị thấp chưa chắc tốt hơn?

Vì hãng đó có thể có nhiều TV nhỏ hơn. Muốn so sánh công bằng, cần chọn cùng nhóm kích thước và công nghệ trước.

### Website có đề xuất mẫu TV tốt nhất không?

Không. Website chỉ tạo danh sách tham khảo theo kích thước, công nghệ, số sao và điện năng. Quyết định mua còn cần giá, tính năng, chất lượng hình ảnh và tình trạng bán thực tế.

### Hạn chế chính của dữ liệu là gì?

- Dữ liệu chỉ phản ánh tình trạng tại ngày 04/10/2026.
- Công suất chờ không hợp lệ hoặc thiếu ở một phần dữ liệu.
- Dữ liệu không có giá bán, đánh giá người dùng, tồn kho hoặc thời lượng sử dụng thực tế.
- Biểu đồ cho thấy các biến có liên hệ, nhưng không tự chứng minh quan hệ nguyên nhân và kết quả.

---

## Câu kết ngắn nếu hết thời gian

> Tóm lại, KNIME làm sạch và biến đổi dữ liệu; mỗi biểu đồ trả lời một câu hỏi; còn website giúp người dùng đi từ nhu cầu đến danh sách TV phù hợp để tìm hiểu thêm.
