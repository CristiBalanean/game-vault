import styles from './GamePageSkeleton.module.css'

function GamePageSkeleton() {
    return (
        <div className={styles.page}>
            <div className={styles.leftColumn}>
                <div className={styles.image} />
            </div>
            <div className={styles.content}>
                <div className={styles.title} />
                <div className={styles.ratingRow}>
                    <div className={styles.ratingPill} />
                    <div className={styles.metacriticPill} />
                </div>
                <div className={styles.tags}>
                    <div className={styles.tag} />
                    <div className={styles.tag} />
                </div>
                <div className={styles.tags}>
                    <div className={styles.tagWide} />
                    <div className={styles.tagWide} />
                    <div className={styles.tagWide} />
                </div>
                <div className={styles.line} />
                <div className={styles.lineShort} />
                <div className={styles.block} />
                <div className={styles.screenshotsBlock}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={styles.screenshotThumb} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GamePageSkeleton