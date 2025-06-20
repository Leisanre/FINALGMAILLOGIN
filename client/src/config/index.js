export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "romance", label: "Romance" },
      { id: "action", label: "Action" },
      { id: "kids", label: "Kids" },
      { id: "History", label: "Crime" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Type",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  },
  {
    label: "Genre",
    name: "genre",
    componentType: "select",
    options: [
      { id: "fiction", label: "Fiction" },
      { id: "non-fiction", label: "Non-Fiction" },
      { id: "romance", label: "Romance" },
      { id: "mystery", label: "Mystery" },
      { id: "sci-fi", label: "Sci-Fi" },
      { id: "fantasy", label: "Fantasy" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "about",
    label: "About",
    path: "/shop/about",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/shop/contact",
  },
  {
    id: "store",
    label: "Store",
    path: "/shop/store",
  },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
};

export const genreOptionsMap = {
  fiction: "Fiction",
  "non-fiction": "Non-Fiction",
  romance: "Romance",
  mystery: "Mystery",
  "sci-fi": "Sci-Fi",
  fantasy: "Fantasy",
  action: "Action",
  // Add any additional genres that might be created dynamically
  // These will automatically match the converted IDs from admin form
};

// Helper function to get genre display name by ID or name
export const getGenreDisplayName = (genreId, genreList = []) => {
  if (!genreId) return '';

  // First try to find by exact ID match in the dynamic list
  const foundByIdInList = genreList.find(item => item._id === genreId);
  if (foundByIdInList) return foundByIdInList.name;

  // Try to find by name in the dynamic list (case insensitive)
  const foundByNameInList = genreList.find(item =>
    item.name.toLowerCase() === genreId.toLowerCase()
  );
  if (foundByNameInList) return foundByNameInList.name;

  // Fallback to static map
  const staticResult = genreOptionsMap[genreId];
  if (staticResult) return staticResult;

  // If nothing found, capitalize the input as fallback
  return genreId.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const filterOptions = {
  category: [
    { id: "men", label: "Romance" },
    { id: "women", label: "Action" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Crime" },
    { id: "footwear", label: "History" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Zip Code",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your zip code",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
