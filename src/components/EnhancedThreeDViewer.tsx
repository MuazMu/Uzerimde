import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  useAnimations, 
  Environment,
  PerspectiveCamera,
  ContactShadows,
  useProgress,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface TextureMaps {
  normal: string;
  roughness: string;
  diffuse?: string;
  metalness?: string;
}

interface ClothingItem {
  id: string;
  name: string;
  category: 'upper' | 'lower' | 'shoes' | 'full';
  imageUrl: string;
  modelUrl: string;
  brand?: string;
  price?: string;
  textureMaps?: TextureMaps;
}

interface EnhancedThreeDViewerProps {
  avatarUrl: string | null;
  selectedItems: ClothingItem[];
  isLoading: boolean;
  animationMode: 'idle' | 'walking' | 'turning';
  initialZoom?: number;
  initialRotation?: number;
  enableControls?: boolean;
}

// Loading indicator component
function LoadingIndicator() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-2 text-primary font-medium">{progress.toFixed(0)}% yükleniyor</p>
      </div>
    </Html>
  );
}

function EnhancedAvatar({ 
  url, 
  clothingItems,
  animationMode
}: { 
  url: string; 
  clothingItems: ClothingItem[];
  animationMode: 'idle' | 'walking' | 'turning';
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);
  const [clothingModels, setClothingModels] = useState<THREE.Object3D[]>([]);
  
  // Apply animation based on mode
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      // Reset all animations
      Object.values(actions).forEach(action => action?.stop());
      
      // Standard RPM animation names
      const animationMap = {
        idle: ['Idle', 'idle_breathing', 'idle', 'breathing'],
        walking: ['Walking', 'walk', 'walk_forward', 'strolling'],
        turning: ['Turning', 'turn', 'turn_90', 'rotate']
      };
      
      const preferredAnimations = animationMap[animationMode];
      
      // Try to find the best matching animation from preferred list
      let animationFound = false;
      for (const animName of preferredAnimations) {
        if (actions[animName]) {
          actions[animName].reset().play();
          animationFound = true;
          break;
        }
      }
      
      // Fallback if no matching animation found
      if (!animationFound) {
        // Find an animation that might be suitable
        const availableAnimations = Object.keys(actions);
        if (availableAnimations.length > 0) {
          // Try to find something that matches by searching for substrings
          const searchTerm = animationMode === 'idle' ? 'idle' : 
                           animationMode === 'walking' ? 'walk' : 'turn';
          
          const matchingAnim = availableAnimations.find(name => 
            name.toLowerCase().includes(searchTerm)
          );
          
          if (matchingAnim) {
            actions[matchingAnim]?.reset()?.play();
          } else {
            // Just play the first animation as last resort
            actions[availableAnimations[0]]?.reset()?.play();
          }
        }
      }
    }
  }, [actions, animationMode]);

  // Load clothing items
  useEffect(() => {
    async function loadClothingItems() {
      if (clothingItems.length > 0 && group.current) {
        // Remove previous clothing
        clothingModels.forEach((model) => {
          group.current?.remove(model);
        });
        
        const newModels: THREE.Object3D[] = [];
        
        // Load clothing items
        for (const item of clothingItems) {
          try {
            // Type assertion to handle TypeScript error
            const gltf = await useGLTF.preload(item.modelUrl) as any;
            
            if (!gltf || !gltf.scene) {
              console.error(`Failed to load model scene: ${item.modelUrl}`);
              continue;
            }
            
            const clothingModel = gltf.scene.clone();
            
            // Apply textures if available
            if (item.textureMaps) {
              clothingModel.traverse((child: THREE.Object3D) => {
                if (child instanceof THREE.Mesh) {
                  const material = child.material as THREE.MeshStandardMaterial;
                  
                  // Apply diffuse map
                  if (item.textureMaps?.diffuse) {
                    const diffuseTexture = new THREE.TextureLoader().load(item.textureMaps.diffuse);
                    material.map = diffuseTexture;
                  }
                  
                  // Apply normal map
                  if (item.textureMaps?.normal) {
                    const normalTexture = new THREE.TextureLoader().load(item.textureMaps.normal);
                    material.normalMap = normalTexture;
                  }
                  
                  // Apply roughness map
                  if (item.textureMaps?.roughness) {
                    const roughnessTexture = new THREE.TextureLoader().load(item.textureMaps.roughness);
                    material.roughnessMap = roughnessTexture;
                  }
                  
                  // Apply metalness map
                  if (item.textureMaps?.metalness) {
                    const metalnessTexture = new THREE.TextureLoader().load(item.textureMaps.metalness);
                    material.metalnessMap = metalnessTexture;
                  }
                }
              });
            }
            
            // Apply bone bindings/weights from avatar to clothing
            // In a production app, this would require a more complex rigging solution
            
            clothingModel.name = `clothing_${item.id}`;
            group.current?.add(clothingModel);
            newModels.push(clothingModel);
          } catch (error) {
            console.error(`Error loading clothing model: ${item.modelUrl}`, error);
          }
        }
        
        setClothingModels(newModels);
      }
    }
    
    loadClothingItems();
  }, [clothingItems]);

  // Rotate slowly for turning animation
  useFrame(({ clock }) => {
    if (group.current && animationMode === 'turning') {
      group.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

// Enhanced scene with better lighting and environment
function EnhancedScene({ 
  avatarUrl, 
  clothingItems,
  animationMode,
  cameraPosition = [0, 1.5, 3]
}: { 
  avatarUrl: string | null; 
  clothingItems: ClothingItem[];
  animationMode: 'idle' | 'walking' | 'turning';
  cameraPosition?: [number, number, number];
}) {
  const { camera } = useThree();
  
  useEffect(() => {
    // Position camera for a good view of the avatar
    camera.position.set(...cameraPosition);
    camera.lookAt(0, 1, 0);
  }, [camera, cameraPosition]);

  if (!avatarUrl) return null;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-10, 10, 5]} intensity={0.5} castShadow />
      <spotLight 
        position={[-5, 5, 5]} 
        intensity={0.8} 
        angle={Math.PI / 6} 
        penumbra={0.2}
        castShadow
      />
      <EnhancedAvatar 
        url={avatarUrl} 
        clothingItems={clothingItems}
        animationMode={animationMode}
      />
      <Environment preset="studio" />
      <ContactShadows 
        opacity={0.5} 
        scale={10} 
        blur={2} 
        far={4} 
        resolution={256} 
        color="#000000" 
      />
      <OrbitControls 
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={5}
        autoRotate={animationMode === 'turning'}
        autoRotateSpeed={2}
        enableDamping={true}
        dampingFactor={0.1}
      />
    </>
  );
}

// Main enhanced 3D viewer component
const EnhancedThreeDViewer: React.FC<EnhancedThreeDViewerProps> = ({
  avatarUrl,
  selectedItems,
  isLoading,
  animationMode,
  initialZoom = 3,
  initialRotation = 0,
  enableControls = true
}) => {
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(initialRotation);
  const [autoRotate, setAutoRotate] = useState(animationMode === 'turning');
  const [currentAnimationMode, setCurrentAnimationMode] = useState(animationMode);
  
  // Sync animation mode with prop
  useEffect(() => {
    setCurrentAnimationMode(animationMode);
    setAutoRotate(animationMode === 'turning');
  }, [animationMode]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-[600px]">
      <h2 className="text-xl font-semibold mb-4">3D Önizleme</h2>
      
      <div className="relative h-[500px] w-full bg-gray-100 rounded-md overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            <p className="ml-3 text-gray-600">Avatar oluşturuluyor...</p>
          </div>
        ) : avatarUrl ? (
          <>
            <Canvas shadows>
              <PerspectiveCamera 
                makeDefault 
                position={[0, 1.5, zoom]} 
                fov={50} 
                near={0.1} 
                far={100}
              />
              <EnhancedScene 
                avatarUrl={avatarUrl} 
                clothingItems={selectedItems}
                animationMode={currentAnimationMode}
                cameraPosition={[Math.sin(rotation) * zoom, 1.5, Math.cos(rotation) * zoom]}
              />
              <LoadingIndicator />
            </Canvas>
            
            {enableControls && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/30 backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-white text-xs mb-1">Yakınlaştır</p>
                    <Slider 
                      value={[zoom]} 
                      min={2} 
                      max={5} 
                      step={0.1} 
                      onValueChange={(values) => setZoom(values[0])}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={currentAnimationMode === 'idle' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setCurrentAnimationMode('idle');
                        setAutoRotate(false);
                      }}
                    >
                      Duruş
                    </Button>
                    <Button
                      variant={currentAnimationMode === 'walking' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setCurrentAnimationMode('walking');
                        setAutoRotate(false);
                      }}
                    >
                      Yürüyüş
                    </Button>
                    <Button
                      variant={currentAnimationMode === 'turning' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setCurrentAnimationMode('turning');
                        setAutoRotate(true);
                      }}
                    >
                      360° Dönüş
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">Lütfen 3D avatarınızı oluşturmak için bir fotoğraf yükleyin.</p>
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <p className="text-sm text-gray-500">
          {selectedItems.length > 0
            ? `Giyilen: ${selectedItems.map(item => item.name).join(', ')}`
            : 'Kıyafet denemek için katalogdan ürün seçin.'}
        </p>
      </div>
    </div>
  );
};

export default EnhancedThreeDViewer; 