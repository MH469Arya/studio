'use client';

import Image from 'next/image';
import Link from 'next/link';
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
import { PlusCircle, Pencil, Wand2, Lightbulb } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Product = {
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  price: number;
  category: string;
  stock: number;
};

const initialProducts: Product[] = [
  {
    name: 'Ganjifa Cards',
    description: 'Traditional hand-painted playing cards from Odisha.',
    imageUrl: 'https://i.pinimg.com/736x/1d/e1/f6/1de1f652bbc42b47cbf5574815456755.jpg',
    imageHint: 'Ganjifa cards',
    price: 259,
    category: 'Games',
    stock: 50,
  },
  {
    name: 'Kolhapuri Chappals',
    description: 'Handcrafted leather sandals from Maharashtra.',
    imageUrl: 'https://i.pinimg.com/1200x/83/3d/73/833d733aa2c526961a164280efa52c4e.jpg',
    imageHint: 'leather sandals',
    price: 469,
    category: 'Footwear',
    stock: 30,
  },
];

export default function MyProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    setIsAddDialogOpen(false);
    event.currentTarget.reset();
  };

  const handleEditProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(event.currentTarget);
    const updatedProduct = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
      imageHint: (formData.get('name') as string).toLowerCase(),
      price: Number(formData.get('price')),
      category: formData.get('category') as string,
      stock: Number(formData.get('stock')),
    };

    setProducts(products.map(p => p.name === editingProduct.name ? updatedProduct : p));
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">My Products</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                <div className="grid grid-cols-4 items-start gap-4">
                   <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <div className="col-span-3 grid gap-2">
                    <Input id="description" name="description" required />
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/products" target="_blank">
                           <Wand2 className="mr-2 h-3 w-3"/> Generate with AI
                        </Link>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input id="imageUrl" name="imageUrl" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="price" className="text-right pt-2">
                    Price
                  </Label>
                   <div className="col-span-3 grid gap-2">
                    <Input id="price" name="price" type="number" required />
                     <Button variant="outline" size="sm" asChild>
                        <Link href="/sales" target="_blank">
                           <Lightbulb className="mr-2 h-3 w-3"/> Suggest Price
                        </Link>
                    </Button>
                  </div>
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
                width={300}
                height={300}
                className="object-cover w-full h-full"
                data-ai-hint={product.imageHint}
              />
            </div>
            <CardHeader className="flex flex-row items-start justify-between">
              <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(product)}>
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

       {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => {
        setIsEditDialogOpen(isOpen);
        if (!isOpen) {
          setEditingProduct(null);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the details for your product. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleEditProduct}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Product Name
                  </Label>
                  <Input id="edit-name" name="name" defaultValue={editingProduct.name} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-description" className="text-right">
                    Description
                  </Label>
                  <Input id="edit-description" name="description" defaultValue={editingProduct.description} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input id="edit-imageUrl" name="imageUrl" defaultValue={editingProduct.imageUrl} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-price" className="text-right">
                    Price
                  </Label>
                  <Input id="edit-price" name="price" type="number" defaultValue={editingProduct.price} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Category
                  </Label>
                  <Input id="edit-category" name="category" defaultValue={editingProduct.category} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-stock" className="text-right">
                    Stock
                  </Label>
                  <Input id="edit-stock" name="stock" type="number" defaultValue={editingProduct.stock} className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
