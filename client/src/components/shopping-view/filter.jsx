import { Fragment, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";

function ProductFilter({ filters, handleFilter }) {
  const [dynamicFilters, setDynamicFilters] = useState({});

  useEffect(() => {
  const fetchFilterOptions = async () => {
    try {
      const [brandRes, categoryRes, genreRes] = await Promise.all([
        axios.get("/api/brands"),
        axios.get("/api/categories"),
        axios.get("/api/genres"),
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

  const handleDropdownChange = (keyItem, value) => {
    if (value === "all") {
      // Clear the filter for this category
      handleFilter(keyItem, null, true);
    } else {
      // Set single selection for this category
      handleFilter(keyItem, value, false, true);
    }
  };

  const getSelectedValue = (keyItem) => {
    const filterValues = filters?.[keyItem];
    if (!filterValues || filterValues.length === 0) {
      return "all";
    }
    return filterValues[0]; // Return first selected value for single selection
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
              <Select
                value={getSelectedValue(keyItem)}
                onValueChange={(value) => handleDropdownChange(keyItem, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Select ${keyItem === 'brand' ? 'Type' : keyItem}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {keyItem === 'brand' ? 'Types' : `${keyItem}s`}</SelectItem>
                  {dynamicFilters[keyItem].map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
