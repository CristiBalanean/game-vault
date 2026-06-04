import styles from './SkeletonCard.module.css'

function SkeletonCard() {
    return (
        <div className={styles.card}>
            <div className={styles.image} />
            <div className={styles.content}>
                <div className={styles.title} />
                <div className={styles.line} />
                <div className={styles.lineShort} />
            </div>
        </div>
    )
}

export default SkeletonCard