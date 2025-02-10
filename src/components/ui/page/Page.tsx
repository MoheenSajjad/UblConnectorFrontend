import * as React from "react";

type PageProps = {
  title: string;
  children?: React.ReactNode;
};

export const Page = ({ title, children }: PageProps): JSX.Element => {
  React.useEffect(() => {
    document.title = `${title} | Al-Telal PoS Portal`;
  }, [title]);

  return <React.Fragment>{children}</React.Fragment>;
};
