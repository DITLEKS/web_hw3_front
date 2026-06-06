import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItem } from '../store/cartSlice'
import { fetchOrders, fetchOrderByNumber, fetchOrderDetails, selectOrders, selectOrdersLoading } from '../store/ordersSlice'
import styles from './OrdersPage.module.css'

const STATUS_MAP = {
  pending:      'В обработке',
  processing:   'В обработке',
  created:      'Создан',
  confirmed:    'Подтверждён',
  in_assembly:  'Сборка',
  assembled:    'Собран',
  shipped:      'Отправлен',
  delivered:    'Доставлен',
  cancelled:    'Отменён',
  assembly:     'Сборка',

  'В обработке': 'В обработке',
  'Подтверждён': 'Подтверждён',
  'Сборка':      'Сборка',
  'Собран':      'Собран',
  'Отправлен':   'Отправлен',
  'Доставлен':   'Доставлен',
  'Отменён':     'Отменён',
}

const STATUS_STYLE = {
  pending:      { bg: '#fff7e0', color: '#B87208' },
  processing:   { bg: '#fff7e0', color: '#B87208' },
  created:      { bg: '#fff7e0', color: '#B87208' },
  confirmed:    { bg: '#e0f0ff', color: '#0066CC' },
  in_assembly:  { bg: '#fff7e0', color: '#B87208' },
  assembled:    { bg: '#e0f0ff', color: '#0066CC' },
  shipped:      { bg: '#e0f0ff', color: '#0066CC' },
  delivered:    { bg: '#e6f7ee', color: '#2D7A4F' },
  cancelled:    { bg: '#fef2f2', color: '#EF4444' },
  assembly:     { bg: '#fff7e0', color: '#B87208' },
  'В обработке': { bg: '#fff7e0', color: '#B87208' },
  'Подтверждён': { bg: '#e0f0ff', color: '#0066CC' },
  'Сборка':      { bg: '#fff7e0', color: '#B87208' },
  'Собран':      { bg: '#e0f0ff', color: '#0066CC' },
  'Отправлен':   { bg: '#e0f0ff', color: '#0066CC' },
  'Доставлен':   { bg: '#e6f7ee', color: '#2D7A4F' },
  'Отменён':     { bg: '#fef2f2', color: '#EF4444' },
}

export const getStatusLabel = (status) => STATUS_MAP[status] ?? status ?? 'Неизвестно'

export function getStatusStyle(status) {
  return STATUS_STYLE[status] ?? { bg: '#fff7e0', color: '#B87208' }
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
  const [email, setEmail] = useState('')
  const [savedEmail, setSavedEmail] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const ordersLoadedRef = useRef(orders.length > 0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('slx_customer_email') || ''
      setSavedEmail(stored)
      setEmail(stored)
      if (stored && !ordersLoadedRef.current) {
        ordersLoadedRef.current = true
        dispatch(fetchOrders())
      }
    } catch (e) {
      setSavedEmail('')
    }
  }, [dispatch])

  useEffect(() => {
    if (orders.length > 0) {
      console.log('all statuses:', orders.map(o => o.status ?? o.status_name ?? o.state))
    }
  }, [orders])

  const handleEmailSubmit = (event) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setEmailTouched(true)
      return
    }
    try {
      localStorage.setItem('slx_customer_email', trimmed)
      setSavedEmail(trimmed)
      dispatch(fetchOrders())
    } catch (e) {
      // ignore storage errors
    }
  }

  useEffect(() => {
    const onFocus = () => {
      if (savedEmail && orders.length === 0) dispatch(fetchOrders())
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [dispatch, savedEmail, orders.length])

  useEffect(() => {
    if (orders.length === 0) return
    orders.forEach(order => {
      if (!order.items || order.items.length === 0) {
        dispatch(fetchOrderDetails(order.order_number))
      }
    })
  }, [orders.length, dispatch])

  // Если после загрузки список пуст, пробуем подгрузить последний оформленный заказ по номеру
  useEffect(() => {
    if (!loading && orders.length === 0) {
      try {
        const last = localStorage.getItem('lastOrderNumber')
        if (last) dispatch(fetchOrderByNumber(last))
      } catch (e) {
        // ignore
      }
    }
  }, [loading, orders.length, dispatch])

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

        {!savedEmail && (
          <div className={styles.emailPrompt}>
            <p>Введите email, указанный при оформлении заказа</p>
            <form onSubmit={handleEmailSubmit} className={styles.emailForm}>
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="example@mail.ru"
                className={styles.emailInput}
                required
              />
              <button type="submit" className="btn btn-primary">Показать заказы</button>
            </form>
            {emailTouched && !email.trim() && (
              <p className={styles.errorText}>Пожалуйста, введите email.</p>
            )}
          </div>
        )}

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
              const statusKey = order.status ?? order.status_name ?? order.state
              const statusLabel = getStatusLabel(statusKey)
              const sc = getStatusStyle(statusKey)
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
                      {statusLabel}
                    </span>
                  </div>

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

                  <div className={styles.orderItemsBlock}>
                    <div className={styles.orderItemsTitle}>Состав заказа</div>
                    {items.length > 0 ? (
                      <ul className={styles.orderItemsList}>
                        {items.map((item, i) => {
                          const name  = item.product_name ?? item.name ?? item.sku ?? item.product_sku
                          const qty   = item.quantity ?? item.qty ?? 1
                          const unit  = parseFloat(item.price ?? item.unit_price ?? 0)
                          const totalLine = (unit * qty).toFixed(0)
                          return (
                            <li key={i} className={styles.orderItemsListItem}>
                              • {name} × {qty} — {totalLine} ₽
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <div className={styles.orderItemsEmpty}>Состав недоступен</div>
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
