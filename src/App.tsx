import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './lib/authContext';
import { I18nProvider, useTranslation } from './lib/i18nContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { SermonsPage } from './pages/SermonsPage';
import { SermonDetailPage } from './pages/SermonDetailPage';
import { IllustrationsPage } from './pages/IllustrationsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { WelcomeScreen } from './pages/WelcomeScreen';
import { 
  getSermons, 
  getCategories, 
  getIllustrations, 
  getUserFavorites, 
  addFavorite, 
  removeFavorite,
  seedInitialDataIfEmpty,
  getSocialLinks,
  getAdBannerConfig,
  DEFAULT_AD_BANNER
} from './lib/dbService';
import { Sermon, Category, Illustration, Favorite, SocialLinks, AdBannerConfig } from './types';
import { INITIAL_CATEGORIES, INITIAL_SERMONS, INITIAL_ILLUSTRATIONS } from './lib/seedData';
import { AdBanner } from './components/AdBanner';
import { BookOpen } from 'lucide-react';

function MainApp() {
  const { user, isAdmin } = useAuth();
  
  const [currentTab, setCurrentTab] = useState<string>('welcome');
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [adConfig, setAdConfig] = useState<AdBannerConfig>(DEFAULT_AD_BANNER);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch or seed
      let [cats, sems, ills, socials, adSettings] = await Promise.all([
        getCategories(),
        getSermons(),
        getIllustrations(),
        getSocialLinks(),
        getAdBannerConfig()
      ]);
      setSocialLinks(socials);
      setAdConfig(adSettings);

      // If database is completely empty on first launch, auto-populate initial theological content
      if (cats.length === 0 && sems.length === 0) {
        try {
          await seedInitialDataIfEmpty();
          cats = await getCategories();
          sems = await getSermons();
          ills = await getIllustrations();
        } catch (seedErr) {
          console.warn('Auto-seed bypassed or requires admin permissions:', seedErr);
        }
      }

      // Fallback display if network warm-up in progress
      setCategories(cats.length > 0 ? cats : INITIAL_CATEGORIES.map((c, i) => ({ id: `cat-${i}`, ...c })));
      setSermons(sems.length > 0 ? sems : INITIAL_SERMONS.map((s, i) => ({ id: `serm-${i}`, ...s })));
      setIllustrations(ills.length > 0 ? ills : INITIAL_ILLUSTRATIONS.map((ill, i) => ({ id: `ill-${i}`, ...ill })));
    } catch (e) {
      console.error('Error fetching data:', e);
      // Fallback to initial seeds so app is never blank
      setCategories(INITIAL_CATEGORIES.map((c, i) => ({ id: `cat-${i}`, ...c })));
      setSermons(INITIAL_SERMONS.map((s, i) => ({ id: `serm-${i}`, ...s })));
      setIllustrations(INITIAL_ILLUSTRATIONS.map((ill, i) => ({ id: `ill-${i}`, ...ill })));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Check URL parameters for direct deep linking (e.g. ?sermon=slug or ?tab=admin or /admin)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sermonSlug = params.get('sermon');
      const tabParam = params.get('tab');
      const path = window.location.pathname;

      if (path === '/admin' || tabParam === 'admin' || window.location.hash === '#admin') {
        setCurrentTab('admin');
      } else if (sermonSlug && sermons.length > 0) {
        const found = sermons.find(s => s.slug === sermonSlug);
        if (found) {
          setSelectedSermon(found);
          setCurrentTab('sermon-detail');
        }
      }
    }
  }, [sermons]);

  // Load user favorites
  const loadFavorites = useCallback(async () => {
    if (user) {
      try {
        const favs = await getUserFavorites(user.uid);
        setFavorites(favs);
      } catch (e) {
        console.warn('Could not load user favorites:', e);
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const favoriteIds = new Set(favorites.map(f => f.sermonId));

  // Toggle Favorite
  const handleToggleFavorite = async (sermon: Sermon) => {
    if (!user) {
      alert('Faça login com sua conta para salvar sermões aos seus favoritos!');
      return;
    }

    const existing = favorites.find(f => f.sermonId === sermon.id);
    if (existing) {
      // Optimistic remove
      setFavorites(prev => prev.filter(f => f.id !== existing.id));
      try {
        await removeFavorite(existing.id);
      } catch (e) {
        console.error('Error removing favorite:', e);
        loadFavorites();
      }
    } else {
      // Optimistic add
      const tempId = `temp-${Date.now()}`;
      const newFav: Favorite = {
        id: tempId,
        userId: user.uid,
        sermonId: sermon.id,
        sermonTitle: sermon.title,
        sermonCategory: sermon.category,
        sermonAuthor: sermon.author,
        sermonImageUrl: sermon.imageUrl,
        createdAt: new Date().toISOString(),
      };
      setFavorites(prev => [newFav, ...prev]);

      try {
        const realId = await addFavorite({
          userId: user.uid,
          sermonId: sermon.id,
          sermonTitle: sermon.title,
          sermonCategory: sermon.category,
          sermonAuthor: sermon.author,
          sermonImageUrl: sermon.imageUrl,
          createdAt: new Date().toISOString(),
        });
        setFavorites(prev => prev.map(f => f.id === tempId ? { ...f, id: realId } : f));
      } catch (e) {
        console.error('Error adding favorite:', e);
        loadFavorites();
      }
    }
  };

  const handleRemoveFavoriteById = async (favId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== favId));
    try {
      await removeFavorite(favId);
    } catch (e) {
      console.error('Error removing favorite:', e);
      loadFavorites();
    }
  };

  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'sermoes' && param) {
      setCategoryFilter(param);
      setSearchFilter('');
    } else if (tab === 'sermoes') {
      setCategoryFilter('todas');
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSermon = (sermon: Sermon) => {
    setSelectedSermon(sermon);
    setCurrentTab('sermon-detail');
    if (typeof window !== 'undefined' && window.history?.pushState) {
      const newUrl = `${window.location.pathname}?sermon=${sermon.slug}`;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categorySlug: string) => {
    setCategoryFilter(categorySlug);
    setSearchFilter('');
    setCurrentTab('sermoes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (searchTerm: string) => {
    setSearchFilter(searchTerm);
    setCategoryFilter('todas');
    setCurrentTab('sermoes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header is hidden on Admin and Welcome screens */}
      {currentTab !== 'admin' && currentTab !== 'welcome' && (
        <Header
          currentTab={currentTab}
          onNavigate={handleNavigate}
          favoritesCount={favorites.length}
        />
      )}

      {/* Main Views */}
      <div className="flex-1">
        {isLoading ? (
          <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 animate-pulse">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300 font-serif">
              Carregando a Biblioteca PregAI...
            </p>
          </div>
        ) : (
          <>
            {currentTab === 'welcome' && (
              <WelcomeScreen
                onExploreLibrary={() => handleNavigate('sermoes')}
                onGoToFavorites={() => handleNavigate('favoritos')}
                onGoToAdmin={() => handleNavigate('admin')}
                totalSermonsCount={sermons.length}
                socialLinks={socialLinks}
              />
            )}

            {currentTab === 'home' && (
              <HomePage
                sermons={sermons.filter(s => s.status === 'published')}
                categories={categories}
                illustrations={illustrations}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                onSelectSermon={handleSelectSermon}
                onSelectCategory={handleSelectCategory}
                onNavigate={handleNavigate}
                onSearch={handleHeroSearch}
              />
            )}

            {currentTab === 'sermoes' && (
              <SermonsPage
                sermons={sermons.filter(s => s.status === 'published')}
                categories={categories}
                initialCategory={categoryFilter}
                initialSearch={searchFilter}
                favoriteIds={favoriteIds}
                onToggleFavorite={handleToggleFavorite}
                onSelectSermon={handleSelectSermon}
              />
            )}

            {currentTab === 'sermon-detail' && selectedSermon && (
              <SermonDetailPage
                sermon={selectedSermon}
                relatedSermons={sermons.filter(s => s.id !== selectedSermon.id && s.categorySlug === selectedSermon.categorySlug && s.status === 'published')}
                isFavorite={favoriteIds.has(selectedSermon.id)}
                onToggleFavorite={handleToggleFavorite}
                onBack={() => handleNavigate('sermoes')}
                onSelectSermon={handleSelectSermon}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {currentTab === 'ilustracoes' && (
              <IllustrationsPage
                illustrations={illustrations}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {currentTab === 'categorias' && (
              <CategoriesPage
                categories={categories}
                sermons={sermons.filter(s => s.status === 'published')}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {currentTab === 'favoritos' && (
              <FavoritesPage
                favorites={favorites}
                sermons={sermons}
                onRemoveFavorite={handleRemoveFavoriteById}
                onSelectSermon={handleSelectSermon}
                onExplore={() => handleNavigate('sermoes')}
              />
            )}

            {currentTab === 'admin' && (
              <AdminDashboard
                sermons={sermons}
                categories={categories}
                illustrations={illustrations}
                socialLinks={socialLinks}
                adConfig={adConfig}
                onRefreshData={fetchData}
                onRefreshSocials={fetchData}
                onRefreshAdConfig={fetchData}
                onExitAdmin={() => handleNavigate('home')}
                onPreviewSermon={(s) => {
                  setSelectedSermon(s);
                  setCurrentTab('sermon-detail');
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Espaço Publicitário & Parcerias na parte inferior antes do rodapé */}
      {currentTab !== 'admin' && currentTab !== 'welcome' && (
        <AdBanner
          config={adConfig}
          onNavigateToAdmin={() => handleNavigate('admin')}
        />
      )}

      {/* Footer */}
      {currentTab !== 'admin' && currentTab !== 'welcome' && (
        <Footer
          onNavigate={handleNavigate}
          categories={categories}
          socialLinks={socialLinks}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <I18nProvider>
        <MainApp />
      </I18nProvider>
    </AuthProvider>
  );
}
