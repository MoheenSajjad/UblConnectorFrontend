import Navbar from "./Navbar";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="  bg-[#f1f1f1] h-screen overflow-hidden relative">
      <Navbar />
      <main className=" overflow-x-hidden overflow-y-auto custom-scroll h-full pt-5 pb-20 pl-5 pr-5">
        <div className="bg-white border border-borderColor rounded-md p-4 ">
          {children}
        </div>
      </main>
    </div>
  );
};
