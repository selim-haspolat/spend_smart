"use client";

import React, { useEffect, useState } from "react";

import BreadCrumb from "@/components/breadcrumb";
import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import instance from "@/lib/axios-instance";
import CreateProduct from "@/components/product/create-product";
import ProductLoading from "@/components/product/product-loading";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const breadcrumbItems = [{ title: "Products", link: "/products" }];

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

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div>
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex flex-col gap-5">
        <CreateProduct setProducts={setProducts} />
        {loading ? (
          <ProductLoading />
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center gap-3">
            <h2>Product Not Found</h2>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:md:grid-cols-5 gap-5">
            {products.map((p, i) => {
              const Icon = Icons[p.icon];

              return (
                <Card key={i} className="cursor-pointer">
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
      </div>
    </div>
  );
};

export default Products;
