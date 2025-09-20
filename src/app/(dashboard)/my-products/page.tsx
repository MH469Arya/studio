'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Pencil } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const initialProducts = [
  {
    name: 'Ganjifa Cards',
    description: 'Traditional hand-painted playing cards from Odisha.',
    imageUrl: 'https://picsum.photos/seed/ganjifa/400/400',
    imageHint: 'Ganjifa cards',
    price: 259,
    category: 'Games',
    stock: 50,
  },
  {
    name: 'Kolhapuri Chappals',
    description: 'Handcrafted leather sandals from Maharashtra.',
    imageUrl: 'https://picsum.photos/seed/kolhapuri/400/400',
    imageHint: 'leather sandals',
    price: 469,
    category: 'Footwear',
    stock: 30,
  },
];

export default function MyProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newProduct = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
      imageHint: (formData.get('name') as string).toLowerCase(),
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      stock: Number(formData.get('stock')),
    };
    setProducts([...products, newProduct]);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">My Products</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new product to your inventory.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddProduct}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Product Name
                  </Label>
                  <Input id="name" name="name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input id="description" name="description" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input id="imageUrl" name="imageUrl" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price
                  </Label>
                  <Input id="price" name="price" type="number" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input id="category" name="category" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="stock" className="text-right">
                    Stock
                  </Label>
                  <Input id="stock" name="stock" type="number" className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Product</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Card key={product.name} className="overflow-hidden">
            <div className="w-full aspect-square relative">
              <Image
                src={product.imageUrl}
                alt={product.description}
                fill
                className="object-cover"
                data-ai-hint={product.imageHint}
              />
            </div>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pencil className="h-4 w-4"/>
              </Button>
            </CardHeader>
            <CardContent className="pt-0 grid gap-2">
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">₹{product.price}</p>
                <Badge variant="outline">Stock: {product.stock}</Badge>
              </div>
               <p className="text-sm text-muted-foreground">Category: {product.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
