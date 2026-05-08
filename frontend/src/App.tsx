import { useState, useEffect } from 'react'
import { type Food, type Category } from './data/foods'
import { fetchFoodsPaginated } from './services/foodApi'
import { useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import FoodCard from './components/FoodCard'
import Cart from './components/Cart'
import './App.css'

export interface CartItem {
  id: string
  food: Food
  weight: number
}

type FilterTab = 'all' | Category

const TABS: { key: FilterTab; label: string; emoji: string }[] = [
  { key: 'all', label: 'ทั้งหมด', emoji: '🌈' },
  { key: 'vegetable', label: 'ผัก', emoji: '🥦' },
  { key: 'fruit', label: 'ผลไม้', emoji: '🍎' },
]

const PAGE_SIZE_OPTIONS = [4, 8, 12, 20]

export default function App() {
  const { token, username, logout } = useAuth()

  if (!token) return <AuthPage />

  return <AppContent username={username} onLogout={logout} />
}

function AppContent({ username, onLogout }: { username: string | null; onLogout: () => void }) {
  const [foods, setFoods] = useState<Food[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<FilterTab>('all')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  useEffect(() => {
    setLoading(true)
    const category = tab === 'all' ? undefined : tab
    fetchFoodsPaginated(page, pageSize, category)
      .then((res) => {
        setFoods(res.data)
        setTotal(res.total)
        setTotalPages(res.totalPages)
      })
      .finally(() => setLoading(false))
  }, [page, pageSize, tab])

  const changeTab = (t: FilterTab) => {
    setTab(t)
    setPage(1)
  }

  const changePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  const addToCart = (food: Food, weight: number) => {
    setCartItems((prev) => [...prev, { id: `${food.id}-${Date.now()}`, food, weight }])
    setCartOpen(true)
  }

  const removeFromCart = (id: string) =>
    setCartItems((prev) => prev.filter((item) => item.id !== id))

  const totalCalories = cartItems.reduce(
    (sum, item) => sum + Math.round((item.food.caloriesPer100g * item.weight) / 100),
    0
  )

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="headerInner">
          <div className="brand">
            <div className="brandLogo">🥗</div>
            <div>
              <span className="brandName">FoodCal</span>
              <span className="brandTagline">นับแคลอรี่ผัก &amp; ผลไม้</span>
            </div>
          </div>
          <div className="headerActions">
            <button className="cartBtn" onClick={() => setCartOpen((o) => !o)}>
              <span className="cartBtnIcon">🛒</span>
              <span className="cartBtnText">ตะกร้า</span>
              {cartItems.length > 0 && (
                <>
                  <span className="cartBadge">{cartItems.length}</span>
                  <span className="cartKcal">{totalCalories} kcal</span>
                </>
              )}
            </button>
            <div className="userChip">
              <span className="userAvatar">👤</span>
              <span className="userName">{username}</span>
              <button className="logoutBtn" onClick={onLogout} title="ออกจากระบบ">
                ออก
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="pageWrap">
        {/* Content */}
        <main className="content">
          {/* Filter bar */}
          <div className="filterBar">
            <div className="tabs">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`tabChip ${tab === t.key ? 'tabChipActive' : ''}`}
                  onClick={() => changeTab(t.key)}
                >
                  <span>{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
            <div className="pageSizeRow">
              <span className="pageSizeLabel">แสดง</span>
              {PAGE_SIZE_OPTIONS.map((s) => (
                <button
                  key={s}
                  className={`pageSizeBtn ${pageSize === s ? 'pageSizeBtnActive' : ''}`}
                  onClick={() => changePageSize(s)}
                >
                  {s}
                </button>
              ))}
              <span className="pageSizeLabel">รายการ</span>
            </div>
          </div>

          {/* Loading / content */}
          {loading ? (
            <div className="resultsInfo">กำลังโหลด...</div>
          ) : (
            <>
              <div className="resultsInfo">
                แสดง {total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} จาก {total} รายการ
              </div>

              <div className="grid">
                {foods.map((food) => (
                  <FoodCard key={food.id} food={food} onAddToCart={addToCart} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pageNavBtn"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    ‹ ก่อนหน้า
                  </button>
                  <div className="pageNumbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`pageNum ${page === p ? 'pageNumActive' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    className="pageNavBtn"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    ถัดไป ›
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Cart panel */}
        <aside className={`cartPanel ${cartOpen ? 'cartPanelOpen' : ''}`}>
          <Cart items={cartItems} onRemove={removeFromCart} onClear={() => setCartItems([])} />
        </aside>
      </div>

      {cartOpen && <div className="overlay" onClick={() => setCartOpen(false)} />}
    </div>
  )
}
