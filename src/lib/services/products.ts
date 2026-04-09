import { hasServiceRole } from '@/lib/env'
import { toSlug } from '@/lib/format'
import { createAdminClient } from '@/lib/supabase/admin'

type ProductInput = {
  name: string
  shortDescription: string
  description: string
  categorySlug: string
  family: string
  gender: string
  season: string
  occasion: string
  price: number
  comparePrice?: number | null
  stock: number
  image: string
}

export async function createProduct(input: ProductInput) {
  if (!hasServiceRole()) {
    return { success: true, persisted: false }
  }

  const admin = createAdminClient()
  const { data: category } = await admin.from('categories').select('id').eq('slug', input.categorySlug).maybeSingle()

  const { data: product, error } = await admin
    .from('products')
    .insert({
      name: input.name,
      slug: toSlug(input.name),
      short_description: input.shortDescription,
      full_description: input.description,
      category_id: category?.id || null,
      fragrance_family: input.family,
      gender: input.gender?.toLowerCase() || 'unisex',
      season_type: input.season,
      occasion_type: input.occasion,
      base_price: input.price,
      compare_at_price: input.comparePrice || null,
      stock_quantity: input.stock,
      is_featured: false,
      is_best_seller: false,
      is_new: true,
      is_on_sale: Boolean(input.comparePrice && input.comparePrice > input.price),
      status: 'active'
    })
    .select('id, name')
    .single()

  if (error || !product) throw new Error(error?.message || 'Could not create product')

  if (input.image) {
    await admin.from('product_images').insert({
      product_id: product.id,
      image_url: input.image,
      alt_text: input.name,
      is_cover: true,
      sort_order: 1
    })
  }

  return { success: true, persisted: true, id: product.id }
}
