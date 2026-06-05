import styles from './Card.module.css'
import { Bookmark } from 'lucide-react'

function Card({ title, genre, platform, rating, image, onClick, onToggleBacklog, inBacklog }) {
    return(
        <div className={styles.card} onClick={onClick}>
            <div className={styles.imageWrapper}>
                {image
                    ? <img className={styles.image} alt={title} src={image} />
                    : <div className={styles.imagePlaceholder}>🎮</div>
                }
                <button
                    className={`${styles.bookmarkBtn} ${inBacklog ? styles.bookmarkActive : ''}`}
                    onClick={(e) => { e.stopPropagation(); onToggleBacklog?.() }}
                >
                    <Bookmark size={16} fill={inBacklog ? '#6c63ff' : 'none'} />
                </button>
            </div>

            <div className={styles.info}>
                <h2 className={styles.title}>{title}</h2>

                <div className={styles.genreRow}>
                    <div className={styles.genre}>
                        <p>{genre || 'Unknown'}</p>
                    </div>
                    <div className={styles.rating}>
                        ⭐ {rating || 'N/A'}
                    </div>
                </div>

                <div className={styles.platform}>
                    <p>{platform || 'Unknown'}</p>
                </div>
            </div>
        </div>
    )
}

export default Card