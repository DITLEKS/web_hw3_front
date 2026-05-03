const SESSION_KEY = 'slx_session_id'

/** Возвращает session ID из localStorage, создавая новый при необходимости. */
export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}
