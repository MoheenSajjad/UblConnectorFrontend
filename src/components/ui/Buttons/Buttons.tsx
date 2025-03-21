import React, { useState } from "react";
import { Button, ButtonSize, ButtonVariant } from "../Button";
import {
  ArchiveIcon,
  CheckIcon,
  CopyIcon,
  EyeIcon,
  FilterIcon,
  PlusIcon,
  RefreshIcon,
  XArchiveIcon,
  EditIcon,
} from "@/components/icons";
import { IconButton } from "../IconButton";
import Tooltip from "../Tooltip/Tooltip";

type AddNewButtonProps = {
  onClick: () => void;
};
export const AddNewButton = ({ onClick }: AddNewButtonProps) => {
  return (
    <Button
      variant={ButtonVariant.Primary}
      size={ButtonSize.Medium}
      icon={<PlusIcon />}
      onClick={onClick}
    >
      Add New
    </Button>
  );
};

interface CopyButtonProps {
  text: string;
}

export const CopyButton = ({ text }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  };

  return (
    <div
      onClick={handleCopy}
      className={`flex items-center rounded-lg cursor-pointer ml-auto py-1 px-3 absolute right-3 top-2 w-max ${
        isCopied ? "bg-green-500/10" : "bg-gray-200"
      } text-gray-700`}
    >
      {isCopied ? (
        <>
          <CheckIcon className="text-green-500" />
          <span className="text-sm ml-2 font-medium tracking-wider text-green-500 overflow-hidden break-words">
            Copied
          </span>
        </>
      ) : (
        <>
          <CopyIcon />
          <span className="text-sm ml-2 font-medium tracking-wider text-gray-700 overflow-hidden break-words">
            Copy
          </span>
        </>
      )}
    </div>
  );
};

type DeleteButtonProps = {
  isDeleted: boolean;
  onClick: () => void;
};

export const DeleteButton = ({ isDeleted, onClick }: DeleteButtonProps) => {
  return (
    <Tooltip
      content={isDeleted ? "Recover" : "Delete"}
      position={Tooltip.Position.Top}
    >
      <IconButton
        icon={
          isDeleted ? (
            <XArchiveIcon className="text-danger" />
          ) : (
            <ArchiveIcon className="text-danger" />
          )
        }
        onClick={onClick}
      />
    </Tooltip>
  );
};

export const FilterButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <Button
      variant={ButtonVariant.Outline}
      size={ButtonSize.Medium}
      icon={<FilterIcon />}
      onClick={onClick}
    >
      Filter
    </Button>
  );
};

type RefreshButtonProps = {
  handleRefresh: () => void;
};
export const RefreshButton = ({ handleRefresh }: RefreshButtonProps) => {
  return (
    <Button
      variant={ButtonVariant.Secondary}
      size={ButtonSize.Medium}
      icon={<RefreshIcon />}
      onClick={handleRefresh}
    >
      Refresh
    </Button>
  );
};

type ViewButtonProps = {
  onClick: () => void;
  isDisabled?: boolean;
};

export const ViewButton = ({ onClick, isDisabled }: ViewButtonProps) => {
  return (
    <Tooltip
      content={isDisabled ? "Record Deleted" : "View Details"}
      position={Tooltip.Position.Top}
    >
      <IconButton
        icon={<EyeIcon />}
        onClick={onClick}
        isDisabled={isDisabled}
      />
    </Tooltip>
  );
};

type EditButtonProps = {
  onClick: () => void;
  isDisabled?: boolean;
};

export const EditButton = ({ onClick, isDisabled }: EditButtonProps) => {
  return (
    <Tooltip content={"Edit Payload"} position={Tooltip.Position.Top}>
      <IconButton
        icon={<EditIcon />}
        onClick={onClick}
        isDisabled={isDisabled}
      />
    </Tooltip>
  );
};
