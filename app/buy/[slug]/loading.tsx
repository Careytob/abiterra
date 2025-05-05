//app/buy/[slug]/loading.tsx
import NavBar from '../../NavBar';
import Footer from '../../Footer';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow flex items-center justify-center pt-20 sm:pt-24 pb-6 sm:pb-12 bg-gray-50">
        <div className="px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-600">Loading property details...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}