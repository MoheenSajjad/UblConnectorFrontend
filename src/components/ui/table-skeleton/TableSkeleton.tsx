export const TableSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="overflow-x-auto overflow-y-auto custom-scroll relative">
      <table className="min-w-full rounded-lg overflow-hidden">
        <tbody>
          {[...Array(count)].map((_, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 transition rounded animate-pulse duration-150 ease-in-out last:border-b-0"
            >
              <td className="px-3 py-1">
                <div className="h-8 w-full bg-gray-300 mx-auto rounded animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
