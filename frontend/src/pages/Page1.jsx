import React, { useState, useEffect } from 'react';
import { riddles } from '../../../data/riddles/riddles';

const Page1 = () => {
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

  return (
    <div className="w-full max-w-7xl mx-auto p-4 h-full overflow-y-auto">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeCategory === category
                ? 'bg-secondary text-white'
                : 'bg-secondary-light text-secondary-dark hover:bg-secondary hover:text-primary-light'
            }`}
          >
            {category === 'all' ? '全部' : category}
          </button>
        ))}
      </div>

      {/* Table */}
      {activeCategory === 'all' ? (
        Object.keys(groupedData).map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-secondary-dark">{category}</h2>
            <div className="overflow-hidden rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      集數
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      題目
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-60">
                      答案
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {groupedData[category].map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        EP{item.episode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.question}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.answer}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-secondary-dark">{activeCategory}</h2>
          <div className="overflow-hidden rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    集數
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    題目
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-60">
                    答案
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groupedData[activeCategory].map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      EP{item.episode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.question}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.answer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page1;
