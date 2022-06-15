import React, { useState } from "react";
import { useRouter } from "next/router";

import Navbar from "@material-tailwind/react/Navbar";
import NavbarContainer from "@material-tailwind/react/NavbarContainer";
import NavbarWrapper from "@material-tailwind/react/NavbarWrapper";
import NavbarBrand from "@material-tailwind/react/NavbarBrand";
import NavbarToggler from "@material-tailwind/react/NavbarToggler";
import NavbarCollapse from "@material-tailwind/react/NavbarCollapse";
import Nav from "@material-tailwind/react/Nav";
import NavLink from "@material-tailwind/react/NavLink";

import { useTranslation } from "react-i18next";

import useUa from "/hooks/useUa";
import LanButton from "components/LanButton";
import dbL from "src/dbL.js";
import { CDN_SERVER, PC_MENU_LIST, MOBILE_MENU_LIST } from "src/config";
const Layout = ({ children, contentClass, rootClass }) => {
  const { t } = useTranslation();
  const [openNavbar, setOpenNavbar] = useState(false);
  const ua = useUa();
  const router = useRouter();
  const resetNur = () => {
    dbL
      .set("selected", {
        supports: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {} },
        player: {},
        races: [],
      })
      .write();
  };

  const list = ua.isPhone ? MOBILE_MENU_LIST : PC_MENU_LIST;
  return (
    <div className={"flex flex-col w-screen min-h-screen relative"}>
      <Navbar className="sticky top-0 z-50" color="lightBlue" navbar>
        <NavbarContainer>
          <NavbarWrapper>
            <NavbarBrand>赛马娘</NavbarBrand>
            <NavbarToggler
              color="white"
              onClick={() => setOpenNavbar(!openNavbar)}
              ripple="light"
            />
          </NavbarWrapper>

          <NavbarCollapse open={openNavbar}>
            <Nav leftSide>
              {list.map((item) => (
                // <Link to={item.path} onClick={() => setOpenNavbar(!openNavbar)}>
                <NavLink
                  key={item.path}
                  // href={item.path}
                  onClick={() => {
                    setOpenNavbar(!openNavbar);
                    router.push(item.path);
                  }}
                  active={router.pathname === item.path ? "light" : "normal"}
                  ripple="light"
                >
                  {t(item.title)}
                </NavLink>
                // </Link>
              ))}
            </Nav>
          </NavbarCollapse>
        </NavbarContainer>
      </Navbar>
      {children}
      <div className="w-full flex items-center flex-wrap pb-10 md:pb-0">
        <div className="cursor-pointer" data-tip="无法打开育成页面时点一哈" onClick={resetNur}>
          {t("初始化育成")}
        </div>
        <LanButton />
        <div className="flex-auto"></div>
        <iframe
          title="GitHub"
          src="https://ghbtns.com/github-btn.html?user=wrrwrr111&repo=pretty-derby&type=star&count=true&size=large&v=2"
          frameBorder="0"
          scrolling="0"
          width="160px"
          height="30px"
        ></iframe>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://qm.qq.com/cgi-bin/qm/qr?k=f2Q2MIqkkxiiYq-sfRYmI7E4v17-r3V2&jump_from=webapi"
          data-tip={`
          <img src=${CDN_SERVER + "img/q.jpg"} width={300} />
          <p>${t("闲聊为主")}</p>
          `}
        >
          <img
            border="0"
            src="//pub.idqqimg.com/wpa/images/group.png"
            alt="轻 松 赛 马"
            title="轻 松 赛 马"
          />
        </a>
        <div
          className="flex mx-2 items-center"
          data-tip={`<img src=${CDN_SERVER + "img/weapp.jpg"} width={200} />`}
        >
          <img alt="reimu" src={CDN_SERVER + "reimu.gif"} preview="false" width={24} />
          <div>{t("微信小程序")}</div>
        </div>
      </div>
    </div>
  );
};
export default Layout;
