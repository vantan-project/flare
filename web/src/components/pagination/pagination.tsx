export interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onClick: (page: number) => void;
}

export function Pagination({
  currentPage,
  lastPage,
  onClick,
}: PaginationProps) {
  const getPaginationItems = (): (number | string)[] => {
    if (lastPage <= 4) {
      return Array.from({ length: lastPage }, (_, index) => index + 1);
    }
    if (currentPage <= 2) {
      return [1, 2, "･･･", lastPage];
    }
    if (currentPage >= lastPage - 1) {
      return [1, "･･･", lastPage - 1, lastPage];
    }
    return [1, "･･･", currentPage, "･･･", lastPage];
  };

  const paginationItems = getPaginationItems();
  return (
    <div className="flex items-center gap-10">
      <div
        className="
          w-[36px] h-[36px] flex justify-center items-center rounded-md transition duration-300
          text-text bg-accentLight hover:shadow-lg
        "
        onClick={() => currentPage - 1 > 0 && onClick(currentPage - 1)}
        children="前へ"
      />
      <div className="flex items-center gap-2">
        {paginationItems.map((item, index) => (
          <div key={index}>
            {typeof item === "number" ? (
              <button
                className={`
                w-[36px] h-[36px] flex justify-center place-items-center rounded-full transition duration-300
                ${
                  item === currentPage
                    ? "text-white bg-main"
                    : "text-text hover:shadow-lg"
                }
              `}
                onClick={() => item !== currentPage && onClick(item)}
                children={item}
              />
            ) : (
              <div
                className="w-[36px] h-[36px] flex justify-center items-center"
                children={item}
              />
            )}
          </div>
        ))}
      </div>
      <div
        className="
          w-[36px] h-[36px] flex justify-center items-center rounded-md transition duration-300
          text-text bg-accentLight hover:shadow-lg
        "
        onClick={() => currentPage + 1 <= lastPage && onClick(currentPage + 1)}
        children="次へ"
      />
    </div>
  );
}
