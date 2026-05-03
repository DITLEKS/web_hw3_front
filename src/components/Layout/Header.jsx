import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './Header.module.css'

export default function Header() {
  const { itemCount } = useCart()
  const navigate = useNavigate()

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>

        {/* Логотип */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>SmartLight</span>
        </Link>

        {/* Навигация */}
        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            Каталог
          </NavLink>
        </nav>

        {/* Корзина */}
        <button
          className={styles.cartBtn}
          onClick={() => navigate('/cart')}
          aria-label={`Корзина, ${itemCount} товаров`}
        >
          <CartIcon />
          <span className={styles.cartLabel}>Корзина</span>
          {itemCount > 0 && (
            <span className={`badge ${styles.cartBadge}`}>{itemCount}</span>
          )}
        </button>

      </div>
    </header>
  )
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  )
}
