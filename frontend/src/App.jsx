import { createContext, useContext, useState } from 'react'
import { createAuthClient } from 'better-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import './App.css'
import AiChat from './AiChat.jsx'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const authClient = createAuthClient({ baseURL: apiUrl })

const translations = {
  en: {
    announcement: 'Free delivery on orders over $75',
    returns: 'Easy returns within 30 days',
    shop: 'Shop', newIn: 'New in', journal: 'Journal', bag: 'Bag',
    collection: 'The quiet collection / 04', heroTitle: 'Good things,', heroTitleEm: 'well chosen.',
    heroText: 'Thoughtful pieces for everyday rituals. Made to be used, loved, and kept.',
    explore: 'Explore collection', smallBatch: 'Small-batch goods', dailyOrbit: 'for your daily orbit.',
    curated: 'Curated with intention in Copenhagen', sent: 'and sent wherever you are.', pointOfView: 'Our point of view',
    shopEdit: 'Shop the edit', madeNow: 'Made for now', allPieces: 'All pieces',
    view: 'View', addBag: 'Add to bag', saved: 'Saved for later', wishlist: 'Your wishlist',
    piecesWaiting: (count) => `${count} pieces waiting for you.`, emptyWishlist: 'Your quiet corner is waiting for something lovely.',
    browse: 'Browse the collection', backShop: 'Back to shop', detail: 'DETAIL / 01',
    size: 'Size', material: 'Material', delivery: 'Delivery', ships: 'Ships in 1–2 days',
    returnsLabel: 'Returns', returnsValue: '30 days, no questions', add: 'Add to bag',
    selection: 'Your selection', shoppingBag: 'Shopping bag', qty: 'Qty', orderSummary: 'Order summary',
    subtotal: 'Subtotal', deliveryCalc: 'Calculated at checkout', checkout: 'Checkout', continueShopping: 'Continue shopping',
    beginning: 'A considered beginning', welcome: 'Welcome back', createAccount: 'Create your account', signInTitle: 'Sign in to Morrow',
    accountIntro: 'Save your favorites, track your orders, and stay close to the good stuff.', savedPieces: 'Your saved pieces are waiting.',
    fullName: 'Full name', yourName: 'Your name', email: 'Email address', password: 'Password', forgot: 'Forgot password?',
    signIn: 'Sign in', already: 'Already have an account?', newTo: 'New to Morrow?', signUp: 'Create an account',
    google: 'Continue with Google', resetStart: 'A fresh start', resetPassword: 'Reset password',
    resetIntro: 'Enter your email and we’ll send a link to set a new password.', sendReset: 'Send reset link',
    backSignIn: 'Back to sign in', nothing: 'Nothing here yet.', join: 'Join the list', footer: 'Objects for slower mornings and better days.',
    apparel: 'Apparel', homeware: 'Homeware', accessories: 'Accessories', newBadge: 'New in', bestseller: 'Bestseller', lowStock: 'Low stock', curatedBadge: 'Curated',
    linen: 'Linen day shirt', ceramic: 'Studio ceramic set', tote: 'Weekend tote', lamp: 'Contour table lamp',
    linenDescription: 'A relaxed everyday layer cut from breathable linen with a softly structured collar. Designed for the space between dressed and undone.',
    washedLinen: '100% washed linen', language: 'Language', english: 'English', kiswahili: 'Kiswahili',
  },
  sw: {
    announcement: 'Usafirishaji wa bure kwa oda zaidi ya $75', returns: 'Rudisha bidhaa ndani ya siku 30',
    shop: 'Duka', newIn: 'Mpya', journal: 'Jarida', bag: 'Kikapu', collection: 'Mkusanyiko tulivu / 04',
    heroTitle: 'Vitu vizuri,', heroTitleEm: 'vimechaguliwa vyema.', heroText: 'Bidhaa zenye mawazo kwa shughuli zako za kila siku. Zimetengenezwa kutumiwa, kupendwa na kuhifadhiwa.',
    explore: 'Tazama mkusanyiko', smallBatch: 'Bidhaa za kiwango kidogo', dailyOrbit: 'kwa maisha yako ya kila siku.',
    curated: 'Imechaguliwa kwa umakini Copenhagen', sent: 'na kutumwa popote ulipo.', pointOfView: 'Mtazamo wetu', shopEdit: 'Chagua unachopenda', madeNow: 'Zilizotengenezwa sasa', allPieces: 'Bidhaa zote',
    view: 'Tazama', addBag: 'Ongeza kikapuni', saved: 'Zilizohifadhiwa', wishlist: 'Orodha yako ya mapenzi', piecesWaiting: (count) => `Bidhaa ${count} zinakungoja.`, emptyWishlist: 'Kona yako tulivu inangoja kitu kizuri.', browse: 'Tazama mkusanyiko', backShop: 'Rudi dukani', detail: 'MAELEZO / 01',
    size: 'Ukubwa', material: 'Nyenzo', delivery: 'Usafirishaji', ships: 'Inatumwa ndani ya siku 1–2', returnsLabel: 'Marejesho', returnsValue: 'Siku 30, bila masharti', selection: 'Chaguo lako', shoppingBag: 'Kikapu cha manunuzi', qty: 'Idadi', orderSummary: 'Muhtasari wa oda', subtotal: 'Jumla ndogo', deliveryCalc: 'Hukokotolewa wakati wa malipo', checkout: 'Lipa', continueShopping: 'Endelea kununua',
    beginning: 'Mwanzo wenye maana', welcome: 'Karibu tena', createAccount: 'Fungua akaunti yako', signInTitle: 'Ingia Morrow', accountIntro: 'Hifadhi vipendwa, fuatilia oda zako na uwe karibu na bidhaa nzuri.', savedPieces: 'Bidhaa ulizohifadhi zinakungoja.', fullName: 'Jina kamili', yourName: 'Jina lako', email: 'Barua pepe', password: 'Nenosiri', forgot: 'Umesahau nenosiri?', signIn: 'Ingia', already: 'Una akaunti tayari?', newTo: 'Mgeni Morrow?', signUp: 'Fungua akaunti', google: 'Endelea na Google', resetStart: 'Mwanzo mpya', resetPassword: 'Badilisha nenosiri', resetIntro: 'Weka barua pepe yako na tutakutumia kiungo cha kuweka nenosiri jipya.', sendReset: 'Tuma kiungo', backSignIn: 'Rudi kuingia', nothing: 'Hakuna kitu bado.', join: 'Jiunge nasi', footer: 'Vitu vya asubuhi tulivu na siku bora.',
    apparel: 'Mavazi', homeware: 'Vya nyumbani', accessories: 'Vifaa', newBadge: 'Mpya', bestseller: 'Kinachopendwa', lowStock: 'Vimebaki vichache', curatedBadge: 'Teule', linen: 'Shati la kitani', ceramic: 'Seti ya vyombo vya kauri', tote: 'Mkoba wa wikendi', lamp: 'Taa ya meza ya Contour', linenDescription: 'Tabaka la kila siku lililotengenezwa kwa kitani kinachopitisha hewa, lenye kola iliyopangwa kwa upole. Limeundwa kwa wakati kati ya kuvaa rasmi na kawaida.', washedLinen: 'Kitani kilichooshwa 100%', language: 'Lugha', english: 'Kiingereza', kiswahili: 'Kiswahili',
  },
}

const LanguageContext = createContext(null)
function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('morrow_language') || 'en')
  const changeLanguage = (next) => { setLanguage(next); localStorage.setItem('morrow_language', next) }
  return <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: translations[language] }}>{children}</LanguageContext.Provider>
}
function useI18n() { return useContext(LanguageContext) }

function App() {
  const queryClient = useQueryClient()
  useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/api/auth/get-session`, { credentials: 'include' })
      if (!response.ok) return null
      return response.json()
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
  const { data: products = [], isLoading: productsLoading, isError: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/api/products`)
      if (!response.ok) throw new Error('Could not load products')
      return response.json()
    },
    staleTime: 60 * 1000,
  })
  const { language, setLanguage, t } = useI18n()
  const [page, setPage] = useState('shop')
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])
  const navigate = (nextPage) => { setPage(nextPage); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleWishlist = (id) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const addToCart = (product) => setCart((current) => current.some((item) => item.id === product.id) ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }])
  const pageContent = {
    shop: <ShopPage products={products} loading={productsLoading} error={productsError} onProduct={navigate} onWishlist={toggleWishlist} wishlist={wishlist} onAdd={addToCart} />,
    product: <ProductPage product={products[0]} onBack={() => navigate('shop')} onAdd={addToCart} />,
    wishlist: <WishlistPage items={products.filter((product) => wishlist.includes(product.id))} onAdd={addToCart} onProduct={navigate} />,
    cart: <CartPage items={cart} onShop={() => navigate('shop')} />,
    signup: <AccountPage mode="signup" onSwitch={() => navigate('signin')} />,
    signin: <AccountPage mode="signin" onSwitch={() => navigate('signup')} onSignedIn={() => navigate('shop')} />,
    reset: <ResetPasswordPage onBack={() => navigate('signin')} />,
    manage: <ProductManager onCreated={(product) => { queryClient.setQueryData(['products'], (current = []) => [product, ...current]); navigate('product') }} />,
  }[page]

  return <div className="app-shell">
    <AiChat />
    <div className="announcement">{t.announcement} <span>+</span> {t.returns}</div>
    <header className="site-header"><button className="wordmark" onClick={() => navigate('shop')}>Morrow<span>.</span></button><nav className="main-nav"><button className={page === 'shop' ? 'active' : ''} onClick={() => navigate('shop')}>{t.shop}</button><button onClick={() => navigate('shop')}>{t.newIn}</button><button onClick={() => navigate('shop')}>{t.journal}</button></nav><div className="header-actions"><button className="language-button" aria-label={t.language} title={t.language} onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}>🌐 <span>{language === 'en' ? 'SW' : 'EN'}</span></button><button className="icon-button" onClick={() => navigate('signin')}>◎</button><button className="icon-button" onClick={() => navigate('wishlist')}>♡<small>{wishlist.length}</small></button><button className="cart-button" onClick={() => navigate('cart')}>{t.bag} <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span></button><button className="manage-button" onClick={() => navigate('manage')}>+</button></div></header>
    <main>{pageContent}</main><footer><span>Morrow.</span><p>{t.footer}</p><button onClick={() => navigate('signup')}>{t.join}</button></footer>
  </div>
}

function ShopPage({ products, loading, error, onProduct, onWishlist, wishlist, onAdd }) { const { t } = useI18n(); return <><section className="hero-band"><div className="hero-copy"><p className="eyebrow">{t.collection}</p><h1>{t.heroTitle}<br /><em>{t.heroTitleEm}</em></h1><p className="hero-text">{t.heroText}</p><button className="primary-button" onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}>{t.explore} <span>↘</span></button></div><div className="hero-art"><div className="sun-disc" /><div className="hero-vase vase-a" /><div className="hero-vase vase-b" /><div className="hero-leaf">⌁</div><span className="art-label">FORM / FUNCTION</span></div></section><section className="intro-row"><p>{t.smallBatch}<br />{t.dailyOrbit}</p><p className="muted">{t.curated}<br />{t.sent}</p><button className="text-button">{t.pointOfView} <span>→</span></button></section><section className="collection" id="collection"><div className="section-heading"><div><p className="eyebrow">{t.shopEdit}</p><h2>{t.madeNow}</h2></div><button className="filter-button">{t.allPieces} <span>⌄</span></button></div>{loading && <p className="muted">Loading products...</p>}{error && <p className="auth-error">Could not load products.</p>}{!loading && !error && <div className="product-grid">{products.map((product) => <ProductCard key={product._id || product.id} product={product} liked={wishlist.includes(product._id || product.id)} onWishlist={onWishlist} onAdd={onAdd} onProduct={onProduct} />)}</div>}</section></> }

function ProductCard({ product, liked, onWishlist, onAdd, onProduct }) { const { t } = useI18n(); const labels = { 1: [t.linen, t.apparel, t.newBadge], 2: [t.ceramic, t.homeware, t.bestseller], 3: [t.tote, t.accessories, t.lowStock], 4: [t.lamp, t.homeware, t.curatedBadge] }; const fallback = labels[product.id] || [product.name, product.category || t.allPieces, product.stock === 0 ? t.lowStock : t.curatedBadge]; const [name, category, badge] = fallback; const productId = product._id || product.id; return <article className="product-card"><button className="product-image" onClick={() => onProduct('product')}>{product.imageUrl ? <img className="product-photo" src={product.imageUrl} alt={name} /> : <span className={`product-shape ${product.color || 'sage'}`} />}<span className="badge">{badge}</span><span className="zoom">{t.view}</span></button><div className="product-meta"><div><p>{category}</p><h3>{name}</h3></div><button className={`heart ${liked ? 'liked' : ''}`} onClick={() => onWishlist(productId)}>{liked ? '♥' : '♡'}</button></div><div className="product-bottom"><span>${product.price}</span><button onClick={() => onAdd(product)}>{t.addBag} <span>+</span></button></div></article> }

function ProductPage({ product, onBack, onAdd }) { const { t } = useI18n(); if (!product) return <section className="content-page"><button className="back-button" onClick={onBack}>← {t.backShop}</button><p className="muted">{t.nothing}</p></section>; return <section className="detail-page"><button className="back-button" onClick={onBack}>← {t.backShop}</button><div className="detail-grid"><div className="detail-image">{product.imageUrl ? <img className="detail-photo" src={product.imageUrl} alt={product.name} /> : <span className={`product-shape ${product.color || 'sage'}`} />}<span className="art-label">{t.detail}</span></div><div className="detail-info"><p className="eyebrow">{product.category || t.allPieces} / Morrow edit</p><h1>{product.name}</h1><p className="detail-price">${product.price}</p><p className="detail-description">{product.description || t.linenDescription}</p><div className="option-row"><span>{t.size}</span><button>S</button><button className="selected">M</button><button>L</button></div><button className="primary-button full" onClick={() => onAdd(product)}>{t.addBag} <span>+</span></button><div className="details-list"><p>{t.material} <span>{t.washedLinen}</span></p><p>{t.delivery} <span>{t.ships}</span></p><p>{t.returnsLabel} <span>{t.returnsValue}</span></p></div></div></div></section> }

function ProductManager({ onCreated }) { const { t } = useI18n(); const [image, setImage] = useState(''); const [message, setMessage] = useState(''); const createMutation = useMutation({ mutationFn: async (product) => { const response = await fetch(`${apiUrl}/api/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ ...product, image }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Could not create product'); return result }, onSuccess: (product) => { setMessage('Product uploaded successfully.'); setImage(''); onCreated(product) }, onError: (error) => setMessage(error.message) }); const submit = (event) => { event.preventDefault(); const formData = new FormData(event.currentTarget); createMutation.mutate({ name: formData.get('name'), description: formData.get('description'), price: formData.get('price'), stock: formData.get('stock'), category: formData.get('category') }) }; const readImage = (event) => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setImage(reader.result); reader.readAsDataURL(file) }; return <section className="content-page"><div className="page-heading"><p className="eyebrow">Owner workspace</p><h1>Upload product</h1></div><form className="product-form" onSubmit={submit}><label>Name<input name="name" required /></label><label>Description<textarea name="description" /></label><label>Price<input name="price" type="number" min="0" step="0.01" required /></label><label>Stock<input name="stock" type="number" min="0" step="1" defaultValue="0" /></label><label>Category<input name="category" /></label><label>Product picture<input type="file" accept="image/*" onChange={readImage} required /></label>{message && <p className="auth-error">{message}</p>}<button className="primary-button" type="submit" disabled={createMutation.isPending}>{createMutation.isPending ? 'Uploading...' : 'Create product'} <span>→</span></button></form></section> }

function WishlistPage({ items, onAdd, onProduct }) { const { t } = useI18n(); return <section className="content-page"><div className="page-heading"><p className="eyebrow">{t.saved}</p><h1>{t.wishlist}</h1><p>{items.length ? t.piecesWaiting(items.length) : t.emptyWishlist}</p></div>{items.length ? <div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} liked onWishlist={() => {}} onAdd={onAdd} onProduct={onProduct} />)}</div> : <EmptyState label={t.browse} onClick={() => onProduct('shop')} />}</section> }

function CartPage({ items, onShop }) { const { t } = useI18n(); const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0); return <section className="content-page cart-page"><div className="page-heading"><p className="eyebrow">{t.selection}</p><h1>{t.shoppingBag}</h1></div>{items.length ? <div className="cart-layout"><div className="cart-items">{items.map((item) => <div className="cart-item" key={item.id}><div className={`cart-thumb ${item.color}`}><span className="product-shape" /></div><div><p className="eyebrow">{item.category}</p><h3>{item.name}</h3><p>{t.qty} {item.quantity}</p></div><strong>${item.price * item.quantity}</strong></div>)}</div><aside className="summary"><p className="eyebrow">{t.orderSummary}</p><div><span>{t.subtotal}</span><strong>${total}</strong></div><div><span>{t.delivery}</span><span>{t.deliveryCalc}</span></div><button className="primary-button full">{t.checkout} <span>→</span></button></aside></div> : <EmptyState label={t.continueShopping} onClick={onShop} />}</section> }

function AccountPage({ mode, onSwitch, onSignedIn }) {
  const { t } = useI18n()
  const queryClient = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
  const signup = mode === 'signup'
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Sign-in failed')
      return result
    },
    onSuccess: (result) => {
      localStorage.setItem('morrow_session', JSON.stringify(result))
      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })
      onSignedIn()
    },
  })
  const submit = (event) => {
    event.preventDefault()
    if (signup) return
    const formData = new FormData(event.currentTarget)
    loginMutation.mutate({ email: formData.get('email'), password: formData.get('password') })
  }

  return <section className="auth-page">
    <div className="auth-panel">
      <p className="eyebrow">{signup ? t.beginning : t.welcome}</p>
      <h1>{signup ? t.createAccount : t.signInTitle}</h1>
      <p className="auth-intro">{signup ? t.accountIntro : t.savedPieces}</p>
      {!signup && <><GoogleSignInButton /><div className="auth-divider"><span>{t.google}</span></div></>}
      <form onSubmit={submit}>
        {signup && <label>{t.fullName}<input type="text" placeholder={t.yourName} /></label>}
        <label>{t.email}<input name="email" type="email" placeholder="you@example.com" /></label>
        <label>{t.password}<span className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} placeholder="********" /><button className="password-toggle" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? '◉' : '◌'}</button></span></label>
        {!signup && <button className="forgot" type="button">{t.forgot}</button>}
        {loginMutation.isError && <p className="auth-error">{loginMutation.error.message}</p>}
        <button className="primary-button full" type="submit" disabled={loginMutation.isPending}>{signup ? t.createAccount : loginMutation.isPending ? 'Signing in...' : t.signIn} <span>→</span></button>
      </form>
      <p className="switch-copy">{signup ? t.already : t.newTo} <button onClick={onSwitch}>{signup ? t.signIn : t.signUp}</button></p>
    </div>
    <div className="auth-art"><div className="auth-circle" /><p>Made slowly.<br />Kept dearly.</p></div>
  </section>
}

function GoogleSignInButton() {
  const [error, setError] = useState('')
  const signInWithGoogle = async () => {
    const result = await authClient.signIn.social({
      provider: 'google',
      callbackURL: window.location.origin,
    })
    if (result.error) setError(result.error.message || 'Google sign-in failed')
  }

  return <div className="google-signin"><button className="google-brand" type="button" onClick={signInWithGoogle}><span className="google-logo" aria-hidden="true">G</span><span>Continue with Google</span></button>{error && <p className="auth-error">{error}</p>}</div>
}

function ResetPasswordPage({ onBack }) { const { t } = useI18n(); return <section className="auth-page"><div className="auth-panel"><p className="eyebrow">{t.resetStart}</p><h1>{t.resetPassword}</h1><p className="auth-intro">{t.resetIntro}</p><form onSubmit={(event) => event.preventDefault()}><label>{t.email}<input type="email" placeholder="you@example.com" /></label><button className="primary-button full" type="submit">{t.sendReset} <span>→</span></button></form><button className="text-button" onClick={onBack}>← {t.backSignIn}</button></div><div className="auth-art reset-art"><div className="auth-circle" /><p>Take your time.</p></div></section> }
function EmptyState({ label, onClick }) { const { t } = useI18n(); return <div className="empty-state"><span className="empty-mark">+</span><p>{t.nothing}</p><button className="text-button" onClick={onClick}>{label} <span>→</span></button></div> }

function AppWithLanguage() { return <LanguageProvider><App /></LanguageProvider> }

export default AppWithLanguage
