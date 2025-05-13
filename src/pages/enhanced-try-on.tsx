import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, User2 } from 'lucide-react';
import Webcam from 'react-webcam';
import EnhancedThreeDViewer from '@/components/EnhancedThreeDViewer';
import ClothingSelector, { ClothingItem, ClothingCategory } from '@/components/ClothingSelector';
import SizeRecommendation from '@/components/SizeRecommendation';
import { generateAvatar } from '@/services/avatarService';
import { estimateBodyMeasurements, BodyMeasurements, SizeRecommendation as SizeRecommendationType } from '@/services/sizeEstimationService';
import { getBatchSizeRecommendations } from '@/services/sizeEstimationService';

// Sample clothing items (in a real app, these would come from an API or database)
const SAMPLE_CLOTHING_ITEMS: ClothingItem[] = [
  {
    id: 'upper-1',
    name: 'Mavi Tişört',
    category: 'upper',
    imageUrl: 'https://example.com/images/tshirt-blue.jpg',
    modelUrl: 'https://example.com/models/tshirt-blue.glb',
    brand: 'Koton',
    price: '199',
    description: 'Pamuklu mavi tişört'
  },
  {
    id: 'upper-2',
    name: 'Beyaz Gömlek',
    category: 'upper',
    imageUrl: 'https://example.com/images/shirt-white.jpg',
    modelUrl: 'https://example.com/models/shirt-white.glb',
    brand: 'Mavi',
    price: '399',
    description: '100% pamuk beyaz gömlek'
  },
  {
    id: 'lower-1',
    name: 'Siyah Pantolon',
    category: 'lower',
    imageUrl: 'https://example.com/images/pants-black.jpg',
    modelUrl: 'https://example.com/models/pants-black.glb',
    brand: 'LCW',
    price: '349',
    description: 'Rahat kesim siyah pantolon'
  },
  {
    id: 'shoes-1',
    name: 'Spor Ayakkabı',
    category: 'shoes',
    imageUrl: 'https://example.com/images/sneakers.jpg',
    modelUrl: 'https://example.com/models/sneakers.glb',
    brand: 'Nike',
    price: '1299',
    description: 'Günlük spor ayakkabı'
  },
  {
    id: 'full-1',
    name: 'Takım Elbise',
    category: 'full',
    imageUrl: 'https://example.com/images/suit.jpg',
    modelUrl: 'https://example.com/models/suit.glb',
    brand: 'Kiğılı',
    price: '2899',
    description: 'Slim fit takım elbise'
  }
];

// Enhanced Try-On page component
const EnhancedTryOnPage: React.FC = () => {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  
  // State variables
  const [userImage, setUserImage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedItems, setSelectedItems] = useState<Record<ClothingCategory, ClothingItem | null>>({
    upper: null,
    lower: null,
    shoes: null,
    full: null
  });
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurements | null>(null);
  const [sizeRecommendations, setSizeRecommendations] = useState<{[productId: string]: SizeRecommendationType}>({});
  const [activeView, setActiveView] = useState<'2d' | '3d'>('3d');
  const [animationMode, setAnimationMode] = useState<'idle' | 'walking' | 'turning'>('idle');
  
  // Get flattened array of selected clothing items
  const selectedItemsArray = Object.values(selectedItems).filter(Boolean) as ClothingItem[];
  
  // Handle webcam capture
  const handleCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setUserImage(imageSrc);
        setIsCapturing(false);
      }
    }, 500);
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle avatar generation
  const handleGenerateAvatar = async () => {
    if (!userImage) return;
    
    setIsGeneratingAvatar(true);
    setGenerationProgress(0);
    
    try {
      // Simulate progress (in a real app, this would come from the API)
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);
      
      // Convert base64 image to File object
      const response = await fetch(userImage);
      const blob = await response.blob();
      const file = new File([blob], 'user-image.jpg', { type: 'image/jpeg' });
      
      // Generate avatar
      const avatarUrl = await generateAvatar(file);
      setAvatarUrl(avatarUrl);
      
      // Estimate body measurements
      const measurements = await estimateBodyMeasurements(file);
      setBodyMeasurements(measurements);
      
      // Get size recommendations for sample clothing items
      const recommendations = await getBatchSizeRecommendations(
        measurements,
        SAMPLE_CLOTHING_ITEMS.map(item => item.id)
      );
      setSizeRecommendations(recommendations);
      
      // Complete progress
      clearInterval(progressInterval);
      setGenerationProgress(100);
    } catch (error) {
      console.error('Error generating avatar:', error);
      // Handle error
    } finally {
      setTimeout(() => {
        setIsGeneratingAvatar(false);
      }, 500); // Small delay to show 100% progress
    }
  };
  
  // Handle selection change
  const handleSelectionChange = (newSelection: Record<ClothingCategory, ClothingItem | null>) => {
    setSelectedItems(newSelection);
  };
  
  return (
    <>
      <Head>
        <title>Üzerimde - Gelişmiş Sanal Prova</title>
        <meta name="description" content="Üzerimde ile gelişmiş sanal kıyafet prova deneyimi" />
      </Head>
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Üzerimde</h1>
          <p className="text-gray-500 text-center max-w-2xl">
            Gelişmiş sanal kıyafet prova deneyimi ile kıyafetleri 3 boyutlu olarak üzerinizde görün,
            beden önerilerini alın ve alışverişinizi kolayca tamamlayın.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Image capture and body measurement */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User2 className="h-5 w-5" />
                  Fotoğraf Yükle
                </CardTitle>
                <CardDescription>
                  Fotoğrafınızla 3D avatarınızı oluşturun
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userImage ? (
                  <div className="space-y-4">
                    <div className="aspect-[3/4] w-full rounded-md overflow-hidden bg-muted">
                      <img 
                        src={userImage} 
                        alt="Kullanıcı Fotoğrafı" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" onClick={() => setUserImage(null)}>
                        Farklı Fotoğraf Seç
                      </Button>
                      <Button 
                        onClick={handleGenerateAvatar}
                        disabled={isGeneratingAvatar}
                      >
                        {isGeneratingAvatar ? 'Avatar Oluşturuluyor...' : '3D Avatar Oluştur'}
                      </Button>
                      
                      {isGeneratingAvatar && (
                        <div className="mt-2">
                          <Progress value={generationProgress} className="mb-1" />
                          <p className="text-xs text-center text-gray-500">
                            {generationProgress < 100 ? 'İşleniyor...' : 'Tamamlandı!'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Tabs defaultValue="camera">
                      <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="camera">Kamera</TabsTrigger>
                        <TabsTrigger value="upload">Dosya Yükle</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="camera" className="space-y-4">
                        <div className="aspect-[3/4] w-full rounded-md overflow-hidden bg-muted">
                          <Webcam
                            ref={webcamRef}
                            mirrored
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: 'user' }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button 
                          className="w-full"
                          onClick={handleCapture}
                          disabled={isCapturing}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          {isCapturing ? 'Fotoğraf Çekiliyor...' : 'Fotoğraf Çek'}
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="upload" className="space-y-4">
                        <div className="aspect-[3/4] w-full flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50">
                          <div className="text-center p-4">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">
                              Fotoğrafınızı yüklemek için tıklayın veya sürükleyin
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={handleFileUpload}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          Desteklenen formatlar: JPG, PNG, HEIC
                        </p>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <ClothingSelector
              items={SAMPLE_CLOTHING_ITEMS}
              onSelectionChange={handleSelectionChange}
            />
          </div>
          
          {/* Center and right columns - 3D viewer and size recommendations */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Sanal Prova</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant={activeView === '3d' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveView('3d')}
                    >
                      3D Görünüm
                    </Button>
                    <Button 
                      variant={activeView === '2d' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setActiveView('2d')}
                    >
                      2D Görünüm
                    </Button>
                  </div>
                </div>
                <Separator className="my-1" />
              </CardHeader>
              <CardContent className="p-0">
                {activeView === '3d' ? (
                  <EnhancedThreeDViewer
                    avatarUrl={avatarUrl}
                    selectedItems={selectedItemsArray}
                    isLoading={isGeneratingAvatar}
                    animationMode={animationMode}
                    enableControls={true}
                  />
                ) : (
                  <div className="p-4 h-[600px] flex items-center justify-center">
                    <p className="text-gray-500">
                      {avatarUrl 
                        ? '2D görünüm yakında eklenecek'
                        : 'Lütfen önce 3D avatarınızı oluşturun'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <SizeRecommendation
              recommendations={sizeRecommendations}
              selectedItems={selectedItemsArray}
              bodyMeasurements={bodyMeasurements || undefined}
              showMeasurements={true}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default EnhancedTryOnPage; 