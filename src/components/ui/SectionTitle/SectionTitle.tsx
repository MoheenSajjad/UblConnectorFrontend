export const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center w-full mb-4 mt-2">
      <div className="mr-4 font-semibold uppercase text-base text[#2b2e27]  flex-shrink-0">
        {title}
      </div>
      <div className="flex-grow border-b-[1px] border-[#e0dfdf]"></div>
    </div>
  );
};
