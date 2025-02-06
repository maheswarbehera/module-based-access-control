
import reactLogo from './assets/react.svg' 
import './App.css'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import OrdersPage from './pages/OrdersPage'

function App() { 
  return (
    <>
      <div> 
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> 
      <Login/>
      <Sidebar/>
      {/* <OrdersPage/> */}
    </>
  )
}

export default App
