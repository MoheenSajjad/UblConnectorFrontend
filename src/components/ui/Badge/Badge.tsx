export const Badge = ({ count }: { count?: number }) => {
  return (
    <span className="bg-[#e6e6e6] ml-2 py-[4px] px-2 font-semibold text-base rounded-lg w-max text-[#464943]">
      {count}
    </span>
  );
};
