import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ProductLoading = () => {
  const products = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <div className="w-[100%] grid grid-cols-2 md:grid-cols-4 xl:md:grid-cols-5 gap-5">
      {products.map((p, i) => {
        return (
          <Card key={i}>
            <CardHeader>
              <CardTitle>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center gap-2">
              <Skeleton className="w-[40px] h-[20px] rounded-full" />
              <div className="flex justify-end">
                <Skeleton className="w-[80px] h-[20px] rounded-full" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductLoading;
