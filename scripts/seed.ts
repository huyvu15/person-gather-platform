import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.note.deleteMany()

  // Create sample notes
  const notes = [
    {
      title: 'Ghi chú về chuyến du lịch Đà Nẵng',
      content: 'Chuyến du lịch đến Đà Nẵng thật tuyệt vời. Cần lưu lại những địa điểm đã ghé thăm: Bãi biển Mỹ Khê, Bán đảo Sơn Trà, Cầu Rồng, và các món ăn đặc sản như bánh mì Phượng, bún chả cá.',
      category: 'travel',
      tags: ['travel', 'vacation', 'danang', 'vietnam'],
      color: 'blue',
      isPinned: true,
      isArchived: false
    },
    {
      title: 'Công việc tuần này',
      content: 'Cần hoàn thành dự án A trước thứ 6, họp với team B vào thứ 4 lúc 2h chiều, chuẩn bị presentation cho client C vào thứ 5. Đừng quên gửi báo cáo hàng tuần.',
      category: 'work',
      tags: ['work', 'important', 'deadline', 'meeting'],
      color: 'green',
      isPinned: true,
      isArchived: false
    },
    {
      title: 'Ý tưởng cho dự án mới',
      content: 'Có thể tạo một ứng dụng quản lý ảnh với AI để tự động phân loại và tag ảnh. Tính năng chính: upload ảnh, AI tagging, album organization, sharing, và backup tự động.',
      category: 'ideas',
      tags: ['ideas', 'project', 'ai', 'photos', 'app'],
      color: 'purple',
      isPinned: false,
      isArchived: false
    },
    {
      title: 'Danh sách mua sắm',
      content: 'Cần mua: sữa, bánh mì, trứng, rau cải, thịt gà, dầu ăn, muối, đường, và một số đồ gia dụng khác cho tuần này.',
      category: 'personal',
      tags: ['shopping', 'groceries', 'personal'],
      color: 'orange',
      isPinned: false,
      isArchived: false
    },
    {
      title: 'Todo list cho tuần',
      content: '1. Hoàn thành báo cáo dự án\n2. Gọi điện cho khách hàng\n3. Dọn dẹp nhà cửa\n4. Đọc sách mới\n5. Tập thể dục 3 lần/tuần',
      category: 'todo',
      tags: ['todo', 'tasks', 'weekly'],
      color: 'yellow',
      isPinned: false,
      isArchived: false
    },
    {
      title: 'Công thức nấu ăn',
      content: 'Phở bò: Nguyên liệu: bánh phở, thịt bò, nước dùng, rau thơm, gia vị. Cách làm: nấu nước dùng với xương bò, luộc bánh phở, thái thịt bò, bày rau thơm và thưởng thức.',
      category: 'personal',
      tags: ['cooking', 'recipe', 'pho', 'vietnamese'],
      color: 'pink',
      isPinned: false,
      isArchived: false
    }
  ]

  for (const note of notes) {
    await prisma.note.create({
      data: note
    })
  }

  console.log('✅ Sample notes created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 