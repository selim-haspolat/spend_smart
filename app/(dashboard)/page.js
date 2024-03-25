"use client";

import { Icons } from "@/components/icons";
import ProductLoading from "@/components/product/product-loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/components/ui/use-toast";
import instance from "@/lib/axios-instance";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [goal, setGoal] = useState(150);
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
    try {
      await instance.post("/purchase", {
        value: value,
        productId: product.id,
      });

      toast({
        title: "Success!",
        description: "You have successfully purchased!",
      });

      setGoal(150);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  function onClick(adjustment) {
    setGoal(Math.max(0, Math.min(1000, goal + adjustment)));
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <main>
      <Drawer open={open} onOpenChange={setOpen}>
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
                <DrawerTrigger asChild>
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
                </DrawerTrigger>
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
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>
                Set your daily activity goal.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => onClick(-10)}
                  disabled={goal <= 0}
                >
                  <MinusIcon className="h-4 w-4" />
                  <span className="sr-only">Decrease</span>
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-7xl font-bold tracking-tighter">
                    {goal}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={() => onClick(10)}
                  disabled={goal >= 1000}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span className="sr-only">Increase</span>
                </Button>
              </div>
              <div className="mt-3 h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart>
                    <Bar
                      dataKey="goal"
                      style={{
                        fill: "hsl(var(--foreground))",
                        opacity: 0.9,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={() => createPurchase(goal, selectedProduct)}>
                Submit
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </main>
  );
}
