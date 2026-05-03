import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS } from '../data/mock'
import { ordersApi } from '../api/client'
import { getSessionId } from '../utils/session'
import styles from './CheckoutPage.module.css'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_ORDERS_API_URL

const INITIAL_FORM = {
  first_name: '', last_name: '', phone: '', email: '',
  delivery_type: 'courier',
  city: '', street: '', zip: '',
  payment_method: 'card_online',
  comment: '',
}

export default function CheckoutPage() {
  const { items, subtotal, discount, promo, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  if (items.length === 0) {
    return (
      <main className={`container ${styles.empty}`}>
        <h2>Корзина пуста</h2>
        <Link to="/" className="btn btn-primary">В каталог</Link>
      </main>
    )
  }

  const delivery = DELIVERY_OPTIONS.find(d => d.value === form.delivery_type) ?? DELIVERY_OPTIONS[0]
  const total = subtotal - discount + delivery.price

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.first_name.trim()) errs.first_name = 'Введите имя'
    if (!form.last_name.trim())  errs.last_name  = 'Введите фамилию'
    if (!form.phone.trim())      errs.phone      = 'Введите телефон'
    if (!form.email.trim())      errs.email      = 'Введите email'
    if (form.delivery_type !== 'pickup') {
      if (!form.city.trim())   errs.city   = 'Введите город'
      if (!form.street.trim()) errs.street = 'Введите адрес'
    }
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError(null)

    try {
      let orderNumber, orderTotal, orderDelivery, orderPayment

      if (USE_MOCK) {
        // Mock: генерируем номер заказа локально
        await new Promise(r => setTimeout(r, 1200))
        orderNumber  = `LX-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.floor(Math.random()*9000)+1000)}`
        orderTotal   = total
        orderDelivery= delivery.label
        orderPayment = PAYMENT_OPTIONS.find(p => p.value === form.payment_method)?.label
      } else {
        // Real API: POST /api/v1/orders
        const sessionId = getSessionId()
        const payload = {
          delivery_type:   form.delivery_type,
          delivery_city:   form.delivery_type !== 'pickup' ? form.city : undefined,
          delivery_street: form.delivery_type !== 'pickup' ? form.street : undefined,
          delivery_zip:    form.zip || undefined,
          payment_method:  form.payment_method,
          promo_code:      promo?.code || undefined,
        }
        const res = await ordersApi.createOrder(sessionId, payload)
        const d = res.data
        orderNumber  = d.order_number
        orderTotal   = parseFloat(d.total_amount)
        orderDelivery= delivery.label
        orderPayment = PAYMENT_OPTIONS.find(p => p.value === form.payment_method)?.label
      }

      clearCart()
      navigate('/order-success', {
        state: {
          orderNumber,
          total: orderTotal,
          delivery: orderDelivery,
          payment: orderPayment,
          email: form.email,
        },
      })
    } catch (err) {
      setApiError(err.message || 'Не удалось оформить заказ. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className="container">

        <nav className={`${styles.breadcrumb} anim-fade-in`} aria-label="Навигация">
          <Link to="/">Каталог</Link><span>/</span>
          <Link to="/cart">Корзина</Link><span>/</span>
          <span>Оформление</span>
        </nav>

        <h1 className={`${styles.title} anim-fade-up`}>Оформление заказа</h1>

        {apiError && (
          <div className={styles.apiError} role="alert">
            ⚠️ {apiError}
          </div>
        )}

        <form className={styles.layout} onSubmit={handleSubmit} noValidate>

          {/* Левая колонка — форма */}
          <div className={styles.formSection}>

            {/* Покупатель */}
            <Section title="Ваши данные" step="1">
              <div className={styles.grid2}>
                <Field label="Имя" error={errors.first_name}>
                  <input className={`input ${errors.first_name ? styles.errInput : ''}`}
                    name="first_name" placeholder="Иван" value={form.first_name} onChange={handleChange}
                    autoComplete="given-name" />
                </Field>
                <Field label="Фамилия" error={errors.last_name}>
                  <input className={`input ${errors.last_name ? styles.errInput : ''}`}
                    name="last_name" placeholder="Иванов" value={form.last_name} onChange={handleChange}
                    autoComplete="family-name" />
                </Field>
              </div>
              <div className={styles.grid2}>
                <Field label="Телефон" error={errors.phone}>
                  <input className={`input ${errors.phone ? styles.errInput : ''}`}
                    name="phone" type="tel" placeholder="+7 (___) ___-__-__"
                    value={form.phone} onChange={handleChange} autoComplete="tel" />
                </Field>
                <Field label="E-mail" error={errors.email}>
                  <input className={`input ${errors.email ? styles.errInput : ''}`}
                    name="email" type="email" placeholder="ivan@example.com"
                    value={form.email} onChange={handleChange} autoComplete="email" />
                </Field>
              </div>
            </Section>

            {/* Доставка */}
            <Section title="Способ доставки" step="2">
              <div className={styles.radioGroup}>
                {DELIVERY_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`${styles.radioCard} ${form.delivery_type === opt.value ? styles.selected : ''}`}
                  >
                    <input
                      type="radio"
                      name="delivery_type"
                      value={opt.value}
                      checked={form.delivery_type === opt.value}
                      onChange={handleChange}
                      className={styles.srOnly}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioTitle}>{opt.label}</div>
                      <div className={styles.radioSub}>{opt.description}</div>
                    </div>
                    <div className={styles.radioPrice}>
                      {opt.price > 0 ? `${opt.price} ₽` : 'Бесплатно'}
                    </div>
                  </label>
                ))}
              </div>

              {form.delivery_type !== 'pickup' && (
                <div className={styles.addressFields}>
                  <Field label="Город" error={errors.city}>
                    <input className={`input ${errors.city ? styles.errInput : ''}`}
                      name="city" placeholder="Москва" value={form.city} onChange={handleChange}
                      autoComplete="address-level2" />
                  </Field>
                  <Field label="Улица, дом, квартира" error={errors.street}>
                    <input className={`input ${errors.street ? styles.errInput : ''}`}
                      name="street" placeholder="ул. Ленина, д. 1, кв. 42"
                      value={form.street} onChange={handleChange}
                      autoComplete="street-address" />
                  </Field>
                  <Field label="Почтовый индекс">
                    <input className="input" name="zip" placeholder="101000"
                      value={form.zip} onChange={handleChange} maxLength={6}
                      autoComplete="postal-code" />
                  </Field>
                </div>
              )}
            </Section>

            {/* Оплата */}
            <Section title="Способ оплаты" step="3">
              <div className={styles.radioGroup}>
                {PAYMENT_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`${styles.radioCard} ${form.payment_method === opt.value ? styles.selected : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={opt.value}
                      checked={form.payment_method === opt.value}
                      onChange={handleChange}
                      className={styles.srOnly}
                    />
                    <span className={styles.payIcon}>{opt.icon}</span>
                    <div className={styles.radioContent}>
                      <div className={styles.radioTitle}>{opt.label}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Section>

            {/* Комментарий */}
            <Section title="Комментарий к заказу" step="4" optional>
              <textarea
                className="input"
                name="comment"
                placeholder="Дополнительные пожелания к заказу или доставке..."
                value={form.comment}
                onChange={handleChange}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </Section>

          </div>

          {/* Правая колонка — итог */}
          <aside className={`${styles.orderSummary} anim-fade-up delay-2`}>
            <h2 className={styles.summaryTitle}>Ваш заказ</h2>

            <div className={styles.orderItems}>
              {items.map(item => (
                <div key={item.sku} className={styles.orderItem}>
                  <img src={item.image} alt={item.name} className={styles.orderItemImg} />
                  <div className={styles.orderItemInfo}>
                    <span className={styles.orderItemName}>{item.name}</span>
                    <span className={styles.orderItemQty}>{item.quantity} шт. × {item.price} ₽</span>
                  </div>
                  <strong className={styles.orderItemTotal}>{item.price * item.quantity} ₽</strong>
                </div>
              ))}
            </div>

            <div className={styles.summaryLines}>
              <div className={styles.summaryLine}>
                <span>Товары</span><span>{subtotal} ₽</span>
              </div>
              {discount > 0 && (
                <div className={`${styles.summaryLine} ${styles.discountLine}`}>
                  <span>Промокод {promo?.code}</span><span>−{discount} ₽</span>
                </div>
              )}
              <div className={styles.summaryLine}>
                <span>Доставка</span>
                <span>{delivery.price > 0 ? `${delivery.price} ₽` : 'Бесплатно'}</span>
              </div>
            </div>

            <div className={styles.summaryTotal}>
              <span>Итого</span>
              <strong>{total} ₽</strong>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinner} aria-hidden />
              ) : (
                'Подтвердить заказ →'
              )}
            </button>

            <Link to="/cart" className={styles.back}>← Вернуться в корзину</Link>
          </aside>

        </form>
      </div>
    </main>
  )
}

// ── Вспомогательные компоненты ────────────────────────────────────── //

function Section({ title, step, optional, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.stepBadge}>{step}</span>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {optional && <span className={styles.optional}>необязательно</span>}
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {error && <span className={styles.errMsg} role="alert">{error}</span>}
    </div>
  )
}
