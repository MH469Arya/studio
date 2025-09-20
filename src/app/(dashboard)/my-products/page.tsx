import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function MyProductsPage() {
    const products = [
    {
      name: 'Ganjifa Cards',
      description: 'Traditional hand-painted playing cards from Odisha.',
      image: PlaceHolderImages.find((img) => img.id === 'ganjifa-cards'),
    },
    {
      name: 'Kolhapuri Chappals',
      description: 'Handcrafted leather sandals from Maharashtra.',
      image: PlaceHolderImages.find((img) => img.id === 'kolhapuri-chappals'),
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">My Products</h2>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
                <Card key={product.name} className="overflow-hidden">
                    {product.image && (
                        <div className="relative h-48 w-full">
                            <Image
                                src={product.image.imageUrl}
                                alt={product.image.description}
                                fill
                                className="object-cover"
                                data-ai-hint={product.image.imageHint}
                            />
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
  );
}
