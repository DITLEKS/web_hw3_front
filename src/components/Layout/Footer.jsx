import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>SmartLight</span>
          <p className={styles.tagline}>Освещение, которое меняет пространство</p>
        </div>
        <div className={styles.links}>
          <Link to="/catalog">Каталог</Link>
          <Link to="/cart">Корзина</Link>
        </div>
        <p className={styles.copy}>© 2026 SmartLight. Все права защищены.</p>
      </div>
    </footer>
  )
}
