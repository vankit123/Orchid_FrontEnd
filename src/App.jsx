import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate} from 'react-router'
import ListOfOrchids from './components/ListOfOrchids';
import EditOrchid from './components/EditOrchid';
import HomeScreen from './components/HomeScreen';
import ListOfEmployees from './components/ListOfEmployees';
import DetailOrchid from './pages/DetailOrchid';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import "./App.css"
import ShoppingCart from './pages/ShoppingCart';
import { ToastContainer } from 'react-toastify';
function App() {
 
  return (
    <>
<ToastContainer />
    <Routes>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/' element={<Navigate to="/home" replace />}/>
      <Route path='/home' element={<HomeScreen/>}/>
      <Route path='/orchids' element={<ListOfEmployees/>}/>
      <Route path='/detail/:id' element={<DetailOrchid/>}/>
      <Route path='/edit/:id' element={<EditOrchid/>}/>
      <Route path='/admin' element={<AdminPage/>}/>
      <Route path='/cart' element={<ShoppingCart/>}/>
    </Routes>
    </>
  )
}

export default App