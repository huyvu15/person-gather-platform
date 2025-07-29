# MyGather - Ứng dụng quản lý ảnh kỷ niệm

Ứng dụng web hiện đại để quản lý và xem ảnh kỷ niệm với giao diện đẹp mắt và tính năng mạnh mẽ.

## 🚀 Tính năng

- **Quản lý ảnh**: Upload, xem, tải xuống ảnh từ AWS S3
- **Tìm kiếm & Lọc**: Tìm kiếm nhanh và bộ lọc thông minh
- **Chế độ xem**: Grid và List view với tùy chỉnh
- **Zoom ảnh**: Xem chi tiết ảnh với zoom và xoay
- **Giao diện đẹp**: Thiết kế hiện đại với glass morphism và gradient
- **Responsive**: Hoạt động tốt trên mọi thiết bị

## 🛠️ Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd mygather
```

### 2. Cài đặt dependencies
```bash
npm install
npm install @prisma/client prisma pg
npx prisma generate
```


### 3. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục gốc:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_S3_FOLDER_PATH=Pictures/Me

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Database (nếu sử dụng)
DATABASE_URL=your_database_url_here
```

### 4. Chạy development server
```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 🔐 Bảo mật

### Environment Variables
- **KHÔNG BAO GIỜ** commit file `.env.local` lên Git
- File `.gitignore` đã được cấu hình để bảo vệ các file nhạy cảm
- Chỉ sử dụng `.env.example` làm template

### AWS S3 Setup
1. Tạo AWS S3 bucket
2. Cấu hình CORS cho bucket
3. Tạo IAM user với quyền truy cập S3
4. Lưu Access Key và Secret Key an toàn

### CORS Configuration cho S3
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
        "ExposeHeaders": []
    }
]
```

## 📁 Cấu trúc dự án

```
mygather/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── memories/          # Trang memories
│   └── page.tsx           # Trang chủ
├── components/            # React components
│   ├── MemoryCard.tsx    # Card hiển thị ảnh
│   ├── MemoryGrid.tsx    # Grid layout
│   ├── SearchAndFilter.tsx # Tìm kiếm và lọc
│   └── ImageModal.tsx    # Modal xem ảnh
├── lib/                  # Utilities
│   └── s3.ts            # AWS S3 integration
├── .env.example         # Template cho env variables
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```

## 🎨 Giao diện

### Màu sắc
- **Primary**: Xanh dương tươi (#0ea5e9)
- **Accent**: Tím hồng gradient (#d946ef)
- **Success**: Xanh lá tươi (#22c55e)
- **Warning**: Cam vàng (#f59e0b)

### Hiệu ứng
- Glass morphism với backdrop blur
- Gradient backgrounds
- Smooth animations và transitions
- Hover effects với scale và glow

## 🚀 Deployment

### Vercel (Recommended)
1. Connect repository với Vercel
2. Cấu hình environment variables trong Vercel dashboard
3. Deploy tự động

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Development

### Scripts
```bash
npm run dev          # Development server
npm run build        # Build production
npm run start        # Start production server
npm run lint         # Lint code
```

### Cấu trúc Environment Variables
```bash
# Required
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET_NAME=your_bucket
AWS_S3_FOLDER_PATH=Pictures/Me

# Optional
AWS_REGION=us-east-1
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **"Invalid time value"**
   - Đã được sửa trong MemoryCard component
   - Xử lý date validation

2. **S3 Access Denied**
   - Kiểm tra AWS credentials
   - Đảm bảo IAM user có quyền truy cập S3

3. **Images không hiển thị**
   - Kiểm tra S3 bucket configuration
   - Đảm bảo CORS được cấu hình đúng

## 📝 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Support

Nếu có vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ qua email. 