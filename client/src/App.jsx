import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from '../src/pages/Home';
import Header from '../src/layout/Header';
import Footer from '../src/layout/Footer';
import Container from "./components/Container";

function App() {
  return (
    <BrowserRouter>
      <Container>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </Container>
    </BrowserRouter>
  )
}

export default App
