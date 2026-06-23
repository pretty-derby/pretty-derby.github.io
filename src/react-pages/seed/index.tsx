import React, { useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import dbL from "@/dbL";
import SeedInputForm from "@/components/seed/SeedInputForm";
import SeedSearchForm from "@/components/seed/SeedSearchForm";
import SeedTable from "@/components/seed/SeedTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

interface SeedData {
  id: string;
  likes: number;
  dislikes: number;
  [key: string]: any;
}

const Seed = () => {
  const [isSeedInputVisible, setIsSeedInputVisible] = useState(false);
  const [seedList, setSeedList] = useState<SeedData[]>([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState({});
  const userId = dbL.chain.get("userId").value();

  const showSeedInput = () => setIsSeedInputVisible(true);
  const closeSeedInput = () => setIsSeedInputVisible(false);

  const showMySeed = () => {
    search({ attrs: ["userId"], levels: [userId] });
  };

  const search = async (params: any) => {
    setSearchParams(params);
    try {
      const res = await axios.post(
        "https://urarawin-worker.urarawin.workers.dev/api/sqlite/search",
        params
      );
      if (res.data) {
        if (res.data.count) {
          setSeedList(res.data.list);
          setTotal(res.data.count);
        } else {
          setSeedList([]);
          setTotal(0);
          toast.info("暂无数据");
        }
      }
    } catch (error) {
      toast.error("搜索失败");
    }
  };

  const handleTableChange = (pagination: any) => {
    search({
      ...searchParams,
      count: pagination.total,
      offset: pagination.current * 10 - 10,
    });
  };

  const like = async (seed: SeedData) => {
    if (!userId) {
      toast.info("刷新后重试");
      return;
    }
    try {
      const res = await axios.post("https://urarawin-worker.urarawin.workers.dev/api/sqlite/like", {
        id: seed.id,
        userId,
      });
      if (res.data) {
        toast.info("操作成功");
        setSeedList((prev) =>
          prev.map((item) => (item.id === seed.id ? { ...item, likes: item.likes + 1 } : item))
        );
      }
    } catch (error) {
      toast.error("操作失败");
    }
  };

  const dislike = async (seed: SeedData) => {
    if (!userId) {
      toast.info("刷新后重试");
      return;
    }
    try {
      const res = await axios.post(
        "https://urarawin-worker.urarawin.workers.dev/api/sqlite/dislike",
        { id: seed.id, userId }
      );
      if (res.data) {
        toast.info("操作成功");
        setSeedList((prev) =>
          prev.map((item) =>
            item.id === seed.id ? { ...item, dislikes: item.dislikes + 1 } : item
          )
        );
      }
    } catch (error) {
      toast.error("操作失败");
    }
  };

  const deleteSeed = async (seed: SeedData) => {
    try {
      const res = await axios.post(
        "https://urarawin-worker.urarawin.workers.dev/api/sqlite/delete",
        seed
      );
      if (res.data) {
        toast.info("成功删除");
        setSeedList((prev) => prev.filter((item) => item.id !== seed.id));
        setTotal((prev) => prev - 1);
      }
    } catch (error) {
      toast.error("删除失败");
    }
  };

  return (
    <>
      <Helmet>
        <title>分享 - 乌拉拉大胜利 - 赛马娘资料站</title>
      </Helmet>
      <div className="space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>过滤条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SeedSearchForm onSearch={search} />
            <div className="flex space-x-2">
              <Button onClick={showSeedInput}>配置我的种子</Button>
              <Button variant="outline" onClick={showMySeed}>
                查看我的种子
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>结果</CardTitle>
          </CardHeader>
          <CardContent>
            <SeedTable
              data={seedList}
              total={total}
              onChange={handleTableChange}
              onLike={like}
              onDislike={dislike}
              onDelete={deleteSeed}
              userId={userId}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isSeedInputVisible} onOpenChange={setIsSeedInputVisible}>
        <DialogContent className="sm:max-w-[80%]">
          <SeedInputForm onFinish={closeSeedInput} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Seed;
