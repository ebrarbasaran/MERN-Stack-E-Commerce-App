import { useState } from "react";
import profileImg from "../assets/user-profile.png";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown } from "react-icons/fi";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const links = [
    { href: '/profile', label: 'Profil' },
    { href: '/settings', label: 'Ayarlar' },
    { href: '/logout', label: 'Çıkış Yap' },
  ]

  return (
    <header className="sticky bg-white top-0 z-50 border-b-3 border-indigo-600 ">
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
              className="w-full h-[40px] px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute right-3 top-3 text-gray-700 cursor-pointer" />
          </div>
        </div>

        {/* Right side - mobile icons */}

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
          <Menu>
            {({ open }) => (
              <div className="relative inline-block text-left">
                <MenuButton
                  className={`flex items-center gap-2 px-4 h-[40px] rounded-xl border transition-colors duration-200 cursor-pointer
          ${open ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-300 text-gray-700 hover:text-white hover:bg-indigo-600 hover:border-indigo-600"}
        `}
                >
                  <FiUser className="text-lg" />
                  <div className="flex flex-col items-center leading-tight">
                    <p>Hesabım</p>
                    <p className="text-[10px]">User Name</p>
                  </div>
                  <FiChevronDown className="text-lg" />
                </MenuButton>

                <MenuItems
                  className="absolute left-0 top-full mt-2 right-0 w-(--button-width) bg-white rounded-md shadow-md text-gray-700 border border-gray-200 px-2 py-2 z-50 focus:outline-none"
                >
                  {links.map((link) => (
                    <MenuItem key={link.href}>
                      {({ active }) => (
                        <a
                          href={link.href}
                          className={`block px-4 py-2 text-sm rounded-md ${active ? "text-indigo-600 font-medium" : "text-gray-700"
                            }`}
                        >
                          {link.label}
                        </a>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </div>
            )}
          </Menu>
          <button
            href="/cart"
            className="flex items-center gap-2 px-4 h-[40px] rounded-xl border border-gray-300 text-gray-700 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-colors duration-200 cursor-pointer"
          >
            <FiShoppingCart className="text-lg" />
            <p>Sepetim</p>
          </button>
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
