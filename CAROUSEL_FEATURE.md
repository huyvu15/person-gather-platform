# Tính năng Carousel/Slideshow ảnh kỷ niệm

## Mô tả
Tính năng carousel cho phép người dùng xem ảnh kỷ niệm dạng slideshow với khả năng trượt ngang khi click vào ảnh.

## Các tính năng chính

### 1. Mở Carousel
- Click vào bất kỳ ảnh nào trong grid để mở carousel
- Carousel sẽ hiển thị ảnh được chọn ở vị trí đầu tiên

### 2. Điều hướng
- **Mũi tên trái/phải**: Chuyển đến ảnh trước/sau
- **Phím tắt**: 
  - `←` (Arrow Left): Ảnh trước
  - `→` (Arrow Right): Ảnh sau
  - `Esc`: Đóng carousel
- **Thumbnail navigation**: Click vào thumbnail ở dưới để chuyển nhanh

### 3. Zoom và Pan
- **Zoom**: Sử dụng thanh trượt zoom hoặc scroll chuột
- **Pan**: Kéo thả ảnh khi đã zoom
- **Reset**: Nút "Reset" để đặt lại zoom và vị trí

### 4. Xoay ảnh
- Nút "Xoay" để xoay ảnh 90 độ

### 5. Tương tác
- **Like/Unlike**: Nút tim để thích/bỏ thích ảnh
- **Download**: Tải xuống ảnh
- **Share**: Chia sẻ ảnh (placeholder)

## Cấu trúc Component

### CarouselModal
- Component chính cho carousel
- Quản lý state: currentIndex, scale, rotation, position
- Xử lý keyboard events và mouse events

### MemoryGrid
- Cập nhật để sử dụng CarouselModal thay vì ImageModal
- Quản lý selectedImageIndex thay vì selectedImage

### MemoryCard
- Cập nhật handleView để mở carousel
- Thêm nút zoom riêng biệt
- Giữ nguyên tính năng zoom local

## Cải tiến so với ImageModal cũ

1. **Navigation**: Thêm mũi tên điều hướng và thumbnail
2. **Keyboard support**: Hỗ trợ phím tắt
3. **Smooth transitions**: Animation mượt mà khi chuyển ảnh
4. **Better UX**: Hiển thị số thứ tự ảnh (1/10)
5. **Responsive**: Tối ưu cho mobile và desktop

## Cách sử dụng

1. Vào trang Memories
2. Click vào bất kỳ ảnh nào
3. Sử dụng mũi tên hoặc thumbnail để điều hướng
4. Zoom và pan để xem chi tiết
5. Nhấn Esc hoặc nút X để đóng

## Technical Details

- Sử dụng Framer Motion cho animations
- State management với React hooks
- Keyboard event listeners
- Touch/mouse event handling
- Responsive design với Tailwind CSS 