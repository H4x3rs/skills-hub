import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        offset={60}
        expand={false}
        visibleToasts={8}
        toastOptions={{
          className: 'bg-white border border-gray-200 shadow-lg rounded-md !text-sm',
          style: {
            zIndex: 9999,
          }
        }}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;