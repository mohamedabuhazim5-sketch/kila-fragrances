'use client'

type QuantitySelectorProps = {
  value: number
  onChange: (value: number) => void
}

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <div className="quantity-selector">
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))}>–</button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(99, value + 1))}>+</button>
    </div>
  )
}
