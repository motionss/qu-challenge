import { usePlanetContext } from '../contexts/PlanetContext'
import { cn } from '../lib/utils'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'

function SortButton({ field }: { field: string }) {
  const [sort, setSort] = usePlanetContext().sortState
  const fieldLower = field.toLowerCase()

  return (
    <button
      type="button"
      onClick={() =>
        // If currentSort is null or sort.field is different from the field in this button = {field: field, order: 'asc'}
        // Else if currentSort's field is the same and order is 'asc' = {..., order: 'desc'}
        // Else null
        setSort(currentSort =>
          !currentSort || currentSort.field !== fieldLower
            ? { field: fieldLower as 'name' | 'diameter', order: 'asc' }
            : currentSort.field === fieldLower && currentSort.order === 'asc'
            ? { ...currentSort, order: 'desc' }
            : null
        )
      }
      className={cn('button text-sm sm:text-base max-sm:px-2', sort?.field !== fieldLower && 'text-gray-500')}>
      {field}{' '}
      {sort?.field === fieldLower ? (
        sort.order === 'asc' ? (
          <FaSortUp size={24} />
        ) : (
          <FaSortDown size={24} />
        )
      ) : (
        <FaSort size={24} />
      )}
    </button>
  )
}

export default SortButton
