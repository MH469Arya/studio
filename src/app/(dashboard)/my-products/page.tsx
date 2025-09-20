'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { PlusCircle, Pencil, Wand2, Lightbulb, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { suggestProductPrice } from '@/ai/flows/suggest-product-price';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  
  // State for the "Add Product" form
  const [newProductName, setNewProductName] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');

  const [isSuggestingPrice, setIsSuggestingPrice] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState<number | null>(null);

  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // @ts-ignore
    const descFromAI = window.descriptionFromAI;
    if (searchParams.get('fromAI') === 'true' && descFromAI) {
      setNewProductDescription(descFromAI);
      setIsAddDialogOpen(true);
      // Clean up the temporary store and URL
      // @ts-ignore
      delete window.descriptionFromAI; 
      router.replace('/my-products');
    }
  }, [searchParams, router]);


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
    handleOpenAddDialog(false);
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
  
  const handleRemoveProduct = () => {
    if (!editingProduct) return;

    setProducts(products.filter(p => p.name !== editingProduct.name));
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleOpenAddDialog = (isOpen: boolean) => {
    setIsAddDialogOpen(isOpen);
    if (!isOpen) {
      // Reset form state when closing
      setNewProductName('');
      setNewProductDescription('');
      setNewProductCategory('');
      setNewProductPrice('');
      setPriceSuggestion(null);
    }
  }

  const handleSuggestPrice = async () => {
    if (!newProductName || !newProductDescription || !newProductCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill out the Product Name, Description, and Category before suggesting a price.",
        variant: "destructive",
      });
      return;
    }
    setIsSuggestingPrice(true);
    setPriceSuggestion(null);
    try {
      const result = await suggestProductPrice({
        productName: newProductName,
        description: newProductDescription,
        category: newProductCategory,
      });
      setPriceSuggestion(result.suggestedPrice);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Suggesting Price',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestingPrice(false);
    }
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">My Products</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={handleOpenAddDialog}>
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
                  <Input id="name" name="name" className="col-span-3" required value={newProductName} onChange={e => setNewProductName(e.target.value)} />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input id="category" name="category" className="col-span-3" required value={newProductCategory} onChange={e => setNewProductCategory(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                   <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <div className="col-span-3 grid gap-2">
                    <Textarea 
                      id="description" 
                      name="description" 
                      required 
                      value={newProductDescription}
                      onChange={(e) => setNewProductDescription(e.target.value)}
                      rows={4}
                    />
                    <Button variant="outline" size="sm" asChild>
                        <Link href={{ pathname: '/products', query: { productName: newProductName, category: newProductCategory } }} target="_blank">
                           <Wand2 className="mr-2 h-3 w-3"/> Generate with AI
                        </Link>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input id="imageUrl" name="imageUrl" defaultValue="https://picsum.photos/seed/newproduct/300/300" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="price" className="text-right pt-2">
                    Price
                  </Label>
                   <div className="col-span-3 grid gap-2">
                    <Input id="price" name="price" type="number" required value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} />
                     <Button variant="outline" size="sm" type="button" onClick={handleSuggestPrice} disabled={isSuggestingPrice}>
                        {isSuggestingPrice ? <Loader2 className="animate-spin" /> : <Lightbulb className="mr-2 h-3 w-3"/>}
                        Suggest Price
                    </Button>
                    {priceSuggestion !== null && (
                       <Alert>
                         <Lightbulb className="h-4 w-4" />
                         <AlertTitle>Suggested Price: ₹{priceSuggestion}</AlertTitle>
                         <AlertDescription>
                           <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setNewProductPrice(priceSuggestion.toString())}>Apply this price</Button>
                         </AlertDescription>
                       </Alert>
                    )}
                  </div>
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
            <CardHeader className="flex flex-row items-start justify-between p-4">
              <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8 -translate-y-1" onClick={() => openEditDialog(product)}>
                <Pencil className="h-4 w-4"/>
              </Button>
            </CardHeader>
            <CardContent className="pt-0 grid gap-2 px-4 pb-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
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
                  <Textarea id="edit-description" name="description" defaultValue={editingProduct.description} className="col-span-3" required />
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
                <Button variant="destructive" type="button" onClick={handleRemoveProduct}>
                  Remove Product
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
