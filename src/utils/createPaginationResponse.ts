import { Pagination } from 'src/common/interfaces';

function createPaginationResponse<T>(
  items: T[],
  count: number,
  page: number,
  size: number,
): Pagination<T> {
  const totalItems = count;
  const itemCount = items.length;
  const itemsPerPage = size;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = page;

  return {
    items,
    meta: {
      itemCount,
      totalItems,
      itemsPerPage,
      totalPages,
      currentPage,
    },
  };
}

export default createPaginationResponse;
