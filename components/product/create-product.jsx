import React, { useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { toast } from "../ui/use-toast";
import instance from "@/lib/axios-instance";
import { Checkbox } from "../ui/checkbox";

const CreateProduct = ({ setProducts }) => {
  const [name, setName] = useState(null);
  const [value, setValue] = useState(null);
  const [dynamicPrice, setDynamicPrice] = useState(false);
  const [icon, setIcon] = useState("");

  const [createLoading, setCreateLoading] = useState(false);

  const selectData = [
    {
      text: "Water",
      icon: "glassWater",
    },
    {
      text: "Food",
      icon: "utensils",
    },
    {
      text: "Fruit",
      icon: "apple",
    },
    {
      text: "Shopping",
      icon: "shoppingCartIcon",
    },
    {
      text: "Phone Bill",
      icon: "phone",
    },
    {
      text: "Home",
      icon: "home",
    },
  ];

  const createProduct = async () => {
    setCreateLoading(true);
    try {
      if (
        (value <= 0 && dynamicPrice === false) ||
        icon === "" ||
        name === ""
      ) {
        toast({
          title: "Invalid Value!",
          description: "Value must be greater than 0",
          variant: "destructive",
        });
        return;
      }

      await instance.post("/product", {
        name,
        value,
        dynamic: dynamicPrice,
        icon,
      });

      setProducts((prev) => [
        {
          name,
          value,
          icon,
        },
        ...prev,
      ]);

      toast({
        title: "Success!",
        description: "Product Created Successfully",
      });
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="mt-5 flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <div className="flex gap-2">
          <Input
            type="number"
            min={0}
            disabled={dynamicPrice}
            placeholder="Price ₺"
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dp"
              checked={dynamicPrice}
              onCheckedChange={(e) => setDynamicPrice(e)}
            />
            <label
              htmlFor="dp"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Dynamic Price
            </label>
          </div>
        </div>
        <Select onValueChange={(e) => setIcon(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Symbol" />
          </SelectTrigger>
          <SelectContent>
            {selectData.map((data, index) => {
              const Icon = Icons[data.icon];

              return (
                <SelectItem key={index} value={data.icon}>
                  <span className="flex items-center gap-3">
                    <Icon />
                    {data.text}
                  </span>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end">
        <Button disabled={createLoading} onClick={createProduct}>
          {createLoading ? "Creating..." : "Create"}
        </Button>
      </div>
      <Separator />
    </div>
  );
};

export default CreateProduct;
