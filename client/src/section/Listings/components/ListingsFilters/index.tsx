import React from "react";
import { ListingsFilter as Filter } from "../../../../lib/graphql/globalTypes";
import { Select } from "antd";

interface Props {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}

export const ListingsFilters = ({ filter, setFilter }: Props) => {
  return (
    <div className="listings-filters">
      <span>Filter by</span>
      <Select
        value={filter}
        onChange={(filterValue: Filter) => setFilter(filterValue)}
      >
        <Select.Option value={Filter.PRICE_LOW_TO_HIGH}>
          Price low to high
        </Select.Option>
        <Select.Option value={Filter.PRICE_HIGH_TO_LOW}>
          Price high to low
        </Select.Option>
      </Select>
    </div>
  );
};
