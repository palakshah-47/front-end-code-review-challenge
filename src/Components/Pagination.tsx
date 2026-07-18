import { Pagination as PaginationType } from '../types'
import styles from '../app/page.module.css'

type PaginationProps = {
  pagination: PaginationType | null
  onPageChange: (page: number) => void
  disabled?: boolean
}

// The Art Institute search endpoint only lets you page through the first 1000
// results (page * limit <= 1000). Requesting beyond that returns a 403.
const MAX_SEARCH_RESULTS = 1000

const getVisiblePages = (currentPage: number, totalPages: number) => {
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

const getReachablePageCount = (pagination: PaginationType) => {
  // The API rejects requests past the first MAX_SEARCH_RESULTS results
  // (page * limit), so cap the reachable pages at that boundary.
  const maxReachablePages = Math.floor(MAX_SEARCH_RESULTS / pagination.limit)

  return Math.min(pagination.total_pages, maxReachablePages)
}

const Pagination = ({
  pagination,
  onPageChange,
  disabled = false,
}: PaginationProps) => {
  if (!pagination || pagination.total_pages <= 1) return null

  const { current_page, total } = pagination
  const reachablePages = getReachablePageCount(pagination)
  const visiblePages = getVisiblePages(current_page, reachablePages)
  const canGoPrevious = current_page > 1 && !disabled
  const canGoNext = current_page < reachablePages && !disabled

  return (
    <nav aria-label="Search results pagination" style={{ marginTop: '1rem' }}>
      <p style={{ marginBottom: '0.5rem' }}>
        Page {current_page} of {reachablePages} ({total} results)
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          className={styles.paginationButton}
          type="button"
          onClick={() => onPageChange(current_page - 1)}
          disabled={!canGoPrevious}
        >
          Previous
        </button>
        {visiblePages[0] > 1 && (
          <>
            <button
              className={styles.paginationButton}
              type="button"
              onClick={() => onPageChange(1)}
              disabled={disabled}
            >
              1
            </button>
            <span aria-hidden="true">...</span>
          </>
        )}
        {visiblePages.map((page) => (
          <button
            className={styles.paginationButton}
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            disabled={disabled || page === current_page}
            aria-current={page === current_page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        {visiblePages[visiblePages.length - 1] < reachablePages && (
          <>
            <span aria-hidden="true">...</span>
            <button
              className={styles.paginationButton}
              type="button"
              onClick={() => onPageChange(reachablePages)}
              disabled={disabled}
            >
              {reachablePages}
            </button>
          </>
        )}
        <button
          className={styles.paginationButton}
          type="button"
          onClick={() => onPageChange(current_page + 1)}
          disabled={!canGoNext}
        >
          Next
        </button>
      </div>
    </nav>
  )
}

export default Pagination
