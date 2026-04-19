import {Outlet} from 'react-router-dom';
import Navbar from "../components/Navbar";
import Breadcrumb from '../components/Breadcrumb';
import Footer from "../components/Footer";

function MainLayout() {
  return (
    <>
     <Navbar/>
     <Breadcrumb/>
     <main>
        <Outlet/>
     </main>
     <Footer/>
    </>
  )
}

export default MainLayout;