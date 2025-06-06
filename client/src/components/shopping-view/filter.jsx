import { Fragment, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
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

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(dynamicFilters).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold capitalize">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {dynamicFilters[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex font-medium items-center gap-2"
                  >
                    <Checkbox
                      checked={
                        filters?.[keyItem]?.includes(option.id) || false
                      }
                      onCheckedChange={() =>
                        handleFilter(keyItem, option.id)
                      }
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
