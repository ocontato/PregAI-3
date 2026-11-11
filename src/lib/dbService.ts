import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  setDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrors';
import { Sermon, Category, Illustration, Favorite, SermonStatus, SocialLinks, AdBannerConfig } from '../types';
import { INITIAL_CATEGORIES, INITIAL_SERMONS, INITIAL_ILLUSTRATIONS } from './seedData';

// SERMONS
export async function getSermons(options?: {
  categorySlug?: string;
  status?: SermonStatus;
  featuredOnly?: boolean;
  limitCount?: number;
}): Promise<Sermon[]> {
  const path = 'sermons';
  try {
    let q = collection(db, path);
    const constraints: any[] = [];

    if (options?.status) {
      constraints.push(where('status', '==', options.status));
    }
    if (options?.categorySlug && options.categorySlug !== 'todas') {
      constraints.push(where('categorySlug', '==', options.categorySlug));
    }
    if (options?.featuredOnly) {
      constraints.push(where('featured', '==', true));
    }
    if (options?.limitCount) {
      constraints.push(limit(options.limitCount));
    }

    const firestoreQuery = query(q, ...constraints);
    const snap = await getDocs(firestoreQuery);
    const sermons: Sermon[] = [];
    snap.forEach((d) => {
      sermons.push({ id: d.id, ...(d.data() as Omit<Sermon, 'id'>) });
    });

    // Client-side sort by publishedAt descending to handle queries without composite index requirements
    return sermons.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function getSermonById(id: string): Promise<Sermon | null> {
  const path = `sermons/${id}`;
  try {
    const snap = await getDoc(doc(db, 'sermons', id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Sermon, 'id'>) };
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function getSermonBySlug(slug: string): Promise<Sermon | null> {
  const path = 'sermons';
  try {
    const q = query(collection(db, path), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docData = snap.docs[0];
    return { id: docData.id, ...(docData.data() as Omit<Sermon, 'id'>) };
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function createSermon(data: Omit<Sermon, 'id'>): Promise<string> {
  const path = 'sermons';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function updateSermon(id: string, updates: Partial<Sermon>): Promise<void> {
  const path = `sermons/${id}`;
  try {
    const docRef = doc(db, 'sermons', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteSermon(id: string): Promise<void> {
  const path = `sermons/${id}`;
  try {
    await deleteDoc(doc(db, 'sermons', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// CATEGORIES
export async function getCategories(): Promise<Category[]> {
  const path = 'categories';
  try {
    const snap = await getDocs(collection(db, path));
    const list: Category[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<Category, 'id'>) });
    });
    return list.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
  const path = 'categories';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  const path = `categories/${id}`;
  try {
    await updateDoc(doc(db, 'categories', id), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const path = `categories/${id}`;
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// ILLUSTRATIONS
export async function getIllustrations(category?: string): Promise<Illustration[]> {
  const path = 'illustrations';
  try {
    let q = collection(db, path);
    let firestoreQuery = query(q);
    if (category && category !== 'todas') {
      firestoreQuery = query(q, where('category', '==', category));
    }
    const snap = await getDocs(firestoreQuery);
    const list: Illustration[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<Illustration, 'id'>) });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function createIllustration(data: Omit<Illustration, 'id'>): Promise<string> {
  const path = 'illustrations';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function updateIllustration(id: string, updates: Partial<Illustration>): Promise<void> {
  const path = `illustrations/${id}`;
  try {
    await updateDoc(doc(db, 'illustrations', id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteIllustration(id: string): Promise<void> {
  const path = `illustrations/${id}`;
  try {
    await deleteDoc(doc(db, 'illustrations', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// FAVORITES
export async function getUserFavorites(userId: string): Promise<Favorite[]> {
  const path = 'favorites';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    const snap = await getDocs(q);
    const list: Favorite[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<Favorite, 'id'>) });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function addFavorite(data: Omit<Favorite, 'id'>): Promise<string> {
  const path = 'favorites';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function removeFavorite(favoriteId: string): Promise<void> {
  const path = `favorites/${favoriteId}`;
  try {
    await deleteDoc(doc(db, 'favorites', favoriteId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

// SEED DATABASE
export async function seedInitialDataIfEmpty(): Promise<{ categoriesSeeded: number; sermonsSeeded: number; illustrationsSeeded: number }> {
  let categoriesSeeded = 0;
  let sermonsSeeded = 0;
  let illustrationsSeeded = 0;

  // 1. Categories
  const catSnap = await getDocs(collection(db, 'categories'));
  if (catSnap.empty) {
    for (const cat of INITIAL_CATEGORIES) {
      await addDoc(collection(db, 'categories'), cat);
      categoriesSeeded++;
    }
  }

  // 2. Sermons
  const sermSnap = await getDocs(collection(db, 'sermons'));
  if (sermSnap.empty) {
    for (const s of INITIAL_SERMONS) {
      await addDoc(collection(db, 'sermons'), s);
      sermonsSeeded++;
    }
  }

  // 3. Illustrations
  const illSnap = await getDocs(collection(db, 'illustrations'));
  if (illSnap.empty) {
    for (const ill of INITIAL_ILLUSTRATIONS) {
      await addDoc(collection(db, 'illustrations'), ill);
      illustrationsSeeded++;
    }
  }

  return { categoriesSeeded, sermonsSeeded, illustrationsSeeded };
}

// SOCIAL LINKS SETTINGS
export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
  facebook: 'https://facebook.com',
  whatsapp: 'https://whatsapp.com',
  telegram: 'https://t.me',
  spotify: 'https://spotify.com',
};

export async function getSocialLinks(): Promise<SocialLinks> {
  const path = 'settings/socials';
  try {
    const snap = await getDoc(doc(db, 'settings', 'socials'));
    if (!snap.exists()) {
      return DEFAULT_SOCIAL_LINKS;
    }
    return { ...DEFAULT_SOCIAL_LINKS, ...(snap.data() as SocialLinks) };
  } catch (err) {
    console.warn('Could not fetch social links from Firestore, using defaults:', err);
    return DEFAULT_SOCIAL_LINKS;
  }
}

export async function saveSocialLinks(links: SocialLinks): Promise<void> {
  const path = 'settings/socials';
  try {
    await setDoc(doc(db, 'settings', 'socials'), {
      ...links,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// ADVERTISING & SPONSOR BANNER SETTINGS
export const DEFAULT_AD_BANNER: AdBannerConfig = {
  enabled: true,
  tag: 'Espaço Publicitário & Parceria Gospel',
  sponsorName: 'Instituto Teológico PregAI',
  badgeText: 'Bolsas de Estudo',
  title: 'Formação em Homilética e Pregação Expositiva',
  description: 'Aprenda a estruturar sermões bíblicos profundos, com fidelidade textual, ilustrações impactantes e relevância para sua igreja. Matricule-se hoje com condições especiais para obreiros e líderes.',
  ctaText: 'Conhecer Curso e Vagas',
  linkUrl: 'https://seusiteparceiro.com/curso-pregacao',
  imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
};

export async function getAdBannerConfig(): Promise<AdBannerConfig> {
  const path = 'settings/ad_banner';
  try {
    const snap = await getDoc(doc(db, 'settings', 'ad_banner'));
    if (!snap.exists()) {
      return DEFAULT_AD_BANNER;
    }
    return { ...DEFAULT_AD_BANNER, ...(snap.data() as AdBannerConfig) };
  } catch (err) {
    console.warn('Could not fetch ad banner config from Firestore, using defaults:', err);
    return DEFAULT_AD_BANNER;
  }
}

export async function saveAdBannerConfig(config: AdBannerConfig): Promise<void> {
  const path = 'settings/ad_banner';
  try {
    await setDoc(doc(db, 'settings', 'ad_banner'), {
      ...config,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

