import { Fragment, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import axios from "axios";

function ProductFilter({ filters, handleFilter }) {
  const [dynamicFilters, setDynamicFilters] = useState({});

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [brandRes, categoryRes, genreRes] = await Promise.all([
          axios.get("http://localhost:5000/api/brands"),
          axios.get("http://localhost:5000/api/categories"),
          axios.get("http://localhost:5000/api/genres"),
        ]);
        console.log("BRANDS", brandRes);
        console.log("CATEGORIES", categoryRes);
        console.log("GENRES", genreRes);

        setDynamicFilters({
          brand: brandRes.data.data.map((b) => ({
            id: b._id,
            label: b.name,
          })),
          category: categoryRes.data.data.map((c) => ({
            id: c._id,
            label: c.name,
          })),
          genre: genreRes.data.data.map((g) => ({
            id: g._id,
            label: g.name,
          })),
        });
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchFilterOptions();
  }, []);

  const getSelectedCount = (keyItem) => {
    const filterValues = filters?.[keyItem];
    return filterValues ? filterValues.length : 0;
  };

  const getDisplayText = (keyItem) => {
    const count = getSelectedCount(keyItem);
    const categoryName = keyItem === 'brand' ? 'Type' : keyItem;
    
    if (count === 0) {
      return `All ${categoryName}s`;
    } else if (count === 1) {
      const selectedId = filters[keyItem][0];
      const selectedOption = dynamicFilters[keyItem].find(option => option.id === selectedId);
      return selectedOption ? selectedOption.label : `${count} selected`;
    } else {
      return `${count} selected`;
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(dynamicFilters).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <Label className="text-base font-bold capitalize mb-2 block">
                {keyItem === 'brand' ? 'Type' : keyItem}
              </Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                  >
                    <span className="truncate">{getDisplayText(keyItem)}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[200px] p-2">
                  <div className="space-y-2">
                    {dynamicFilters[keyItem].map((option) => (
                      <Label
                        key={option.id}
                        className="flex font-medium items-center gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm p-2"
                      >
                        <Checkbox
                          checked={
                            filters?.[keyItem]?.includes(option.id) || false
                          }
                          onCheckedChange={() =>
                            handleFilter(keyItem, option.id)
                          }
                        />
                        <span className="flex-1">{option.label}</span>
                      </Label>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
