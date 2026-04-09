'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { CartLine, Product } from '@/lib/types'
import { clamp } from '@/lib/utils'

type CartContextValue = {
  items: CartLine[]
  itemCount: number
  subtotal: number
  shippingFee: number
  total: number
  addItem: (product: Product, size?: string, quantity?: number) => void
  removeItem: (productId: string, size?: string) => void
  updateQuantity: (productId: string, size: string | undefined, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'kila-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([])

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingFee = items.length ? 200 : 0
    const total = subtotal + shippingFee

    return {
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      shippingFee,
      total,
      addItem(product, size, quantity = 1) {
        setItems((current) => {
          const variant = size ? product.variants.find((item) => item.size === size) : product.variants[0]
          const price = variant?.price ?? product.price
          const image = product.images[0]?.url || ''
          const lineKey = `${product.id}:${size || variant?.size || ''}`
          const existing = current.find((item) => `${item.productId}:${item.size || ''}` === lineKey)

          if (existing) {
            return current.map((item) =>
              `${item.productId}:${item.size || ''}` === lineKey
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }

          return [
            ...current,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image,
              price,
              size: size || variant?.size,
              quantity
            }
          ]
        })
      },
      removeItem(productId, size) {
        setItems((current) => current.filter((item) => !(item.productId === productId && item.size === size)))
      },
      updateQuantity(productId, size, quantity) {
        setItems((current) =>
          current.map((item) =>
            item.productId === productId && item.size === size
              ? { ...item, quantity: clamp(quantity, 1, 99) }
              : item
          )
        )
      },
      clearCart() {
        setItems([])
      }
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider.')
  }

  return context
}
