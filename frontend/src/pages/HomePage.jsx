import React from "react";
import CategoryItem from "../components/CategoryItem.jsx";

const categories = [
  {
    href: "/jeans",
    name: "Jeans",
    imageUrl:
      "https://i.pinimg.com/originals/0d/a3/ce/0da3ce42bb345bb956365f82b40cd98d.jpg",
  },
  {
    href: "/t-shirts",
    name: "T-shirts",
    imageUrl:
      "https://th.bing.com/th/id/OIP.8d10izBcVWbcrPaQhcfRwQHaJ3?rs=1&pid=ImgDetMain",
  },
  {
    href: "/shoes",
    name: "Shoes",
    imageUrl:
      "https://th.bing.com/th/id/OIP.rMUB07XQeta-yb-uYcg6vQHaIw?rs=1&pid=ImgDetMain",
  },
  {
    href: "/glasses",
    name: "Glasses",
    imageUrl:
      "https://i.pinimg.com/originals/d2/bb/ae/d2bbaee75b971f7becd3b71ccca88d66.jpg",
  },
  {
    href: "/jackets",
    name: "Jackets",
    imageUrl:
      "https://th.bing.com/th/id/OIP.wfTVSOLUpgtH5JSfe7OueAHaG4?rs=1&pid=ImgDetMain",
  },
  {
    href: "/suits",
    name: "Suits",
    imageUrl:
      "https://img.mensxp.com/media/content/2023/Feb/iStock-1127767024_63edce9b49f76.jpeg",
  },
  {
    href: "/bags",
    name: "Bags",
    imageUrl:
      "https://th.bing.com/th/id/OIP.kalSOW4jME0yQH3H0xBeSQHaHK?rs=1&pid=ImgDetMain",
  },
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
        <h1 className="text-center text-2xl sm:text-4xl font-bold text-gray-600 mb-4">
          Shop Our Categories
        </h1>
        <p className="text-center text-xl text-gray-500 mb-12">
          Discover the latest trends in eco-friendly fashion
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-12">
          {categories.map((category) => (
            <CategoryItem key={category.name} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
