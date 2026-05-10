import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, PRODUCTS } from '../data/mock'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, selectCartItems } from '../store/cartSlice'
import styles from './HomePage.module.css'

const CAT_COLORS = {
  led:'#3B82F6', filament:'#F59E0B', smart:'#10B981',
  halogen:'#EF4444', grow:'#22C55E', uv:'#8B5CF6',
}

const CAT_ICONS = {
  led: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  filament: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/></svg>,
  smart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>,
  halogen: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  специальные: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
}

const BANNERS = [
  { title:'Экономия до 90% энергии', sub:'Переходите на LED-освещение и снижайте расходы на электроэнергию', cta:'Смотреть LED лампы', link:'/catalog', bg:'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1400&q=80' },
  { title:'Умный дом с SmartLight', sub:'Управляйте освещением голосом и с телефона через Wi-Fi', cta:'Smart лампы', link:'/catalog', bg:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80' },
  { title:'Ретро-атмосфера Filament', sub:'Лампы с видимой нитью накаливания для уютного интерьера', cta:'Смотреть коллекцию', link:'/catalog', bg:'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1400&q=80' },
]

export default function HomePage() {
  const [slide, setSlide] = useState(0)
  const popular = PRODUCTS.filter(p => p.status === 'active').slice(0, 4)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % BANNERS.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <main>
      <section className={styles.bannerWrap}>
        {BANNERS.map((b, i) => (
          <div key={i} className={`${styles.bannerSlide} ${i === slide ? styles.active : ''}`}
            style={{ backgroundImage:`url(${b.bg})` }}>
            <div className={styles.bannerOverlay}/>
            <div className={`container ${styles.bannerContent}`}>
              <h1 className={styles.bannerTitle}>{b.title}</h1>
              <p className={styles.bannerSub}>{b.sub}</p>
              <Link to={b.link} className={`btn btn-primary ${styles.bannerBtn}`}>{b.cta}</Link>
            </div>
          </div>
        ))}
        <div className={styles.dots}>
          {BANNERS.map((_,i) => (
            <button key={i} className={`${styles.dot} ${i===slide?styles.dotActive:''}`}
              onClick={() => setSlide(i)} aria-label={`Слайд ${i+1}`}/>
          ))}
        </div>
      </section>

      <section className={`container ${styles.catsSection}`}>
        {CATEGORIES.map(cat => (
          <Link key={cat.slug} to="/catalog" className={styles.catCard}>
            <div className={styles.catIcon}
              style={{ color: CAT_COLORS[cat.slug]||cat.color, background:(CAT_COLORS[cat.slug]||cat.color)+'1a' }}>
              {CAT_ICONS[cat.slug]||<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="8"/></svg>}
            </div>
            <span className={styles.catName}>{cat.name}</span>
          </Link>
        ))}
        <Link to="/catalog" className={styles.catCard}>
          <div className={styles.catIcon} style={{ color:'#6B7280', background:'#6B72801a' }}>
            {CAT_ICONS['специальные']}
          </div>
          <span className={styles.catName}>Специальные</span>
        </Link>
      </section>

      <section className={`container ${styles.popularSection}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Популярные товары</h2>
          <Link to="/catalog" className={styles.seeAll}>Все товары →</Link>
        </div>
        <div className={styles.popularGrid}>
          {popular.map((p, idx) => <HomeCard key={p.sku} product={p} animDelay={idx*60}/>)}
        </div>
      </section>
    </main>
  )
}

function HomeCard({ product, animDelay }) {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const dispatchAdd = (product) => dispatch(addItem({ product, qty: 1 }))
  const inCart = items.some(i => i.sku === product.sku)
  const price = parseFloat(product.price)
  const oldPrice = product.old_price ? parseFloat(product.old_price) : null
  const outOfStock = product.status === 'out_of_stock' || product.stock_quantity === 0

  return (
    <Link to={`/products/${product.sku}`} className={styles.homeCard}
      style={{ animationDelay:`${animDelay}ms` }}>
      <div className={styles.homeCardImg}>
        <img src={product.primary_image} alt={product.name} loading="lazy"/>
        <span className={styles.catBadge} style={{ background: CAT_COLORS[product.category.slug]||'#888' }}>
          {product.category.name}
        </span>
      </div>
      <div className={styles.homeCardBody}>
        <p className={styles.homeCardSku}>{product.sku}</p>
        <p className={styles.homeCardName}>{product.name}</p>
        <div className={styles.homeCardRow}>
          <div className={styles.homeCardPrice}>
            <strong>{price} ₽</strong>
            {oldPrice && <s>{oldPrice} ₽</s>}
          </div>
          <span className={styles.stockLabel} style={{ color: outOfStock?'#EF4444':'#10B981' }}>
            {outOfStock ? '0 в наличии' : `${product.stock_quantity} в наличии`}
          </span>
        </div>
        <button className={`${styles.addBtn} ${inCart?styles.inCartBtn:''}`}
          onClick={e=>{e.preventDefault();e.stopPropagation();if(!outOfStock)dispatchAdd(product)}}
          disabled={outOfStock}>
          {inCart ? '✓ В корзине' : 'В корзину'}
        </button>
      </div>
    </Link>
  )
}