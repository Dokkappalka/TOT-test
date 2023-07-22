import React, { useEffect } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import styles from './App.module.scss'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation/Navigation'
import InboxPage from './pages/InboxPage/InboxPage'
import MessagePage from './pages/MessagePage/MessagePage'
function App() {
  console.log(process.env.REACT_APP_API)
  return (
    <div>
      <Header />
      <main className={styles.main}>
        <Navigation />
        <div className={styles.pageContainer}>
          <Routes>
            <Route path='/' element={<Navigate to='/mail/?dir=1' />} />
            <Route path='/mail' element={<InboxPage />} />
            <Route path='/message' element={<MessagePage />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
