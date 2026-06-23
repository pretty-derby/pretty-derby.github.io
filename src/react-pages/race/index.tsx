import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { useDB } from "@/hooks/useDB";
import { RACE_FILTER_LIST } from "@/config";
import { Helmet } from "react-helmet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface RaceProps {
  type?: "medium";
  onSelect?: (selected: Record<string, string[]>) => void;
}

interface RaceData {
  key: number;
  id: string;
  dateNum: string;
  [key: string]: any;
}

const RACE_TABLE_LABELS = [
  "name",
  "date",
  "class",
  "grade",
  "place",
  "ground",
  "distance",
  "distanceType",
  "direction",
  "side",
];

const mediumLabels = ["name", "date", "class", "grade", "ground", "distanceType"];

const labelTextDict: Record<string, string> = {
  name: "名称",
  date: "时间",
  class: "年级",
  grade: "赛事等级",
  place: "地点",
  ground: "场地",
  distance: "长度",
  distanceType: "赛程",
  direction: "方向",
  side: "赛道",
};

const Race: React.FC<RaceProps> = ({ type, onSelect }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const { t } = useTranslation();
  const { db } = useDB();

  const useViewport = () => {
    const [height, setHeight] = React.useState(window.innerHeight);
    React.useEffect(() => {
      const handleWindowResize = () => setHeight(window.innerHeight);
      window.addEventListener("resize", handleWindowResize);
      return () => window.removeEventListener("resize", handleWindowResize);
    }, []);
    return { height };
  };

  const dynamicTableHeight = useViewport().height - 168;

  if (!db) return null;

  const allRaceList: RaceData[] = db.chain
    .get("races")
    .value()
    .map((race, index) => ({
      ...race,
      key: index,
    }));

  const filteredData = allRaceList.filter((race) => {
    return Object.entries(filters).every(([key, values]) => {
      if (!values.length) return true;
      return values.includes(race[key]);
    });
  });

  const handleSelectChange = (key: number, checked: boolean) => {
    const newSelectedKeys = checked
      ? [...selectedRowKeys, key]
      : selectedRowKeys.filter((k) => k !== key);

    setSelectedRowKeys(newSelectedKeys);

    if (onSelect) {
      const selected: Record<string, string[]> = {};
      allRaceList
        .filter((race) => newSelectedKeys.includes(race.key))
        .forEach((race) => {
          if (selected[race.dateNum]) {
            selected[race.dateNum].push(race.id);
          } else {
            selected[race.dateNum] = [race.id];
          }
        });
      onSelect(selected);
    }
  };

  const handleFilterChange = (column: string, values: string[]) => {
    setFilters((prev) => ({
      ...prev,
      [column]: values,
    }));
    setSelectedRowKeys([]);
    onSelect?.([]);
  };

  const displayLabels = type === "medium" ? mediumLabels : RACE_TABLE_LABELS;

  return (
    <div className="w-full overflow-x-auto">
      <Helmet>
        <title>比赛 - 乌拉拉大胜利 - 赛马娘资料站</title>
      </Helmet>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {onSelect && (
                <TableHead className="w-12">
                  <Label className="sr-only">Select</Label>
                </TableHead>
              )}
              {displayLabels.map((label) => (
                <TableHead key={label} className={label === "name" ? "sticky left-0 bg-white" : ""}>
                  <div className="flex items-center">
                    {t(labelTextDict[label])}
                    {RACE_FILTER_LIST[label] && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-1 h-6 p-1">
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {RACE_FILTER_LIST[label].map((filter) => (
                            <DropdownMenuCheckboxItem
                              key={filter.value}
                              checked={filters[label]?.includes(filter.value)}
                              onCheckedChange={(checked) => {
                                const newFilters = checked
                                  ? [...(filters[label] || []), filter.value]
                                  : (filters[label] || []).filter((v) => v !== filter.value);
                                handleFilterChange(label, newFilters);
                              }}
                            >
                              {filter.text}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody style={{ maxHeight: `${dynamicTableHeight}px`, overflowY: "auto" }}>
            {filteredData.map((race) => (
              <TableRow key={race.key}>
                {onSelect && (
                  <TableCell className="sticky left-0 bg-white">
                    <Checkbox
                      checked={selectedRowKeys.includes(race.key)}
                      onCheckedChange={(checked) =>
                        handleSelectChange(race.key, checked as boolean)
                      }
                    />
                  </TableCell>
                )}
                {displayLabels.map((label) => (
                  <TableCell
                    key={`${race.key}-${label}`}
                    className={label === "name" ? "sticky left-12 bg-white" : ""}
                  >
                    {race[label]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Race;
