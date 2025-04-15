import {
  DataTable,
  dateColumn,
} from "@stanfordspezi/spezi-web-design-system/components/DataTable";
import { createColumnHelper, type Table } from "@tanstack/table-core";
import {
  type MeasurementItem,
  type MeasurementsData,
} from "@/routes/~_dashboard/~patients/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@stanfordspezi/spezi-web-design-system/components/Select";
import { useMemo } from "react";

const columnIds = {
  type: "type",
} as const;

type ObservationTypeFilterProps = {
  table: Table<MeasurementItem>;
};

const ObservationTypeFilter = ({ table }: ObservationTypeFilterProps) => {
  const observationTypes = useMemo(() => {
    const types = new Set<string>();
    table.options.data.forEach((row) => types.add(row.typeLabel));
    return Array.from(types).sort();
  }, [table.options.data]);

  const currentFilter = table
    .getState()
    .columnFilters.find((filter) => filter.id === columnIds.type)?.value as
    | string
    | undefined;

  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-sm font-medium">Type</span>
      <Select
        value={currentFilter ?? "All"}
        onValueChange={(value) => {
          table.setColumnFilters((filters) => {
            const newFilters = filters.filter(
              (filter) => filter.id !== columnIds.type,
            );
            if (value !== "All") {
              newFilters.push({
                id: columnIds.type,
                value: value,
              });
            }
            return newFilters;
          });
        }}
      >
        <SelectTrigger className="min-w-[140px]">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All types</SelectItem>
          {observationTypes.map((typeLabel) => (
            <SelectItem key={typeLabel} value={typeLabel}>
              {typeLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface MeasurementsProps extends MeasurementsData {}

const columnHelper = createColumnHelper<MeasurementItem>();

const valueFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
});

export const Measurements = ({ observations }: MeasurementsProps) => {
  return (
    <DataTable
      columns={[
        columnHelper.accessor((observation) => observation.effectiveDateTime, {
          header: "Date",
          cell: dateColumn,
        }),
        columnHelper.accessor((observation) => observation.typeLabel, {
          header: "Type",
          id: columnIds.type,
          filterFn: "equals",
        }),
        columnHelper.accessor("value", {
          header: "Value",
          cell: (props) => {
            const observation = props.row.original;
            return `${observation.value ? valueFormatter.format(observation.value) : ""} ${observation.unit}`;
          },
        }),
      ]}
      data={observations}
      entityName="measurements"
      header={({ table }) => (
        <div className="ml-auto">
          <ObservationTypeFilter table={table} />
        </div>
      )}
    />
  );
};
