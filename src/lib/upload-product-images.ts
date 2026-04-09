import { createClient } from '@/lib/supabase/client'

export type UploadedProductImage = {
  image_url: string
  storage_path: string
  alt_text: string
  sort_order: number
  is_cover: boolean
}

function slugifyFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.\-_]/g, '')
}

export async function uploadProductImages(files: File[], productSlug: string) {
  const supabase = createClient()
  const uploaded: UploadedProductImage[] = []

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index]
    if (!file || file.size === 0) continue

    const safeName = slugifyFileName(file.name)
    const path = `products/${productSlug}/${Date.now()}-${index}-${safeName}`

    const { data, error } = await supabase.storage
      .from('product-media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || undefined
      })

    if (error) {
      throw new Error(error.message)
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-media')
      .getPublicUrl(data.path)

    uploaded.push({
      image_url: publicUrlData.publicUrl,
      storage_path: data.path,
      alt_text: productSlug,
      sort_order: index,
      is_cover: index === 0
    })
  }

  return uploaded
}

export async function deleteProductImageFromStorage(storagePath: string) {
  const supabase = createClient()
  const { error } = await supabase.storage.from('product-media').remove([storagePath])
  if (error) throw new Error(error.message)
}
