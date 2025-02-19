import React from "react";

interface LoadingProps {
  /**
   * A flag to indicate whether the loading spinner should be displayed.
   * When `true`, the spinner is shown and the content is hidden.
   * @default false
   * @type {boolean}
   */
  isLoading: boolean;

  /**
   * The content that will be displayed when `isLoading` is false.
   * When loading is true, the content is hidden and replaced with a loading spinner.
   * @type {React.ReactNode}
   */
  children: React.ReactNode;
}

/**
 * A functional component that displays a loading spinner while data is being loaded.
 *
 * @component
 * @param {boolean} isLoading - Determines if the loading spinner should be displayed.
 * @param {React.ReactNode} children - The content to display when loading is complete.
 */

export const Loading: React.FC<LoadingProps> = ({ isLoading, children }) => {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50">
          <div className="relative w-[60px] h-[60px] flex justify-center items-center animate-spin">
            <span className="absolute top-0 w-[30px] h-[30px] bg-primary rounded-full animate-dotsBounce" />
            <span className="absolute bottom-0 w-[30px] h-[30px] bg-primary rounded-full animate-dotBounceDelay" />
          </div>
          <div className="text-primary  flex text-lg font-medium">
            Loading
            <div className="h-[20px] animate-bounce [animation-delay:-0.3s]">
              .
            </div>
            <div className="h-[20px] animate-bounce [animation-delay:-0.15s]">
              .
            </div>
            <div className="h-[20px] animate-bounce">.</div>
          </div>
        </div>
      )}

      <div className={isLoading ? "opacity-50" : "opacity-100"}>{children}</div>
    </div>
  );
};
