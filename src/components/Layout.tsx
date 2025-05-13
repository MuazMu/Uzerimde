import React from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-app py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-6 h-6"
              >
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
              </svg>
              <span>Üzerimde</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <NavLink href="/">Ana Sayfa</NavLink>
              <NavLink href="/try-on-2d">2D Prova</NavLink>
              <NavLink href="/try-on-3d">3D Prova</NavLink>
            </nav>
            <div className="flex md:hidden">
              <button className="text-foreground p-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-6 h-6"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-muted/40 border-t">
        <div className="container-app py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 text-primary"
              >
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
              </svg>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Üzerimde. Tüm hakları saklıdır.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                Hakkımızda
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                Gizlilik
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                Koşullar
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className }) => {
  // In a real implementation, we would check if the link is active
  return (
    <Link 
      href={href} 
      className={cn(
        "text-muted-foreground hover:text-foreground transition-colors", 
        className
      )}
    >
      {children}
    </Link>
  );
};

export default Layout; 