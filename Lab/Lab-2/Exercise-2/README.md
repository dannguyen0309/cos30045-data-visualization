# Lab 2 — Exercise 2, simplified

Đã đọc lại [Exercise 2 trên Canvas](https://swinburne.instructure.com/courses/78028/pages/exercise-2-data-exploration-and-chart-types-in-knime?module_item_id=5905223) và rút workflow từ **40 xuống 18 node**. Giữ đủ câu hỏi; bỏ các nhánh phụ không cần thiết.

## Các node đã bỏ

| Phần bỏ | Số node | Lý do |
|---|---:|---|
| Cleaning và gộp brand | 5 | Đã làm trong Lab 1. Lab 2 không tổng hợp theo brand; cách viết Brand_Reg không thay đổi kết quả size/technology. |
| Hai Histogram bổ sung | 2 | Thử đổi bins trong một Histogram, không cần ba node. |
| CSV Writer | 6 | Exercise 2 không yêu cầu xuất sáu bảng CSV. Dữ liệu gốc vẫn đi kèm workflow. |
| Filter/Table View kiểm tra size | 2 | Kiểm tra model qua Output Table của node hiện có. |
| Pivot/chart Star2 riêng | 2 | Thử Median(Star2) trong Pivot/chart hiện có, rồi khôi phục Mean(energy). |
| GroupBy cho hai energy bar chart | 2 | Bar Chart có Aggregation = Average, tính mean trực tiếp. |
| Column Resorter và hai Sorter phụ | 3 | Giữ một Sorter theo số inch; các node bố trí/thứ tự còn lại không cần thiết. |

Lab 1 và CSV gốc không thay đổi. Brand trong Lab 2 giữ cách viết nguồn vì không có câu hỏi so sánh brand.

## Workflow còn lại

1. CSV Reader → Column Filter → Available TVs → Australian TVs.
2. Một Histogram cho Q1.
3. Expression tạo inch chính xác; một Scatter Plot cho Q2.
4. Number Rounder thêm inch làm tròn; hai Expression tạo size label và size category; Sorter; hai energy Bar Chart.
5. Một GroupBy theo Screen_Tech; hai Bar Chart cho count và mean screen size.
6. Một Pivot theo technology × size category; một grouped Bar Chart cho mean energy.

Hai row filter vẫn cần vì câu hỏi nói về TV Available tại Australia. Giữ mọi tổ hợp SoldIn có Australia. Dự kiến: 4.724 dòng gốc; 4.710 Available; 4.508 Available tại Australia. Không thêm ExpDate filter hoặc dedup vào bài tập này.

## Q1 — Phân bố size

Histogram hiện dùng **20 equal-width bins** và đã chạy, với tổng 4.508 bản ghi. Người dùng chọn giữ 20 bins, không thực hiện thử nghiệm 10/30 trong bản này. Canvas có câu hỏi về thay đổi số bins; tài liệu không tuyên bố đã thử 10/30. Số bins là số khoảng, không phải độ rộng 10/20/30 cm.

Kiểm tra khoảng quanh 150/175 cm qua Output Table của Australian TVs, hoặc bảng sau Expression để đọc cả inch. Table filter dùng để kiểm tra, không thay đổi dữ liệu phân tích. Khoảng 145–155 cm hoặc 170–180 cm có tổng 153 dòng.

Ví dụ `4T-C60CK1X`: 152,663 cm, khoảng 60,10 inch. Nhiều model 70 có khoảng 176,54 cm, tức gần 69,5 inch. Kiểm tra specification của đúng model trước khi kết luận nhập sai. Không tự sửa chỉ vì histogram có nhóm ít bản ghi.

## Q2 — Size và energy

- Expression tạo inch chính xác: `screensize / 2.54`. Scatter dùng inch chính xác và energy theo kWh/year; giới hạn 5.000 dòng bao phủ 4.508 bản ghi.
- Number Rounder append `screensize_inch_rounded`, giữ nguyên inch chính xác.
- Expression tạo `screensize_label` dạng string và `screensize_category`: Small ≤43, Medium 44–65, Large ≥66 inch đã làm tròn. Quy tắc phủ ranh giới 43/66 chưa nhất quán trong đề.
- Hai energy Bar Chart: **Aggregation = Average**, frequency dimension là **cột energy gốc**. Không dùng cột Mean(...) vì không còn GroupBy phía trước.

| Nhóm | Count | Mean energy dự kiến (kWh/year) |
|---|---:|---:|
| Small | 1.111 | 158,109811 |
| Medium | 2.059 | 404,680427 |
| Large | 1.338 | 748,884903 |

Có 47 size đo đã làm tròn. Rounding có thể chia cùng một size quảng cáo thành hai nhóm gần nhau; không khẳng định kích thước thị trường của model. Mean giữ đơn vị energy nhưng nhạy với giá trị lớn. Chart mô tả quan hệ, không chứng minh nhân quả. Thiếu tariff nên không quy đổi kWh thành tiền dù đề dùng chữ “costs”.

## Q3 — Công nghệ

GroupBy theo Screen_Tech: Count(Model_No) và Mean(screensize_inch). Hai technology chart đọc hai kết quả này, Aggregation = None.

| Screen_Tech | Count | Mean size dự kiến (inch) |
|---|---:|---:|
| LCD | 562 | 50,567312 |
| LCD (LED) | 3.658 | 59,483225 |
| OLED | 288 | 64,970121 |

OLED có size trung bình lớn hơn, nên cần so sánh energy trong nhóm size. Pivot: Groups = Screen_Tech; Pivots = screensize_category; Manual Aggregation = Mean(labelled energy); Column names = Pivot name. Grouped Bar Chart dùng Screen_Tech làm category và ba cột size làm frequency dimensions, Aggregation = None.

| Mean kWh/year | Small | Medium | Large |
|---|---:|---:|---:|
| LCD | 135,046414 | 384,888372 | 654,518182 |
| LCD (LED) | 163,029172 | 409,630162 | 760,350442 |
| OLED | 231,647059 | 381,468208 | 722,602041 |

Nhóm size rộng vẫn chứa khác biệt về kích thước/model; không coi đây là ảnh hưởng nhân quả của technology.

### Câu hỏi Star2

Star2 là rating có thứ tự, không phải lượng điện tuyến tính. Có thể dùng Median hoặc Mode. Theo [Energy Rating](https://www.energyrating.gov.au/consumer-information/products/televisions), so sánh hiệu quả giữa TV cùng kích thước; cùng số sao không có nghĩa cùng kWh/year.

Để thử câu hỏi cuối của Canvas, đổi aggregation trong Pivot hiện có thành Median(Star2), chạy lại và đổi title/đơn vị grouped chart sang median stars. Ghi nhận kết quả hoặc screenshot, rồi khôi phục Mean(energy) và title kWh/year trước khi Save. Không cần hai node riêng.

| Median Star2 tham khảo | Small | Medium | Large |
|---|---:|---:|---:|
| LCD | 5,0 | 5,0 | 5,25 |
| LCD (LED) | 5,0 | 4,5 | 5,0 |
| OLED | 4,5 | 5,0 | 5,5 |

Median có thể nằm giữa hai mức rating khi số bản ghi chẵn. Không diễn giải 6 sao là gấp đôi hiệu quả của 3 sao.

## Kiểm tra và nộp

1. Đóng và mở lại Exercise-2 để nạp graph 18 node; Execute all rồi Save.
2. Kiểm tra các filter theo số dòng trên; technology GroupBy và Pivot có 3 dòng.
3. Mở Histogram, Scatter, hai energy chart, hai technology chart và grouped energy chart; đối chiếu số liệu/đơn vị với bảng tham khảo.
4. Giữ Histogram ở 20 bins theo lựa chọn hiện tại; kiểm tra model ở size ít phổ biến và chuẩn bị giải thích ý nghĩa số bins. Trả lời câu hỏi Star2 bằng cách thử lại Pivot nếu cần.
5. Export .knwf có tên sinh viên, kèm dữ liệu; import thử ở vị trí mới. Rà lại GenAI declaration.

Không cần CSV Writer cho Lab 2. Các số tham khảo không phải bằng chứng graph mới đã chạy. Dataset là snapshot 15/02/2026, đếm registration records chứ không phải doanh số; dữ liệu nguồn được giữ nguyên.
