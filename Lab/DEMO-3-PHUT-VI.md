# Bản trình bày Demonstration 2 trong 3 phút

Mở http://127.0.0.1:8004/. Dùng menu để chuyển phần. Không đọc toàn bộ bảng; chỉ chỉ vào một ví dụ.

## 0:00–0:35 — SVG house

“Website này tổng hợp bài Week 4 đến Week 6 bằng HTML, CSS, JavaScript và D3 v7.

Đầu tiên là ngôi nhà bằng SVG. Gốc tọa độ nằm ở góc trên bên trái; x tăng sang phải và y tăng xuống dưới. Em dùng rect cho tường, polygon cho mái, circle cho mặt trời và path cho đường đi cong. Hai cửa sổ nằm trong nhóm g để dùng chung màu và stroke. translate di chuyển cả nhóm theo hệ tọa độ cục bộ.”

**Thao tác:** chỉ vào hai cửa sổ; nếu được hỏi, mở ví dụ tọa độ bên dưới.

## 0:35–1:10 — Horizontal bar chart

“Biểu đồ thanh ngang thể hiện số bản ghi đăng ký theo brand. Em đọc CSV bằng d3.csv và chuyển count từ chuỗi thành số. Vì tải file là bất đồng bộ, phần vẽ chạy sau khi Promise hoàn thành.

Em dùng data binding và join để tạo thanh. scaleLinear biến count thành chiều dài; scaleBand chia vị trí cho các brand. Baseline bắt đầu từ 0. Workflow chỉ giữ brand có ít nhất 20 đăng ký, nên chart có 25 brand và tổng 4.240 bản ghi. Đây không phải doanh số.”

**Thao tác:** chỉ một thanh và nhãn count.

## 1:10–2:00 — Multi-chart

“Trang có ba loại biểu đồ. Bar chart đứng so sánh mean annual energy giữa các công nghệ trong nhóm TV 55 inch. KNIME đổi centimet sang inch, làm tròn rồi lọc bằng 55. Nhóm này có 736 bản ghi; giữ cùng kích thước giúp giảm ảnh hưởng của size khi so sánh công nghệ.

Line chart dùng dữ liệu giá điện bán buôn từ 1998 đến 2024, đơn vị AUD/MWh. Em chuyển năm thành số, sắp tăng dần rồi dùng d3.line để nối các điểm.

Donut chart thể hiện tỷ lệ Small, Medium và Large. d3.pie tính góc; d3.arc vẽ cung. Nhóm size lần lượt là tối đa 43, từ 44 đến 65 và từ 66 inch, sau làm tròn.”

**Thao tác:** chỉ nhanh bar, line và donut; không dừng đọc từng giá trị.

## 2:00–3:00 — Interactivity và phần mở rộng

“Phần cuối gồm histogram và scatterplot từ 4.233 bản ghi TV. Histogram dùng d3.bin để chia annual energy thành các khoảng; chiều cao là số bản ghi trong khoảng. Scatterplot dùng star rating trên trục x, annual energy trên trục y, và màu thể hiện công nghệ.

Phần mở rộng là một bộ lọc cập nhật đồng thời cả hai chart và số bản ghi. Khi chọn OLED, cả hai chỉ còn 286 bản ghi; All khôi phục toàn bộ. Em giữ nguyên bin boundaries và domain khi lọc để so sánh giữa các nhóm.

Tooltip hiển thị thông tin đúng bản ghi, gồm screen size. Có thể đọc bằng hover, focus hoặc danh sách chọn, nên điểm chồng nhau vẫn truy cập được. Em giữ outlier và không chuyển missing thành 0.

Em có sử dụng Codex hỗ trợ tạo code, chỉnh workflow và kiểm thử; phần hỗ trợ được khai báo riêng. Em phân biệt các kiểm tra tự động với thao tác KNIME thực tế.”

**Thao tác:** chọn OLED → chọn một bản ghi để hiện tooltip → chọn All. Đây là phần quan trọng nhất cần làm trực tiếp.

## Câu hỏi thường gặp và ý trả lời

1. **D3 làm gì?** D3 gắn dữ liệu vào DOM và giúp tính scales, axes, shapes cùng xử lý sự kiện. Không phải chỉ gọi tên chart là thư viện tự vẽ hết.
2. **Vì sao cần ép count thành số?** CSV đọc giá trị thành chuỗi. Phép tính và scales cần số. Riêng chuỗi trống phải kiểm tra trước vì Number('') trả về 0.
3. **Promise và then là gì?** Promise đại diện kết quả tải file trong tương lai. then chạy khi có dữ liệu; catch xử lý lỗi tải hoặc parse.
4. **data binding và join là gì?** Ghép mỗi datum với một phần tử; tạo phần tử còn thiếu, cập nhật phần tử khớp và xóa phần tử không còn dữ liệu.
5. **Key trong join dùng làm gì?** Nhận diện bản ghi ổn định khi lọc hoặc đổi thứ tự. Chart dùng brand hoặc id của dòng.
6. **scaleLinear khác scaleBand thế nào?** Linear ánh xạ giá trị số sang vị trí/chiều dài liên tục. Band cấp vị trí và độ rộng cho từng category.
7. **domain khác range thế nào?** Domain là miền dữ liệu, ví dụ 0–2.800 kWh/year. Range là miền tọa độ pixel dùng để vẽ.
8. **Vì sao y range đảo?** SVG y tăng xuống dưới. Để giá trị lớn nằm cao hơn, dùng range từ chiều cao chart về 0.
9. **Vì sao chiều cao bar là h − y(value)?** y(value) là tọa độ đỉnh thanh; h là tọa độ baseline. Hiệu là chiều cao thanh.
10. **Vì sao bar chart bắt đầu tại 0?** Chiều dài biểu diễn độ lớn; cắt baseline có thể làm khác biệt trông lớn hơn thực tế.
11. **Vì sao chỉ so TV 55 inch?** Size liên quan mạnh đến energy. Giữ size cố định giúp so sánh công nghệ hợp lý hơn; vẫn không chứng minh nhân quả.
12. **55 inch được xác định thế nào?** screensize / 2.54, làm tròn số nguyên rồi lọc bằng 55. Không so số thực bằng 55.000 tùy tiện.
13. **Mean khác median?** Mean là tổng chia số bản ghi, nhạy với outlier. Median là giá trị giữa sau khi sắp xếp. Bài này dùng mean đúng yêu cầu.
14. **Vì sao cần sắp năm trước khi vẽ line?** Đường nối theo thứ tự dòng. Năm lộn xộn sẽ làm đường đi ngược thời gian.
15. **Pie và donut khác gì trong code?** Donut có innerRadius >0; đặt innerRadius=0 để thành pie. Tỷ lệ dữ liệu không đổi.
16. **Histogram khác bar chart?** Histogram chia biến số liên tục thành các khoảng liền nhau; bar chart so các category rời rạc.
17. **Vì sao giữ bins và domain khi lọc?** Đảm bảo cùng một vị trí và chiều cao luôn mang cùng ý nghĩa giữa các lần chọn.
18. **Transition dùng để làm gì?** Giúp theo dõi thay đổi khi lọc. Transition ngắn; tắt khi người dùng bật reduced motion.
19. **event và d trong .on() là gì?** event là sự kiện DOM; d là dữ liệu gắn với phần tử đang tương tác.
20. **Tooltip đọc screen size từ đâu?** Từ d.screenSize của đúng datum, không suy từ vị trí điểm hoặc chỉ số sau lọc.
21. **Có thể xóa outlier không?** Chỉ khi có lý do và ghi nhận rõ. Bản này giữ 2.652 kWh/year để không làm mất phạm vi dữ liệu.
22. **Star rating có phải lượng điện?** Không. Đây là rating có thứ tự; 6 sao không có nghĩa gấp đôi 3 sao về lượng điện hoặc hiệu quả.
23. **Count có phải doanh số?** Không. Count là số bản ghi đăng ký trong snapshot giảng dạy.
24. **Giá spot có phải tiền điện hộ gia đình?** Không. Đây là giá điện bán buôn, đơn vị AUD/MWh, chưa phải retail tariff.
25. **Làm sao biết filter đúng?** Với từng nhóm, tổng frequency histogram và số điểm scatter phải bằng số bản ghi đã lọc. All=4.233; LED=3.492; LCD=455; OLED=286.
26. **Vì sao Lab 5 có 4.508 nhưng Lab 6 có 4.233?** Hai bộ dữ liệu có bước chuẩn bị khác nhau. W6 được cung cấp riêng, có xử lý trùng/đổi tên công nghệ. Không trộn các tổng này.
27. **Kiểm thử tự động có thay usability testing không?** Không. Chưa có participant hay feedback người thật; không nhận là đã làm usability evaluation.
28. **Em dùng GenAI đến đâu?** Nêu đúng: Codex hỗ trợ SVG, website, chart, chỉnh settings workflow, tests và tài liệu. Không nói tự viết toàn bộ. Chỉ nhận phần thao tác/hiểu biết mình thực sự làm được.

## Nếu tutor yêu cầu sửa trực tiếp

- Đổi màu LED: sửa `TV.colors.LED` trong `Lab-6/shared-constants.js`.
- Đổi spacing: sửa `.padding(.2)` trong `Lab-4/bar-chart.js`.
- Đổi số bins: sửa tick target `14` trong `Lab-6/load-data.js`; reload. Đây là tick target, không phải lúc nào cũng cho đúng bằng số bins yêu cầu.
- Đổi donut thành pie: sửa `.innerRadius(r*.6)` thành `.innerRadius(0)` trong `Lab-5/donut-chart.js`.
- Thêm nội dung tooltip: sửa `describeTV` trong `Lab-6/shared-constants.js`.
- Di chuyển cửa sổ trên website: sửa `transform` của nhóm `windows` trong inline SVG ở `index.html`. File `house.svg` là bản SVG lưu riêng; sửa file này không tự cập nhật inline SVG.

Không cố nhớ hết 28 câu trong vài phút. Ưu tiên câu 2–9, 12, 16–20 và 25; mở code đúng chỗ để giải thích.
