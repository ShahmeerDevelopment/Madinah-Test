/**
 * Skeleton loading component for Featured Campaigns section
 * Displayed during PPR streaming while dynamic content loads
 */

export default function FeaturedCampaignsSkeleton() {
  return (
    <div className="ppr-skeleton-container">
      {/* Featured Campaigns Section Skeleton */}
      <section className="ppr-skeleton-section">
        <div className="ppr-skeleton-header">
          <div className="ppr-skeleton-element ppr-skeleton-heading" />
          <div className="ppr-skeleton-element ppr-skeleton-arrows" />
        </div>
        <div className="ppr-skeleton-grid-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="ppr-skeleton-card">
              <div className="ppr-skeleton-element ppr-skeleton-image" />
              <div className="ppr-skeleton-card-content">
                <div className="ppr-skeleton-element ppr-skeleton-title" />
                <div className="ppr-skeleton-element ppr-skeleton-subtitle" />
                <div className="ppr-skeleton-element ppr-skeleton-progress" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Voices of Madinah Skeleton */}
      <section className="ppr-skeleton-section">
        <div className="ppr-skeleton-element ppr-skeleton-heading" />
        <div className="ppr-skeleton-voices">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="ppr-skeleton-voice-card">
              <div className="ppr-skeleton-element ppr-skeleton-avatar" />
              <div className="ppr-skeleton-element ppr-skeleton-name" />
            </div>
          ))}
        </div>
      </section>

      {/* Help Happens Here - Static (will be replaced) */}
      <section className="ppr-skeleton-section">
        <div className="ppr-skeleton-element ppr-skeleton-heading" />
        <div className="ppr-skeleton-element ppr-skeleton-text" />
        <div className="ppr-skeleton-element ppr-skeleton-map" />
      </section>

      {/* Recent Campaigns Skeleton */}
      <section className="ppr-skeleton-section">
        <div className="ppr-skeleton-element ppr-skeleton-heading" />
        <div className="ppr-skeleton-grid-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ppr-skeleton-recent-card">
              <div className="ppr-skeleton-element ppr-skeleton-recent-image" />
              <div className="ppr-skeleton-element ppr-skeleton-recent-title" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
