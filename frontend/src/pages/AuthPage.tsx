import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './AuthPage.module.css'

type Mode = 'login' | 'register'

export default function AuthPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const switchMode = (m: Mode) => {
    setMode(m)
    setError('')
    setUsername('')
    setEmail('')
    setPassword('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(username, password)
      } else {
        await register(username, email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Left panel */}
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <div className={styles.logo}>🥗</div>
          <h1 className={styles.appName}>FoodCal</h1>
          <p className={styles.appDesc}>ติดตามแคลอรี่จากผัก &amp; ผลไม้</p>
          <div className={styles.features}>
            <div className={styles.feature}><span>⚖️</span> ระบุน้ำหนักแล้วดูแคลอรี่ได้เลย</div>
            <div className={styles.feature}><span>🗂️</span> แยกหมวดผักและผลไม้</div>
            <div className={styles.feature}><span>🛒</span> รวมแคลอรี่ทุกรายการในตะกร้า</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className={styles.right}>
        <div className={styles.card}>
          {/* Mode tabs */}
          <div className={styles.modeTabs}>
            <button
              className={`${styles.modeTab} ${mode === 'login' ? styles.modeTabActive : ''}`}
              onClick={() => switchMode('login')}
            >
              เข้าสู่ระบบ
            </button>
            <button
              className={`${styles.modeTab} ${mode === 'register' ? styles.modeTabActive : ''}`}
              onClick={() => switchMode('register')}
            >
              สมัครสมาชิก
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>ชื่อผู้ใช้</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="กรอกชื่อผู้ใช้"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className={styles.field}>
                <label className={styles.label}>อีเมล</label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}>✉️</span>
                  <input
                    className={styles.input}
                    type="email"
                    placeholder="กรอกอีเมล"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>รหัสผ่าน</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  className={styles.input}
                  type="password"
                  placeholder={mode === 'register' ? 'อย่างน้อย 6 ตัวอักษร' : 'กรอกรหัสผ่าน'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={mode === 'register' ? 6 : undefined}
                />
              </div>
            </div>

            {error && (
              <div className={styles.errorBox}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : mode === 'login' ? (
                'เข้าสู่ระบบ'
              ) : (
                'สมัครสมาชิก'
              )}
            </button>
          </form>

          <p className={styles.switchHint}>
            {mode === 'login' ? (
              <>ยังไม่มีบัญชี? <button className={styles.switchBtn} onClick={() => switchMode('register')}>สมัครสมาชิก</button></>
            ) : (
              <>มีบัญชีแล้ว? <button className={styles.switchBtn} onClick={() => switchMode('login')}>เข้าสู่ระบบ</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
