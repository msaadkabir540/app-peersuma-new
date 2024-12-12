import React from "react";

import EmbedComponent from "@/src/pages/embed";

const Embed = ({ params }: { params: { embed: string } }) => {
  const { embed } = params;

  return <EmbedComponent id={embed} />;
};

export default Embed;
