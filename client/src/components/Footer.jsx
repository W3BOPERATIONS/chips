const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 text-white py-12 mt-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <h3 className="text-2xl font-bold gradient-text">ChipsStore</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Your favorite destination for premium quality chips and snacks. Fresh, crispy, and delicious!
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>→</span>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>→</span>
                  <span>Cart</span>
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>→</span>
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-slate-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>→</span>
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <span>📧</span>
                </div>
                <span>info@chipsstore.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <span>📞</span>
                </div>
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <span>📍</span>
                </div>
                <span>123 Snack Street, Food City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-12 pt-8 text-center">
          <p className="text-slate-400">&copy; 2024 ChipsStore. All rights reserved. Made with ❤️ for chip lovers.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
