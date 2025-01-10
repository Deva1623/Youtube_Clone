import React from "react";

const FilterBar = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <section className=" flex justify-around bg-gray-100 shadow-md p-2 mt-52 md:mt-20  ">
  
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => setSelectedCategory(category)} 
          className={` p-2  text-sm md:font-lg md:px-4 md:py-2 rounded-lg font-semibold font-mono transition ${
            selectedCategory === category
              ? "bg-red-500 text-white"
              : "bg-gray-800 opacity-80 text-white hover:bg-black"
          }`}
        >
          {category}
        </button>
      ))}
    </section>
  );
};

export default FilterBar;
