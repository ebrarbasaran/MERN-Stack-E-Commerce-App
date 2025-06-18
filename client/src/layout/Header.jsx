import { useState } from "react";
import profileImg from "../assets/user-profile.png";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-gray-100 sticky top-0 z-50">
      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Logo and mobile menu button */}
        <div className="flex items-center space-x-4">
          <button
            className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <a href="/" className="text-xl font-bold text-indigo-600">
            E-Commerce
          </a>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Ürün ara..."
              className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Right side - mobile icons */}
        <div className="flex items-center space-x-4">
          <div className="md:hidden flex items-center space-x-4">
            <a
              href="/login"
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
            >
              <FiUser className="text-xl" />
            </a>
            <a
              href="/cart"
              className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
            >
              <FiShoppingCart className="text-xl" />
            </a>
          </div>

          {/* Right side - desktop icons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/login"
              className="flex items-center gap-2 px-4 py-1 rounded-xl border border-gray-300 text-gray-700 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-colors duration-200"
            >
              <FiUser className="text-lg" />
              <span>Giriş Yap</span>
            </a>
            <a
              href="/cart"
              className="flex items-center gap-2 px-4 py-1 rounded-xl border border-gray-300 text-gray-700 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-colors duration-200"
            >
              <FiShoppingCart className="text-lg" />
              <span>Sepetim</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="md:hidden px-4 pb-2 pt-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Arama Yap"
                className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
              <FiSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          <nav className="flex flex-col space-y-1 px-4">
            <a href="#" className="py-2 text-gray-700 hover:text-indigo-600">
              Kategoriler
            </a>
            <a href="#" className="py-2 text-gray-700 hover:text-indigo-600">
              Fırsatlar
            </a>
            <a href="#" className="py-2 text-gray-700 hover:text-indigo-600">
              Hesabım
            </a>
          </nav>

          <div className="px-4 py-3 flex items-center space-x-3 border-t mt-2">
            <img src={profileImg} alt="User" className="w-8 h-8 rounded-full" />
            <span className="text-gray-700">Merhaba, Kullanıcı</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
