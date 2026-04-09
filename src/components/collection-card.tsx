import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/lib/types'

export function CollectionCard({ category }: { category: Category }) {
  const imageSrc = category.image?.trim() ? category.image : '/placeholder-collection.svg'

  return (
    <Link href={`/collections/${category.slug}`} className="collection-card">
      <div className="collection-image-wrap">
        <Image src={imageSrc} alt={category.name} fill className="cover-image" />
      </div>
      <div className="collection-content">
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>
    </Link>
  )
}
