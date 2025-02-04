import React from "react";
import Tooltip from "@/components/ui/Tooltip/Tooltip";

interface TransactionDetailRowProps {
  label: string;
  value: string;
  underline?: boolean;
  tooltip?: string;
}

export const TransactionDetailRow: React.FC<TransactionDetailRowProps> = ({
  label,
  value,
  underline,
  tooltip,
}) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-secondary font-bold mr-2 whitespace-nowrap">
        {label}:
      </span>
      <div>
        {tooltip ? (
          <Tooltip content={tooltip} position={Tooltip.Position.Right}>
            <span
              className={`text-gray-700 ${
                underline &&
                "border-secondary border-b-[1px] border-dashed cursor-default"
              }`}
            >
              {value}
            </span>
          </Tooltip>
        ) : (
          <span
            className={`text-gray-700 ${
              underline &&
              "border-secondary border-b-[1px] border-dashed cursor-default"
            }`}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
};

interface TransactionDetailLinkProps {
  text: string;
}

export const TransactionDetailLink: React.FC<TransactionDetailLinkProps> = ({
  text,
}) => {
  return (
    <div className="cursor-pointer w-max">
      <div className="text-primary font-poppins tracking-wider overflow-hidden hover:underline">
        {text}
      </div>
    </div>
  );
};
// the below code can be used for dot notation componenet

// import React from "react";
// import Tooltip from "@/components/ui/Tooltip/Tooltip";

// interface TransactionDetailRowProps {
//   children: React.ReactNode;
//   underline?: boolean;
//   tooltip?: string;
// }

// interface LabelProps {
//   children: React.ReactNode;
// }

// interface ValueProps {
//   children: React.ReactNode;
//   underline?: boolean;
//   tooltip?: string;
// }

// export const TransactionDetailRow: React.FC<TransactionDetailRowProps> & {
//   Label: React.FC<LabelProps>;
//   Value: React.FC<ValueProps>;
// } = ({ children, underline, tooltip }) => {
//   return (
//     <div className="flex items-center justify-between mb-3">{children}</div>
//   );
// };

// const Label: React.FC<LabelProps> = ({ children }) => {
//   return (
//     <span className="text-secondary font-bold mr-2 whitespace-nowrap">
//       {children}:
//     </span>
//   );
// };

// const Value: React.FC<ValueProps> = ({ children, underline, tooltip }) => {
//   return (
//     <div>
//       {tooltip ? (
//         <Tooltip content={tooltip} position={Tooltip.Position.Right}>
//           <span
//             className={`text-gray-700 ${
//               underline &&
//               "border-secondary border-b-[1px] border-dashed cursor-default"
//             }`}
//           >
//             {children}
//           </span>
//         </Tooltip>
//       ) : (
//         <span
//           className={`text-gray-700 ${
//             underline &&
//             "border-secondary border-b-[1px] border-dashed cursor-default"
//           }`}
//         >
//           {children}
//         </span>
//       )}
//     </div>
//   );
// };

// // Assign Label and Value as static properties of TransactionDetailRow
// TransactionDetailRow.Label = Label;
// TransactionDetailRow.Value = Value;
