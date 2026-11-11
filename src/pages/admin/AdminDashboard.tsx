import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Layers, 
  Sparkles, 
  Users, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Flame, 
  Save, 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  AlertTriangle,
  RotateCcw,
  Clock,
  ExternalLink,
  LogIn,
  Share2,
  Instagram,
  Youtube,
  Facebook,
  MessageCircle,
  Send,
  Headphones,
  Globe,
  Megaphone
} from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { useAuth } from '../../lib/authContext';
import { Sermon, Category, Illustration, SermonStatus, SocialLinks, AdBannerConfig } from '../../types';
import { 
  createSermon, 
  updateSermon, 
  deleteSermon, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  createIllustration, 
  updateIllustration, 
  deleteIllustration,
  seedInitialDataIfEmpty,
  saveSocialLinks,
  saveAdBannerConfig
} from '../../lib/dbService';
import { CategoryBadge } from '../../components/CategoryBadge';

interface AdminDashboardProps {
  sermons: Sermon[];
  categories: Category[];
  illustrations: Illustration[];
  socialLinks?: SocialLinks;
  adConfig?: AdBannerConfig;
  onRefreshData: () => Promise<void>;
  onRefreshSocials?: () => Promise<void>;
  onRefreshAdConfig?: () => Promise<void>;
  onExitAdmin: () => void;
  onPreviewSermon: (sermon: Sermon) => void;
}

const PRESET_CHRISTIAN_IMAGES = [
  { label: 'Bíblia Aberta na Luz', url: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Oração e Intimidade', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cruz no Pôr do Sol', url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Família Cristã', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Púlpito & Altar', url: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Chama & Espírito Santo', url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Céus & Esperança', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Caminho na Luz', url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  sermons,
  categories,
  illustrations,
  socialLinks,
  adConfig,
  onRefreshData,
  onRefreshSocials,
  onRefreshAdConfig,
  onExitAdmin,
  onPreviewSermon,
}) => {
  const { user, isAdmin, signInWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'sermons' | 'editor' | 'categories' | 'illustrations' | 'socials' | 'advertising'>('overview');
  
  // Social Networks State
  const [socInstagram, setSocInstagram] = useState(socialLinks?.instagram || '');
  const [socYoutube, setSocYoutube] = useState(socialLinks?.youtube || '');
  const [socFacebook, setSocFacebook] = useState(socialLinks?.facebook || '');
  const [socWhatsapp, setSocWhatsapp] = useState(socialLinks?.whatsapp || '');
  const [socTelegram, setSocTelegram] = useState(socialLinks?.telegram || '');
  const [socSpotify, setSocSpotify] = useState(socialLinks?.spotify || '');
  const [isSavingSocials, setIsSavingSocials] = useState(false);

  useEffect(() => {
    if (socialLinks) {
      setSocInstagram(socialLinks.instagram || '');
      setSocYoutube(socialLinks.youtube || '');
      setSocFacebook(socialLinks.facebook || '');
      setSocWhatsapp(socialLinks.whatsapp || '');
      setSocTelegram(socialLinks.telegram || '');
      setSocSpotify(socialLinks.spotify || '');
    }
  }, [socialLinks]);

  // Advertising & Sponsor Banner State
  const [adEnabled, setAdEnabled] = useState(adConfig?.enabled ?? true);
  const [adTag, setAdTag] = useState(adConfig?.tag || 'Espaço Publicitário & Parceria Gospel');
  const [adSponsorName, setAdSponsorName] = useState(adConfig?.sponsorName || 'Instituto Teológico PregAI');
  const [adBadgeText, setAdBadgeText] = useState(adConfig?.badgeText || 'Bolsas de Estudo');
  const [adTitle, setAdTitle] = useState(adConfig?.title || 'Formação em Homilética e Pregação Expositiva');
  const [adDescription, setAdDescription] = useState(adConfig?.description || 'Aprenda a estruturar sermões bíblicos profundos, com fidelidade textual, ilustrações impactantes e relevância para sua igreja.');
  const [adCtaText, setAdCtaText] = useState(adConfig?.ctaText || 'Conhecer Curso e Vagas');
  const [adLinkUrl, setAdLinkUrl] = useState(adConfig?.linkUrl || 'https://seusiteparceiro.com/curso-pregacao');
  const [adImageUrl, setAdImageUrl] = useState(adConfig?.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80');
  const [isSavingAd, setIsSavingAd] = useState(false);
  const [adSaveFeedback, setAdSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (adConfig) {
      setAdEnabled(adConfig.enabled);
      setAdTag(adConfig.tag || 'Espaço Publicitário & Parceria Gospel');
      setAdSponsorName(adConfig.sponsorName || '');
      setAdBadgeText(adConfig.badgeText || '');
      setAdTitle(adConfig.title || '');
      setAdDescription(adConfig.description || '');
      setAdCtaText(adConfig.ctaText || 'Saiba Mais');
      setAdLinkUrl(adConfig.linkUrl || '');
      setAdImageUrl(adConfig.imageUrl || '');
    }
  }, [adConfig]);

  // Sermon Editor State
  const [editingSermonId, setEditingSermonId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formBiblicalRef, setFormBiblicalRef] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.name || 'Fé');
  const [formAuthor, setFormAuthor] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formKeywords, setFormKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [formStatus, setFormStatus] = useState<SermonStatus>('published');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formPublishedAt, setFormPublishedAt] = useState(new Date().toISOString().slice(0, 10));
  const [editorPreviewMode, setEditorPreviewMode] = useState(false);

  // Uploading state
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Search & Filter in Admin Sermons Table
  const [sermonSearch, setSermonSearch] = useState('');
  const [sermonFilterCategory, setSermonFilterCategory] = useState('todas');
  const [sermonFilterStatus, setSermonFilterStatus] = useState('todos');

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<{ type: 'sermon' | 'category' | 'illustration'; id: string; title: string } | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // Illustration Modal State
  const [isIllustrationModalOpen, setIsIllustrationModalOpen] = useState(false);
  const [illTitle, setIllTitle] = useState('');
  const [illStory, setIllStory] = useState('');
  const [illApplication, setIllApplication] = useState('');
  const [illBiblicalRef, setIllBiblicalRef] = useState('');
  const [illCategory, setIllCategory] = useState(categories[0]?.name || 'Vida Cristã');
  const [illAuthor, setIllAuthor] = useState('');
  const [illImageUrl, setIllImageUrl] = useState('');
  const [editingIllId, setEditingIllId] = useState<string | null>(null);

  // Seeding indicator
  const [isSeeding, setIsSeeding] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Auto generate slug from title
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingSermonId) {
      const generatedSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormSlug(generatedSlug);
    }
  };

  // Add keyword
  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formKeywords.includes(keywordInput.trim())) {
      setFormKeywords([...formKeywords, keywordInput.trim().toLowerCase()]);
      setKeywordInput('');
    }
  };

  // Remove keyword
  const handleRemoveKeyword = (kw: string) => {
    setFormKeywords(formKeywords.filter(k => k !== kw));
  };

  // Insert markdown tag into content editor
  const insertFormatting = (prefix: string, suffix: string = '') => {
    setFormContent(prev => prev + `\n${prefix} ` + suffix);
  };

  // Open editor for new sermon
  const handleNewSermon = () => {
    setEditingSermonId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormSlug('');
    setFormDescription('');
    setFormContent(`## INTRODUÇÃO\n\n> "Texto bíblico aqui"\n\n---\n\n## I. PRIMEIRO PONTO\n\n---\n\n## II. SEGUNDO PONTO\n\n---\n\n## CONCLUSÃO E APELO\n`);
    setFormBiblicalRef('');
    setFormCategory(categories[0]?.name || 'Fé');
    setFormAuthor(user?.displayName || 'Pastor');
    setFormImageUrl(PRESET_CHRISTIAN_IMAGES[0].url);
    setFormKeywords(['fé', 'palavra']);
    setFormStatus('published');
    setFormFeatured(false);
    setFormPublishedAt(new Date().toISOString().slice(0, 10));
    setActiveTab('editor');
  };

  // Open editor to edit existing sermon
  const handleEditSermon = (s: Sermon) => {
    setEditingSermonId(s.id);
    setFormTitle(s.title);
    setFormSubtitle(s.subtitle || '');
    setFormSlug(s.slug);
    setFormDescription(s.description);
    setFormContent(s.content);
    setFormBiblicalRef(s.biblicalReferences);
    setFormCategory(s.category);
    setFormAuthor(s.author);
    setFormImageUrl(s.imageUrl);
    setFormKeywords(s.keywords || []);
    setFormStatus(s.status);
    setFormFeatured(s.featured);
    setFormPublishedAt(s.publishedAt ? s.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10));
    setActiveTab('editor');
  };

  // Save Sermon
  const handleSaveSermon = async (statusOverride?: SermonStatus) => {
    if (!formTitle.trim() || !formContent.trim()) {
      showNotification('Preencha pelo menos o título e o conteúdo do sermão.', 'error');
      return;
    }

    const finalStatus = statusOverride || formStatus;
    const catObj = categories.find(c => c.name === formCategory);
    const categorySlug = catObj ? catObj.slug : formCategory.toLowerCase().replace(/\s+/g, '-');
    const wordCount = formContent.split(/\s+/).length;
    const readingTimeMinutes = Math.max(1, Math.round(wordCount / 180));

    try {
      if (editingSermonId) {
        await updateSermon(editingSermonId, {
          title: formTitle.trim(),
          subtitle: formSubtitle.trim(),
          slug: formSlug.trim() || `sermao-${Date.now()}`,
          description: formDescription.trim(),
          content: formContent,
          biblicalReferences: formBiblicalRef.trim(),
          category: formCategory,
          categorySlug,
          author: formAuthor.trim() || 'Pastor',
          imageUrl: formImageUrl || PRESET_CHRISTIAN_IMAGES[0].url,
          keywords: formKeywords,
          status: finalStatus,
          featured: formFeatured,
          readingTimeMinutes,
          publishedAt: new Date(formPublishedAt).toISOString(),
        });
        showNotification('Sermão atualizado com sucesso no banco de dados!');
      } else {
        await createSermon({
          title: formTitle.trim(),
          subtitle: formSubtitle.trim(),
          slug: formSlug.trim() || `sermao-${Date.now()}`,
          description: formDescription.trim(),
          content: formContent,
          biblicalReferences: formBiblicalRef.trim(),
          category: formCategory,
          categorySlug,
          author: formAuthor.trim() || 'Pastor',
          imageUrl: formImageUrl || PRESET_CHRISTIAN_IMAGES[0].url,
          keywords: formKeywords,
          status: finalStatus,
          featured: formFeatured,
          readingTimeMinutes,
          publishedAt: new Date(formPublishedAt).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        showNotification('Novo sermão publicado com sucesso!');
      }

      await onRefreshData();
      setActiveTab('sermons');
    } catch (e: any) {
      showNotification(`Erro ao salvar: ${e.message}`, 'error');
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (s: Sermon) => {
    try {
      await updateSermon(s.id, { featured: !s.featured });
      await onRefreshData();
      showNotification(`Sermão "${s.title}" ${!s.featured ? 'adicionado aos destaques' : 'removido dos destaques'}.`);
    } catch (e: any) {
      showNotification(`Erro ao atualizar destaque: ${e.message}`, 'error');
    }
  };

  // Toggle Published/Draft
  const handleToggleStatus = async (s: Sermon) => {
    const nextStatus: SermonStatus = s.status === 'published' ? 'draft' : 'published';
    try {
      await updateSermon(s.id, { status: nextStatus });
      await onRefreshData();
      showNotification(`Status alterado para ${nextStatus === 'published' ? 'Publicado' : 'Rascunho'}.`);
    } catch (e: any) {
      showNotification(`Erro ao alterar status: ${e.message}`, 'error');
    }
  };

  // Delete handler
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'sermon') {
        await deleteSermon(itemToDelete.id);
        showNotification('Sermão excluído com sucesso.');
      } else if (itemToDelete.type === 'category') {
        await deleteCategory(itemToDelete.id);
        showNotification('Categoria excluída com sucesso.');
      } else if (itemToDelete.type === 'illustration') {
        await deleteIllustration(itemToDelete.id);
        showNotification('Ilustração excluída com sucesso.');
      }
      await onRefreshData();
      setItemToDelete(null);
    } catch (e: any) {
      showNotification(`Erro ao excluir: ${e.message}`, 'error');
    }
  };

  // Image Upload to Firebase Storage
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadProgress(10);

    const storageRef = ref(storage, `sermons/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        console.error('Storage upload error:', error);
        showNotification('Erro ao enviar imagem para o Storage. Usando URL direta.', 'error');
        setIsUploadingImage(false);
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setFormImageUrl(downloadUrl);
        setIsUploadingImage(false);
        showNotification('Imagem enviada com sucesso para o Firebase Storage!');
      }
    );
  };

  // Seed Data Handler
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const res = await seedInitialDataIfEmpty();
      await onRefreshData();
      showNotification(`Banco de dados populado: ${res.sermonsSeeded} sermões, ${res.categoriesSeeded} categorias, ${res.illustrationsSeeded} ilustrações.`);
    } catch (e: any) {
      showNotification(`Erro ao popular dados: ${e.message}`, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Category save
  const handleSaveCategory = async () => {
    if (!catName.trim()) return;
    const slug = catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      if (editingCatId) {
        await updateCategory(editingCatId, {
          name: catName.trim(),
          slug,
          description: catDescription.trim(),
        });
        showNotification('Categoria atualizada com sucesso!');
      } else {
        await createCategory({
          name: catName.trim(),
          slug,
          description: catDescription.trim(),
          createdAt: new Date().toISOString(),
        });
        showNotification('Nova categoria criada com sucesso!');
      }
      await onRefreshData();
      setIsCategoryModalOpen(false);
      setEditingCatId(null);
      setCatName('');
      setCatSlug('');
      setCatDescription('');
    } catch (e: any) {
      showNotification(`Erro ao salvar categoria: ${e.message}`, 'error');
    }
  };

  // Illustration save
  const handleSaveIllustration = async () => {
    if (!illTitle.trim() || !illStory.trim()) {
      showNotification('Preencha título e história da ilustração.', 'error');
      return;
    }

    try {
      if (editingIllId) {
        await updateIllustration(editingIllId, {
          title: illTitle.trim(),
          story: illStory.trim(),
          application: illApplication.trim(),
          biblicalReference: illBiblicalRef.trim(),
          category: illCategory,
          author: illAuthor.trim() || 'Tradicional',
          imageUrl: illImageUrl.trim(),
        });
        showNotification('Ilustração atualizada com sucesso!');
      } else {
        await createIllustration({
          title: illTitle.trim(),
          story: illStory.trim(),
          application: illApplication.trim(),
          biblicalReference: illBiblicalRef.trim(),
          category: illCategory,
          author: illAuthor.trim() || 'Tradicional',
          imageUrl: illImageUrl.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        showNotification('Nova ilustração cadastrada com sucesso!');
      }
      await onRefreshData();
      setIsIllustrationModalOpen(false);
      setEditingIllId(null);
      setIllTitle('');
      setIllStory('');
      setIllApplication('');
      setIllBiblicalRef('');
      setIllAuthor('');
      setIllImageUrl('');
    } catch (e: any) {
      showNotification(`Erro ao salvar ilustração: ${e.message}`, 'error');
    }
  };

  // Social networks save
  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSocials(true);
    try {
      await saveSocialLinks({
        instagram: socInstagram.trim(),
        youtube: socYoutube.trim(),
        facebook: socFacebook.trim(),
        whatsapp: socWhatsapp.trim(),
        telegram: socTelegram.trim(),
        spotify: socSpotify.trim(),
      });
      if (onRefreshSocials) {
        await onRefreshSocials();
      }
      showNotification('Links das redes sociais atualizados com sucesso no banco de dados!');
    } catch (err: any) {
      showNotification(`Erro ao salvar redes sociais: ${err.message}`, 'error');
    } finally {
      setIsSavingSocials(false);
    }
  };

  // Advertising & Sponsor banner save
  const handleSaveAdConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAd(true);
    try {
      await saveAdBannerConfig({
        enabled: adEnabled,
        tag: adTag.trim() || 'Espaço Publicitário & Parceria Gospel',
        sponsorName: adSponsorName.trim(),
        badgeText: adBadgeText.trim(),
        title: adTitle.trim() || 'Espaço Publicitário',
        description: adDescription.trim(),
        ctaText: adCtaText.trim() || 'Saiba Mais',
        linkUrl: adLinkUrl.trim(),
        imageUrl: adImageUrl.trim(),
        updatedAt: new Date().toISOString(),
      });
      if (onRefreshAdConfig) {
        await onRefreshAdConfig();
      }
      showNotification('Configurações do espaço publicitário salvas com sucesso no banco de dados!');
    } catch (err: any) {
      showNotification(`Erro ao salvar publicidade: ${err.message}`, 'error');
    } finally {
      setIsSavingAd(false);
    }
  };

  // Access Protection Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Acesso Restrito ao Administrador
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Esta área é reservada para a gestão e publicação de sermões, esboços e categorias da biblioteca cristã.
          </p>
          {!user ? (
            <button
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
            >
              <LogIn className="w-4 h-4" />
              Entrar com Conta de Administrador
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-left space-y-1">
              <p className="font-bold">Usuário conectado:</p>
              <p className="font-mono text-[11px] truncate">{user.email}</p>
              <p className="text-[11px] text-slate-400 pt-1">
                Para ter acesso, faça login com a conta de administrador autorizada (ex: tnkdzn@gmail.com).
              </p>
            </div>
          )}
          <button
            onClick={onExitAdmin}
            className="text-xs text-slate-400 hover:text-white underline font-semibold pt-2"
          >
            Voltar para a Biblioteca Pública
          </button>
        </div>
      </div>
    );
  }

  // Filtered sermons in table
  const filteredTableSermons = sermons.filter(s => {
    const matchSearch = !sermonSearch || 
      s.title.toLowerCase().includes(sermonSearch.toLowerCase()) ||
      s.author.toLowerCase().includes(sermonSearch.toLowerCase()) ||
      (s.biblicalReferences && s.biblicalReferences.toLowerCase().includes(sermonSearch.toLowerCase()));
    const matchCategory = sermonFilterCategory === 'todas' || s.category === sermonFilterCategory;
    const matchStatus = sermonFilterStatus === 'todos' || s.status === sermonFilterStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const publishedCount = sermons.filter(s => s.status === 'published').length;
  const draftCount = sermons.filter(s => s.status === 'draft').length;
  const featuredCount = sermons.filter(s => s.featured).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      
      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold border animate-in slide-in-from-bottom-3 ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-950 text-emerald-200 border-emerald-500/50' 
            : 'bg-rose-950 text-rose-200 border-rose-500/50'
        }`}>
          {feedbackMessage.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* SIDEBAR CMS NAVIGATION */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-white tracking-tight">PregAI CMS</h2>
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Painel Administrativo</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('sermons')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'sermons' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" />
                <span>Gerenciar Sermões</span>
              </div>
              <span className={`text-[11px] px-2 py-0.2 rounded-full font-bold ${
                activeTab === 'sermons' ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {sermons.length}
              </span>
            </button>

            <button
              onClick={handleNewSermon}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'editor' && !editingSermonId
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-amber-300 bg-amber-500/10 hover:bg-amber-500/20'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>Novo Sermão</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'categories' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Categorias</span>
              </div>
              <span className={`text-[11px] px-2 py-0.2 rounded-full font-bold ${
                activeTab === 'categories' ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('illustrations')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'illustrations' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4" />
                <span>Ilustrações Gospel</span>
              </div>
              <span className={`text-[11px] px-2 py-0.2 rounded-full font-bold ${
                activeTab === 'illustrations' ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {illustrations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('socials')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'socials' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Redes Sociais</span>
            </button>

            <button
              onClick={() => setActiveTab('advertising')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'advertising' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Megaphone className="w-4 h-4 text-amber-400" />
              <span>Espaço Publicitário</span>
            </button>
          </nav>
        </div>

        {/* User bar & Exit */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full border border-amber-400" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-xs font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.displayName || 'Administrador'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Site Público</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        
        {/* ==================== TAB: OVERVIEW ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Visão Geral do Ministério
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Resumo das publicações, rascunhos e conteúdos da biblioteca teológica.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSeedDatabase}
                  disabled={isSeeding}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-amber-500/30 transition-colors disabled:opacity-50"
                  title="Popular banco com sermões teológicos de referência"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                  {isSeeding ? 'Populando...' : 'Popular Dados Iniciais'}
                </button>
                <button
                  onClick={handleNewSermon}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Novo Sermão
                </button>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase font-mono">Total de Sermões</span>
                  <BookOpen className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold font-serif text-white">{sermons.length}</div>
                <p className="text-[11px] text-slate-400 mt-1">Esboços e estudos cadastrados</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase font-mono">Publicados</span>
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold font-serif text-emerald-400">{publishedCount}</div>
                <p className="text-[11px] text-slate-400 mt-1">Visíveis para a congregação</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase font-mono">Rascunhos</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold font-serif text-amber-400">{draftCount}</div>
                <p className="text-[11px] text-slate-400 mt-1">Em fase de preparação</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium uppercase font-mono">Ilustrações</span>
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-bold font-serif text-purple-400">{illustrations.length}</div>
                <p className="text-[11px] text-slate-400 mt-1">Parábolas e analogias</p>
              </div>
            </div>

            {/* Recent Publications Table preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-white">Sermões Recentes</h3>
                <button
                  onClick={() => setActiveTab('sermons')}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  Ver todos &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 font-mono uppercase">
                    <tr>
                      <th className="py-3 px-3">Título</th>
                      <th className="py-3 px-3">Categoria</th>
                      <th className="py-3 px-3">Autor</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {sermons.slice(0, 5).map((s) => (
                      <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">
                          {s.title}
                        </td>
                        <td className="py-3 px-3">
                          <CategoryBadge category={s.category} size="sm" />
                        </td>
                        <td className="py-3 px-3 text-slate-300">{s.author}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            s.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {s.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEditSermon(s)}
                              className="p-1.5 text-slate-400 hover:text-amber-400 rounded hover:bg-slate-800"
                              title="Editar"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onPreviewSermon(s)}
                              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                              title="Visualizar"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: SERMONS LIST ==================== */}
        {activeTab === 'sermons' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Gerenciador de Sermões
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Publique, edite, destaque e organize todos os conteúdos teológicos.
                </p>
              </div>

              <button
                onClick={handleNewSermon}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                Novo Sermão
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={sermonSearch}
                  onChange={(e) => setSermonSearch(e.target.value)}
                  placeholder="Pesquisar por título, autor, passagem..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                  value={sermonFilterCategory}
                  onChange={(e) => setSermonFilterCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-amber-400"
                >
                  <option value="todas">Todas Categorias</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={sermonFilterStatus}
                  onChange={(e) => setSermonFilterStatus(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 outline-none focus:border-amber-400"
                >
                  <option value="todos">Todos Status</option>
                  <option value="published">Publicados</option>
                  <option value="draft">Rascunhos</option>
                </select>
              </div>
            </div>

            {/* Sermons Data Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono uppercase">
                    <tr>
                      <th className="py-3.5 px-4">Capa & Título</th>
                      <th className="py-3.5 px-4">Passagem</th>
                      <th className="py-3.5 px-4">Categoria</th>
                      <th className="py-3.5 px-4">Autor</th>
                      <th className="py-3.5 px-4">Destaque</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredTableSermons.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400">
                          Nenhum sermão encontrado com os filtros aplicados.
                        </td>
                      </tr>
                    ) : (
                      filteredTableSermons.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={s.imageUrl || PRESET_CHRISTIAN_IMAGES[0].url}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                              />
                              <div className="max-w-xs">
                                <p className="font-bold text-white truncate">{s.title}</p>
                                <p className="text-[11px] text-slate-400 truncate">{s.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-amber-400 font-medium whitespace-nowrap">
                            {s.biblicalReferences || '—'}
                          </td>
                          <td className="py-3 px-4">
                            <CategoryBadge category={s.category} size="sm" />
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-medium whitespace-nowrap">
                            {s.author}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleFeatured(s)}
                              className={`p-1.5 rounded-lg border transition-all ${
                                s.featured 
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm' 
                                  : 'text-slate-500 border-slate-800 hover:text-slate-300'
                              }`}
                              title={s.featured ? 'Remover dos destaques' : 'Definir como destaque'}
                            >
                              <Flame className={`w-3.5 h-3.5 ${s.featured ? 'fill-current' : ''}`} />
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleStatus(s)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                s.status === 'published'
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                              }`}
                              title="Clique para alternar status"
                            >
                              {s.status === 'published' ? 'Publicado' : 'Rascunho'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onPreviewSermon(s)}
                                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                                title="Ver sermão"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleEditSermon(s)}
                                className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800"
                                title="Editar"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setItemToDelete({ type: 'sermon', id: s.id, title: s.title })}
                                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                                title="Excluir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: SERMON EDITOR ==================== */}
        {activeTab === 'editor' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('sermons')}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
                    {editingSermonId ? 'Editar Sermão' : 'Criar Nova Publicação'}
                  </h1>
                  <p className="text-xs text-slate-400">
                    Preencha os campos teológicos, formate os pontos de pregação e envie imagens.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditorPreviewMode(!editorPreviewMode)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  {editorPreviewMode ? 'Voltar ao Editor' : 'Pré-visualizar'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSermon('draft')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-slate-700"
                >
                  Salvar Rascunho
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveSermon('published')}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  <Save className="w-4 h-4" />
                  Publicar Sermão
                </button>
              </div>
            </div>

            {editorPreviewMode ? (
              /* Live Preview */
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-2">
                  <CategoryBadge category={formCategory} size="md" />
                  {formBiblicalRef && (
                    <span className="text-xs text-amber-400 font-semibold font-mono">
                      &bull; {formBiblicalRef}
                    </span>
                  )}
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">{formTitle || 'Título do Sermão'}</h1>
                {formSubtitle && <p className="text-lg font-serif italic text-slate-300">{formSubtitle}</p>}
                {formImageUrl && (
                  <div className="rounded-xl overflow-hidden max-h-80 border border-slate-800">
                    <img src={formImageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line">
                  {formContent}
                </div>
              </div>
            ) : (
              /* Form Grid */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left 2 Cols: Main Content */}
                <div className="lg:col-span-2 space-y-5">
                  
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                      Título do Sermão *
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Ex: A Fé que Move Montanhas e Rompe o Impossível"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                      Subtítulo / Proposição
                    </label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      placeholder="Ex: Como desenvolver uma confiança inabalável nas promessas de Deus"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Description / Abstract */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                      Descrição / Sinopse
                    </label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Breve resumo da mensagem para exibição nos cartões e redes sociais..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 outline-none focus:border-amber-400 resize-y"
                    />
                  </div>

                  {/* Rich Content Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Conteúdo Completo & Esboço de Pregação *
                      </label>
                      <span className="text-[11px] text-slate-500">
                        {formContent.split(/\s+/).filter(Boolean).length} palavras
                      </span>
                    </div>

                    {/* Toolbar */}
                    <div className="bg-slate-950 border border-b-0 border-slate-800 rounded-t-xl p-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
                      <button
                        type="button"
                        onClick={() => insertFormatting('## TÍTULO DE SEÇÃO')}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 font-bold text-amber-400"
                        title="Título Principal (H2)"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('### SUBTÍTULO')}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 font-bold"
                        title="Subtítulo (H3)"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('> "Versículo bíblico ou citação"', '')}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 italic text-amber-300 font-serif"
                        title="Citação Bíblica em Destaque"
                      >
                        " Citação "
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('## I. PONTO DO ESBOÇO')}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 font-mono"
                        title="Ponto de Divisão I, II, III"
                      >
                        I, II, III
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('- Item da lista')}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800"
                        title="Marcador de Lista"
                      >
                        &bull; Lista
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('---')}
                        className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800"
                        title="Linha Divisória"
                      >
                        — Linha
                      </button>
                    </div>

                    <textarea
                      rows={16}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      placeholder="Escreva ou cole aqui a pregação completa..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-b-xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 font-mono leading-relaxed outline-none focus:border-amber-400 resize-y"
                    />
                  </div>

                </div>

                {/* Right Col: Metadata, Taxonomy & Image */}
                <div className="space-y-5">
                  
                  {/* Status & Featured */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                      Publicação & Visibilidade
                    </h4>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as SermonStatus)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      >
                        <option value="published">Publicado (Disponível no site)</option>
                        <option value="draft">Rascunho (Privado para o Admin)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-semibold text-slate-300">Destaque na Página Inicial</span>
                      <button
                        type="button"
                        onClick={() => setFormFeatured(!formFeatured)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          formFeatured ? 'bg-amber-500' : 'bg-slate-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                          formFeatured ? 'left-6' : 'left-1'
                        }`} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Data de Publicação</label>
                      <input
                        type="date"
                        value={formPublishedAt}
                        onChange={(e) => setFormPublishedAt(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Taxonomy: Category & Author & Bible Ref */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                      Classificação Teológica
                    </h4>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria Principal</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Referências Bíblicas</label>
                      <input
                        type="text"
                        value={formBiblicalRef}
                        onChange={(e) => setFormBiblicalRef(e.target.value)}
                        placeholder="Ex: João 14:1-6; Hebreus 11:1"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Autor / Pregador</label>
                      <input
                        type="text"
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        placeholder="Ex: Pr. Hernandes Dias Lopes"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Slug (URL)</label>
                      <input
                        type="text"
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono outline-none"
                      />
                    </div>
                  </div>

                  {/* Cover Image & Upload */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                      Imagem de Capa
                    </h4>

                    {formImageUrl && (
                      <div className="rounded-xl overflow-hidden h-32 border border-slate-800 relative">
                        <img src={formImageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* File upload to Firebase Storage */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Enviar do Computador (Firebase Storage)
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-amber-400 text-xs text-slate-300 transition-colors">
                          <Upload className="w-4 h-4 text-amber-400" />
                          <span>{isUploadingImage ? `Enviando (${uploadProgress}%)...` : 'Selecionar arquivo...'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            disabled={isUploadingImage}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Presets selector */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Ou selecione uma imagem cristã curada:
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {PRESET_CHRISTIAN_IMAGES.map((img, i) => (
                          <div
                            key={i}
                            onClick={() => setFormImageUrl(img.url)}
                            className={`h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                              formImageUrl === img.url ? 'border-amber-400 scale-95 shadow-md' : 'border-slate-800 hover:opacity-80'
                            }`}
                            title={img.label}
                          >
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Ou cole a URL direta:</label>
                      <input
                        type="url"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
                      />
                    </div>
                  </div>

                  {/* Keywords / Tags */}
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                      Palavras-chave
                    </h4>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddKeyword(); } }}
                        placeholder="Ex: fé, oração, família..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                      >
                        Adicionar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {formKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          #{kw}
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(kw)}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: CATEGORIES ==================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Gestão de Categorias
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Crie e organize as divisões doutrinárias e temas da biblioteca.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCatId(null);
                  setCatName('');
                  setCatSlug('');
                  setCatDescription('');
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                Nova Categoria
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => {
                const count = sermons.filter(s => s.categorySlug === c.slug || s.category === c.name).length;
                return (
                  <div
                    key={c.id || c.slug}
                    className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <CategoryBadge category={c.name} size="sm" />
                        <span className="text-[11px] text-slate-400 font-mono">
                          {count} {count === 1 ? 'sermão' : 'sermões'}
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-white mb-1">{c.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{c.description || 'Sem descrição.'}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-500">/{c.slug}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCatId(c.id);
                            setCatName(c.name);
                            setCatSlug(c.slug);
                            setCatDescription(c.description || '');
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-amber-400 rounded hover:bg-slate-800"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setItemToDelete({ type: 'category', id: c.id, title: c.name })}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB: ILLUSTRATIONS ==================== */}
        {activeTab === 'illustrations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Ilustrações Gospel & Parábolas
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Gerencie as histórias, parolas e aplicações práticas para enriquecer sermões.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingIllId(null);
                  setIllTitle('');
                  setIllStory('');
                  setIllApplication('');
                  setIllBiblicalRef('');
                  setIllCategory(categories[0]?.name || 'Vida Cristã');
                  setIllAuthor('');
                  setIllImageUrl('');
                  setIsIllustrationModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                Nova Ilustração
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {illustrations.map((ill) => (
                <div
                  key={ill.id}
                  className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <CategoryBadge category={ill.category} size="sm" />
                      {ill.biblicalReference && (
                        <span className="text-[11px] text-amber-400 font-medium">
                          {ill.biblicalReference}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-base font-bold text-white mb-2">{ill.title}</h3>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-3">{ill.story}</p>
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 line-clamp-2">
                      <span className="font-bold text-amber-400">Aplicação: </span>
                      {ill.application}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{ill.author || 'Tradicional'}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingIllId(ill.id);
                          setIllTitle(ill.title);
                          setIllStory(ill.story);
                          setIllApplication(ill.application);
                          setIllBiblicalRef(ill.biblicalReference || '');
                          setIllCategory(ill.category);
                          setIllAuthor(ill.author || '');
                          setIllImageUrl(ill.imageUrl || '');
                          setIsIllustrationModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-400 rounded hover:bg-slate-800"
                        title="Editar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setItemToDelete({ type: 'illustration', id: ill.id, title: ill.title })}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: SOCIAL NETWORKS SETTINGS ==================== */}
        {activeTab === 'socials' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Redes Sociais & Contatos Oficiais
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Configure os links das redes sociais que serão exibidos na tela inicial de boas-vindas e no rodapé público.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form Col */}
              <form onSubmit={handleSaveSocials} className="lg:col-span-2 space-y-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
                
                {/* Instagram */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400 font-mono mb-1.5">
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </label>
                  <input
                    type="url"
                    value={socInstagram}
                    onChange={(e) => setSocInstagram(e.target.value)}
                    placeholder="https://instagram.com/seuministerio"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Ex: perfil da igreja ou do pregador</p>
                </div>

                {/* YouTube */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 font-mono mb-1.5">
                    <Youtube className="w-4 h-4" />
                    <span>Canal no YouTube</span>
                  </label>
                  <input
                    type="url"
                    value={socYoutube}
                    onChange={(e) => setSocYoutube(e.target.value)}
                    placeholder="https://youtube.com/@seucanal"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Para transmissões ao vivo e gravações de cultos</p>
                </div>

                {/* Facebook */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 font-mono mb-1.5">
                    <Facebook className="w-4 h-4" />
                    <span>Página no Facebook</span>
                  </label>
                  <input
                    type="url"
                    value={socFacebook}
                    onChange={(e) => setSocFacebook(e.target.value)}
                    placeholder="https://facebook.com/suapagina"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono mb-1.5">
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp (Grupo ou Contato)</span>
                  </label>
                  <input
                    type="url"
                    value={socWhatsapp}
                    onChange={(e) => setSocWhatsapp(e.target.value)}
                    placeholder="https://wa.me/5511999999999 ou link de convite do grupo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Para oração, pedidos pastorais ou comunidade</p>
                </div>

                {/* Telegram */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 font-mono mb-1.5">
                    <Send className="w-4 h-4" />
                    <span>Canal no Telegram</span>
                  </label>
                  <input
                    type="url"
                    value={socTelegram}
                    onChange={(e) => setSocTelegram(e.target.value)}
                    placeholder="https://t.me/seucanal"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                </div>

                {/* Spotify */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono mb-1.5">
                    <Headphones className="w-4 h-4" />
                    <span>Podcast no Spotify</span>
                  </label>
                  <input
                    type="url"
                    value={socSpotify}
                    onChange={(e) => setSocSpotify(e.target.value)}
                    placeholder="https://open.spotify.com/show/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Para sermões em áudio e estudos bíblicos</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSavingSocials}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingSocials ? 'Salvando no Banco...' : 'Salvar Redes Sociais'}</span>
                  </button>
                </div>
              </form>

              {/* Preview Col */}
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Pré-visualização dos Ícones
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Assim é como os visitantes verão os canais de contato na tela de boas-vindas e no rodapé:
                  </p>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center gap-2.5 justify-center">
                    {socInstagram && (
                      <span className="p-2.5 rounded-xl bg-slate-900 text-pink-400 border border-slate-800" title="Instagram">
                        <Instagram className="w-4 h-4" />
                      </span>
                    )}
                    {socYoutube && (
                      <span className="p-2.5 rounded-xl bg-slate-900 text-red-400 border border-slate-800" title="YouTube">
                        <Youtube className="w-4 h-4" />
                      </span>
                    )}
                    {socFacebook && (
                      <span className="p-2.5 rounded-xl bg-slate-900 text-blue-400 border border-slate-800" title="Facebook">
                        <Facebook className="w-4 h-4" />
                      </span>
                    )}
                    {socWhatsapp && (
                      <span className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 border border-slate-800" title="WhatsApp">
                        <MessageCircle className="w-4 h-4" />
                      </span>
                    )}
                    {socTelegram && (
                      <span className="p-2.5 rounded-xl bg-slate-900 text-sky-400 border border-slate-800" title="Telegram">
                        <Send className="w-4 h-4" />
                      </span>
                    )}
                    {socSpotify && (
                      <span className="p-2.5 rounded-xl bg-slate-900 text-emerald-300 border border-slate-800" title="Spotify">
                        <Headphones className="w-4 h-4" />
                      </span>
                    )}
                    {!socInstagram && !socYoutube && !socFacebook && !socWhatsapp && !socTelegram && !socSpotify && (
                      <span className="text-xs text-slate-500 italic">Nenhuma rede preenchida ainda</span>
                    )}
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200 leading-relaxed">
                    Os links deixados em branco serão ocultados automaticamente para não exibir botões inativos aos visitantes.
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================== TAB: ADVERTISING / SPONSOR BANNER ==================== */}
        {activeTab === 'advertising' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Gestão do Espaço Publicitário & Parcerias
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Configure o banner de patrocínio, cursos teológicos ou livraria cristã exibido na parte inferior antes do rodapé.
                </p>
              </div>

              {/* Status Switch */}
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl self-start sm:self-auto">
                <span className="text-xs font-semibold text-slate-300">
                  {adEnabled ? 'Anúncio Ativado' : 'Anúncio Ocultado'}
                </span>
                <button
                  type="button"
                  onClick={() => setAdEnabled(!adEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    adEnabled ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                  title="Ativar ou desativar o espaço publicitário"
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    adEnabled ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form Col */}
              <form onSubmit={handleSaveAdConfig} className="lg:col-span-2 space-y-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
                
                {/* Tag & Sponsor Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-1.5">
                      Selo do Espaço (Tag)
                    </label>
                    <input
                      type="text"
                      value={adTag}
                      onChange={(e) => setAdTag(e.target.value)}
                      placeholder="Ex: Espaço Publicitário & Parceria Gospel"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                      Nome do Patrocinador / Parceiro
                    </label>
                    <input
                      type="text"
                      value={adSponsorName}
                      onChange={(e) => setAdSponsorName(e.target.value)}
                      placeholder="Ex: Instituto Teológico PregAI"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Badge & CTA text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono mb-1.5">
                      Destaque Promocional (Badge)
                    </label>
                    <input
                      type="text"
                      value={adBadgeText}
                      onChange={(e) => setAdBadgeText(e.target.value)}
                      placeholder="Ex: Bolsas de Estudo, 50% OFF, Matrículas Abertas"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 font-mono mb-1.5">
                      Texto do Botão de Ação (CTA)
                    </label>
                    <input
                      type="text"
                      value={adCtaText}
                      onChange={(e) => setAdCtaText(e.target.value)}
                      placeholder="Ex: Conhecer Curso, Saiba Mais, Acessar Livraria"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Headline / Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                    Título Principal do Anúncio *
                  </label>
                  <input
                    type="text"
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    placeholder="Ex: Formação em Homilética e Pregação Expositiva"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-1.5">
                    Descrição do Anúncio / Proposta de Valor
                  </label>
                  <textarea
                    rows={3}
                    value={adDescription}
                    onChange={(e) => setAdDescription(e.target.value)}
                    placeholder="Explique os benefícios, conteúdo do curso, livros ou o propósito do ministério parceiro..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 resize-y"
                  />
                </div>

                {/* Destination URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-blue-400 font-mono mb-1.5">
                    Link de Destino (URL) *
                  </label>
                  <input
                    type="url"
                    value={adLinkUrl}
                    onChange={(e) => setAdLinkUrl(e.target.value)}
                    placeholder="https://exemplo.com.br/seu-curso"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Ao clicar no botão ou na imagem, o visitante será encaminhado com segurança para este endereço.</p>
                </div>

                {/* Image URL & Presets */}
                <div className="pt-2 border-t border-slate-800/80 space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                    Imagem do Banner de Publicidade
                  </label>
                  
                  <input
                    type="url"
                    value={adImageUrl}
                    onChange={(e) => setAdImageUrl(e.target.value)}
                    placeholder="Cole a URL da imagem ou escolha abaixo..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400"
                  />

                  {/* Preset Banners */}
                  <div>
                    <span className="text-[11px] text-slate-400 mb-1.5 block">Imagens sugeridas para anúncios e estudos:</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Biblioteca & Livros', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80' },
                        { label: 'Púlpito & Bíblia', url: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80' },
                        { label: 'Estudo Teológico', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80' },
                        { label: 'Comunidade & Adoração', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80' }
                      ].map((preset, idx) => (
                        <div
                          key={idx}
                          onClick={() => setAdImageUrl(preset.url)}
                          className={`h-14 rounded-xl overflow-hidden cursor-pointer border-2 transition-all relative ${
                            adImageUrl === preset.url ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-slate-800 hover:border-slate-700'
                          }`}
                          title={preset.label}
                        >
                          <img src={preset.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Save button */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSavingAd}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingAd ? 'Salvando no Banco...' : 'Salvar Espaço Publicitário'}</span>
                  </button>
                </div>

              </form>

              {/* Live Preview Column */}
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>Pré-visualização em Tempo Real</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Veja exatamente como o espaço publicitário aparecerá para os visitantes logo antes do rodapé:
                  </p>

                  {/* Rendered Preview Card */}
                  <div className={`p-4 rounded-2xl border transition-all ${
                    adEnabled ? 'bg-[#0a192f] border-amber-500/30' : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {adTag || 'Espaço Publicitário'}
                      </span>
                      {adBadgeText && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {adBadgeText}
                        </span>
                      )}
                    </div>

                    <h5 className="font-serif text-base font-bold text-white mb-1.5 leading-snug">
                      {adTitle || 'Título do seu anúncio ou parceria'}
                    </h5>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-3">
                      {adDescription || 'Descrição com os detalhes e benefícios do produto, curso ou ministério parceiro.'}
                    </p>

                    {adImageUrl && (
                      <div className="h-28 rounded-xl overflow-hidden border border-slate-800 mb-3">
                        <img src={adImageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                        {adSponsorName ? `Por: ${adSponsorName}` : 'Anúncio Patrocinado'}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] flex items-center gap-1">
                        <span>{adCtaText || 'Saiba Mais'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-200 leading-relaxed">
                    Você pode alterar este espaço sempre que desejar lançar um novo curso, livro, conferência ou evento para a congregação.
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white">Confirmar Exclusão</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tem certeza que deseja excluir permanentemente{' '}
              <span className="text-rose-300 font-semibold">"{itemToDelete.title}"</span>? Esta ação não pode ser desfeita no banco de dados.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-white">
                {editingCatId ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da Categoria *</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCatId) {
                      setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  placeholder="Ex: Escatologia"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="Explicação do tema teológico..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 shadow-md"
              >
                Salvar Categoria
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ILLUSTRATION MODAL */}
      {isIllustrationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-white">
                {editingIllId ? 'Editar Ilustração' : 'Cadastrar Ilustração Gospel'}
              </h3>
              <button onClick={() => setIsIllustrationModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título *</label>
                <input
                  type="text"
                  value={illTitle}
                  onChange={(e) => setIllTitle(e.target.value)}
                  placeholder="Ex: O Farol Imutável e o Navio"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria</label>
                  <select
                    value={illCategory}
                    onChange={(e) => setIllCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Referência Bíblica</label>
                  <input
                    type="text"
                    value={illBiblicalRef}
                    onChange={(e) => setIllBiblicalRef(e.target.value)}
                    placeholder="Ex: Mateus 7:24"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">História / Parábola *</label>
                <textarea
                  rows={4}
                  value={illStory}
                  onChange={(e) => setIllStory(e.target.value)}
                  placeholder="A história ou analogia para contar no púlpito..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Aplicação na Pregação *</label>
                <textarea
                  rows={3}
                  value={illApplication}
                  onChange={(e) => setIllApplication(e.target.value)}
                  placeholder="A moral teológica e apelo prático para o ouvinte..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Autor / Fonte</label>
                  <input
                    type="text"
                    value={illAuthor}
                    onChange={(e) => setIllAuthor(e.target.value)}
                    placeholder="Ex: Tradicional Gospel"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">URL da Imagem</label>
                  <input
                    type="url"
                    value={illImageUrl}
                    onChange={(e) => setIllImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsIllustrationModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveIllustration}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 shadow-md"
              >
                Salvar Ilustração
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
