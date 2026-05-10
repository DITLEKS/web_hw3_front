import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main style={{ padding: '80px 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: 80, fontWeight: 700, color: 'var(--c-text)', marginBottom: 8 }}>404</h1>
      <p style={{ fontSize: 18, color: 'var(--c-text-2)', marginBottom: 32 }}>Страница не найдена</p>
      <Link to="/" className="btn btn-primary">На главную</Link>
    </main>
  )
}
