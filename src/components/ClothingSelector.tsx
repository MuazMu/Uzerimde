import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export type ClothingCategory = 'upper' | 'lower' | 'shoes' | 'full';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  imageUrl: string;
  modelUrl: string;
  brand?: string;
  price?: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
}

interface ClothingSelectorProps {
  items: ClothingItem[];
  onSelectionChange: (selectedItems: Record<ClothingCategory, ClothingItem | null>) => void;
  initialSelection?: Record<ClothingCategory, ClothingItem | null>;
}

const ClothingSelector: React.FC<ClothingSelectorProps> = ({ 
  items, 
  onSelectionChange,
  initialSelection
}) => {
  const [selectedItems, setSelectedItems] = useState<Record<ClothingCategory, ClothingItem | null>>({
    upper: null,
    lower: null,
    shoes: null,
    full: null,
    ...initialSelection
  });
  
  const [activeTab, setActiveTab] = useState<ClothingCategory>('upper');
  
  // Filter items by category
  const categorizedItems = {
    upper: items.filter(item => item.category === 'upper'),
    lower: items.filter(item => item.category === 'lower'),
    shoes: items.filter(item => item.category === 'shoes'),
    full: items.filter(item => item.category === 'full'),
  };
  
  // Handle item selection
  const handleSelect = (item: ClothingItem) => {
    // Create a copy of the current selection
    const newSelection = { ...selectedItems };
    
    if (item.category === 'full') {
      // If selecting a full outfit, clear individual items
      newSelection.upper = null;
      newSelection.lower = null;
      newSelection.shoes = null;
      newSelection.full = item;
    } else {
      // If selecting an individual item, clear the full outfit
      newSelection.full = null;
      newSelection[item.category] = item;
    }
    
    setSelectedItems(newSelection);
  };
  
  // Handle item removal
  const handleRemove = (category: ClothingCategory) => {
    const newSelection = { ...selectedItems };
    newSelection[category] = null;
    setSelectedItems(newSelection);
  };
  
  // Notify parent component when selection changes
  useEffect(() => {
    onSelectionChange(selectedItems);
  }, [selectedItems, onSelectionChange]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Kıyafet Seçimi</h2>
      
      {/* Selected items summary */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(selectedItems).map(([category, item]) => 
          item && (
            <Badge 
              key={item.id} 
              variant="secondary"
              className="flex items-center gap-1 py-1.5 px-3"
            >
              <span className="mr-1 capitalize">{category === 'upper' ? 'Üst' : category === 'lower' ? 'Alt' : category === 'shoes' ? 'Ayakkabı' : 'Tam Set'}</span>
              <span className="font-semibold">{item.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1" 
                onClick={() => handleRemove(category as ClothingCategory)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )
        )}
        
        {Object.values(selectedItems).every(item => item === null) && (
          <p className="text-sm text-gray-500">Henüz bir kıyafet seçilmedi.</p>
        )}
      </div>
      
      {/* Clothing category tabs */}
      <Tabs defaultValue="upper" value={activeTab} onValueChange={(value) => setActiveTab(value as ClothingCategory)}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="upper">Üst Giyim</TabsTrigger>
          <TabsTrigger value="lower">Alt Giyim</TabsTrigger>
          <TabsTrigger value="shoes">Ayakkabı</TabsTrigger>
          <TabsTrigger value="full">Tam Set</TabsTrigger>
        </TabsList>
        
        {/* Tab contents with clothing items */}
        {Object.entries(categorizedItems).map(([category, categoryItems]) => (
          <TabsContent key={category} value={category} className="mt-4">
            <ScrollArea className="h-96">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categoryItems.map(item => (
                  <Card 
                    key={item.id}
                    className={`cursor-pointer transition-all hover:scale-105 ${
                      selectedItems[item.category as ClothingCategory]?.id === item.id 
                        ? 'ring-2 ring-primary' 
                        : ''
                    }`}
                    onClick={() => handleSelect(item)}
                  >
                    <CardContent className="p-2">
                      <div className="aspect-square relative overflow-hidden rounded-md mb-2">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="object-cover w-full h-full"
                        />
                        {item.brand && (
                          <Badge className="absolute top-2 left-2 bg-white/70 text-black">
                            {item.brand}
                          </Badge>
                        )}
                        {item.price && (
                          <Badge className="absolute bottom-2 right-2 bg-black/70">
                            {item.price} ₺
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm font-medium truncate">{item.name}</div>
                      {item.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {categoryItems.length === 0 && (
                  <div className="col-span-full py-8 text-center text-gray-500">
                    Bu kategoride ürün bulunamadı.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ClothingSelector; 