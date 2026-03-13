import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Fragrance {
  id: string;
  name: string;
  brand: string;
  notes: string[];
  seasons: string[];
  occasions: string[];
  description: string;
  imageUrl?: string;
  addedAt: number;
}

interface CatalogContextType {
  catalog: Fragrance[];
  addFragrance: (fragrance: Omit<Fragrance, 'id' | 'addedAt'>) => void;
  removeFragrance: (id: string) => void;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [catalog, setCatalog] = useState<Fragrance[]>(() => {
    const saved = localStorage.getItem('arome_catalog'); // fixed: was 'scentsense_catalog'
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('arome_catalog', JSON.stringify(catalog));
  }, [catalog]);

  const addFragrance = (fragrance: Omit<Fragrance, 'id' | 'addedAt'>) => {
    const newFragrance: Fragrance = {
      ...fragrance,
      id: crypto.randomUUID(),
      addedAt: Date.now(),
    };
    setCatalog((prev) => [...prev, newFragrance]);
  };

  const removeFragrance = (id: string) => {
    setCatalog((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <CatalogContext.Provider value={{ catalog, addFragrance, removeFragrance }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used within a CatalogProvider');
  return context;
}
