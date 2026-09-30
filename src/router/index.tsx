import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type RoutePath = '/' | '/app' | '/download' | '/privacy' | '/terms' | '/open-source';

interface RouterContextType {
  path: RoutePath;
  navigate: (to: RoutePath) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

function normalizePath(rawPath: string): RoutePath {
  const p = rawPath.toLowerCase();
  if (p.startsWith('/app')) return '/app';
  if (p.startsWith('/download')) return '/download';
  if (p.startsWith('/open-source') || p.startsWith('/opensource')) return '/open-source';
  if (p.startsWith('/privacy')) return '/privacy';
  if (p.startsWith('/terms')) return '/terms';
  return '/';
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<RoutePath>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: RoutePath) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== to) {
        window.history.pushState({}, '', to);
      }
      setPath(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
};

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: RoutePath;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Link: React.FC<LinkProps> = ({ to, className, children, onClick, ...rest }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
};
