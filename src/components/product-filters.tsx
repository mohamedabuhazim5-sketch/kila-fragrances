import Link from 'next/link'
import { categories } from '@/lib/mock-data'
import { sortOptions } from '@/lib/constants'

type ProductFiltersProps = {
  currentSearch?: string
  currentCategory?: string
  currentSort?: string
}

export function ProductFilters({ currentSearch = '', currentCategory = '', currentSort = 'featured' }: ProductFiltersProps) {
  return (
    <form className="filters-bar" action="/shop">
      <input type="text" name="search" placeholder="Search products, families, notes..." defaultValue={currentSearch} className="input" />
      <select name="category" defaultValue={currentCategory} className="input">
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>{category.name}</option>
        ))}
      </select>
      <select name="sort" defaultValue={currentSort} className="input">
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <button className="primary-button" type="submit">Apply</button>
      <Link href="/shop" className="secondary-button">Reset</Link>
    </form>
  )
}
