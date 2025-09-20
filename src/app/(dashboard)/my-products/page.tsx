import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const products = [
  {
    name: 'Ganjifa Cards',
    description: 'Traditional hand-painted playing cards from Odisha.',
    imageUrl: 'https://i.pinimg.com/564x/0f/52/39/0f52396b1b147a488339f010a30b9165.jpg',
    imageHint: 'Ganjifa cards',
  },
  {
    name: 'Kolhapuri Chappals',
    description: 'Handcrafted leather sandals from Maharashtra.',
    imageUrl: 'https://i.pinimg.com/564x/b8/9f/c6/b89fc665f80931561b373f15a1a10839.jpg',
    imageHint: 'leather sandals',
  },
];

export default function MyProductsPage() {
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
                    {product.imageUrl && (
                        <div className="relative h-48 w-full">
                            <Image
                                src={product.imageUrl}
                                alt={product.description}
                                fill
                                className="object-cover"
                                data-ai-hint={product.imageHint}
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
