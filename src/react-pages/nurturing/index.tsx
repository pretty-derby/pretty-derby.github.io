import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDB } from "@/hooks/useDB";
import { useTranslation } from "react-i18next";
import dbL from "@/dbL";
import EventList from "@/components/event/EventList";
import SkillList from "@/components/skill/SkillList";
import { BuffButton } from "@/components/buff";
import { RaceTimeline, RaceCheckbox } from "@/components/race";
import { MyDecks, RecommendDecks } from "@/components/deck";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import SupportListWithFilter from "@/components/support/SupportListWithFilter";
import PlayerList from "@/components/player/PlayerList";
import { CDN_SERVER } from "@/config";
import { Helmet } from "react-helmet";

const layoutWithBlank = [
  { i: "a", x: 0, y: 0, w: 2, h: 2 },
  { i: "b", x: 2, y: 0, w: 7, h: 2 },
  { i: "c", x: 0, y: 2, w: 9, h: 7 },
  { i: "d", x: 0, y: 10, w: 4, h: 4 },
  { i: "e", x: 4, y: 10, w: 5, h: 7 },
  { i: "f", x: 0, y: 14, w: 4, h: 3 },
  { i: "s0", x: 17, y: 0, w: 5, h: 8 },
  { i: "s1", x: 22, y: 0, w: 5, h: 8 },
  { i: "s2", x: 27, y: 0, w: 5, h: 8 },
  { i: "s3", x: 17, y: 9, w: 5, h: 8 },
  { i: "s4", x: 22, y: 9, w: 5, h: 8 },
  { i: "s5", x: 27, y: 9, w: 5, h: 8 },
];

const layoutWithoutBlank = [
  { i: "a", x: 0, y: 0, w: 2, h: 2 },
  { i: "b", x: 2, y: 0, w: 9, h: 2 },
  { i: "c", x: 0, y: 2, w: 11, h: 7 },
  { i: "d", x: 0, y: 10, w: 5, h: 4 },
  { i: "e", x: 5, y: 10, w: 6, h: 7 },
  { i: "f", x: 0, y: 14, w: 5, h: 3 },
  { i: "s0", x: 11, y: 0, w: 7, h: 8 },
  { i: "s1", x: 18, y: 0, w: 7, h: 8 },
  { i: "s2", x: 25, y: 0, w: 7, h: 8 },
  { i: "s3", x: 11, y: 9, w: 7, h: 8 },
  { i: "s4", x: 18, y: 9, w: 7, h: 8 },
  { i: "s5", x: 25, y: 9, w: 7, h: 8 },
];

const Nurturing = () => {
  const { t } = useTranslation();
  const [needSelect, setNeedSelect] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isSupportVisible, setIsSupportVisible] = useState(false);
  const [supportIndex, setSupportIndex] = useState(1);

  const selected = dbL.chain.get("selected").value();
  const [supports, setSupports] = useState(selected.supports);
  const [player, setPlayer] = useState(selected.player);
  const [raceFilterCondition, setRaceFilterCondition] = useState(
    selected.raceFilterCondition || {
      distanceType: [],
      grade: [],
      ground: [],
    }
  );
  const [filterRace, setFilterRace] = useState(selected.filterRace || {});

  const { db } = useDB();
  const useViewport = () => {
    const [width, setWidth] = React.useState(window.innerWidth);
    const [height, setHeight] = React.useState(window.innerHeight);
    React.useEffect(() => {
      const handleWindowResize = () => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
      };
      window.addEventListener("resize", handleWindowResize);
      return () => window.removeEventListener("resize", handleWindowResize);
    }, []);
    return { height, width };
  };

  const dynamicRowHeight = Math.floor((useViewport().height - 128 - 40) / 18);
  const dynamicGridWidth = Math.floor(useViewport().width - 10);
  const originalLayout = dbL.chain.get("layout").value() || layoutWithoutBlank;
  const [layout, setLayout] = useState(originalLayout);

  if (!db) return null;
  const races = db.chain.get("races").value();

  const showPlayer = () => setIsPlayerVisible(true);
  const closePlayer = () => setIsPlayerVisible(false);
  const handleSelectPlayer = (data) => {
    setIsPlayerVisible(false);
    setPlayer(data);
    selected.player = data;
    dbL.chain.get("selected").assign(selected)
    dbL.write();
  };

  const showSupport = (index) => {
    setNeedSelect(true);
    setIsSupportVisible(true);
    setSupportIndex(index);
  };

  const showSupport2 = () => {
    setNeedSelect(false);
    setIsSupportVisible(true);
  };

  const closeSupport = () => setIsSupportVisible(false);
  const handleSelectSupport = (data) => {
    const newData = { ...supports, [supportIndex]: data };
    setSupports(newData);
    setIsSupportVisible(false);
    selected.supports[supportIndex] = data;
    dbL.chain.get("selected").assign(selected)
    dbL.write();
  };

  const loadDeck = (deck) => {
    selected.supports = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
    selected.player = {};
    if (deck.playerId) {
      selected.player = db.chain.get("players").find({ id: deck.playerId }).value();
    }
    setPlayer(selected.player);
    deck.supportsId.forEach((id, index) => {
      if (id) {
        selected.supports[index] = db.chain.get("supports").find({ id: id }).value();
      }
    });
    setSupports({ ...selected.supports });
    dbL.chain.get("selected").assign(selected)
    dbL.write();
  };

  const onChangeRace = (filterCondition) => {
    setRaceFilterCondition(filterCondition);
    const tmpRaceList = Object.values(filterCondition).some((f) => f.length > 0)
      ? Object.entries(filterCondition)
          .filter(([, filters]) => filters.length > 0)
          .reduce(
            (result, [key, filters]) => result.filter((race) => filters.includes(race[key])),
            races
          )
      : [];

    const tmpFilterRace = {};
    for (let race of tmpRaceList) {
      if (tmpFilterRace[race.dateNum]) {
        tmpFilterRace[race.dateNum].push(race.id);
      } else {
        tmpFilterRace[race.dateNum] = [race.id];
      }
    }

    setFilterRace(tmpFilterRace);
    selected.raceFilterCondition = filterCondition;
    selected.filterRace = tmpFilterRace;
    dbL.chain.get("selected").assign({ ...selected })
    dbL.write();
  };

  const onLayoutChange = (layout) => {
    dbL.chain.set("layout", layout)
    dbL.write();
    setLayout(layout);
  };

  const panelClass = "bg-card border border-border rounded-md p-2";
  const headClass = "w-full text-center bg-muted p-1 rounded-t-md cursor-move font-medium";

  return (
    <>
      <Helmet>
        <title>育成 - 乌拉拉大胜利 - 赛马娘资料站</title>
      </Helmet>

      <GridLayout
        cols={32}
        layout={layout}
        draggableCancel=".panel-title"
        draggableHandle=".panel-heading"
        rowHeight={dynamicRowHeight}
        width={dynamicGridWidth}
        onLayoutChange={onLayoutChange}
        useCSSTransforms={false}
      >
        {/* Player Selection Panel */}
        <div key="a" className={panelClass}>
          <div className={headClass} onClick={showPlayer}>
            {t("选择马娘")}
          </div>
          {player.id ? (
            <img
              src={CDN_SERVER + player.imgUrl}
              alt={player.name}
              className="w-full h-[calc(100%-22px)] object-contain"
              onClick={showPlayer}
            />
          ) : (
            <div className="flex items-center justify-center h-[calc(100%-22px)]">
              <Button variant="outline" onClick={showPlayer}>
                {t("选择马娘")}
              </Button>
            </div>
          )}
        </div>

        {/* Actions Panel */}
        <div key="b" className={panelClass}>
          <div className={headClass}>{t("操作")}</div>
          <div className="flex flex-wrap gap-2 p-2">
            <Button variant="outline" size="sm" onClick={showPlayer}>
              {t("选择马娘")}
            </Button>
            <Button variant="outline" size="sm" onClick={showSupport2}>
              {t("支援卡查询")}
            </Button>
            <BuffButton />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  {t("比赛")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <RaceCheckbox
                  onChange={onChangeRace}
                  raceFilterCondition={raceFilterCondition}
                />
              </PopoverContent>
            </Popover>
            <MyDecks player={player} supports={supports} loadDeck={loadDeck} />
            <RecommendDecks player={player} loadDeck={loadDeck} />
            <Button variant="outline" size="sm" onClick={() => setLayout(layoutWithBlank)}>
              {t("初始化布局(有留白)")}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLayout(layoutWithoutBlank)}>
              {t("初始化布局(无留白)")}
            </Button>
          </div>
        </div>

        {/* Events Panel */}
        <div key="c" className={panelClass}>
          <div className={headClass}>{t("事件")}</div>
          <ScrollArea className="h-[calc(100%-22px)]">
            <EventList idList={player.eventList} sortFlag={true} />
          </ScrollArea>
        </div>

        {/* Skills Panel */}
        <div key="d" className={panelClass}>
          <div className={headClass}>{t("技能")}</div>
          <ScrollArea className="h-[calc(100%-22px)]">
            <SkillList idList={player.skillList} isNur={true} size="small" />
          </ScrollArea>
        </div>

        {/* Races Panel */}
        <div key="e" className={panelClass}>
          <div className={headClass}>{t("比赛")}</div>
          <ScrollArea className="h-[calc(100%-22px)]">
            <RaceTimeline raceList={player.raceList || []} filterRace={filterRace} />
          </ScrollArea>
        </div>

        {/* Hidden Events Panel */}
        <div key="f" className={panelClass}>
          <div className={headClass}>{t("隐藏事件")}</div>
          <ScrollArea className="h-[calc(100%-22px)]">
            <EventList idList={player.hideEvent} />
          </ScrollArea>
        </div>

        {/* Support Cards Panels */}
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const support = supports[index];
          return (
            <div key={`s${index}`} className={panelClass}>
              {support?.id ? (
                <>
                  <div className={headClass}>
                    <span
                      className="panel-title cursor-pointer"
                      onClick={() => showSupport(index)}
                    >
                      {t("选择支援卡")}
                    </span>
                  </div>
                  <ScrollArea className="h-[calc(100%-22px)]">
                    <div className="flex gap-2">
                      <img
                        className="w-1/4 h-auto"
                        src={CDN_SERVER + support.imgUrl}
                        alt={support.name}
                      />
                      <div className="flex-1">
                        <EventList idList={support.eventList} pid={support.id} />
                      </div>
                    </div>
                    <div className="my-1 bg-accent/10 p-1 rounded">
                      {t("培训技能")}
                    </div>
                    <SkillList idList={support.possessionSkill} isNur={true} size="small" />
                    <div className="my-1 bg-accent/10 p-1 rounded">
                      {t("事件技能")}
                    </div>
                    <SkillList idList={support.trainingEventSkill} isNur={true} size="small" />
                  </ScrollArea>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Button variant="outline" onClick={() => showSupport(index)}>
                    {t("选择支援卡")}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </GridLayout>

      {/* Player Selection Dialog */}
      <Dialog open={isPlayerVisible} onOpenChange={setIsPlayerVisible}>
        <DialogContent className="max-w-[80vw]! h-[80vh]">
          <DialogHeader>
            <DialogTitle>{t("选择马娘")}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-full">
            <PlayerList onClick={handleSelectPlayer} sortFlag={true} />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Support Card Selection Dialog */}
      <Dialog open={isSupportVisible} onOpenChange={setIsSupportVisible}>
        <DialogContent className="max-w-[80vw]! h-[80vh]">
          <DialogHeader>
            <DialogTitle>{t("选择支援卡")}</DialogTitle>
          </DialogHeader>
          <div className="h-full flex relative">
            <SupportListWithFilter
              formName="nurSup"
              onClick={needSelect ? handleSelectSupport : null}
              limitHeight={true}
              sortFlag={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Nurturing;
