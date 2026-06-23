import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import axios from "axios";
import MobileSeedSearchForm from "@/components/seed/MobileSeedSearchForm";
import MobileSeedCard from "@/components/seed/MobileSeedCard";
import { toast } from "sonner";

const MobileSeedList = () => {
  const { t } = useTranslation();
  const [seedList, setSeedList] = useState([]);

  const search = async (value) => {
    try {
      const res = await axios.post(
        "https://urarawin-worker.urarawin.workers.dev/api/sqlite/search",
        value
      );
      if (res.data) {
        if (res.data.count) {
          setSeedList(res.data.list);
        } else {
          toast.info(t("暂无数据"));
        }
      }
    } catch (error) {
      toast.error(t("出错了"));
    }
  };

  return (
    <div className="w-full flex flex-wrap px-3">
      <Helmet>
        <title>分享 - 乌拉拉大胜利 - 赛马娘资料站</title>
      </Helmet>
      <MobileSeedSearchForm search={search} />
      <div className="w-full text-lg font-semibold">{t("结果")}</div>
      {seedList.map((seed) => (
        <MobileSeedCard key={seed.id} data={seed} />
      ))}
    </div>
  );
};

export default MobileSeedList;
