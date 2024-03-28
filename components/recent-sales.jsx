import getDate from "@/lib/get-date";

export function RecentSales({ purchases, products }) {
  const stackThePurchases = () => {
    const stackedPurchases = [];

    purchases
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .forEach((purchase) => {
        const index = stackedPurchases.findIndex(
          (p) => p.productId === purchase.productId
        );

        if (index === -1) {
          stackedPurchases.push({
            productId: purchase.productId,
            value: purchase.value,
            lastTime: purchase.createdAt,
            count: 1,
          });
        } else {
          stackedPurchases[index].value += purchase.value;
          stackedPurchases[index].count++;
        }
      });

    return stackedPurchases;
  };

  return (
    <div className="space-y-8">
      {stackThePurchases()
        .slice(0, 5)
        .map((purchase) => {
          return (
            <div key={purchase.id} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  +{purchase.count}{" "}
                  {products.find((p) => p.id === purchase.productId)?.name ||
                    "Deleted Product"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getDate(new Date(purchase.lastTime), ".", true)}
                </p>
              </div>
              <div className="ml-auto font-medium">-{purchase.value}₺</div>
            </div>
          );
        })}
    </div>
  );
}
