import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './Header.module.css'

export default function Header() {
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>SmartLight</Link>

        <form className={styles.searchForm} onSubmit={e => { e.preventDefault(); if (query.trim()) { navigate('/catalog'); setQuery('') }}} role="search">
          <div className={styles.searchBox}>
            <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="search" placeholder="Поиск товаров..." className={styles.searchInput}
              value={query} onChange={e => setQuery(e.target.value)} aria-label="Поиск товаров"/>
          </div>
        </form>

        <div className={styles.right}>
          <button className={styles.cartBtn} onClick={() => navigate('/cart')}
            aria-label={`Корзина, ${itemCount} товаров`}>
            <span className={styles.cartIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
            </span>
          </button>

          <div className={styles.profileWrap} ref={dropRef}>
            <button className={styles.avatarBtn} onClick={() => setMenuOpen(o => !o)}
              aria-label="Профиль" aria-expanded={menuOpen}>
              <span className={styles.avatar}>И</span>
              <span className={styles.userName}>Иван</span>
            </button>

            {menuOpen && (
              <div className={styles.dropdown}>
                <Link to="/orders" className={styles.dropItem} onClick={() => setMenuOpen(false)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                  Мои заказы
                </Link>
                <div className={styles.divider}/>
                <button className={`${styles.dropItem} ${styles.logoutBtn}`}
                  onClick={() => { setMenuOpen(false); alert('Выход из аккаунта') }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Выйти
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}