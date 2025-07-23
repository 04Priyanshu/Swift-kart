import TitleBorder from "apps/user-ui/src/assets/svgs/title-border";
import React from "react";

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="relative">
      <h1 className="md:text-3xl text-xl font-semibold z-10">{title}</h1>
      <TitleBorder className="absolute top-[46%]" />
    </div>
  );
};

export default SectionTitle;
