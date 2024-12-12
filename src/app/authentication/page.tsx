import React, { Suspense } from "react";

import Loading from "@/src/components/loading";
import AuthenticationScreen from "@/src/pages/authentication/page";
import { ContextCollection } from "@/src/(context)/context-collection";

const Authentication: React.FC = () => {
  return (
    <>
      <Suspense fallback={<Loading diffHeight={600} />}>
        <ContextCollection>
          <div className="flex justify-center items-center">
            <AuthenticationScreen />
          </div>
        </ContextCollection>
      </Suspense>
    </>
  );
};

export default Authentication;
