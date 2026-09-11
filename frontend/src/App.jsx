import { useEffect, useRef, useState } from 'react'
import './App.css'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const products = [
  { id: 1, name: 'Linen day shirt', category: 'Apparel', price: 68, color: 'sage', badge: 'New in' },
  { id: 2, name: 'Studio ceramic set', category: 'Homeware', price: 42, color: 'clay', badge: 'Bestseller' },
  { id: 3, name: 'Weekend tote', category: 'Accessories', price: 54, color: 'ink', badge: 'Low stock' },
  { id: 4, name: 'Contour table lamp', category: 'Homeware', price: 118, color: 'ochre', badge: 'Curated' },
]

function App() {
  const [page, setPage] = useState('shop')
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])
  const navigate = (nextPage) => { setPage(nextPage); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleWishlist = (id) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const addToCart = (product) => setCart((current) => current.some((item) => item.id === product.id) ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }])
  const pageContent = {
    shop: <ShopPage onProduct={navigate} onWishlist={toggleWishlist} wishlist={wishlist} onAdd={addToCart} />,
    product: <ProductPage onBack={() => navigate('shop')} onAdd={addToCart} />,
    wishlist: <WishlistPage items={products.filter((product) => wishlist.includes(product.id))} onAdd={addToCart} onProduct={navigate} />,
    cart: <CartPage items={cart} onShop={() => navigate('shop')} />,
    signup: <AccountPage mode="signup" onSwitch={() => navigate('signin')} />,
    signin: <AccountPage mode="signin" onSwitch={() => navigate('signup')} onSignedIn={() => navigate('shop')} />,
    reset: <ResetPasswordPage onBack={() => navigate('signin')} />,
  }[page]

  return <div className="app-shell">
    <div className="announcement">Free delivery on orders over $75 <span>+</span> Easy returns within 30 days</div>
    <header className="site-header"><button className="wordmark" onClick={() => navigate('shop')}>Morrow<span>.</span></button><nav className="main-nav"><button className={page === 'shop' ? 'active' : ''} onClick={() => navigate('shop')}>Shop</button><button onClick={() => navigate('shop')}>New in</button><button onClick={() => navigate('shop')}>Journal</button></nav><div className="header-actions"><button className="icon-button" onClick={() => navigate('signin')}>◎</button><button className="icon-button" onClick={() => navigate('wishlist')}>♡<small>{wishlist.length}</small></button><button className="cart-button" onClick={() => navigate('cart')}>Bag <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></button></div></header>
    <main>{pageContent}</main><footer><span>Morrow.</span><p>Objects for slower mornings and better days.</p><button onClick={() => navigate('signup')}>Join the list</button></footer>
  </div>
}

function ShopPage({ onProduct, onWishlist, wishlist, onAdd }) { return <><section className="hero-band"><div className="hero-copy"><p className="eyebrow">The quiet collection / 04</p><h1>Good things,<br /><em>well chosen.</em></h1><p className="hero-text">Thoughtful pieces for everyday rituals. Made to be used, loved, and kept.</p><button className="primary-button" onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}>Explore collection <span>↘</span></button></div><div className="hero-art"><div className="sun-disc" /><div className="hero-vase vase-a" /><div className="hero-vase vase-b" /><div className="hero-leaf">⌁</div><span className="art-label">FORM / FUNCTION</span></div></section><section className="intro-row"><p>Small-batch goods<br />for your daily orbit.</p><p className="muted">Curated with intention in Copenhagen<br />and sent wherever you are.</p><button className="text-button">Our point of view <span>→</span></button></section><section className="collection" id="collection"><div className="section-heading"><div><p className="eyebrow">Shop the edit</p><h2>Made for now</h2></div><button className="filter-button">All pieces <span>⌄</span></button></div><div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} liked={wishlist.includes(product.id)} onWishlist={onWishlist} onAdd={onAdd} onProduct={onProduct} />)}</div></section></> }

function ProductCard({ product, liked, onWishlist, onAdd, onProduct }) { return <article className="product-card"><button className="product-image" onClick={() => onProduct('product')}><span className={`product-shape ${product.color}`} /><span className="badge">{product.badge}</span><span className="zoom">View</span></button><div className="product-meta"><div><p>{product.category}</p><h3>{product.name}</h3></div><button className={`heart ${liked ? 'liked' : ''}`} onClick={() => onWishlist(product.id)}>{liked ? '♥' : '♡'}</button></div><div className="product-bottom"><span>${product.price}</span><button onClick={() => onAdd(product)}>Add to bag <span>+</span></button></div></article> }

function ProductPage({ onBack, onAdd }) { const product = products[0]; return <section className="detail-page"><button className="back-button" onClick={onBack}>← Back to shop</button><div className="detail-grid"><div className="detail-image"><span className="product-shape sage" /><span className="art-label">DETAIL / 01</span></div><div className="detail-info"><p className="eyebrow">{product.category} / Morrow edit</p><h1>{product.name}</h1><p className="detail-price">${product.price}</p><p className="detail-description">A relaxed everyday layer cut from breathable linen with a softly structured collar. Designed for the space between dressed and undone.</p><div className="option-row"><span>Size</span><button>S</button><button className="selected">M</button><button>L</button></div><button className="primary-button full" onClick={() => onAdd(product)}>Add to bag <span>+</span></button><div className="details-list"><p>Material <span>100% washed linen</span></p><p>Delivery <span>Ships in 1–2 days</span></p><p>Returns <span>30 days, no questions</span></p></div></div></div></section> }

function WishlistPage({ items, onAdd, onProduct }) { return <section className="content-page"><div className="page-heading"><p className="eyebrow">Saved for later</p><h1>Your wishlist</h1><p>{items.length ? `${items.length} pieces waiting for you.` : 'Your quiet corner is waiting for something lovely.'}</p></div>{items.length ? <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} liked onWishlist={() => {}} onAdd={onAdd} onProduct={onProduct} />)}</div> : <EmptyState label="Browse the collection" onClick={() => onProduct('shop')} />}</section> }

function CartPage({ items, onShop }) { const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0); return <section className="content-page cart-page"><div className="page-heading"><p className="eyebrow">Your selection</p><h1>Shopping bag</h1></div>{items.length ? <div className="cart-layout"><div className="cart-items">{items.map((item) => <div className="cart-item" key={item.id}><div className={`cart-thumb ${item.color}`}><span className="product-shape" /></div><div><p className="eyebrow">{item.category}</p><h3>{item.name}</h3><p>Qty {item.quantity}</p></div><strong>${item.price * item.quantity}</strong></div>)}</div><aside className="summary"><p className="eyebrow">Order summary</p><div><span>Subtotal</span><strong>${total}</strong></div><div><span>Delivery</span><span>Calculated at checkout</span></div><button className="primary-button full">Checkout <span>→</span></button></aside></div> : <EmptyState label="Continue shopping" onClick={onShop} />}</section> }

function AccountPage({ mode, onSwitch, onSignedIn }) { const signup = mode === 'signup'; return <section className="auth-page"><div className="auth-panel"><p className="eyebrow">{signup ? 'A considered beginning' : 'Welcome back'}</p><h1>{signup ? 'Create your account' : 'Sign in to Morrow'}</h1><p className="auth-intro">{signup ? 'Save your favorites, track your orders, and stay close to the good stuff.' : 'Your saved pieces are waiting.'}</p>{!signup && <><GoogleSignInButton onSignedIn={onSignedIn} /><div className="auth-divider"><span>or continue with email</span></div></>}<form onSubmit={(event) => event.preventDefault()}>{signup && <label>Full name<input type="text" placeholder="Your name" /></label>}<label>Email address<input type="email" placeholder="you@example.com" /></label><label>Password<input type="password" placeholder="••••••••" /></label>{!signup && <button className="forgot" type="button">Forgot password?</button>}<button className="primary-button full" type="submit">{signup ? 'Create account' : 'Sign in'} <span>→</span></button></form><p className="switch-copy">{signup ? 'Already have an account?' : 'New to Morrow?'} <button onClick={onSwitch}>{signup ? 'Sign in' : 'Create an account'}</button></p></div><div className="auth-art"><div className="auth-circle" /><p>Made slowly.<br />Kept dearly.</p></div></section> }

function GoogleSignInButton({ onSignedIn }) {
  const buttonRef = useRef(null)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) {
      setError('Google sign-in is not configured yet.')
      return undefined
    }

    const renderButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          try {
            const response = await fetch(`${apiUrl}/auth/google`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credential }),
            })
            const result = await response.json()
            if (!response.ok) throw new Error(result.error || 'Google sign-in failed')
            localStorage.setItem('morrow_session', JSON.stringify(result))
            onSignedIn()
          } catch (requestError) {
            setError(requestError.message)
          }
        },
      })
      window.google.accounts.id.renderButton(buttonRef.current, { theme: 'outline', size: 'large', width: 320, text: 'continue_with' })
      setReady(true)
    }

    if (window.google?.accounts?.id) {
      renderButton()
      return undefined
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = renderButton
    script.onerror = () => setError('Google sign-in could not load. Check your connection.')
    document.head.appendChild(script)
    return () => script.remove()
  }, [])

  return <div className="google-signin">{!ready && <div className="google-brand"><span className="google-logo" aria-hidden="true">G</span><span>Continue with Google</span></div>}<div ref={buttonRef} />{error && <p className="auth-error">{error}</p>}</div>
}

function ResetPasswordPage({ onBack }) { return <section className="auth-page"><div className="auth-panel"><p className="eyebrow">A fresh start</p><h1>Reset password</h1><p className="auth-intro">Enter your email and we’ll send a link to set a new password.</p><form onSubmit={(event) => event.preventDefault()}><label>Email address<input type="email" placeholder="you@example.com" /></label><button className="primary-button full" type="submit">Send reset link <span>→</span></button></form><button className="text-button" onClick={onBack}>← Back to sign in</button></div><div className="auth-art reset-art"><div className="auth-circle" /><p>Take your time.</p></div></section> }
function EmptyState({ label, onClick }) { return <div className="empty-state"><span className="empty-mark">+</span><p>Nothing here yet.</p><button className="text-button" onClick={onClick}>{label} <span>→</span></button></div> }

export default App
