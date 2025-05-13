import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import ClothingItems from '@/components/ClothingItems';
import TwoDViewer from '@/components/TwoDViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Realistic clothing items for the application
const clothingItems = [
  {
    id: 1,
    name: 'Mavi V-Yaka T-Shirt',
    category: 'tops',
    image: '/images/clothing/blue-vneck-tshirt.png',
    overlay: '/images/overlays/blue-vneck-tshirt-overlay.png',
    brand: 'LCWaikiki',
    price: '199,90 TL',
  },
  {
    id: 2,
    name: 'Siyah Deri Ceket',
    category: 'outerwear',
    image: '/images/clothing/black-leather-jacket.png',
    overlay: '/images/overlays/black-leather-jacket-overlay.png',
    brand: 'Koton',
    price: '899,90 TL',
  },
  {
    id: 3,
    name: 'Slim Fit Kot Pantolon',
    category: 'bottoms',
    image: '/images/clothing/slim-fit-jeans.png',
    overlay: '/images/overlays/slim-fit-jeans-overlay.png',
    brand: 'Mavi',
    price: '549,90 TL',
  },
  {
    id: 4,
    name: 'Çiçek Desenli Yazlık Elbise',
    category: 'dresses',
    image: '/images/clothing/floral-summer-dress.png',
    overlay: '/images/overlays/floral-summer-dress-overlay.png',
    brand: 'DeFacto',
    price: '399,90 TL',
  },
  {
    id: 5,
    name: 'Beyaz Gömlek',
    category: 'tops',
    image: '/images/clothing/white-shirt.png',
    overlay: '/images/overlays/white-shirt-overlay.png',
    brand: 'Pierre Cardin',
    price: '329,90 TL',
  },
  {
    id: 6,
    name: 'Kırmızı Kazak',
    category: 'tops',
    image: '/images/clothing/red-sweater.png',
    overlay: '/images/overlays/red-sweater-overlay.png',
    brand: 'Beymen',
    price: '699,90 TL',
  },
];

export default function TryOn2D() {
  const router = useRouter();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  // Get user image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('userImage');
    if (savedImage) {
      setUserImage(savedImage);
    } else {
      // Use placeholder for demo purposes
      setUserImage('/images/demo/default-user.jpg');
    }
  }, [router]);

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredItems = activeCategory === 'all' 
    ? clothingItems 
    : clothingItems.filter(item => item.category === activeCategory);

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'tops', name: 'Üst Giyim' },
    { id: 'outerwear', name: 'Dış Giyim' },
    { id: 'bottoms', name: 'Alt Giyim' },
    { id: 'dresses', name: 'Elbiseler' },
  ];

  return (
    <Layout>
      <div className="container-app py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">2D Sanal Prova</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TwoDViewer 
              userImage={userImage} 
              selectedItems={selectedItems.map(id => 
                clothingItems.find(item => item.id === id)!
              )} 
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Kıyafetler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
              
              <ClothingItems 
                items={filteredItems}
                selectedItems={selectedItems}
                onToggleItem={toggleItemSelection}
              />
              
              <div className="mt-8 pt-4 border-t">
                <h3 className="text-lg font-medium mb-3">Nasıl Çalışır?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Sağdaki panelden deneme istediğiniz kıyafetleri seçin</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Kıyafetler otomatik olarak fotoğrafınıza yerleştirilir</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>Farklı kombinasyonları deneyin ve size en uygun olanı bulun</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 