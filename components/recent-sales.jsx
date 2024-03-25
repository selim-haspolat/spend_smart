import getDate from "@/lib/get-date";

export function RecentSales({ purchases, products }) {
  return (
    <div className="space-y-8">
      {purchases
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
        .map((purchase) => {
          return (
            <div key={purchase.id} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {products.find((p) => p.id === purchase.productId)?.name ||
                    "Deleted Product"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getDate(new Date(purchase.createdAt), ".", true)}
                </p>
              </div>
              <div className="ml-auto font-medium">-{purchase.value}₺</div>
            </div>
          );
        })}
    </div>
  );
}
