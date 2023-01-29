import React, { useState } from "react";
import { Table } from "antd";
import { useTranslation } from "react-i18next";
import { RACE_FILTER_LIST } from "src/config";

import { useAtom } from "jotai";
import { racesAtom } from "../../hooks/atoms";
// const TITLE = "比赛 - 乌拉拉大胜利 - 赛马娘资料站";

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
const labelTextDict = {
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
const mediumLabels = ["name", "date", "class", "grade", "ground", "distanceType"];

const Race = (props) => {
  const [races] = useAtom(racesAtom);
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const getColumns = () => {
    return RACE_TABLE_LABELS.map((label) => {
      if (RACE_FILTER_LIST["class"]) {
        return {
          title: t(labelTextDict[label]),
          dataIndex: label,
          filters: RACE_FILTER_LIST[label],
          width: 100,
          fixed: label === "name" ? "left" : null,
          onFilter: (value, record) => record[label] === value,
        };
      } else {
        return {
          fixed: label === "name" ? "left" : null,
          title: t(labelTextDict[label]),
          dataIndex: label,
        };
      }
    });
  };

  const allRaceList = races.map((race, index) => {
    race.key = index;
    return race;
  });
  let columns = getColumns();
  if (props.type === "medium") {
    columns = getColumns(mediumLabels);
  }
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    let selected = {};
    for (let race of selectedRows) {
      if (selected[race.dateNum]) {
        selected[race.dateNum].push(race.id);
      } else {
        selected[race.dateNum] = [race.id];
      }
    }
    props.onSelect(selected);
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // 筛选发生变化时清空已经选择的内容
  const onChange = (pagination, filters, sorter, extra) => {
    props.onSelect([]);
    setSelectedRowKeys([]);
  };
  return (
    <div className={"w-full overflow-x-auto"} style={{ height: `calc(100vh - 120px)` }}>
      <Table
        className="h-full"
        rowSelection={props.onSelect ? rowSelection : null}
        columns={columns}
        dataSource={allRaceList}
        onChange={onChange}
        pagination={false}
        scroll={{ y: "100%" }}
      />
    </div>
  );
};

export default Race;
