import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ServicesPage } from './pages/ServicesPage';
import { ContactsPage } from './pages/ContactsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AboutPage } from './pages/AboutPage';
import { Vacancies } from './pages/Vacancies';
import { VacancyDetails } from './pages/VacancyDetails';
import NotFound from './pages/NotFound';
import CookieForm from './forms/CookieForm';
import ContactButton from './forms/ContactButtonForm';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  // Состояние для хранения высоты заголовка
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);

  // Эффект для измерения высоты заголовка при монтировании и изменении размера окна
  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerElement = document.querySelector('header');
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    };

    // Инициализация высоты заголовка
    updateHeaderHeight();

    // Обновление высоты при изменении размера окна
    window.addEventListener('resize', updateHeaderHeight);

    // Очистка слушателя при размонтировании компонента
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
        <Header />
        {/* Динамическое определение отступа */}
        <main className="flex-grow" style={{ paddingTop: headerHeight ? `${headerHeight}px` : '100px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/vacancies/:id" element={<VacancyDetails />} />
            <Route path="/vacancies" element={<Vacancies />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <CookieForm />
                <ContactButton />
      </div>
    </Router>
  );
}

export default App;