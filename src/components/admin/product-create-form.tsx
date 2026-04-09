'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { deleteProductImageFromStorage, uploadProductImages } from '@/lib/upload-product-images'

type ExistingImage = {
  id: string
  image_url: string
  storage_path?: string | null
  is_cover?: boolean
  sort_order?: number
}

type ProductFormProps = {
  product?: {
    id: string
    name: string
    slug: string
    sku?: string | null
    short_description?: string | null
    full_description?: string | null
    fragrance_family?: string | null
    season_type?: string | null
    occasion_type?: string | null
    base_price: number
    compare_at_price?: number | null
    stock_quantity: number
    status: 'draft' | 'active' | 'archived'
    gender?: 'men' | 'women' | 'unisex' | null
    category_id?: string | null
    is_featured?: boolean
    is_best_seller?: boolean
    is_new?: boolean
    is_on_sale?: boolean
    images?: ExistingImage[]
  }
  categories?: { id: string; name: string }[]
}

export function ProductCreateForm({ product, categories = [] }: ProductFormProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [sku, setSku] = useState(product?.sku ?? '')
  const [shortDescription, setShortDescription] = useState(product?.short_description ?? '')
  const [fullDescription, setFullDescription] = useState(product?.full_description ?? '')
  const [fragranceFamily, setFragranceFamily] = useState(product?.fragrance_family ?? '')
  const [seasonType, setSeasonType] = useState(product?.season_type ?? '')
  const [occasionType, setOccasionType] = useState(product?.occasion_type ?? '')
  const [basePrice, setBasePrice] = useState(String(product?.base_price ?? 0))
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compare_at_price ? String(product.compare_at_price) : '')
  const [stockQuantity, setStockQuantity] = useState(String(product?.stock_quantity ?? 0))
  const [status, setStatus] = useState<'draft' | 'active' | 'archived'>(product?.status ?? 'draft')
  const [gender, setGender] = useState(product?.gender ?? '')
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '')
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false)
  const [isBestSeller, setIsBestSeller] = useState(product?.is_best_seller ?? false)
  const [isNew, setIsNew] = useState(product?.is_new ?? false)
  const [isOnSale, setIsOnSale] = useState(product?.is_on_sale ?? false)
  const [existingImages, setExistingImages] = useState<ExistingImage[]>(product?.images ?? [])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleDeleteImage(image: ExistingImage) {
    try {
      setError('')
      setSuccess('')

      if (image.storage_path) {
        await deleteProductImageFromStorage(image.storage_path)
      }

      const { error: deleteError } = await supabase.from('product_images').delete().eq('id', image.id)
      if (deleteError) throw new Error(deleteError.message)

      setExistingImages((prev) => prev.filter((item) => item.id !== image.id))
      setSuccess('Image deleted successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image.')
    }
  }

  async function handleSetCover(imageId: string) {
    if (!product?.id) return

    try {
      setError('')
      setSuccess('')

      const { error: resetError } = await supabase
        .from('product_images')
        .update({ is_cover: false })
        .eq('product_id', product.id)
      if (resetError) throw new Error(resetError.message)

      const { error: coverError } = await supabase
        .from('product_images')
        .update({ is_cover: true })
        .eq('id', imageId)
      if (coverError) throw new Error(coverError.message)

      setExistingImages((prev) => prev.map((img) => ({ ...img, is_cover: img.id === imageId })))
      setSuccess('Cover image updated successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set cover image.')
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (!name.trim()) throw new Error('Product name is required.')
      if (!slug.trim()) throw new Error('Slug is required.')

      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        sku: sku.trim() || null,
        short_description: shortDescription.trim() || null,
        full_description: fullDescription.trim() || null,
        fragrance_family: fragranceFamily.trim() || null,
        season_type: seasonType.trim() || null,
        occasion_type: occasionType.trim() || null,
        base_price: Number(basePrice || 0),
        compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
        stock_quantity: Number(stockQuantity || 0),
        status,
        gender: gender || null,
        category_id: categoryId || null,
        is_featured: isFeatured,
        is_best_seller: isBestSeller,
        is_new: isNew,
        is_on_sale: isOnSale
      }

      let productId = product?.id ?? null
      const isEditing = Boolean(productId)

      if (isEditing) {
        const { error: updateError } = await supabase.from('products').update(payload).eq('id', productId)
        if (updateError) throw new Error(updateError.message)
      } else {
        const { data: createdProduct, error: insertError } = await supabase
          .from('products')
          .insert(payload)
          .select('id')
          .single()
        if (insertError) throw new Error(insertError.message)
        productId = createdProduct.id
      }

      if (!productId) throw new Error('Product ID was not returned.')

      if (selectedFiles.length > 0) {
        const uploaded = await uploadProductImages(selectedFiles, slug.trim())
        const imagesPayload = uploaded.map((item, index) => ({
          product_id: productId,
          image_url: item.image_url,
          storage_path: item.storage_path,
          alt_text: item.alt_text,
          sort_order: existingImages.length + index,
          is_cover: existingImages.length === 0 && index === 0
        }))

        const { error: imageInsertError } = await supabase.from('product_images').insert(imagesPayload)
        if (imageInsertError) throw new Error(imageInsertError.message)
      }

      setSuccess(isEditing ? 'Product updated successfully.' : 'Product created successfully.')
      setSelectedFiles([])
      router.refresh()

      if (!isEditing) {
        setName('')
        setSlug('')
        setSku('')
        setShortDescription('')
        setFullDescription('')
        setFragranceFamily('')
        setSeasonType('')
        setOccasionType('')
        setBasePrice('0')
        setCompareAtPrice('')
        setStockQuantity('0')
        setStatus('draft')
        setGender('')
        setCategoryId('')
        setIsFeatured(false)
        setIsBestSeller(false)
        setIsNew(false)
        setIsOnSale(false)
        setExistingImages([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div style={{ marginBottom: '20px' }}>
        <p className="section-kicker">{product ? 'Edit Product' : 'New Product'}</p>
        <h2 style={{ marginBottom: '6px' }}>{product ? 'Update Existing Product' : 'Create New Product'}</h2>
        <p className="section-description">
          Add fragrance details, pricing, stock, and upload product images directly.
        </p>
      </div>

      <div className="grid-two">
        <div className="field-group">
          <label>Product Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="field-group">
          <label>Slug</label>
          <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>

        <div className="field-group">
          <label>SKU</label>
          <input className="input" value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>

        <div className="field-group">
          <label>Category</label>
          <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Select category</option>
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label>Gender</label>
          <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select gender</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="field-group">
          <label>Status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as 'draft' | 'active' | 'archived')}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="field-group">
          <label>Base Price</label>
          <input className="input" type="number" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />
        </div>

        <div className="field-group">
          <label>Compare At Price</label>
          <input className="input" type="number" step="0.01" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} />
        </div>

        <div className="field-group">
          <label>Stock Quantity</label>
          <input className="input" type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required />
        </div>

        <div className="field-group">
          <label>Fragrance Family</label>
          <input className="input" value={fragranceFamily} onChange={(e) => setFragranceFamily(e.target.value)} />
        </div>

        <div className="field-group">
          <label>Season Type</label>
          <input className="input" value={seasonType} onChange={(e) => setSeasonType(e.target.value)} />
        </div>

        <div className="field-group">
          <label>Occasion Type</label>
          <input className="input" value={occasionType} onChange={(e) => setOccasionType(e.target.value)} />
        </div>
      </div>

      <div className="field-group">
        <label>Short Description</label>
        <textarea className="input" rows={3} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
      </div>

      <div className="field-group">
        <label>Full Description</label>
        <textarea className="input" rows={6} value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} />
      </div>

      <div className="checkbox-grid">
        <label><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> Featured</label>
        <label><input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} /> Best Seller</label>
        <label><input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} /> New</label>
        <label><input type="checkbox" checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} /> On Sale</label>
      </div>

      {existingImages.length > 0 && (
        <div className="field-group">
          <label>Existing Images</label>
          <div className="admin-image-grid">
            {existingImages.map((image) => (
              <div key={image.id} className="admin-image-card">
                <img src={image.image_url} alt="" className="admin-image-preview" />
                <div className="admin-image-actions">
                  <button type="button" className="secondary-button" onClick={() => handleSetCover(image.id)}>
                    {image.is_cover ? 'Cover Image' : 'Set as Cover'}
                  </button>
                  <button type="button" className="danger-button" onClick={() => handleDeleteImage(image)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="field-group">
        <label>Upload Images</label>
        <input className="input" type="file" accept="image/*" multiple onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))} />
        {selectedFiles.length > 0 ? <p className="muted-text">{selectedFiles.length} file(s) selected</p> : null}
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      {success ? <p className="success-text">{success}</p> : null}

      <button type="submit" className="primary-button" disabled={loading}>
        {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  )
}
