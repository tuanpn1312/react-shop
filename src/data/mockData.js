// Mock data for development
export const mockCategories = [
  { id: 1, name: 'Áo' },
  { id: 2, name: 'Quần' },
  { id: 3, name: 'Giày' },
  { id: 4, name: 'Phụ kiện' }
];

export const mockProducts = [
  {
    id: 1,
    nameProduct: 'Áo thun nam cổ tròn',
    price: 299000,
    description: 'Áo thun nam chất liệu cotton mềm mại, thoáng mát',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTf0CPRmrWbdnsow2OTgNlv7zIjLz5gARaxg&s',
    category: { id: 1, name: 'Áo' },
    stock: 50
  },
  {
    id: 2,
    nameProduct: 'Áo sơ mi nữ',
    price: 450000,
    description: 'Áo sơ mi nữ thiết kế thanh lịch, phù hợp đi làm',
    imageUrl: 'https://product.hstatic.net/200000886795/product/-insidemen-dang-body-fit-ilt019bz__2__9636da81e26649a0a68f03c5cf8f80a5_1961be13a99442989d9a9ec9829ef8f0.jpg',
    category: { id: 1, name: 'Áo' },
    stock: 30
  },
  {
    id: 3,
    nameProduct: 'Quần jeans nam',
    price: 650000,
    description: 'Quần jeans nam form slim fit, chất liệu denim cao cấp',
    imageUrl: 'https://product.hstatic.net/1000340796/product/z5758993730474_0d4401e0072d39371079d21fc82bd8d3_d7d9c5bfc7104e2095346048ec104b45.jpg',
    category: { id: 2, name: 'Quần' },
    stock: 25
  },
  {
    id: 4,
    nameProduct: 'Quần váy nữ',
    price: 380000,
    description: 'Quần váy nữ thiết kế trẻ trung, năng động',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQZ6CyfT_Bly0nmuwVsZCnPhAC-1FAgRP3p7eg5vAZ9Ux2xO82woh29pzTxzcVnsXm_KkGRVHc7sb4-HoX64MvlhOXqldHEQNT2SrGxxzh6Xod9wSQ-7XSxhTm-nFN_ggYioNPrPPqngg&usqp=CAc',
    category: { id: 2, name: 'Quần' },
    stock: 40
  },
  {
    id: 5,
    nameProduct: 'Giày sneaker',
    price: 890000,
    description: 'Giày sneaker thể thao, phù hợp mọi hoạt động',
    imageUrl: 'https://via.placeholder.com/300x300?text=Giày+sneaker',
    category: { id: 3, name: 'Giày' },
    stock: 20
  },
  {
    id: 6,
    nameProduct: 'Giày cao gót',
    price: 750000,
    description: 'Giày cao gót nữ thanh lịch, phù hợp dự tiệc',
    imageUrl: 'https://via.placeholder.com/300x300?text=Giày+cao+gót',
    category: { id: 3, name: 'Giày' },
    stock: 15
  },
  {
    id: 7,
    nameProduct: 'Túi xách nữ',
    price: 520000,
    description: 'Túi xách nữ da thật, thiết kế sang trọng',
    imageUrl: 'https://via.placeholder.com/300x300?text=Túi+xách+nữ',
    category: { id: 4, name: 'Phụ kiện' },
    stock: 35
  },
  {
    id: 8,
    nameProduct: 'Đồng hồ nam',
    price: 1200000,
    description: 'Đồng hồ nam chính hãng, chống nước',
    imageUrl: 'https://via.placeholder.com/300x300?text=Đồng+hồ+nam',
    category: { id: 4, name: 'Phụ kiện' },
    stock: 10
  }
];