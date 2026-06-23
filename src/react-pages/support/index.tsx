import React from "react";
import SupportListWithFilter from "@/components/support/SupportListWithFilter";
import { Helmet } from "react-helmet";

const Support = () => {
  return (
    <>
      <Helmet>
        <title>支援 - 乌拉拉大胜利 - 赛马娘资料站</title>
      </Helmet>
      <SupportListWithFilter />;
    </>
  );
};
export default Support;
