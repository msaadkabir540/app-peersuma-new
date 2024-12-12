import React from "react";

import Navbar from "./navbar";

import style from "./layout.module.scss";

const Layout = ({
  children,
  handlePageRedirect,
  handleSelectedClients,
}: {
  handlePageRedirect?: () => void;
  handleSelectedClients?: ({ data }: { data: any }) => void;
  children: React.ReactNode;
}) => {
  return (
    <div className={style.layoutWrapper}>
      <main>
        <Navbar
          handlePageRedirect={handlePageRedirect}
          handleSelectedClients={handleSelectedClients}
        />
        <div className={style.layoutWrapperInnerClass}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
