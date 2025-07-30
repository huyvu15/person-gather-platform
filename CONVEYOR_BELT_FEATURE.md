# Tính năng Băng Chuyền (Conveyor Belt) ảnh kỷ niệm

## Mô tả
Tính năng băng chuyền cho phép người dùng xem ảnh kỷ niệm dạng slideshow tự động với hiệu ứng trượt ngang như băng chuyền.

## Các tính năng chính

### 1. Auto-play Slideshow
- **Tự động phát**: Ảnh tự động chuyển theo thời gian
- **Tốc độ điều chỉnh**: 1s, 2s, 3s, 5s mỗi ảnh
- **Hướng di chuyển**: Tiến hoặc lùi
- **Play/Pause**: Tạm dừng hoặc tiếp tục slideshow

### 2. Điều khiển thủ công
- **Mũi tên trái/phải**: Chuyển ảnh thủ công
- **Thumbnail navigation**: Click vào thumbnail để chuyển nhanh
- **Phím tắt**: 
  - `←` (Arrow Left): Ảnh trước
  - `→` (Arrow Right): Ảnh sau
  - `Space`: Play/Pause
  - `Esc`: Đóng slideshow

### 3. Hiệu ứng băng chuyền
- **Smooth transitions**: Animation mượt mà khi chuyển ảnh
- **Direction-aware**: Animation theo hướng di chuyển
- **Thumbnail preview**: Xem trước tất cả ảnh ở dưới

## Cách sử dụng

### Mở Slideshow
1. **Click nút "🎬 Slideshow"** ở thanh tìm kiếm (chỉ hiện khi có nhiều hơn 1 ảnh)
2. Slideshow sẽ mở với ảnh đầu tiên
3. Tự động bắt đầu phát

### Điều khiển
- **Play/Pause**: Click nút play/pause hoặc nhấn Space
- **Tốc độ**: Chọn từ dropdown (1s, 2s, 3s, 5s)
- **Hướng**: Click nút rotate để đổi hướng
- **Thủ công**: Sử dụng mũi tên hoặc thumbnail

## Technical Details

### State Management
```typescript
const [currentIndex, setCurrentIndex] = useState(0)
const [isPlaying, setIsPlaying] = useState(true)
const [speed, setSpeed] = useState(3000) // 3 seconds
const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
```

### Auto-play Logic
```typescript
useEffect(() => {
  if (!isOpen || !isPlaying || images.length <= 1) return

  const interval = setInterval(() => {
    setCurrentIndex(prev => {
      if (direction === 'forward') {
        return prev >= images.length - 1 ? 0 : prev + 1
      } else {
        return prev <= 0 ? images.length - 1 : prev - 1
      }
    })
  }, speed)

  return () => clearInterval(interval)
}, [isOpen, isPlaying, images.length, speed, direction])
```

### Animation
- **Framer Motion**: Smooth transitions với AnimatePresence
- **Direction-aware**: Animation theo hướng di chuyển
- **Performance**: Optimized với will-change và transform

## UI/UX Features

### Header Controls
- **Tên file và kích thước**: Hiển thị thông tin ảnh hiện tại
- **Số thứ tự**: "1/10" để biết vị trí
- **Tốc độ**: Dropdown để điều chỉnh tốc độ
- **Hướng**: Nút rotate để đổi hướng
- **Play/Pause**: Nút để tạm dừng/tiếp tục

### Navigation
- **Mũi tên trái/phải**: Điều khiển thủ công
- **Thumbnail bar**: Xem trước và chuyển nhanh
- **Keyboard support**: Phím tắt đầy đủ

### Footer Info
- **Ngày tạo**: Thông tin ngày tạo ảnh
- **Kích thước file**: Thông tin dung lượng
- **Trạng thái**: Hiển thị đang phát/tạm dừng và hướng
- **Like button**: Thích/bỏ thích ảnh

## Responsive Design

- **Desktop**: Đầy đủ controls và preview
- **Tablet**: Optimized layout cho màn hình vừa
- **Mobile**: Touch-friendly controls

## Performance Optimizations

- **Lazy loading**: Ảnh được load khi cần
- **Memory management**: Cleanup intervals khi đóng
- **Smooth animations**: Hardware acceleration
- **Efficient re-renders**: Memoized components

## Accessibility

- **Keyboard navigation**: Đầy đủ phím tắt
- **Screen readers**: Alt text và labels
- **Focus management**: Proper focus indicators
- **Reduced motion**: Respect user preferences

## Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **CSS transforms**: Hardware acceleration
- **ES6+ features**: Arrow functions, destructuring
- **Framer Motion**: Animation library 