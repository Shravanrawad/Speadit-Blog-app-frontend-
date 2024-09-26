import Header from "@/components/header";
import { Toaster } from 'react-hot-toast';

export default function Layout({ children }) {
  return (
    <div>
      <header className="fixed top-0 left-0 w-full flex items-center bg-white z-50 shadow-sm  h-17">
          <Header/>
      </header>

      <main className="mt-20 w-full h-screen">
        {children}
        <Toaster />
      </main>
    </div>
  );
}
