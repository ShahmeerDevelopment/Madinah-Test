/**
 * Skeleton loading component for Featured Campaigns section
 * Displayed during PPR streaming while dynamic content loads
 */
import styles from "./skeleton.module.css";

export default function FeaturedCampaignsSkeleton() {
  return (
    <div className={styles.container}>
      {/* Featured Campaigns Section Skeleton */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.headingSkeleton} />
          <div className={styles.arrowsSkeleton} />
        </div>
        <div className={styles.campaignsGrid}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={styles.campaignCard}>
              <div className={styles.imageSkeleton} />
              <div className={styles.cardContent}>
                <div className={styles.titleSkeleton} />
                <div className={styles.subtitleSkeleton} />
                <div className={styles.progressSkeleton} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Voices of Madinah Skeleton */}
      <section className={styles.section}>
        <div className={styles.headingSkeleton} />
        <div className={styles.voicesGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.voiceCard}>
              <div className={styles.avatarSkeleton} />
              <div className={styles.nameSkeleton} />
            </div>
          ))}
        </div>
      </section>

      {/* Help Happens Here - Static (will be replaced) */}
      <section className={styles.section}>
        <div className={styles.headingSkeleton} />
        <div className={styles.textSkeleton} />
        <div className={styles.mapSkeleton} />
      </section>

      {/* Recent Campaigns Skeleton */}
      <section className={styles.section}>
        <div className={styles.headingSkeleton} />
        <div className={styles.recentGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.recentCard}>
              <div className={styles.recentImageSkeleton} />
              <div className={styles.recentTitleSkeleton} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
