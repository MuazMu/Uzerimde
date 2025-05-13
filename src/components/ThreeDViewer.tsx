import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface TextureMaps {
  normal: string;
  roughness: string;
}

interface ClothingItem {
  id: number;
  name: string;
  category: string;
  image: string;
  modelUrl: string;
  brand?: string;
  price?: string;
  textureMaps?: TextureMaps;
}

interface ThreeDViewerProps {
  avatarUrl: string | null;
  selectedItems: ClothingItem[];
  isLoading: boolean;
  animationMode: 'idle' | 'walking' | 'turning';
}

function Avatar({ 
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
            actions[matchingAnim].reset().play();
          } else {
            // Just play the first animation as last resort
            actions[availableAnimations[0]].reset().play();
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
            const { scene: clothingScene } = await useGLTF.preload(item.modelUrl);
            const clothingModel = clothingScene.clone();
            
            // Apply textures if available
            if (item.textureMaps) {
              clothingModel.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  const material = child.material as THREE.MeshStandardMaterial;
                  
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

// Set up scene and camera
function Scene({ 
  avatarUrl, 
  clothingItems,
  animationMode
}: { 
  avatarUrl: string | null; 
  clothingItems: ClothingItem[];
  animationMode: 'idle' | 'walking' | 'turning';
}) {
  const { camera } = useThree();
  
  useEffect(() => {
    // Position camera for a good view of the avatar
    camera.position.set(0, 1.5, 3);
    camera.lookAt(0, 1, 0);
  }, [camera]);

  if (!avatarUrl) return null;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <spotLight 
        position={[-5, 5, 5]} 
        intensity={0.8} 
        angle={Math.PI / 6} 
        penumbra={0.2}
        castShadow
      />
      <Avatar 
        url={avatarUrl} 
        clothingItems={clothingItems}
        animationMode={animationMode}
      />
      <Environment preset="studio" />
      <OrbitControls 
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={5}
        autoRotate={animationMode === 'turning'}
        autoRotateSpeed={2}
      />
    </>
  );
}

// Main component
const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  avatarUrl,
  selectedItems,
  isLoading,
  animationMode
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-[500px]">
      <h2 className="text-xl font-semibold mb-4">3D Önizleme</h2>
      
      <div className="relative h-[400px] w-full bg-gray-100 rounded-md overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            <p className="ml-3 text-gray-600">Avatar oluşturuluyor...</p>
          </div>
        ) : avatarUrl ? (
          <Canvas shadows>
            <Scene 
              avatarUrl={avatarUrl} 
              clothingItems={selectedItems}
              animationMode={animationMode}
            />
          </Canvas>
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

export default ThreeDViewer; 