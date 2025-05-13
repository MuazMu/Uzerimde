import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClothingItem {
  id: number;
  name: string;
  category: string;
  image: string;
  overlay: string;
  brand?: string;
  price?: string;
}

interface TwoDViewerProps {
  userImage: string | null;
  selectedItems: ClothingItem[];
}

// Body landmark points for clothing positioning
interface BodyLandmarks {
  head: { x: number; y: number };
  neck: { x: number; y: number };
  shoulders: { left: { x: number; y: number }; right: { x: number; y: number } };
  chest: { x: number; y: number };
  waist: { x: number; y: number };
  hips: { x: number; y: number };
  knees: { left: { x: number; y: number }; right: { x: number; y: number } };
  ankles: { left: { x: number; y: number }; right: { x: number; y: number } };
}

const TwoDViewer: React.FC<TwoDViewerProps> = ({ userImage, selectedItems }) => {
  const [loading, setLoading] = useState(true);
  const [bodyLandmarks, setBodyLandmarks] = useState<BodyLandmarks | null>(null);
  const [positionedItems, setPositionedItems] = useState<Array<{
    item: ClothingItem;
    position: { x: number, y: number };
    scale: number;
    zIndex: number;
    rotation: number;
  }>>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Process image to detect body landmarks and position clothing
  useEffect(() => {
    if (userImage && imageRef.current) {
      const img = new Image();
      img.src = userImage;
      img.onload = async () => {
        setLoading(false);
        
        try {
          // In a production app, this would use an actual body detection model
          // like MediaPipe Pose or TensorFlow.js PoseNet
          await detectBodyLandmarks(img);
        } catch (error) {
          console.error('Error processing image:', error);
        }
      };
    }
  }, [userImage]);
  
  // Update clothing positioning when items or body landmarks change
  useEffect(() => {
    if (!loading && selectedItems.length > 0 && bodyLandmarks) {
      positionClothingItems();
    } else {
      setPositionedItems([]);
    }
  }, [selectedItems, loading, bodyLandmarks]);
  
  // Detect body landmarks using image analysis
  const detectBodyLandmarks = async (image: HTMLImageElement) => {
    // In a production app, this would use an ML model to detect actual body points
    // For this MVP, we'll use a proportional approach based on image dimensions
    
    const width = image.width;
    const height = image.height;
    
    // Calculate approximate body landmarks based on typical human proportions
    // These points would normally come from ML model detection
    const landmarks: BodyLandmarks = {
      head: { x: width * 0.5, y: height * 0.12 },
      neck: { x: width * 0.5, y: height * 0.18 },
      shoulders: {
        left: { x: width * 0.4, y: height * 0.22 },
        right: { x: width * 0.6, y: height * 0.22 }
      },
      chest: { x: width * 0.5, y: height * 0.3 },
      waist: { x: width * 0.5, y: height * 0.45 },
      hips: { x: width * 0.5, y: height * 0.55 },
      knees: {
        left: { x: width * 0.45, y: height * 0.75 },
        right: { x: width * 0.55, y: height * 0.75 }
      },
      ankles: {
        left: { x: width * 0.45, y: height * 0.95 },
        right: { x: width * 0.55, y: height * 0.95 }
      }
    };
    
    setBodyLandmarks(landmarks);
    return landmarks;
  };
  
  // Position clothing items based on their category and detected body landmarks
  const positionClothingItems = () => {
    if (!imageRef.current || !containerRef.current || !bodyLandmarks) return;
    
    const imgWidth = imageRef.current.clientWidth;
    const imgHeight = imageRef.current.clientHeight;
    
    // Calculate scaling factor between original image and displayed size
    const displayRatio = {
      x: imgWidth / (imageRef.current.naturalWidth || 1),
      y: imgHeight / (imageRef.current.naturalHeight || 1)
    };
    
    // Scale the landmarks to match the displayed image size
    const scaledLandmarks: BodyLandmarks = {
      head: { 
        x: bodyLandmarks.head.x * displayRatio.x, 
        y: bodyLandmarks.head.y * displayRatio.y 
      },
      neck: { 
        x: bodyLandmarks.neck.x * displayRatio.x, 
        y: bodyLandmarks.neck.y * displayRatio.y 
      },
      shoulders: {
        left: { 
          x: bodyLandmarks.shoulders.left.x * displayRatio.x, 
          y: bodyLandmarks.shoulders.left.y * displayRatio.y 
        },
        right: { 
          x: bodyLandmarks.shoulders.right.x * displayRatio.x, 
          y: bodyLandmarks.shoulders.right.y * displayRatio.y 
        }
      },
      chest: { 
        x: bodyLandmarks.chest.x * displayRatio.x, 
        y: bodyLandmarks.chest.y * displayRatio.y 
      },
      waist: { 
        x: bodyLandmarks.waist.x * displayRatio.x, 
        y: bodyLandmarks.waist.y * displayRatio.y 
      },
      hips: { 
        x: bodyLandmarks.hips.x * displayRatio.x, 
        y: bodyLandmarks.hips.y * displayRatio.y 
      },
      knees: {
        left: { 
          x: bodyLandmarks.knees.left.x * displayRatio.x, 
          y: bodyLandmarks.knees.left.y * displayRatio.y 
        },
        right: { 
          x: bodyLandmarks.knees.right.x * displayRatio.x, 
          y: bodyLandmarks.knees.right.y * displayRatio.y 
        }
      },
      ankles: {
        left: { 
          x: bodyLandmarks.ankles.left.x * displayRatio.x, 
          y: bodyLandmarks.ankles.left.y * displayRatio.y 
        },
        right: { 
          x: bodyLandmarks.ankles.right.x * displayRatio.x, 
          y: bodyLandmarks.ankles.right.y * displayRatio.y 
        }
      }
    };
    
    // Position each clothing item based on its category and the detected body landmarks
    const positioned = selectedItems.map((item, index) => {
      let position = { x: 0, y: 0 };
      let scale = 1;
      let zIndex = 10 + index;
      let rotation = 0; // In degrees
      
      // Position based on clothing category
      switch (item.category) {
        case 'tops':
          // Position tops around the chest area
          position = { 
            x: scaledLandmarks.chest.x, 
            y: scaledLandmarks.chest.y 
          };
          
          // Calculate scale based on shoulder width
          const shoulderWidth = Math.abs(
            scaledLandmarks.shoulders.right.x - scaledLandmarks.shoulders.left.x
          );
          scale = shoulderWidth / 150; // Assuming 150px is the reference width for the overlay
          
          zIndex = 20; // Tops go under outerwear but over other items
          break;
        
        case 'outerwear':
          // Position outerwear slightly larger than tops
          position = { 
            x: scaledLandmarks.chest.x, 
            y: scaledLandmarks.chest.y * 0.95 // Slightly higher than the chest
          };
          
          // Calculate scale based on shoulder width, but slightly larger
          const outerShoulderWidth = Math.abs(
            scaledLandmarks.shoulders.right.x - scaledLandmarks.shoulders.left.x
          ) * 1.2; // 20% wider
          scale = outerShoulderWidth / 150;
          
          zIndex = 30; // Outerwear is the topmost layer
          break;
        
        case 'bottoms':
          // Position bottoms between waist and knees
          position = { 
            x: scaledLandmarks.hips.x, 
            y: (scaledLandmarks.waist.y + scaledLandmarks.knees.left.y) / 2
          };
          
          // Calculate scale based on hip width
          const hipWidth = Math.abs(
            scaledLandmarks.knees.right.x - scaledLandmarks.knees.left.x
          ) * 1.2;
          scale = hipWidth / 120;
          
          zIndex = 15; // Under tops
          break;
        
        case 'dresses':
          // Dresses cover from shoulders to knees
          position = { 
            x: scaledLandmarks.chest.x, 
            y: (scaledLandmarks.shoulders.left.y + scaledLandmarks.knees.left.y) / 2
          };
          
          // Calculate scale based on body height and width
          const bodyHeight = scaledLandmarks.knees.left.y - scaledLandmarks.shoulders.left.y;
          const bodyWidth = Math.abs(
            scaledLandmarks.shoulders.right.x - scaledLandmarks.shoulders.left.x
          ) * 1.1;
          
          scale = Math.max(bodyHeight / 300, bodyWidth / 150);
          
          zIndex = 25; // Over tops but under outerwear
          break;
          
        default:
          position = { 
            x: scaledLandmarks.chest.x, 
            y: scaledLandmarks.chest.y
          };
      }
      
      return {
        item,
        position,
        scale,
        zIndex,
        rotation
      };
    });
    
    setPositionedItems(positioned);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>2D Önizleme</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-full">
          <div 
            ref={containerRef}
            className="relative flex-grow flex items-center justify-center bg-muted rounded-md overflow-hidden"
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}
            
            {userImage && (
              <div className="relative max-h-full">
                <img 
                  ref={imageRef}
                  src={userImage} 
                  alt="Kullanıcı" 
                  className="max-h-[70vh] object-contain"
                />
                
                {/* Overlay clothing items with improved positioning */}
                {positionedItems.map(({ item, position, scale, zIndex, rotation }) => (
                  <div 
                    key={item.id}
                    className="absolute pointer-events-none"
                    style={{
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                      zIndex
                    }}
                  >
                    <img 
                      src={item.overlay} 
                      alt={item.name} 
                      className="absolute object-contain"
                      style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                        maxWidth: 'none'
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {!userImage && !loading && (
              <div className="text-center p-8 text-muted-foreground">
                <p>Sanal prova başlatmak için lütfen bir fotoğraf yükleyin.</p>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-muted px-3 py-1 rounded-full text-sm"
                >
                  {item.name}
                </div>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">
              {selectedItems.length === 0
                ? "Kıyafetleri görmek için sağ panelden seçim yapın."
                : `${selectedItems.length} kıyafet seçildi.`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwoDViewer; 