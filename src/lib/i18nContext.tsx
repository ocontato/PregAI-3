import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'pt' | 'en' | 'es' | 'fr';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const translations: Record<SupportedLanguage, Record<string, string>> = {
  pt: {
    // Nav
    'nav.welcome': 'Boas-vindas',
    'nav.home': 'Início',
    'nav.sermons': 'Sermões',
    'nav.illustrations': 'Ilustrações',
    'nav.categories': 'Categorias',
    'nav.favorites': 'Favoritos',
    'nav.admin': 'Painel Admin',
    'nav.login': 'Entrar',
    'nav.logout': 'Encerrar Sessão',
    'nav.search': 'Buscar',
    'nav.mySavedSermons': 'Meus Sermões Salvos',

    // Welcome
    'welcome.title': 'Seja bem-vindo!',
    'welcome.phrase': 'A Palavra que inspira. A mensagem que transforma.',
    'welcome.description': 'Encontre sermões, estudos bíblicos e ilustrações para fortalecer sua fé e inspirar suas pregações.',
    'welcome.explore': 'Explorar biblioteca',
    'welcome.login': 'Entrar na minha conta',
    'welcome.register': 'Criar minha conta',
    'welcome.connectedAs': 'Conectado como',
    'welcome.myFavorites': 'Acessar meus favoritos',
    'welcome.adminPanel': 'Acessar Painel Admin',
    'welcome.totalSermons': 'sermões e estudos bíblicos disponíveis',

    // Sermons
    'sermon.featured': 'Destaque',
    'sermon.read': 'Ler',
    'sermon.readingTime': 'min de leitura',
    'sermon.author': 'Autor',
    'sermon.date': 'Data',
    'sermon.share': 'Compartilhar',
    'sermon.save': 'Salvar sermão',
    'sermon.saved': 'Salvo',
    'sermon.download': 'Baixar',
    'sermon.downloadPdf': 'Baixar em PDF',
    'sermon.downloadDoc': 'Baixar em Word (DOC)',
    'sermon.chooseFormat': 'Escolha o formato:',
    'sermon.printDirect': 'Imprimir diretamente',
    'sermon.noResults': 'Nenhum sermão encontrado com os filtros aplicados.',

    // Detail & Reader
    'detail.back': 'Voltar à Biblioteca',
    'detail.listen': 'Ouvir Sermão',
    'detail.pauseAudio': 'Pausar Áudio',
    'detail.readingMode': 'Modo Leitura',
    'detail.readingModeDesc': 'Visualização limpa para leitura e púlpito',
    'detail.baseScripture': 'Texto Bíblico Base',
    'detail.abstract': 'Resumo da Mensagem',
    'detail.keywords': 'Palavras-chave e Temas',
    'detail.moreInCategory': 'Mais Sermões em',
    'detail.seeAll': 'Ver todos',
    'detail.pulpitReady': 'Deseja ministrar ou estudar este sermão?',
    'detail.pulpitDesc': 'Baixe o esboço formatado para levar ao púlpito ou compartilhe com seu ministério.',

    // Reader Mode
    'reader.title': 'Modo Leitura & Púlpito',
    'reader.subtitle': 'Foco total sem distrações para ministração e estudo',
    'reader.fullscreen': 'Tela Cheia',
    'reader.exitFullscreen': 'Sair da Tela Cheia',
    'reader.theme': 'Tema',
    'reader.themeNight': 'Púlpito Noturno',
    'reader.themeNavy': 'Azul PregAI',
    'reader.themeSepia': 'Sépia Bíblico',
    'reader.themeWhite': 'Papel Alvo',
    'reader.fontSize': 'Fonte',
    'reader.fontFamily': 'Tipografia',
    'reader.fontSerif': 'Clássica (Serif)',
    'reader.fontSans': 'Moderna (Sans)',
    'reader.fontMono': 'Esboço (Mono)',
    'reader.autoScroll': 'Rolagem Automática',
    'reader.speed': 'Velocidade',
    'reader.stopwatch': 'Tempo de Púlpito',
    'reader.start': 'Iniciar',
    'reader.pause': 'Pausar',
    'reader.reset': 'Zerar',
    'reader.exit': 'Sair do Modo Leitura',
    'reader.tips': 'Dica: Pressione espaço para pausar/retomar a rolagem automática ou use as setas do teclado.',

    // Illustrations
    'illustrations.title': 'Ilustrações Gospel & Parábolas',
    'illustrations.subtitle': 'Histórias curtas, analogias e aplicações práticas para enriquecer suas pregações.',
    'illustrations.copyStory': 'Copiar História',
    'illustrations.copied': 'Copiado!',
    'illustrations.application': 'Aplicação Prática',

    // Search & Filters
    'search.placeholder': 'Pesquisar sermões por título, assunto, autor ou versículo...',
    'search.allCategories': 'Todas as Categorias',
    'search.filterCategory': 'Filtrar por Categoria',
    'search.orderRecent': 'Mais Recentes',
    'search.orderPopular': 'Mais Populares',

    // Ad Banner
    'ad.defaultTag': 'Espaço Publicitário & Parceria Gospel',
    'ad.sponsor': 'Apoio',
    'ad.learnMore': 'Saiba Mais',
    'ad.hide': 'Ocultar anúncio nesta sessão',

    // Footer
    'footer.description': 'A sua biblioteca digital completa de sermões, esboços expositivos, estudos bíblicos e ilustrações cristãs.',
    'footer.quickLinks': 'Navegação Rápida',
    'footer.categories': 'Categorias Doutrinárias',
    'footer.socialNetworks': 'Redes Sociais & Contatos',
    'footer.rights': 'Todos os direitos reservados. PregAI &middot; Biblioteca Gospel.',
  },

  en: {
    // Nav
    'nav.welcome': 'Welcome',
    'nav.home': 'Home',
    'nav.sermons': 'Sermons',
    'nav.illustrations': 'Illustrations',
    'nav.categories': 'Categories',
    'nav.favorites': 'Favorites',
    'nav.admin': 'Admin Panel',
    'nav.login': 'Sign In',
    'nav.logout': 'Sign Out',
    'nav.search': 'Search',
    'nav.mySavedSermons': 'My Saved Sermons',

    // Welcome
    'welcome.title': 'Welcome!',
    'welcome.phrase': 'The Word that inspires. The message that transforms.',
    'welcome.description': 'Find sermons, Bible studies, and gospel illustrations to strengthen your faith and empower your preaching.',
    'welcome.explore': 'Explore library',
    'welcome.login': 'Sign in to my account',
    'welcome.register': 'Create my account',
    'welcome.connectedAs': 'Signed in as',
    'welcome.myFavorites': 'Go to my favorites',
    'welcome.adminPanel': 'Access Admin Panel',
    'welcome.totalSermons': 'sermons and Bible studies available',

    // Sermons
    'sermon.featured': 'Featured',
    'sermon.read': 'Read',
    'sermon.readingTime': 'min read',
    'sermon.author': 'Author',
    'sermon.date': 'Date',
    'sermon.share': 'Share',
    'sermon.save': 'Save sermon',
    'sermon.saved': 'Saved',
    'sermon.download': 'Download',
    'sermon.downloadPdf': 'Download as PDF',
    'sermon.downloadDoc': 'Download as Word (DOC)',
    'sermon.chooseFormat': 'Choose format:',
    'sermon.printDirect': 'Print directly',
    'sermon.noResults': 'No sermons found matching your filters.',

    // Detail & Reader
    'detail.back': 'Back to Library',
    'detail.listen': 'Listen to Sermon',
    'detail.pauseAudio': 'Pause Audio',
    'detail.readingMode': 'Reading Mode',
    'detail.readingModeDesc': 'Distraction-free pulpit view',
    'detail.baseScripture': 'Base Scripture',
    'detail.abstract': 'Message Summary',
    'detail.keywords': 'Keywords & Themes',
    'detail.moreInCategory': 'More Sermons in',
    'detail.seeAll': 'See all',
    'detail.pulpitReady': 'Preparing to preach or study this sermon?',
    'detail.pulpitDesc': 'Download the formatted outline for the pulpit or share it with your ministry.',

    // Reader Mode
    'reader.title': 'Reading & Pulpit Mode',
    'reader.subtitle': 'Full focus without distractions for preaching and study',
    'reader.fullscreen': 'Fullscreen',
    'reader.exitFullscreen': 'Exit Fullscreen',
    'reader.theme': 'Theme',
    'reader.themeNight': 'Dark Pulpit',
    'reader.themeNavy': 'PregAI Navy',
    'reader.themeSepia': 'Bible Sepia',
    'reader.themeWhite': 'Clean White',
    'reader.fontSize': 'Font Size',
    'reader.fontFamily': 'Typography',
    'reader.fontSerif': 'Classic (Serif)',
    'reader.fontSans': 'Modern (Sans)',
    'reader.fontMono': 'Outline (Mono)',
    'reader.autoScroll': 'Teleprompter / Auto-Scroll',
    'reader.speed': 'Speed',
    'reader.stopwatch': 'Pulpit Timer',
    'reader.start': 'Start',
    'reader.pause': 'Pause',
    'reader.reset': 'Reset',
    'reader.exit': 'Exit Reading Mode',
    'reader.tips': 'Tip: Press Spacebar to pause/resume auto-scroll or use keyboard arrow keys.',

    // Illustrations
    'illustrations.title': 'Gospel Illustrations & Parables',
    'illustrations.subtitle': 'Short stories, analogies, and practical applications to enrich your preaching.',
    'illustrations.copyStory': 'Copy Story',
    'illustrations.copied': 'Copied!',
    'illustrations.application': 'Practical Application',

    // Search & Filters
    'search.placeholder': 'Search sermons by title, topic, preacher or Scripture...',
    'search.allCategories': 'All Categories',
    'search.filterCategory': 'Filter by Category',
    'search.orderRecent': 'Most Recent',
    'search.orderPopular': 'Most Popular',

    // Ad Banner
    'ad.defaultTag': 'Sponsorship & Gospel Partner',
    'ad.sponsor': 'Partner',
    'ad.learnMore': 'Learn More',
    'ad.hide': 'Hide ad for this session',

    // Footer
    'footer.description': 'Your complete digital library of sermons, expository outlines, Bible studies, and Christian illustrations.',
    'footer.quickLinks': 'Quick Navigation',
    'footer.categories': 'Doctrinal Categories',
    'footer.socialNetworks': 'Social Media & Contacts',
    'footer.rights': 'All rights reserved. PregAI &middot; Gospel Library.',
  },

  es: {
    // Nav
    'nav.welcome': 'Bienvenida',
    'nav.home': 'Inicio',
    'nav.sermons': 'Sermones',
    'nav.illustrations': 'Ilustraciones',
    'nav.categories': 'Categorías',
    'nav.favorites': 'Favoritos',
    'nav.admin': 'Panel Admin',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    'nav.search': 'Buscar',
    'nav.mySavedSermons': 'Mis Sermones Guardados',

    // Welcome
    'welcome.title': '¡Bienvenido!',
    'welcome.phrase': 'La Palabra que inspira. El mensaje que transforma.',
    'welcome.description': 'Encuentra sermones, estudios bíblicos e ilustraciones para fortalecer tu fe e inspirar tus predicaciones.',
    'welcome.explore': 'Explorar biblioteca',
    'welcome.login': 'Ingresar a mi cuenta',
    'welcome.register': 'Crear mi cuenta',
    'welcome.connectedAs': 'Conectado como',
    'welcome.myFavorites': 'Ir a mis favoritos',
    'welcome.adminPanel': 'Acceder al Panel Admin',
    'welcome.totalSermons': 'sermones y estudios bíblicos disponibles',

    // Sermons
    'sermon.featured': 'Destacado',
    'sermon.read': 'Leer',
    'sermon.readingTime': 'min de lectura',
    'sermon.author': 'Autor',
    'sermon.date': 'Fecha',
    'sermon.share': 'Compartir',
    'sermon.save': 'Guardar sermón',
    'sermon.saved': 'Guardado',
    'sermon.download': 'Descargar',
    'sermon.downloadPdf': 'Descargar en PDF',
    'sermon.downloadDoc': 'Descargar en Word (DOC)',
    'sermon.chooseFormat': 'Elige el formato:',
    'sermon.printDirect': 'Imprimir directamente',
    'sermon.noResults': 'No se encontraron sermones con los filtros aplicados.',

    // Detail & Reader
    'detail.back': 'Volver a la Biblioteca',
    'detail.listen': 'Escuchar Sermón',
    'detail.pauseAudio': 'Pausar Audio',
    'detail.readingMode': 'Modo Lectura',
    'detail.readingModeDesc': 'Vista limpia para el púlpito',
    'detail.baseScripture': 'Texto Bíblico Base',
    'detail.abstract': 'Resumen del Mensaje',
    'detail.keywords': 'Palabras Clave y Temas',
    'detail.moreInCategory': 'Más Sermones en',
    'detail.seeAll': 'Ver todos',
    'detail.pulpitReady': '¿Deseas predicar o estudiar este sermón?',
    'detail.pulpitDesc': 'Descarga el bosquejo formateado para el púlpito o compártelo con tu ministerio.',

    // Reader Mode
    'reader.title': 'Modo Lectura y Púlpito',
    'reader.subtitle': 'Enfoque total sin distracciones para la predicación y el estudio',
    'reader.fullscreen': 'Pantalla Completa',
    'reader.exitFullscreen': 'Salir de Pantalla Completa',
    'reader.theme': 'Tema',
    'reader.themeNight': 'Púlpito Nocturno',
    'reader.themeNavy': 'Azul PregAI',
    'reader.themeSepia': 'Sepia Bíblico',
    'reader.themeWhite': 'Blanco Puro',
    'reader.fontSize': 'Tamaño de Fuente',
    'reader.fontFamily': 'Tipografía',
    'reader.fontSerif': 'Clásica (Serif)',
    'reader.fontSans': 'Moderna (Sans)',
    'reader.fontMono': 'Bosquejo (Mono)',
    'reader.autoScroll': 'Teleprompter / Desplazamiento',
    'reader.speed': 'Velocidad',
    'reader.stopwatch': 'Cronómetro de Púlpito',
    'reader.start': 'Iniciar',
    'reader.pause': 'Pausar',
    'reader.reset': 'Reiniciar',
    'reader.exit': 'Salir del Modo Lectura',
    'reader.tips': 'Consejo: Presiona la barra espaciadora para pausar/reanudar el teleprompter.',

    // Illustrations
    'illustrations.title': 'Ilustraciones Evangélicas y Parábolas',
    'illustrations.subtitle': 'Historias cortas, analogías y aplicaciones prácticas para enriquecer tus sermones.',
    'illustrations.copyStory': 'Copiar Historia',
    'illustrations.copied': '¡Copiado!',
    'illustrations.application': 'Aplicación Práctica',

    // Search & Filters
    'search.placeholder': 'Buscar sermones por título, tema, predicador o pasaje bíblico...',
    'search.allCategories': 'Todas las Categorías',
    'search.filterCategory': 'Filtrar por Categoría',
    'search.orderRecent': 'Más Recientes',
    'search.orderPopular': 'Más Populares',

    // Ad Banner
    'ad.defaultTag': 'Espacio Publicitario y Alianza Gospel',
    'ad.sponsor': 'Apoyo',
    'ad.learnMore': 'Conocer Más',
    'ad.hide': 'Ocultar anuncio en esta sesión',

    // Footer
    'footer.description': 'Tu biblioteca digital completa de sermones, bosquejos expositivos, estudios bíblicos e ilustraciones cristianas.',
    'footer.quickLinks': 'Navegación Rápida',
    'footer.categories': 'Categorías Doctrinales',
    'footer.socialNetworks': 'Redes Sociales y Contactos',
    'footer.rights': 'Todos los derechos reservados. PregAI &middot; Biblioteca Gospel.',
  },

  fr: {
    // Nav
    'nav.welcome': 'Bienvenue',
    'nav.home': 'Accueil',
    'nav.sermons': 'Sermons',
    'nav.illustrations': 'Illustrations',
    'nav.categories': 'Catégories',
    'nav.favorites': 'Favoris',
    'nav.admin': 'Panneau Admin',
    'nav.login': 'Connexion',
    'nav.logout': 'Déconnexion',
    'nav.search': 'Rechercher',
    'nav.mySavedSermons': 'Mes Sermons Enregistrés',

    // Welcome
    'welcome.title': 'Soyez les bienvenus !',
    'welcome.phrase': 'La Parole qui inspire. Le message qui transforme.',
    'welcome.description': 'Trouvez des sermons, des études bibliques et des illustrations pour fortifier votre foi et enrichir vos prédications.',
    'welcome.explore': 'Explorer la bibliothèque',
    'welcome.login': 'Se connecter à mon compte',
    'welcome.register': 'Créer mon compte',
    'welcome.connectedAs': 'Connecté en tant que',
    'welcome.myFavorites': 'Accéder à mes favoris',
    'welcome.adminPanel': 'Accéder au Panneau Admin',
    'welcome.totalSermons': 'sermons et études bibliques disponibles',

    // Sermons
    'sermon.featured': 'En vedette',
    'sermon.read': 'Lire',
    'sermon.readingTime': 'min de lecture',
    'sermon.author': 'Auteur',
    'sermon.date': 'Date',
    'sermon.share': 'Partager',
    'sermon.save': 'Enregistrer le sermon',
    'sermon.saved': 'Enregistré',
    'sermon.download': 'Télécharger',
    'sermon.downloadPdf': 'Télécharger en PDF',
    'sermon.downloadDoc': 'Télécharger en Word (DOC)',
    'sermon.chooseFormat': 'Choisissez le format :',
    'sermon.printDirect': 'Imprimer directement',
    'sermon.noResults': 'Aucun sermon trouvé avec les filtres sélectionnés.',

    // Detail & Reader
    'detail.back': 'Retour à la Bibliothèque',
    'detail.listen': 'Écouter le Sermon',
    'detail.pauseAudio': 'Mettre en Pause',
    'detail.readingMode': 'Mode Lecture',
    'detail.readingModeDesc': 'Affichage épuré pour la chaire',
    'detail.baseScripture': 'Texte Biblique de Base',
    'detail.abstract': 'Résumé du Message',
    'detail.keywords': 'Mots-clés & Thèmes',
    'detail.moreInCategory': 'Plus de Sermons dans',
    'detail.seeAll': 'Voir tout',
    'detail.pulpitReady': 'Prêt à prêcher ou étudier ce sermon ?',
    'detail.pulpitDesc': 'Téléchargez le plan mis en page pour la chaire ou partagez-le avec votre assemblée.',

    // Reader Mode
    'reader.title': 'Mode Lecture & Chaire',
    'reader.subtitle': 'Concentration totale sans distractions pour la prédication et l’étude',
    'reader.fullscreen': 'Plein Écran',
    'reader.exitFullscreen': 'Quitter le Plein Écran',
    'reader.theme': 'Thème',
    'reader.themeNight': 'Chaire Sombre',
    'reader.themeNavy': 'Bleu PregAI',
    'reader.themeSepia': 'Sépia Biblique',
    'reader.themeWhite': 'Blanc Pur',
    'reader.fontSize': 'Taille de Police',
    'reader.fontFamily': 'Typographie',
    'reader.fontSerif': 'Classique (Serif)',
    'reader.fontSans': 'Moderne (Sans)',
    'reader.fontMono': 'Plan (Mono)',
    'reader.autoScroll': 'Téléprompteur / Défilement Auto',
    'reader.speed': 'Vitesse',
    'reader.stopwatch': 'Chronomètre de Chaire',
    'reader.start': 'Démarrer',
    'reader.pause': 'Pause',
    'reader.reset': 'Réinitialiser',
    'reader.exit': 'Quitter le Mode Lecture',
    'reader.tips': 'Astuce : Appuyez sur la barre d’espace pour démarrer/arrêter le défilement.',

    // Illustrations
    'illustrations.title': 'Illustrations Évangéliques & Paraboles',
    'illustrations.subtitle': 'Courtes histoires, analogies et applications pratiques pour enrichir vos messages.',
    'illustrations.copyStory': 'Copier l’histoire',
    'illustrations.copied': 'Copié !',
    'illustrations.application': 'Application Pratique',

    // Search & Filters
    'search.placeholder': 'Rechercher par titre, thème, prédicateur ou passage...',
    'search.allCategories': 'Toutes les Catégories',
    'search.filterCategory': 'Filtrer par Catégorie',
    'search.orderRecent': 'Plus Récents',
    'search.orderPopular': 'Plus Populaires',

    // Ad Banner
    'ad.defaultTag': 'Espace Publicitaire & Partenaire Évangélique',
    'ad.sponsor': 'Partenaire',
    'ad.learnMore': 'En savoir plus',
    'ad.hide': 'Masquer pour cette session',

    // Footer
    'footer.description': 'Votre bibliothèque numérique complète de sermons, plans d’exposition, études bibliques et illustrations chrétiennes.',
    'footer.quickLinks': 'Navigation Rapide',
    'footer.categories': 'Catégories Doctrinales',
    'footer.socialNetworks': 'Réseaux Sociaux & Contacts',
    'footer.rights': 'Tous droits réservés. PregAI &middot; Bibliothèque Évangélique.',
  },
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  currentLanguageOption: LanguageOption;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('pt');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pregui_lang') as SupportedLanguage;
      if (stored && ['pt', 'en', 'es', 'fr'].includes(stored)) {
        setLanguageState(stored);
      } else if (typeof navigator !== 'undefined' && navigator.language) {
        const browserLang = navigator.language.slice(0, 2) as SupportedLanguage;
        if (['en', 'es', 'fr'].includes(browserLang)) {
          setLanguageState(browserLang);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('pregui_lang', lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language] || translations.pt;
    if (langDict[key]) {
      return langDict[key];
    }
    // Fallback to Portuguese dictionary if key missing in target language
    if (translations.pt[key]) {
      return translations.pt[key];
    }
    return fallback || key;
  };

  const currentLanguageOption = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, currentLanguageOption }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
