export enum TagTypeStyles {
  ON_TRACK = "bg-green-100 text-green-700 ",
  WARNING = "bg-orange-100 text-orange-700 ",
  ERROR = "bg-red-100 text-red-700",
  ACTIVE = "bg-blue-100 text-blue-700",
  INFO = "bg-teal-100 text-teal-700",
  INACTIVE = "bg-gray-100 text-gray-700",
}

enum TagDotColors {
  ON_TRACK = "bg-green-700",
  WARNING = "bg-orange-700",
  ERROR = "bg-red-700",
  ACTIVE = "bg-blue-700",
  INFO = "bg-teal-700",
  INACTIVE = "bg-gray-700",
}

type TagProps = {
  type: TagTypeStyles;
  label: string;
  className?: string;
  onClick?: () => void;
};

type TagComponent = {
  (props: TagProps): JSX.Element;
  type: typeof TagTypeStyles;
};

export const Tag: TagComponent = ({
  type = TagTypeStyles.ON_TRACK,
  label,
  className = "",
  onClick,
}: TagProps) => {
  const dotColor =
    type === TagTypeStyles.ON_TRACK
      ? TagDotColors.ON_TRACK
      : type === TagTypeStyles.WARNING
      ? TagDotColors.WARNING
      : type === TagTypeStyles.ERROR
      ? TagDotColors.ERROR
      : type === TagTypeStyles.ACTIVE
      ? TagDotColors.ACTIVE
      : type === TagTypeStyles.INFO
      ? TagDotColors.INFO
      : TagDotColors.INACTIVE;

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${type} ${className}`}
      onClick={onClick}
    >
      <span
        className={`w-2 h-2 rounded-full mr-2 ${dotColor}`}
        aria-hidden="true"
      ></span>
      {label}
    </div>
  );
};

Tag.type = TagTypeStyles;
