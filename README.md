# MyGather - Ứng dụng quản lý ảnh kỷ niệm

Ứng dụng web hiện đại để quản lý và xem ảnh kỷ niệm với giao diện đẹp mắt và tính năng mạnh mẽ.

## 🚀 Tính năng

- **Quản lý ảnh theo user**: Mỗi user có folder riêng trên S3 để lưu trữ ảnh
- **Upload ảnh**: Upload ảnh vào folder riêng của user với authentication
- **Tìm kiếm & Lọc**: Tìm kiếm nhanh và bộ lọc thông minh theo user
- **Chế độ xem**: Grid và List view với tùy chỉnh
- **Zoom ảnh**: Xem chi tiết ảnh với zoom 1.5x
- **Slideshow băng chuyền**: Xem ảnh tự động với hiệu ứng trượt ngang
- **Giao diện đẹp**: Thiết kế hiện đại với glass morphism và gradient
- **Responsive**: Hoạt động tốt trên mọi thiết bị
- **User Authentication**: Hệ thống đăng nhập/đăng ký với database

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
npm install bcryptjs @types/bcryptjs
npx prisma db push --force-reset
npm list bcryptjs
npm install recharts
```

### 3. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục gốc:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=ap-southeast-1
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_S3_FOLDER_PATH=Pictures/

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/mygather"

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Chạy development server
```bash
npm run dev
```

Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Cấu trúc S3 cho User-Specific Folders

Ứng dụng sẽ tạo cấu trúc folder như sau trên S3:

```
Pictures/
├── users/
│   ├── user1_id/
│   │   ├── memories/
│   │   │   ├── image1.jpg
│   │   │   └── image2.png
│   │   ├── family/
│   │   │   └── family_photo.jpg
│   │   └── travel/
│   │       └── vacation.jpg
│   ├── user2_id/
│   │   ├── memories/
│   │   └── work/
│   └── ...
```

### AWS S3 Setup
1. Tạo AWS S3 bucket ở region `ap-southeast-1`
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

### IAM Policy cho S3
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name",
                "arn:aws:s3:::your-bucket-name/*"
            ]
        }
    ]
}
```

## 📁 Cấu trúc dự án

```
mygather/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication routes
│   │   ├── images/        # Image listing API
│   │   ├── folders/       # Folder listing API
│   │   └── upload/        # File upload API
│   ├── (dashboard)/       # Dashboard pages
│   └── login/             # Login page
├── components/            # React components
│   ├── MemoryCard.tsx    # Card hiển thị ảnh
│   ├── MemoryGrid.tsx    # Grid layout
│   ├── UploadModal.tsx   # Upload modal
│   └── ModernCarousel.tsx # Slideshow component
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utilities
│   ├── s3.ts            # AWS S3 integration
│   ├── auth.ts          # Authentication helpers
│   └── prisma.ts        # Database client
├── prisma/              # Database schema
│   └── schema.prisma    # Prisma schema
├── .env.example         # Template cho env variables
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```

## 🔐 User Authentication

Ứng dụng sử dụng hệ thống authentication với:

- **Database**: PostgreSQL với Prisma ORM
- **User Model**: ID, email, password (hashed), name, role, isActive
- **Context**: React Context để quản lý user state
- **API Routes**: Protected routes với user authentication

### Database Schema
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  avatar    String?
  role      String   @default("user")
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

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
AWS_S3_FOLDER_PATH=Pictures/
DATABASE_URL=your_database_url

# Optional
AWS_REGION=ap-southeast-1
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

4. **Authentication errors**
   - Kiểm tra database connection
   - Đảm bảo user đã đăng ký và active

5. **Upload fails**
   - Kiểm tra S3 permissions
   - Đảm bảo folder path được tạo đúng

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