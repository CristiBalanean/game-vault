import styles from './Card.module.css'

function Card({ title, genre, platform, rating, image, onClick }) {
    return(
        <div className={styles.card} onClick={onClick}>
            {image
                ? <img className={styles.image} alt={title} src={image} />
                : <div className={styles.imagePlaceholder}>🎮</div>
            }

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
    );
}

export default Card;