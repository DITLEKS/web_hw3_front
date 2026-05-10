import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addItem } from '../store/cartSlice'
import styles from './OrdersPage.module.css'

const MOCK_ORDERS = [
  {
    id: 'ORD-2025-001',
    date: '28.04.2025',
    status: 'delivered',
    statusLabel: 'Доставлен',
    total: 534,
    items: [
      { sku: 'LX-LED-E27-9W', name: 'Лампа светодиодная груша 9 Вт E27', qty: 2, price: 89 },
      { sku: 'LX-FIL-E27-8W', name: 'Лампа филаментная винтажная 8 Вт E27', qty: 2, price: 180 },
    ],
  },
  {
    id: 'ORD-2025-002',
    date: '01.05.2025',
    status: 'processing',
    statusLabel: 'В обработке',
    total: 450,
    items: [
      { sku: 'LX-SMART-E27-10W', name: 'Умная лампа Wi-Fi RGB 10 Вт E27', qty: 1, price: 450 },
    ],
  },
]

const STATUS_COLOR = {
  delivered:  { bg: '#e6f7ee', color: '#2D7A4F' },
  processing: { bg: '#fff7e0', color: '#B87208' },
  cancelled:  { bg: '#fef2f2', color: '#EF4444' },
  shipped:    { bg: '#e0f0ff', color: '#0066CC' },
}

export default function OrdersPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleRepeat = (order) => {
    order.items.forEach(item => {
      const mockProduct = {
        sku:           item.sku,
        name:          item.name,
        price:         String(item.price),
        primary_image: '',
        stock_quantity: 99,
        status:        'active',
      }
      dispatch(addItem({ product: mockProduct, qty: item.qty }))
    })
    navigate('/cart')
  }

  return (
    <main className={styles.page}>
      <div className="container">

        <nav className={styles.breadcrumb}>
          <Link to="/">Главная</Link>
          <span>/</span>
          <span>Мои заказы</span>
        </nav>

        <h1 className={styles.title}>Мои заказы</h1>

        {MOCK_ORDERS.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📦</span>
            <p>У вас пока нет заказов</p>
            <Link to="/catalog" className="btn btn-primary">Перейти в каталог</Link>
          </div>
        ) : (
          <div className={styles.list}>
            {MOCK_ORDERS.map(order => {
              const sc = STATUS_COLOR[order.status] || STATUS_COLOR.processing
              return (
                <div key={order.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardMeta}>
                      <span className={styles.orderId}>Заказ {order.id}</span>
                      <span className={styles.orderDate}>от {order.date}</span>
                    </div>
                    <span className={styles.statusBadge}
                      style={{ background: sc.bg, color: sc.color }}>
                      {order.statusLabel}
                    </span>
                  </div>

                  <div className={styles.items}>
                    {order.items.map((item, i) => (
                      <div key={i} className={styles.item}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemQty}>{item.qty} шт.</span>
                        <span className={styles.itemPrice}>{item.price * item.qty} ₽</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.total}>
                      Итого: <strong>{order.total} ₽</strong>
                    </span>
                    <button className={styles.repeatBtn} onClick={() => handleRepeat(order)}>
                      Повторить заказ
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
