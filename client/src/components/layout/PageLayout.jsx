import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

export const PageLayout = ({ children, withSidebar = false, withFooter = true }) => {
  return (
    <div
      className={`min-h-screen flex flex-col bg-background text-text-primary selection:bg-primary/30 ${withSidebar ? 'pb-16 md:pb-0' : ''}`}
    >
      <Navbar />

      <div className="flex flex-1 relative">
        {withSidebar && <Sidebar />}
        {withSidebar && <MobileBottomNav />}

        <main className={`flex-1 flex flex-col w-full ${withSidebar ? 'md:ml-64' : ''}`}>
          <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
          {withFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
