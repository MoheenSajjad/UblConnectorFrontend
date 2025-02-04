import * as React from "react";
import { ArrowLeftIcon } from "@/components/icons/arrow-left";

import { Badge } from "../Badge";
import Tooltip from "../Tooltip/Tooltip";
import { IconButton } from "../IconButton";

type ActionbarProps = {
  title: string;
  children?: React.ReactNode;
  totalCount?: number;
  backBtn?: boolean;
};

export const Actionbar = ({
  title,
  children,
  totalCount,
  backBtn,
}: ActionbarProps): JSX.Element => {
  return (
    <div className=" ">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium font-poppins text[#2b2e27] tracking-wider">
          <div className="flex items-center gap-2">
            {backBtn && (
              <Tooltip content="Back" position={Tooltip.Position.BottomRight}>
                <IconButton
                  icon={<ArrowLeftIcon />}
                  onClick={() => window.history.back()}
                  className="hover:bg-white hover:text-hoverPrimary"
                />
              </Tooltip>
            )}
            <div>
              {" "}
              {title} {totalCount && <Badge count={totalCount} />}
            </div>
          </div>
        </h2>
        <div className="flex items-center space-x-3">{children}</div>
      </div>
    </div>
  );
};
