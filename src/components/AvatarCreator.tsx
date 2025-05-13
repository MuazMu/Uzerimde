import React, { useState, useEffect } from 'react';
import { AvatarCreator as RPMAvatarCreator } from '@readyplayerme/react-avatar-creator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AvatarCreatorProps {
  onAvatarCreated: (avatarUrl: string) => void;
  userImage?: string | null;
}

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ onAvatarCreated, userImage }) => {
  const [showCreator, setShowCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real Ready Player Me subdomain for production
  const subdomain = 'uzerimde';

  const handleOnAvatarExported = (event: any) => {
    const url = event.data?.url;
    if (url) {
      setIsLoading(false);
      onAvatarCreated(url);
      setShowCreator(false);
    }
  };

  const handleCreateAvatar = () => {
    setIsLoading(true);
    setShowCreator(true);
  };

  useEffect(() => {
    window.addEventListener('message', handleOnAvatarExported);
    return () => {
      window.removeEventListener('message', handleOnAvatarExported);
    };
  }, []);

  return (
    <div className="w-full">
      {!showCreator ? (
        <Card>
          <CardHeader>
            <CardTitle>3D Avatar Oluştur</CardTitle>
            <CardDescription>
              Kendi 3D avatarınızı oluşturun ve kıyafetleri üzerinizde deneyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userImage && (
              <div className="mb-4 aspect-[3/4] rounded-md overflow-hidden bg-muted">
                <img 
                  src={userImage} 
                  alt="Yüklenen Fotoğraf" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <Button 
              onClick={handleCreateAvatar} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Yükleniyor...' : 'Avatar Oluştur'}
            </Button>
            
            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="w-full h-[600px] rounded-lg overflow-hidden border">
          <RPMAvatarCreator
            subdomain={subdomain}
            className="w-full h-full"
            config={{
              clearCache: true,
              bodyType: 'fullbody',
              quickStart: false,
              language: 'tr',
              segmentId: 'uzerimde-web-app',
              avatarRenderOptions: {
                background: { r: 255, g: 255, b: 255, a: 0 },
                cameraTarget: { x: 0, y: 0.8, z: 0 },
                cameraInitialDistance: 1.8,
                cameraFov: 45,
                cameraMinDistance: 0.5,
                cameraMaxDistance: 5,
                useHDRI: true,
                hdriPath: '/models/environments/studio_hdri.hdr',
                useBasicLighting: false,
              },
              userFeatures: {
                allowEditAvatar: true,
                allowAvatarFullAccess: true,
                allowExport: true,
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AvatarCreator; 