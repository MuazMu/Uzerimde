import React from 'react';

interface ClothingItem {
  id: number;
  name: string;
  category: string;
  image: string;
  overlay?: string;
  modelUrl?: string;
  brand?: string;
  price?: string;
}

interface ClothingItemsProps {
  items: ClothingItem[];
  selectedItems: number[];
  onToggleItem: (id: number) => void;
}

const ClothingItems: React.FC<ClothingItemsProps> = ({
  items,
  selectedItems,
  onToggleItem,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`border rounded-md overflow-hidden cursor-pointer transition-all ${
            selectedItems.includes(item.id)
              ? 'border-primary ring-2 ring-primary/30'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onToggleItem(item.id)}
        >
          <div className="aspect-square bg-gray-50 relative">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain"
            />
            {selectedItems.includes(item.id) && (
              <div className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="p-2">
            <h3 className="text-sm font-medium truncate">{item.name}</h3>
            {item.brand && (
              <div className="flex justify-between items-center mt-1 mb-1">
                <span className="text-xs text-gray-500">{item.brand}</span>
                {item.price && (
                  <span className="text-xs font-semibold text-primary">{item.price}</span>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 capitalize">{item.category}</p>
          </div>
        </div>
      ))}
      
      {items.length === 0 && (
        <div className="col-span-2 py-8 text-center text-gray-500">
          Bu kategoride ürün bulunamadı.
        </div>
      )}
    </div>
  );
};

export default ClothingItems; 