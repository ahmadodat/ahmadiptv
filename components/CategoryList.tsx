import React from 'react';
import { Category } from '../types';
import Icon from './Icon';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onBack: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategory, onSelectCategory, onBack }) => {
  return (
    <ul className="p-2 space-y-1 mt-2">
      <li>
        <button
          onClick={onBack}
          className="w-full flex items-center gap-4 py-3 px-4 rounded-lg text-left transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#8A1538] relative group text-gray-300 hover:bg-gray-800/40 hover:text-white"
        >
          <Icon name="back" className="w-6 h-6 flex-shrink-0" />
          <span className="font-semibold hidden md:inline md:text-lg">Dashboard</span>
        </button>
      </li>
      <hr className="border-gray-800/50 my-2" />
      {categories.map((category) => {
        const isSelected = selectedCategory === category.name;
        return (
          <li key={category.name}>
            <button
              onClick={() => onSelectCategory(category.name)}
              className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg text-left transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E1E1E] focus:ring-[#8A1538] relative group ${
                isSelected
                  ? 'bg-[#8A1538] text-white font-bold'
                  : 'text-gray-400 hover:bg-gray-800/40 hover:text-white'
              }`}
            >
              <Icon name={category.icon} className={`w-6 h-6 flex-shrink-0 ${isSelected ? 'text-white' : ''}`} />
              <span className="font-semibold hidden md:inline md:text-lg">{category.name}</span>
            </button>
          </li>
        )
      })}
    </ul>
  );
};

export default CategoryList;