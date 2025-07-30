# Tính năng Zoom ảnh kỷ niệm

## Mô tả
Tính năng zoom cho phép người dùng xem chi tiết ảnh kỷ niệm bằng cách click vào ảnh hoặc nút "Xem chi tiết".

## Các tính năng chính

### 1. Zoom ảnh
- **Click vào ảnh**: Phóng to ảnh lên 1.5 lần
- **Nút "Xem chi tiết"**: Click vào icon mắt để zoom
- **Click lại**: Thu nhỏ ảnh về kích thước ban đầu

### 2. Hiệu ứng zoom
- **Scale 1.2x**: Ảnh được phóng to 1.2 lần kích thước gốc
- **Smooth animation**: Chuyển động mượt mà với transition 0.3s
- **Z-index cao**: Ảnh zoom hiển thị trên các ảnh khác
- **Shadow effect**: Bóng đổ đẹp mắt khi zoom

### 3. Responsive
- **Grid view**: Zoom hoạt động tốt trong grid layout
- **List view**: Zoom cũng hoạt động trong list layout
- **Mobile friendly**: Tối ưu cho thiết bị di động

## Cách sử dụng

### Grid View
1. **Click vào ảnh** để phóng to
2. **Click lại** để thu nhỏ
3. **Click nút "Xem chi tiết"** (icon mắt) để zoom

### List View
1. **Click vào card** để phóng to
2. **Click lại** để thu nhỏ
3. **Click nút "Xem chi tiết"** để zoom

## Technical Details

### CSS Classes
```css
.memory-card.zoomed {
  position: relative;
  z-index: 50;
  transform: scale(1.5);
  transform-origin: center;
  transition: transform 0.3s ease-in-out;
}
```

### State Management
- `isZoomed`: Boolean state để theo dõi trạng thái zoom
- `handleView`: Toggle zoom state
- `handleZoom`: Toggle zoom từ nút

### Animation
- Sử dụng Framer Motion cho smooth transitions
- CSS transitions cho transform effects
- Hover effects với scale và glow

## Cải tiến so với carousel

1. **Đơn giản hơn**: Chỉ zoom ảnh thay vì mở modal phức tạp
2. **Nhanh hơn**: Không cần load modal, zoom ngay lập tức
3. **UX tốt hơn**: Người dùng có thể xem chi tiết mà không rời khỏi grid
4. **Performance**: Ít resource hơn, không cần render modal

## Accessibility

- **Keyboard navigation**: Có thể sử dụng Tab để focus
- **Screen readers**: Title và alt text được cung cấp
- **Focus indicators**: Rõ ràng khi focus vào elements

## Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **CSS transforms**: Được hỗ trợ rộng rãi
- **Fallback**: Graceful degradation cho browser cũ 