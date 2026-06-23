import React, { useEffect } from "react";
import PlayerList from "@/components/player/PlayerList";
import { Helmet } from "react-helmet";

//todo filter
const Player = (props) => {

  return (
    <>
      <Helmet>
        <title>角色 - 乌拉拉大胜利 - 赛马娘资料站</title>
      </Helmet>
      <PlayerList className="justify-between" sortFlag={true} onClick={props.onClick} />;
    </>
  );
};

export default Player;
