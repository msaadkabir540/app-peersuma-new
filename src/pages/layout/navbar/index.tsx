"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "usehooks-ts";
import { usePathname, useRouter } from "next/navigation";
import React, { memo, useState, useRef, useEffect, useMemo } from "react";

import Selection from "@/src/components/selection";

import { useOutsideClickHook } from "@/src/helper/helper";
import { useClients } from "@/src/(context)/context-collection";

import ImageComponent from "@/src/components/image-component";

import { OptionType } from "@/src/components/selection/selection-interface";
import { RoleInterface } from "@/src/app/interface/user-interface/user-interface";

import style from "./navbar.module.scss";

const Navbar = ({
  handlePageRedirect,
  handleSelectedClients,
}: {
  handlePageRedirect?: () => void;
  handleSelectedClients?: ({ data }: { data: any }) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const navbarRef = useRef<HTMLInputElement>(null);

  const isMobile = useMediaQuery("(max-width: 770px)");

  const { control, setValue, watch } = useForm<{
    selectedClients: { label: string; value: string };
  }>();

  const [userName, setUserName] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const [isMenu, setIsMenu] = useState<boolean>(false);

  const [prevScrollPos, setPrevScrollPos] = useState<number>(20);

  const context = useClients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const clientList = context ? context.clientList : [];
  const loggedInUser = context ? context.loggedInUser : {};
  const currentUserRole = context && context?.currentUserRole;
  const selectedClientIds = context && context.selectedClientIds;
  const handleSelectedClient = context && context.handleSelectedClient;

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos > prevScrollPos) {
      if (Math.floor(Number(currentScrollPos)) < 500) {
        const span = navbarRef?.current; // corresponding DOM node
        if (span) span.className = style?.visible;
      } else {
        const span = navbarRef?.current; // corresponding DOM node
        if (span) span.className = style?.hidden;
      }
    } else if (currentScrollPos < prevScrollPos) {
      const span = navbarRef?.current; // corresponding DOM node
      if (span) span.className = style?.visible;
    }

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevScrollPos]);

  const handleLogout = async () => {
    handlePageRedirect?.();
    localStorage.clear();
    router.push("/login");
    if (pathName?.includes(pathname as string)) {
      localStorage.setItem("redirect_url", pathname as string);
    }
  };

  const handleSelectionChange = (value: string) => {
    handleSelectedClient?.({ data: value });
    handleSelectedClients?.({ data: value });
  };

  const handleActive = () => {
    setActive(!active);
  };

  const handleIsMenu = () => {
    if (pathName?.includes(pathname as string)) {
      localStorage.setItem("redirect_url", pathname as string);
    }
    setIsMenu(!isMenu);
  };

  useEffect(() => {
    if (selectedClientIds != "undefined" && selectedClientIds) {
      const sleetedClientId = clientList?.find((client) => {
        return client?.value === selectedClientIds;
      });
      setValue?.("selectedClients", sleetedClientId!);
    }
  }, [selectedClientIds, clientList, setValue]);

  const disabled = useMemo(() => {
    return disableDropDown?.includes(pathname!) || pathname?.split("/")?.includes("produce");
  }, [pathname]);

  useOutsideClickHook(navbarRef, () => {
    setIsMenu(false);
  });

  const getVisibleTabs = useMemo(
    () => (role: RoleInterface) => {
      const accessibleTabs = rolesAccess?.[role] || [];
      return navTabs.filter((tab) => accessibleTabs.includes(tab.title));
    },
    [],
  );

  const visibleTabs = useMemo(
    () => getVisibleTabs(currentUserRole as RoleInterface),
    [currentUserRole],
  );

  const navBarTabs = useMemo(() => {
    return visibleTabs?.map((navbar) => {
      const isActive =
        navbar?.match.some((x) => pathname?.includes(x)) || navbar.route === pathname;
      return {
        title: navbar?.title,
        route: navbar?.route,
        activeClass: isActive ? style.path : "",
      };
    });
  }, [pathname, visibleTabs]);

  const handlePageRedirects = ({ url }: { url: string }) => {
    if (pathName?.includes(url as string)) {
      localStorage.setItem("redirect_url", url as string);
    }
    handlePageRedirect?.();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && loggedInUser) {
      localStorage.setItem("userName", loggedInUser?.username);
      const storedUserName = loggedInUser?.username || localStorage.getItem("userName") || "";
      setUserName(storedUserName);
    }
  }, [loggedInUser]);

  return (
    <div
      ref={navbarRef}
      style={{
        position: "fixed",
        top: "0px",
        zIndex: "100",
        padding: `${isMobile ? "13px 20px" : "15px 40px"}`,
        width: "100%",
        boxShadow: "0 0 7px 3px #0000004a",
        borderBottom: pathname?.includes("produce/") ? "" : "4px solid #ed1c24",
        background: "#0f0f0f",
      }}
    >
      <div className={`${style.main} `}>
        <div className="md:hidden block ">
          <ImageComponent
            onClick={handleActive}
            className={style.hamburger}
            src={"/assets/hamburger.svg"}
            alt="logo"
            priority={true}
          />
        </div>
        <div className="flex justify-between items-center md:gap-10 ">
          <Link aria-label="sprintx home" href="/">
            <ImageComponent
              className={style.logo}
              src={"/assets/peersuma-logo.png"}
              alt="logo"
              priority={true}
            />
          </Link>
          <ul className={style.list}>
            {navBarTabs?.map((navbar) => (
              <li key={navbar?.title}>
                <Link
                  href={navbar?.route}
                  aria-label="peersuma"
                  onClick={() => handlePageRedirects({ url: navbar?.route })}
                  className={`${style.a} ${navbar?.activeClass}`}
                >
                  {navbar?.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={style.btnDiv}>
          <div
            className={`${style.mySelect} ${disabled || (clientList?.length as any) <= 1 || (clientList === undefined && style.curserNone)}`}
          >
            <Selection
              paddingLeft={"0px"}
              isSearchable={false}
              control={control}
              placeholder="No Client"
              isDisabled={disabled || (clientList?.length as any) <= 1 || clientList === undefined}
              name="selectedClients"
              id="selectedClients"
              customBorder={"none"}
              customHeight={"24px"}
              customPadding={true}
              options={clientList as OptionType[]}
              className={`!w-full  !bg-[#0F0F0F] ${((clientList?.length as any) <= 1 || clientList === undefined) && style.curserNone}`}
              customBackgroundColor={"black !important"}
              customColorSingleValue={"white"}
              customPaddingBottom={"0px"}
              costumPaddingLeft={"10px"}
              customIcon={"/assets/drop-down-white.svg"}
              customFuncOnChange={handleSelectionChange}
              customeFontWeight={"600 !important"}
              placeholderWidth={isMobile ? "100px" : "100px"}
              customeFontSize={isMobile ? "15px !important" : ""}
              singleValueMaxWidth={isMobile ? "100px !important" : ""}
              singleValueMinWidth={isMobile ? "100px !important" : ""}
              customBoxShadow={"0px 2px 4px 0px rgba(0, 0, 0, 0.25)"}
              customeStyles={{ border: "1px solid white !important", borderRadius: "5px" }}
              imageClass={style.imageClass}
              iconClass={
                disabled || (clientList?.length as any) <= 1 || clientList === undefined
                  ? style.noIcon
                  : style.iconClass
              }
            />
          </div>
          <div className={style.logoutDiv}>
            <Image
              data-testid="close-icon"
              style={{
                borderRadius: "10px",
              }}
              src={"/assets/user-white.svg"}
              alt="sortUp"
              height="100"
              width="100"
            />
            <div className="text-white md:block hidden">{userName}</div>
            <div className={`${style.icon}`}>
              <Image
                data-testid="close-icon"
                style={{
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
                onClick={handleIsMenu}
                src={"/assets/drop-down-white.svg"}
                alt="dropDown"
                height="100"
                width="100"
              />
            </div>
          </div>
        </div>
      </div>

      {isMenu && (
        <div className={`absolute  ${style.menuContainer}`}>
          <div className={style.menuClass}>
            <Image
              data-testid="close-icon"
              style={{
                borderRadius: "10px",
              }}
              src={"/assets/user-black.svg"}
              alt="sortUp"
              height="100"
              width="100"
            />
            <div className="">{userName}</div>
          </div>

          <Link href={"/my-setting"} onClick={handleIsMenu}>
            <div>My Settings</div>
          </Link>
          {allowRoles?.includes(currentUserRole!) && (
            <>
              <Link href={"/school-setting"} onClick={handleIsMenu}>
                <div>School Settings</div>
              </Link>
              <Link href={"/user"} onClick={handleIsMenu}>
                <div>User Management</div>
              </Link>
              <Link href={"/widgets"} onClick={handleIsMenu}>
                <div>Widgets</div>
              </Link>
            </>
          )}

          <div className={` ${style.logoutBox}`} onClick={handleLogout}>
            <Image
              data-testid="close-icon"
              style={{
                borderRadius: "10px",
              }}
              src={"/assets/logout.svg"}
              alt="sortUp"
              height="500"
              width="500"
            />
            Logout
          </div>
        </div>
      )}

      {active && (
        <div className={style.backDropDiv}>
          <div className={style.sideBar}>
            <Image
              data-testid="close-icon"
              style={{
                borderRadius: "10px",
              }}
              onClick={handleActive}
              src={"/assets/arrow-right.svg"}
              alt="sortUp"
              height="100"
              width="100"
              className={style.backClickClass}
            />

            <Image
              data-testid="close-icon"
              style={{
                borderRadius: "10px",
              }}
              src={"/assets/peersuma-logo.png"}
              alt="sortUp"
              height="100"
              width="100"
            />
          </div>
          <div
            className={`${style.mySelect} ${disabled || (clientList?.length as any) <= 1 || (clientList === undefined && style.curserNone)}`}
          >
            <Selection
              paddingLeft={"0px"}
              isSearchable={false}
              control={control}
              placeholder="No Client"
              isDisabled={disabled || (clientList?.length as any) <= 1 || clientList === undefined}
              name="selectedClients"
              id="selectedClients"
              customBorder={"none"}
              customHeight={"24px"}
              customPadding={true}
              options={clientList as OptionType[]}
              className={`!w-full  !bg-[#0F0F0F] ${((clientList?.length as any) <= 1 || clientList === undefined) && style.curserNone}`}
              customBackgroundColor={"black !important"}
              customColorSingleValue={"white"}
              customPaddingBottom={"0px"}
              costumPaddingLeft={"10px"}
              customIcon={"/assets/drop-down-white.svg"}
              customFuncOnChange={handleSelectionChange}
              customeFontWeight={"600 !important"}
              placeholderWidth={"100px"}
              customBoxShadow={"0px 2px 4px 0px rgba(0, 0, 0, 0.25)"}
              customeStyles={{ border: "1px solid white !important", borderRadius: "5px" }}
              imageClass={style.imageClass}
              iconClass={
                disabled || (clientList?.length as any) <= 1 || clientList === undefined
                  ? style.noIcon
                  : style.iconClass
              }
            />
          </div>

          <div>
            <ul className={style.list}>
              {navBarTabs?.map((navbar) => (
                <li key={navbar?.title} className={`${style.a} ${navbar?.activeClass}`}>
                  <Link
                    aria-label="sprintx home"
                    href={navbar?.route}
                    onClick={() => handlePageRedirects({ url: navbar?.route })}
                  >
                    {navbar?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Navbar);

const navTabs = [
  { title: "Plan", route: "/plan", match: ["plan"] },
  { title: "Project", route: "/", match: ["produce"] },
  {
    title: "Library",
    route: "/library",
    match: ["library"],
  },
];

const rolesAccess: Record<RoleInterface, string[]> = {
  producer: ["Plan", "Project"],
  "executive-producer": ["Plan", "Project", "Library"],
  backend: ["Plan", "Project", "Library"],
};

const allowRoles = ["executive-producer", "backend"];

const disableDropDown = ["/produce/", "/widgets/", "/update-library", "/create-library"];

const pathName = ["/plan", "/", "/library", "/widgets", "/my-setting", "/school-setting", "/user"];
