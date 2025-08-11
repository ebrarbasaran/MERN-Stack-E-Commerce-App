import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from '../src/pages/Home';
import Header from '../src/layout/Header';
import Footer from '../src/layout/Footer';
import Container from "./components/Container";
import ProductDetail from "./pages/ProductDetail"

function App() {
  return (
    <BrowserRouter>
      <Container>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
        <Footer />
      </Container>
    </BrowserRouter>
  )
}

export default App
