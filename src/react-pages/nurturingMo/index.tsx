import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import shortid from "shortid";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { SquarePen } from "lucide-react";
import { useDB } from "@/hooks/useDB";
import dbL from "@/dbL";
import { useTranslation } from "react-i18next";
import SupportListWithFilter from "@/components/support/SupportListWithFilter";
import PlayerList from "@/components/player/PlayerList";
import { RaceTimeline, RaceCheckbox } from "@/components/race";
import { CDN_SERVER } from "@/config";
import { Helmet } from "react-helmet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

const Nurturing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [needSelect, setNeedSelect] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isSupportVisible, setIsSupportVisible] = useState(false);
  const [supportIndex, setSupportIndex] = useState(1);
  const [confirmAction, setConfirmAction] = useState({
    type: "",
    deck: null,
    open: false,
  });

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
  const [decks, setDecks] = useState(dbL.chain.get("myDecks").value());

  const { db } = useDB();
  if (!db) return null;
  const races = db.chain.get("races").value();

  const showPlayer = () => setIsPlayerVisible(true);
  const closePlayer = () => setIsPlayerVisible(false);

  const handleSelectPlayer = (data) => {
    setPlayer(data);
    selected.player = data;
    dbL.chain.get("selected").assign(selected)
    dbL.write();
    closePlayer();
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
    selected.supports[supportIndex] = data;
    dbL.chain.get("selected").assign(selected)
    dbL.write();
    closeSupport();
  };

  const handleSelectSupportShow = (data) => {
    navigate(`/support-detail/${data.id}`);
    closeSupport();
  };

  // Deck operations
  const saveDeck = (deck = null) => {
    let tmpDeck = {
      imgUrls: [],
      supportsId: [],
    };

    if (player?.id) {
      tmpDeck.playerId = player.id;
      tmpDeck.imgUrls.push(player.imgUrl);
    }

    [0, 1, 2, 3, 4, 5].forEach((index) => {
      if (supports[index]?.id) {
        tmpDeck.imgUrls.push(supports[index].imgUrl);
        tmpDeck.supportsId.push(supports[index].id);
      } else {
        tmpDeck.supportsId.push(null);
      }
    });

    if (deck) {
      dbL.chain.get("myDecks").find({ id: deck.id }).assign(tmpDeck)
      dbL.write();
      toast.info("卡组已更新");
    } else {
      tmpDeck.id = shortid.generate();
      dbL.chain.get("myDecks").push(tmpDeck)
      dbL.write();
      toast.info("新卡组已保存");
    }

    setDecks([...dbL.chain.get("myDecks").value()]);
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
        selected.supports[index] = db.chain.get("supports").find({ id }).value();
      }
    });

    setSupports({ ...selected.supports });
    db.chain.get("selected").assign(selected)
    dbL.write();
    toast.info("卡组已加载");
  };

  const deleteDeck = (deck) => {
    dbL.chain.get("myDecks").remove({ id: deck.id })
    dbL.write();
    setDecks([...dbL.chain.get("myDecks").value()]);
    toast.info("卡组已删除");
  };

  const handleConfirmAction = () => {
    switch (confirmAction.type) {
      case "save":
        saveDeck(confirmAction.deck);
        break;
      case "delete":
        deleteDeck(confirmAction.deck);
        break;
      default:
        break;
    }
    setConfirmAction({ ...confirmAction, open: false });
  };

  const onChangeRace = (filterCondition) => {
    setRaceFilterCondition(filterCondition);

    let tmpRaceList = Object.values(filterCondition).some((f) => f.length > 0)
      ? Object.entries(filterCondition)
          .filter(([, filters]) => filters.length > 0)
          .reduce(
            (result, [key, filters]) => result.filter((race) => filters.includes(race[key])),
            races
          )
      : [];

    let tmpFilterRace = {};
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
    dbL.chain.get("selected").assign(selected)
    dbL.write();
  };

  const toSupportDetail = (id) => navigate(`/support-detail/${id}`);
  const toPlayerDetail = (id) => navigate(`/player-detail/${id}/1`);
  const toBuffList = () => navigate(`/buff`);

  return (
    <>
      <Helmet>
        <title>育成 - 乌拉拉大胜利 - 赛马娘资料站</title>
      </Helmet>

      <div className="flex flex-col items-center gap-4 p-4">
        <div className="flex items-center gap-4 w-full">
          {player?.imgUrl && (
            <img
              src={CDN_SERVER + player.imgUrl}
              alt={player.imgUrl}
              className="w-32 h-32 object-cover rounded-md cursor-pointer"
              onClick={() => toPlayerDetail(player.id)}
            />
          )}

          <div className="flex flex-wrap gap-2 flex-1">
            <Button variant="outline" onClick={showPlayer}>
              {t("选择马娘")}
            </Button>
            <Button variant="outline" onClick={showSupport2}>
              {t("支援卡查询")}
            </Button>
            <Button variant="outline" onClick={toBuffList}>
              {t("BUFF")}
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button>{t("比赛")}</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <RaceCheckbox onChange={onChangeRace} raceFilterCondition={raceFilterCondition} />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button>{t("我的卡组")}</Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-w-2xl">
                <div className="space-y-4">
                  <Button variant="outline" onClick={() => saveDeck()}>
                    {t("保存为新卡组")}
                  </Button>

                  <div className="space-y-2">
                    {decks.map((deck) => (
                      <div key={deck.id} className="flex items-center gap-2 p-2 border rounded">
                        <div className="flex flex-wrap gap-1">
                          {deck.imgUrls.map((imgUrl) => (
                            <img
                              key={imgUrl}
                              src={CDN_SERVER + imgUrl}
                              alt={imgUrl}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ))}
                        </div>

                        <div className="flex gap-2 ml-auto">
                          <Button variant="outline" size="sm" onClick={() => loadDeck(deck)}>
                            {t("读取")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setConfirmAction({
                                type: "save",
                                deck,
                                open: true,
                              })
                            }
                          >
                            {t("覆盖")}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setConfirmAction({
                                type: "delete",
                                deck,
                                open: true,
                              })
                            }
                          >
                            {t("删除")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => showSupport(index)}
                className="w-full"
              >
                <SquarePen className="h-4 w-4 mr-2" />
                {t("选择支援卡")}
              </Button>
              {supports[index]?.id && (
                <img
                  src={CDN_SERVER + supports[index].imgUrl}
                  alt={supports[index].name}
                  className="w-full h-auto rounded-md cursor-pointer"
                  onClick={() => toSupportDetail(supports[index].id)}
                />
              )}
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="w-full">
          <h3 className="text-lg font-medium mb-2">{t("比赛")}</h3>
          <ScrollArea className="h-[400px] w-full border rounded p-4">
            <RaceTimeline raceList={player?.raceList} filterRace={filterRace} />
          </ScrollArea>
        </div>
      </div>

      <Dialog open={isPlayerVisible} onOpenChange={setIsPlayerVisible}>
        <DialogContent className="max-w-[90vw] h-[80vh]">
          <DialogHeader>
            <DialogTitle>{t("选择马娘")}</DialogTitle>
          </DialogHeader>
          <PlayerList sortFlag={true} onClick={handleSelectPlayer} />
        </DialogContent>
      </Dialog>

      <Dialog open={isSupportVisible} onOpenChange={setIsSupportVisible}>
        <DialogContent className="max-w-[90vw] h-[80vh]">
          <DialogHeader>
            <DialogTitle>{t("选择支援卡")}</DialogTitle>
          </DialogHeader>
          <SupportListWithFilter
            formName="nurSupMo"
            onClick={needSelect ? handleSelectSupport : handleSelectSupportShow}
            sortFlag={true}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmAction.open}
        onOpenChange={(open) => setConfirmAction({ ...confirmAction, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认操作</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction.type === "save" && "确认覆盖此卡组？"}
              {confirmAction.type === "delete" && "确认删除此卡组？"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>确认</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Nurturing;
