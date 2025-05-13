import Link from 'next/link';
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <Layout>
      <div className="container-app py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Üzerimde Sanal Prova Deneyimi</h1>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            Fotoğrafınızı yükleyin ve farklı kıyafetleri hem 2D hem de 3D olarak üzerinizde görün
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Fotoğraf Yükle</CardTitle>
            <CardDescription>
              Kıyafetleri sanal olarak denemek için bir fotoğraf yükleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-input rounded-md p-2"
              />
            </div>

            {previewUrl && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">Önizleme:</p>
                <div className="relative w-full aspect-[3/4] bg-muted rounded-md overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Önizleme"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              variant="default"
              className="w-full"
              disabled={!imageFile}
            >
              <Link href={imageFile ? "/try-on-2d" : "#"}>
                2D Deneyimi Dene
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="w-full"
              disabled={!imageFile}
            >
              <Link href={imageFile ? "/try-on-3d" : "#"}>
                3D Deneyimi Dene
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>2D Sanal Prova</CardTitle>
              <CardDescription>
                Kıyafetleri fotoğrafınızın üzerine gerçekçi bir şekilde yerleştirip görün
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>Gerçekçi görüntü bindirme</li>
                <li>Hızlı görselleştirme</li>
                <li>Çoklu kıyafet seçeneği</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3D Avatar Prova</CardTitle>
              <CardDescription>
                Fotoğrafınızdan bir 3D avatar oluşturun ve kıyafetleri her açıdan görün
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                <li>360° görüntüleme</li>
                <li>Gerçekçi vücut oranları</li>
                <li>Temel animasyonlar</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 