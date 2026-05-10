import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCartItems, selectSubtotal, selectDiscount, selectPromo, selectPromoError,
  updateItem, removeItem, applyPromo, removePromo,
} from '../store/cartSlice'
import styles from './CartPage.module.css'

export default function CartPage() {
  const dispatch   = useDispatch()
  const items      = useSelector(selectCartItems)
  const subtotal   = useSelector(selectSubtotal)
  const discount   = useSelector(selectDiscount)
  const promo      = useSelector(selectPromo)
  const promoError = useSelector(selectPromoError)
  const [promoInput, setPromoInput] = useState('')
  const navigate = useNavigate()

  const handlePromo = (e) => {
    e.preventDefault()
    if (promoInput.trim()) dispatch(applyPromo(promoInput.trim()))
  }

  if (items.length === 0) {
    return (
      <main className={`container ${styles.empty}`}>
        <div className={`${styles.emptyContent} anim-scale-in`}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2 className={styles.emptyTitle}>Корзина пуста</h2>
          <p className={styles.emptySub}>Добавьте товары из каталога, чтобы оформить заказ</p>
          <Link to="/" className="btn btn-primary btn-lg">Перейти в каталог</Link>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.page}>
      <div className="container">

        <h1 className={`${styles.title} anim-fade-up`}>
          Корзина
          <span className={styles.count}>{items.length} {plural(items.length, 'товар','товара','товаров')}</span>
        </h1>

        <div className={styles.layout}>

          <div className={styles.itemsList}>
            {items.map((item, idx) => (
              <CartItem key={item.sku} item={item}
                onUpdate={(sku, qty) => dispatch(updateItem({ sku, qty }))}
                onRemove={(sku) => dispatch(removeItem(sku))}
                animDelay={idx * 60}/>
            ))}
          </div>

          <aside className={`${styles.summary} anim-fade-up delay-2`}>
            <h2 className={styles.summaryTitle}>Итог заказа</h2>

            <div className={styles.summaryLines}>
              <div className={styles.summaryLine}>
                <span>Товары ({items.reduce((s,i) => s + i.quantity, 0)} шт.)</span>
                <span>{subtotal} ₽</span>
              </div>
              {discount > 0 && (
                <div className={`${styles.summaryLine} ${styles.discount}`}>
                  <span>Скидка по промокоду</span><span>−{discount} ₽</span>
                </div>
              )}
              <div className={styles.summaryLine}>
                <span className={styles.summaryNote}>Доставка</span>
                <span className={styles.summaryNote}>рассчитается при оформлении</span>
              </div>
            </div>

            <div className={styles.total}>
              <span>К оплате</span>
              <strong>{subtotal - discount} ₽</strong>
            </div>

            {promo ? (
              <div className={styles.promoApplied}>
                <span>🎉 Промокод <strong>{promo.code}</strong> применён</span>
                <button onClick={() => dispatch(removePromo())} className={styles.promoRemove} aria-label="Убрать промокод">✕</button>
              </div>
            ) : (
              <form className={styles.promoForm} onSubmit={handlePromo}>
                <div className={styles.promoInputRow}>
                  <input className={`input ${promoError ? styles.inputError : ''}`}
                    placeholder="Введите промокод" value={promoInput}
                    onChange={e => setPromoInput(e.target.value.toUpperCase())}/>
                  <button type="submit" className="btn btn-outline">Применить</button>
                </div>
                {promoError && <p className={styles.promoError}>{promoError}</p>}
                <p className={styles.promoHint}>Тест: SALE20, WELCOME, SMART15</p>
              </form>
            )}

            <button className="btn btn-primary btn-lg" style={{ width: '100%' }}
              onClick={() => navigate('/checkout')}>
              Оформить заказ →
            </button>

            <Link to="/catalog" className={styles.continueShopping}>← Продолжить покупки</Link>
          </aside>
        </div>
      </div>
    </main>
  )
}

function CartItem({ item, onUpdate, onRemove, animDelay }) {
  return (
    <div className={`${styles.item} anim-fade-up`} style={{ animationDelay: `${animDelay}ms` }}>
      <Link to={`/products/${item.sku}`} className={styles.itemImage}>
        <img src={item.image} alt={item.name} />
      </Link>
      <div className={styles.itemBody}>
        <Link to={`/products/${item.sku}`} className={styles.itemName}>{item.name}</Link>
        <p className={styles.itemSku}>Арт.: {item.sku}</p>
        <div className={styles.itemFooter}>
          <div className={styles.qtyControl}>
            <button className={styles.qtyBtn} onClick={() => onUpdate(item.sku, item.quantity - 1)} aria-label="Уменьшить">−</button>
            <span className={styles.qtyVal}>{item.quantity}</span>
            <button className={styles.qtyBtn} onClick={() => onUpdate(item.sku, Math.min(item.stock, item.quantity + 1))}
              aria-label="Увеличить" disabled={item.quantity >= item.stock}>+</button>
          </div>
          <div className={styles.itemPrice}>
            <strong>{item.price * item.quantity} ₽</strong>
            {item.quantity > 1 && <span>{item.price} ₽ × {item.quantity}</span>}
          </div>
          <button className={styles.removeBtn} onClick={() => onRemove(item.sku)} aria-label="Удалить">
            <TrashIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  )
}

function plural(n, one, few, many) {
  if (n % 100 >= 11 && n % 100 <= 19) return many
  if (n % 10 === 1) return one
  if (n % 10 >= 2 && n % 10 <= 4) return few
  return many
}
