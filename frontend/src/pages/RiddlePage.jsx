import React, { useState, useEffect } from 'react';
import { riddles } from '../../../data/riddles/riddles';

const RiddlePage = () => {
  const [data, setData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    setData(riddles);
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(riddles.map(item => item.category))];

  // Group data by category for display
  const groupedData = {};
  categories.forEach(category => {
    if (category !== 'all') {
      groupedData[category] = data.filter(item => item.category === category);
    }
  });

  // Card component for mobile view
  const RiddleCard = ({ item }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-3">
      <div className="bg-primary px-3 py-2 flex justify-between items-center">
        <h3 className="font-medium text-gray-900">EP{item.episode}</h3>
      </div>
      <div className="px-3 py-3 space-y-3">
        <div>
          <div className="text-xs font-medium text-gray-500 mb-1">題目</div>
          <div className="text-sm text-gray-900">{item.question}</div>
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500 mb-1">答案</div>
          <div className="text-sm text-gray-900">{item.answer}</div>
        </div>
      </div>
    </div>
  );

  // Table component for desktop view
  const RiddleTable = ({ categoryItems, categoryName }) => (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-secondary-dark">{categoryName}</h2>
      <div className="overflow-hidden rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 sm:w-24">
                集數
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                題目
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 sm:w-60">
                答案
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categoryItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  EP{item.episode}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-500">
                  {item.question}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-500">
                  {item.answer}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 h-full overflow-y-auto">
      {/* Category Tabs - Already responsive with flex-wrap */}
      <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
              activeCategory === category
                ? 'bg-secondary text-white'
                : 'bg-secondary-light text-secondary-dark hover:bg-secondary hover:text-primary-light'
            }`}
          >
            {category === 'all' ? '全部' : category}
          </button>
        ))}
      </div>

      {/* Content - Desktop View */}
      <div className="hidden md:block">
        {activeCategory === 'all' ? (
          Object.keys(groupedData).map(category => (
            <RiddleTable 
              key={category} 
              categoryItems={groupedData[category]} 
              categoryName={category} 
            />
          ))
        ) : (
          <RiddleTable 
            categoryItems={groupedData[activeCategory]} 
            categoryName={activeCategory} 
          />
        )}
      </div>

      {/* Content - Mobile View */}
      <div className="md:hidden">
        {activeCategory === 'all' ? (
          Object.keys(groupedData).map(category => (
            <div key={category} className="mb-6">
              <h2 className="text-lg font-bold mb-3 text-secondary-dark">{category}</h2>
              <div className="space-y-2">
                {groupedData[category].map(item => (
                  <RiddleCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-secondary-dark">{activeCategory}</h2>
            <div className="space-y-2">
              {groupedData[activeCategory].map(item => (
                <RiddleCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiddlePage;
