"use client";

import { Icons } from "@/components/icons";
import ProductLoading from "@/components/product/product-loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "@/components/ui/use-toast";
import instance from "@/lib/axios-instance";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectLoading, setSelectLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [customPrice, setCustomPrice] = useState(100);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const getProducts = async () => {
    setLoading(true);
    try {
      const { data } = await instance.get("/product");

      setProducts(data);
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPurchase = async (value, product) => {
    setSelectLoading(true);
    if (selectLoading) return;
    try {
      await instance.post("/purchase", {
        value: value,
        productId: product.id,
      });

      toast({
        title: "Success!",
        description: "You have successfully purchased!",
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setSelectLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <main>
        <h2 className="text-3xl font-bold tracking-tight mb-5">
          Hi, Welcome back 👋
        </h2>
        {loading ? (
          <ProductLoading />
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center gap-3">
            <h2>Product Not Found</h2>
            <Button
              onClick={() => {
                router.push("/products");
              }}
              variant="outline"
            >
              Create Product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:md:grid-cols-5 gap-5 select-none">
            {products.map((p, i) => {
              const Icon = Icons[p.icon];

              return p.dynamic ? (
                <DialogTrigger asChild>
                  <Card
                    key={i}
                    onClick={() => setSelectedProduct(p)}
                    className="cursor-pointer"
                  >
                    <CardHeader>
                      <CardTitle>{p.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center gap-2">
                      <Icon />
                      <p className="text-end">{p.dynamic ? "** " : p.value}₺</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
              ) : (
                <Card
                  key={i}
                  onClick={() => createPurchase(p.value, p)}
                  className="cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle>{p.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between items-center gap-2">
                    <Icon />
                    <p className="text-end">{p.dynamic ? "** " : p.value}₺</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        <DialogContent className="sm:max-w-[425px]">
          {/* <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader> */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Price
              </Label>
              <Input
                value={customPrice}
                className="col-span-3"
                onChange={(e) => setCustomPrice(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => createPurchase(customPrice, selectedProduct)}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </main>
    </Dialog>
  );
}
