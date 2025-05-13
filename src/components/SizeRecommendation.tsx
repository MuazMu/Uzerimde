import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, Ruler } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  SizeRecommendation as SizeRecommendationType, 
  BodyMeasurements 
} from '@/services/sizeEstimationService';
import { ClothingItem } from '@/components/ClothingSelector';

interface SizeRecommendationProps {
  recommendations: {
    [productId: string]: SizeRecommendationType;
  };
  selectedItems: ClothingItem[];
  bodyMeasurements?: BodyMeasurements;
  showMeasurements?: boolean;
}

const SizeRecommendation: React.FC<SizeRecommendationProps> = ({
  recommendations,
  selectedItems,
  bodyMeasurements,
  showMeasurements = false
}) => {
  // Helper function to get confidence level text and color
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) {
      return { text: 'Yüksek Uyumluluk', color: 'text-green-600', icon: <Check className="h-4 w-4" /> };
    } else if (confidence >= 0.5) {
      return { text: 'Orta Uyumluluk', color: 'text-amber-600', icon: <AlertCircle className="h-4 w-4" /> };
    } else {
      return { text: 'Düşük Uyumluluk', color: 'text-red-600', icon: <AlertCircle className="h-4 w-4" /> };
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5" />
          Beden Önerileri
        </CardTitle>
        <CardDescription>
          Vücut ölçülerinize göre önerilen bedenler
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedItems.length === 0 ? (
          <p className="text-center text-gray-500 my-8">
            Beden önerileri için kıyafet seçimi yapınız.
          </p>
        ) : (
          <div className="space-y-4">
            {/* Size recommendations for selected items */}
            <div className="grid gap-3">
              {selectedItems.map(item => {
                const recommendation = recommendations[item.id];
                if (!recommendation) return null;
                
                const confidenceLevel = getConfidenceLevel(recommendation.confidence);
                
                return (
                  <div key={item.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`flex items-center gap-1 ${confidenceLevel.color}`}
                      >
                        {confidenceLevel.icon}
                        {confidenceLevel.text}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {item.category === 'upper' || item.category === 'full' ? (
                        <div className="border rounded p-2 text-center">
                          <div className="text-xs text-gray-500 mb-1">Üst Beden</div>
                          <div className="text-lg font-bold">{recommendation.upperSize}</div>
                        </div>
                      ) : null}
                      
                      {item.category === 'lower' || item.category === 'full' ? (
                        <div className="border rounded p-2 text-center">
                          <div className="text-xs text-gray-500 mb-1">Alt Beden</div>
                          <div className="text-lg font-bold">{recommendation.lowerSize}</div>
                        </div>
                      ) : null}
                      
                      {item.category === 'shoes' ? (
                        <div className="border rounded p-2 text-center">
                          <div className="text-xs text-gray-500 mb-1">Ayakkabı</div>
                          <div className="text-lg font-bold">{recommendation.shoeSize}</div>
                        </div>
                      ) : null}
                      
                      <div className="border rounded p-2 text-center">
                        <div className="text-xs text-gray-500 mb-1">Fit</div>
                        <div className="text-sm font-medium capitalize">
                          {recommendation.fit === 'tight' ? 'Dar' : 
                           recommendation.fit === 'regular' ? 'Normal' : 'Bol'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Brand specific recommendations if available */}
                    {recommendation.brandSpecific && Object.keys(recommendation.brandSpecific).length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Marka Özel Bedenler</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Marka</TableHead>
                              <TableHead>Üst Beden</TableHead>
                              <TableHead>Alt Beden</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(recommendation.brandSpecific).map(([brand, sizes]) => (
                              <TableRow key={brand}>
                                <TableCell className="font-medium">{brand}</TableCell>
                                <TableCell>{sizes.upperSize || '-'}</TableCell>
                                <TableCell>{sizes.lowerSize || '-'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Body measurements section */}
            {showMeasurements && bodyMeasurements && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Vücut Ölçüleriniz</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  <div className="border rounded p-2">
                    <span className="text-xs text-gray-500 block">Boy</span>
                    <span className="font-medium">{bodyMeasurements.height} cm</span>
                  </div>
                  <div className="border rounded p-2">
                    <span className="text-xs text-gray-500 block">Göğüs</span>
                    <span className="font-medium">{bodyMeasurements.chest} cm</span>
                  </div>
                  <div className="border rounded p-2">
                    <span className="text-xs text-gray-500 block">Bel</span>
                    <span className="font-medium">{bodyMeasurements.waist} cm</span>
                  </div>
                  <div className="border rounded p-2">
                    <span className="text-xs text-gray-500 block">Kalça</span>
                    <span className="font-medium">{bodyMeasurements.hips} cm</span>
                  </div>
                  <div className="border rounded p-2">
                    <span className="text-xs text-gray-500 block">Omuz</span>
                    <span className="font-medium">{bodyMeasurements.shoulders} cm</span>
                  </div>
                  <div className="border rounded p-2">
                    <span className="text-xs text-gray-500 block">İç Bacak</span>
                    <span className="font-medium">{bodyMeasurements.inseam} cm</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SizeRecommendation; 