import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import ClothingItems from '@/components/ClothingItems';
import ThreeDViewer from '@/components/ThreeDViewer';
import AvatarCreator from '@/components/AvatarCreator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Realistic 3D clothing items
const clothingItems3D = [
  {
    id: 1,
    name: 'Mavi V-Yaka T-Shirt',
    category: 'tops',
    image: '/images/clothing/blue-vneck-tshirt.png',
    modelUrl: '/models/clothing/blue-vneck-tshirt.glb',
    brand: 'LCWaikiki',
    price: '199,90 TL',
    textureMaps: {
      normal: '/models/textures/blue-vneck-tshirt-normal.jpg',
      roughness: '/models/textures/blue-vneck-tshirt-roughness.jpg',
    }
  },
  {
    id: 2,
    name: 'Siyah Deri Ceket',
    category: 'outerwear',
    image: '/images/clothing/black-leather-jacket.png',
    modelUrl: '/models/clothing/black-leather-jacket.glb',
    brand: 'Koton',
    price: '899,90 TL',
    textureMaps: {
      normal: '/models/textures/black-leather-jacket-normal.jpg',
      roughness: '/models/textures/black-leather-jacket-roughness.jpg',
    }
  },
  {
    id: 3,
    name: 'Slim Fit Kot Pantolon',
    category: 'bottoms',
    image: '/images/clothing/slim-fit-jeans.png',
    modelUrl: '/models/clothing/slim-fit-jeans.glb',
    brand: 'Mavi',
    price: '549,90 TL',
    textureMaps: {
      normal: '/models/textures/slim-fit-jeans-normal.jpg',
      roughness: '/models/textures/slim-fit-jeans-roughness.jpg',
    }
  },
  {
    id: 4,
    name: 'Çiçek Desenli Yazlık Elbise',
    category: 'dresses',
    image: '/images/clothing/floral-summer-dress.png',
    modelUrl: '/models/clothing/floral-summer-dress.glb',
    brand: 'DeFacto',
    price: '399,90 TL',
    textureMaps: {
      normal: '/models/textures/floral-summer-dress-normal.jpg',
      roughness: '/models/textures/floral-summer-dress-roughness.jpg',
    }
  },
  {
    id: 5,
    name: 'Beyaz Gömlek',
    category: 'tops',
    image: '/images/clothing/white-shirt.png',
    modelUrl: '/models/clothing/white-shirt.glb',
    brand: 'Pierre Cardin',
    price: '329,90 TL',
    textureMaps: {
      normal: '/models/textures/white-shirt-normal.jpg',
      roughness: '/models/textures/white-shirt-roughness.jpg',
    }
  },
  {
    id: 6,
    name: 'Kırmızı Kazak',
    category: 'tops',
    image: '/images/clothing/red-sweater.png',
    modelUrl: '/models/clothing/red-sweater.glb',
    brand: 'Beymen',
    price: '699,90 TL',
    textureMaps: {
      normal: '/models/textures/red-sweater-normal.jpg',
      roughness: '/models/textures/red-sweater-roughness.jpg',
    }
  },
];

export default function TryOn3D() {
  const router = useRouter();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [animationMode, setAnimationMode] = useState<'idle' | 'walking' | 'turning'>('idle');
  const [activeTab, setActiveTab] = useState('avatar');

  // Get user image from localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('userImage');
    if (savedImage) {
      setUserImage(savedImage);
    } else {
      // Use demo image for testing
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

  const handleAvatarCreated = (url: string) => {
    setAvatarUrl(url);
    setLoading(false);
    setActiveTab('try-on');
  };

  const filteredItems = activeCategory === 'all' 
    ? clothingItems3D 
    : clothingItems3D.filter(item => item.category === activeCategory);

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
        <h1 className="text-3xl font-bold mb-8 text-center">3D Sanal Prova</h1>
        
        <Tabs defaultValue="avatar" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="avatar">Avatar Oluştur</TabsTrigger>
            <TabsTrigger value="try-on" disabled={!avatarUrl}>Kıyafet Dene</TabsTrigger>
          </TabsList>
          
          <TabsContent value="avatar" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AvatarCreator 
                userImage={userImage}
                onAvatarCreated={handleAvatarCreated}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Nasıl Çalışır?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Üzerimde, fotoğrafınızdan 3D avatarınızı oluşturarak sanal olarak kıyafet denemenizi sağlar.
                  </p>
                  
                  <ol className="list-decimal list-inside text-muted-foreground space-y-2">
                    <li>Fotoğrafınızdan 3D avatar oluşturun</li>
                    <li>Katalogdan istediğiniz kıyafeti seçin</li>
                    <li>Kıyafetin üzerinizdeki görünümünü 360° izleyin</li>
                    <li>İstediğiniz animasyonları deneyin</li>
                  </ol>
                  
                  <p className="text-sm text-muted-foreground italic">
                    Not: Daha doğru sonuçlar için yüzünüzün net göründüğü bir fotoğraf kullanın.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="try-on" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ThreeDViewer 
                  avatarUrl={avatarUrl}
                  selectedItems={selectedItems.map(id => 
                    clothingItems3D.find(item => item.id === id)!
                  )}
                  isLoading={loading}
                  animationMode={animationMode}
                />
                
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Avatar Kontrolleri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={animationMode === 'idle' ? 'default' : 'outline'}
                        onClick={() => setAnimationMode('idle')}
                      >
                        Duruş
                      </Button>
                      <Button
                        variant={animationMode === 'walking' ? 'default' : 'outline'}
                        onClick={() => setAnimationMode('walking')}
                      >
                        Yürüyüş
                      </Button>
                      <Button
                        variant={animationMode === 'turning' ? 'default' : 'outline'}
                        onClick={() => setAnimationMode('turning')}
                      >
                        Dönüş
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Avatarı döndürmek için sürükleyin. Yakınlaşmak ve uzaklaşmak için fare tekerleğini kullanın.
                    </p>
                  </CardContent>
                </Card>
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
                  
                  {userImage && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-lg font-medium mb-2">Fotoğrafınız</h3>
                      <div className="aspect-[3/4] rounded-md overflow-hidden bg-muted">
                        <img 
                          src={userImage} 
                          alt="Fotoğrafınız" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
} 