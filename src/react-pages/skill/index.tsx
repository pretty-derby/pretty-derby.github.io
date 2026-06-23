import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import SkillList from "@/components/skill/SkillList";
import SkillFilterForm from "@/components/skill/SkillFilterForm";

import useViewport from "@/hooks/useViewport";

import { useDB } from "@/hooks/useDB";
import { Helmet } from "react-helmet";

const Skill = () => {
  const viewport = useViewport();
  const [show, setShow] = React.useState(false);
  const [skillList, setSkillList] = useState<Skill[]>();
  const { db } = useDB();

  useEffect(() => {
    if (db) {
      const allSkillList = db.chain.get("skills").orderBy("db_id").value();
      setSkillList(allSkillList);
    }
  }, [db]);

  // init supportMode
  if (typeof window !== "undefined") {
    localStorage.getItem("supportMode") === null && localStorage.setItem("supportMode", 0);
  }

  if (!db) return null;

  return (
    <div className="flex flex-row">
      <Helmet>
        <title>技能 - 乌拉拉大胜利 - 赛马娘资料站</title>
      </Helmet>

      {viewport?.width >= 768 ? (
        <div
          className="sticky top-20 hidden md:flex w-1/4 flex-col p-1 overflow-auto"
          style={{
            height: "calc(100vh - 120px)",
          }}
        >
          <SkillFilterForm onUpdate={setSkillList} />
        </div>
      ) : (
        <>
          <Button
            className="md:hidden fixed top-20 z-40 bg-opacity-80"
            onClick={() => setShow(true)}
          >
            筛选
          </Button>
          <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>筛选技能</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col">
                <SkillFilterForm onUpdate={setSkillList} />
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      <SkillList className="w-full md:w-3/4" dataList={skillList} sortFlag={true} />
    </div>
  );
};

export default Skill;
