import React from "react";
import UpdateLibrary from "./update-library";
import Layout from "../layout/page";

const UpdateCreateLibraryPage = ({
  libraryId,
  videoURl,
}: {
  libraryId: string | null;
  videoURl?: string;
}) => {
  return (
    <Layout>
      <UpdateLibrary libraryId={libraryId as string} videoURl={videoURl} />
    </Layout>
  );
};

export default UpdateCreateLibraryPage;
