import { siteConfig } from '@/lib/constants'

export function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="container">
        <p>{siteConfig.announcement}</p>
      </div>
    </div>
  )
}
