import { notFound } from 'next/navigation'
import { ProductCreateForm } from '@/components/admin/product-create-form'
import { AdminShell } from '@/components/admin/admin-shell'
import { requireAdminAccess } from '@/lib/admin-auth'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const { supabase } = await requireAdminAccess()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select(`
        *,
        images:product_images (
          id,
          image_url,
          storage_path,
          is_cover,
          sort_order
        )
      `)
      .eq('id', id)
      .single(),
    supabase.from('categories').select('id, name').order('sort_order', { ascending: true })
  ])

  if (!product) notFound()

  return (
    <AdminShell
      title="Edit Product"
      description="Update product information, cover image, and gallery uploads."
    >
      <ProductCreateForm product={product as any} categories={(categories ?? []) as any} />
    </AdminShell>
  )
}
