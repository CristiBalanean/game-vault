import styles from './Card.module.css'

function Card({ title, genre, platform, rating, image, onClick }) {
    return(
        <div className={styles.card} onClick={onClick}>
            <img className={styles.image} alt={title} src={image}></img>

            <div className={styles.info}>
                <h2 className={styles.title}>{title}</h2>

                <div className={styles.genreRow}>
                    <div className={styles.genre}>
                        <p>{genre}</p>
                    </div>
                    <div className={styles.rating}>
                        ⭐ {rating}
                    </div>
                </div>

                <div className={styles.platform}>
                    <p>{platform}</p>
                </div>
            </div>
        </div>
    );
}

export default Card;