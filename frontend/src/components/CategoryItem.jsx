import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation between routes in React Router

// CategoryItem component: Renders an individual category card with an image, title, and link
const CategoryItem = ({ category }) => {
  return (
    // Outer container: Defines a relative container for layout and styling
    <div className="relative overflow-hidden h-72 w-full rounded-lg group">
      {/* Link: Wraps the entire card, navigates to the category's page */}
      <Link to={"/category" + category.href}>
        {/* Full container inside the link */}
        <div className="w-full h-full cursor-pointer">
          {/* Gradient overlay: Creates a gradient effect over the image */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10" />

          {/* Category image */}
          <img
            src={category.imageUrl} // Dynamically loads the image URL from the category prop
            alt={category.name} // Accessibility: Provides a descriptive alt text
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            // Styling: Makes the image fill the container, animates scaling on hover
            loading="lazy" // Optimizes loading by deferring image loading until needed
          />

          {/* Text container: Positioned at the bottom of the card */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            {/* Category name/title */}
            <h3 className="text-white text-2xl font-bold mb-2">
              {category.name} {/* Dynamically displays the category name */}
            </h3>
            {/* Subheading or call-to-action text */}
            <p className="text-gray-200 text-sm">Explore {category.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItem; // Export the component for use in other parts of the application
