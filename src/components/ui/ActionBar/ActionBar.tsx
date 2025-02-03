import * as React from "react";
import { LucideArrowLeft } from "lucide-react";

import { Badge } from "../Badge";
import Tooltip from "../Tooltip/Tooltip";

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
                <BackIcon />
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

const BackIcon = () => {
  return (
    <svg
      className="bztBQcm0 hover:text-blue-400"
      xmlns="https://http://www.w3.org/2000/svg"
      height="1.5em"
      width="2em"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      fill-rule="evenodd"
      clip-rule="evenodd"
    >
      <g>
        <path d="M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12M12 1.1C5.98 1.1 1.1 5.98 1.1 12S5.98 22.9 12 22.9 22.9 18.02 22.9 12 18.02 1.1 12 1.1"></path>
        <path d="m9.658 15.89-3.5-3.501a.55.55 0 0 1 0-.778l3.5-3.5a.55.55 0 0 1 .778.778L7.875 11.45h9.574a.55.55 0 1 1 0 1.1H7.875l2.561 2.561a.55.55 0 0 1-.778.778"></path>
      </g>
    </svg>
  );
};
