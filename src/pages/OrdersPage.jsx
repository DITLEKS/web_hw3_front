import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItem } from '../store/cartSlice'
import { fetchOrders, selectOrders, selectOrdersLoading } from '../store/ordersSlice'
import styles from './OrdersPage.module.css'

const STATUS_MAP = {
  pending:    { label: 'Ожидает',      bg: '#fff7e0', color: '#B87208' },
  processing: { label: 'В обработке',  bg: '#fff7e0', color: '#B87208' },
  confirmed:  { label: 'Подтверждён',  bg: '#e0f0ff', color: '#0066CC' },
  shipped:    { label: 'Доставляется', bg: '#e0f0ff', color: '#0066CC' },
  delivered:  { label: 'Доставлен',    bg: '#e6f7ee', color: '#2D7A4F' },
  cancelled:  { label: 'Отменён',      bg: '#fef2f2', color: '#EF4444' },
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function OrdersPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const orders   = useSelector(selectOrders)
  const loading  = useSelector(selectOrdersLoading)

  useEffect(() => { dispatch(fetchOrders()) }, [dispatch])

  const handleRepeat = (order) => {
    const items = order.items ?? order.order_items ?? []
    items.forEach(item => {
      const product = {
        sku:            item.sku ?? item.product_sku,
        name:           item.name ?? item.product_name ?? item.sku,
        price:          String(item.price ?? item.unit_price ?? 0),
        primary_image:  item.primary_image ?? '',
        stock_quantity: 99,
        status:         'active',
      }
      dispatch(addItem({ product, qty: item.qty ?? item.quantity ?? 1 }))
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

        {loading && (
          <div className={styles.loading}>
            {[1,2,3].map(i => <div key={i} className={styles.skeletonCard}/>)}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📦</span>
            <p>У вас пока нет заказов</p>
            <Link to="/catalog" className="btn btn-primary">Перейти в каталог</Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className={styles.list}>
            {orders.map(order => {
              const statusKey = order.status ?? 'processing'
              const sc = STATUS_MAP[statusKey] ?? STATUS_MAP.processing
              const items = order.items ?? order.order_items ?? []
              const total = parseFloat(order.total_amount ?? order.total ?? 0)
              const date  = formatDate(order.created_at ?? order.date)

              return (
                <div key={order.order_number ?? order.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardMeta}>
                      <span className={styles.orderId}>Заказ {order.order_number ?? order.id}</span>
                      {date && <span className={styles.orderDate}>от {date}</span>}
                    </div>
                    <span className={styles.statusBadge}
                      style={{ background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </div>

                  {items.length > 0 && (
                    <div className={styles.items}>
                      {items.map((item, i) => {
                        const name  = item.name ?? item.product_name ?? item.sku ?? item.product_sku
                        const qty   = item.qty ?? item.quantity ?? 1
                        const price = parseFloat(item.price ?? item.unit_price ?? 0)
                        return (
                          <div key={i} className={styles.item}>
                            <span className={styles.itemName}>{name}</span>
                            <span className={styles.itemQty}>{qty} шт.</span>
                            <span className={styles.itemPrice}>{(price * qty).toFixed(0)} ₽</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className={styles.cardFooter}>
                    <span className={styles.total}>
                      Итого: <strong>{total.toFixed(0)} ₽</strong>
                    </span>
                    {items.length > 0 && (
                      <button className={styles.repeatBtn} onClick={() => handleRepeat(order)}>
                        Повторить заказ
                      </button>
                    )}
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
