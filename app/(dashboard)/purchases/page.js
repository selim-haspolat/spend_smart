"use client";

import React, { useEffect, useState } from "react";

import { Overview } from "@/components/overview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecentSales } from "@/components/recent-sales";
import BreadCrumb from "@/components/breadcrumb";
import { toast } from "@/components/ui/use-toast";
import instance from "@/lib/axios-instance";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);

  const getPurchases = async () => {
    try {
      const { data } = await instance.get("/purchase");

      setPurchases(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Something Went Wrong!",
        description: error.response.data.error,
        variant: "destructive",
      });
    }
  };

  const getProducts = async () => {
    try {
      const { data } = await instance.get("/product");

      setProducts(data);
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getPurchases();
    getProducts();
  }, []);

  const breadcrumbItems = [{ title: "Purchases", link: "/purchases" }];

  const getThisMonthsPurchases = () => {
    purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.createdAt);
      const currentDate = new Date();

      return (
        purchaseDate.getMonth() === currentDate.getMonth() &&
        purchaseDate.getFullYear() === currentDate.getFullYear()
      );
    });

    return purchases.length;
  };

  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview purchases={purchases} />
          </CardContent>
        </Card>
        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
            <CardDescription>
              You made {getThisMonthsPurchases() || 0} purchases this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales purchases={purchases} products={products} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Purchases;
