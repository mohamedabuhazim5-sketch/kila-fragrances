type AdminStatCardProps = {
  label: string
  value: string | number
  helper?: string
}

export function AdminStatCard({ label, value, helper }: AdminStatCardProps) {
  return (
    <div className="panel stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {helper ? <p>{helper}</p> : null}
    </div>
  )
}
