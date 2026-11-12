import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../firebase';
import { Project, Service, Inquiry, SiteSettings, MediaItem } from '../types';
import { useAuth } from './AuthContext';

// Default initial data for Meek Studio 3D Art
export const DEFAULT_SETTINGS: SiteSettings = {
  businessName: 'MEEK STUDIO 3D ART',
  headline: 'BRING YOUR IMAGINATION TO LIFE.',
  supportingText: 'Custom 3D Art. Creative Sculptures. Extraordinary Details.',
  bibleVerse: 'Blessed are the meek: for they shall inherit the earth.',
  bibleReference: 'Matthew 5:5',
  aboutTitle: 'THE ART OF BRINGING IDEAS TO LIFE',
  aboutText: 'Meek Studio 3D Art is a creative studio based in Iloilo City, specializing in unique 3D art, custom sculptures, collectible figures, and creative artwork. We transform ideas and imagination into tangible works of art through creativity, craftsmanship, and attention to detail.',
  contactNumber: '09385667572',
  location: 'Iloilo City, Philippines',
  facebookUrl: 'https://www.facebook.com/profile.php?id=100091903210785',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'mythos-dragon-sculpture',
    title: 'Mythos Wyrm – Metallic Gold & Charcoal Edition',
    description: 'High-fidelity custom 3D sculpted mythological dragon centerpiece featuring gilded armor filigree, hyper-textured serpentine anatomy, and dramatic basalt gallery plinth presentation.',
    category: 'Display Sculptures',
    coverImage: '/src/assets/images/meek_hero_sculpture_1794441974326.jpg',
    images: [
      '/src/assets/images/meek_hero_sculpture_1794441974326.jpg',
      '/src/assets/images/meek_display_sculpture_1794441975006.jpg'
    ],
    completionDate: '2026',
    isFeatured: true,
    isPublished: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'aurelian-vanguard-figure',
    title: 'Aurelian Vanguard – Dual Blades Collectible',
    description: 'Handcrafted collectible character figurine sculpted with dynamic cape flow, intricately gilded pauldrons, dual runic broadswords, and weathered stone display base.',
    category: '3D Character Sculptures',
    coverImage: '/src/assets/images/meek_character_figure_1794441974759.jpg',
    images: [
      '/src/assets/images/meek_character_figure_1794441974759.jpg'
    ],
    completionDate: '2026',
    isFeatured: true,
    isPublished: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'aurum-cyberdraco',
    title: 'Aurum Mechadraconis Showcase',
    description: 'Complex mechanical dragon display sculpture blending geometric cybernetic articulation with organic biomechanical wings and radiant gold leaf plates.',
    category: 'Collectible Art',
    coverImage: '/src/assets/images/meek_display_sculpture_1794441975006.jpg',
    images: [
      '/src/assets/images/meek_display_sculpture_1794441975006.jpg'
    ],
    completionDate: '2026',
    isFeatured: true,
    isPublished: true,
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'scholar-bust-sculpture',
    title: 'The Imperial Scholar – Portrait Bust',
    description: 'Custom sculpted realistic portrait bust in aged bronze with 24k gold leaf brocade robes, capturing intense character expression and lifelike skin textures.',
    category: 'Custom Figures',
    coverImage: '/src/assets/images/meek_custom_figure_bust_1794441976147.jpg',
    images: [
      '/src/assets/images/meek_custom_figure_bust_1794441976147.jpg'
    ],
    completionDate: '2026',
    isFeatured: false,
    isPublished: true,
    order: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'studio-atelier-craft',
    title: 'Studio Detailing & Clay Detailing Studies',
    description: 'Behind-the-scenes precision detailing, manual tool calibration, gold pigment application, and multi-stage 3D model finishing in our Iloilo City workshop.',
    category: 'Other Custom Projects',
    coverImage: '/src/assets/images/meek_studio_workshop_1794441975687.jpg',
    images: [
      '/src/assets/images/meek_studio_workshop_1794441975687.jpg'
    ],
    completionDate: '2026',
    isFeatured: false,
    isPublished: true,
    order: 5,
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'custom-3d-sculptures',
    name: 'Custom 3D Sculptures',
    description: 'Large-scale bespoke sculptures, statement art pieces, and display centerpieces modeled and crafted to your exact spatial and aesthetic vision.',
    imageUrl: '/src/assets/images/meek_hero_sculpture_1794441974326.jpg',
    order: 1,
  },
  {
    id: 'character-figures',
    name: 'Character Figures',
    description: 'High-detail anime, comic, game, and fantasy character figures with custom armor, dynamic action poses, and museum display plinths.',
    imageUrl: '/src/assets/images/meek_character_figure_1794441974759.jpg',
    order: 2,
  },
  {
    id: 'collectible-figures',
    name: 'Collectible Figures',
    description: 'Limited run collectible figures, fine art prototypes, and miniature statues with metallic, bronze, or custom hand-painted finishes.',
    imageUrl: '/src/assets/images/meek_display_sculpture_1794441975006.jpg',
    order: 3,
  },
  {
    id: 'personalized-3d-art',
    name: 'Personalized 3D Art',
    description: 'Custom portrait busts, memorial sculptures, family crests, and unique personalized gifts transformed from your reference photographs.',
    imageUrl: '/src/assets/images/meek_custom_figure_bust_1794441976147.jpg',
    order: 4,
  },
  {
    id: 'custom-art-projects',
    name: 'Custom Art Projects',
    description: 'Specialized architectural accents, gaming trophies, specialized props, and experimental 3D designs engineered with premium materials.',
    imageUrl: '/src/assets/images/meek_studio_workshop_1794441975687.jpg',
    order: 5,
  }
];

interface DataContextType {
  projects: Project[];
  services: Service[];
  inquiries: Inquiry[];
  settings: SiteSettings;
  mediaItems: MediaItem[];
  loading: boolean;
  saveProject: (project: Partial<Project> & { id?: string }) => Promise<string>;
  deleteProject: (id: string) => Promise<void>;
  saveService: (service: Partial<Service> & { id?: string }) => Promise<string>;
  deleteService: (id: string) => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  submitInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  uploadMediaItem: (file: File) => Promise<MediaItem>;
  deleteMediaItem: (id: string) => Promise<void>;
  initializeDefaultsToFirestore: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: 'media-1',
      name: 'meek_hero_sculpture.jpg',
      url: '/src/assets/images/meek_hero_sculpture_1794441974326.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-2',
      name: 'meek_character_figure.jpg',
      url: '/src/assets/images/meek_character_figure_1794441974759.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-3',
      name: 'meek_display_sculpture.jpg',
      url: '/src/assets/images/meek_display_sculpture_1794441975006.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-4',
      name: 'meek_custom_figure_bust.jpg',
      url: '/src/assets/images/meek_custom_figure_bust_1794441976147.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-5',
      name: 'meek_studio_workshop.jpg',
      url: '/src/assets/images/meek_studio_workshop_1794441975687.jpg',
      uploadedAt: new Date().toISOString(),
    }
  ]);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync Settings
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'site_config'),
      (snapshot) => {
        if (snapshot.exists()) {
          setSettings({ ...DEFAULT_SETTINGS, ...snapshot.data() } as SiteSettings);
        }
      },
      (error) => {
        console.warn('Settings snapshot listener note:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Sync Services
  useEffect(() => {
    const servicesRef = collection(db, 'services');
    const unsub = onSnapshot(
      servicesRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Service[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Service);
          });
          list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
          setServices(list);
        }
      },
      (error) => {
        console.warn('Services snapshot listener note:', error.message);
      }
    );
    return () => unsub();
  }, []);

  // Sync Projects
  useEffect(() => {
    const projectsRef = collection(db, 'projects');
    const unsub = onSnapshot(
      projectsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Project[] = [];
          snapshot.forEach((d) => {
            const data = d.data() as Omit<Project, 'id'>;
            list.push({ id: d.id, ...data });
          });
          list.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
          setProjects(list);
        }
        setLoading(false);
      },
      (error) => {
        console.warn('Projects snapshot listener note:', error.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // Sync Inquiries (Admin only)
  useEffect(() => {
    if (!isAdmin) {
      setInquiries([]);
      return;
    }

    const inquiriesRef = collection(db, 'inquiries');
    const q = query(inquiriesRef, orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: Inquiry[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Inquiry);
        });
        setInquiries(list);
      },
      (error) => {
        console.warn('Inquiries snapshot listener note:', error.message);
      }
    );

    return () => unsub();
  }, [isAdmin]);

  // Image compressor before upload for speed and storage economy
  const compressImage = async (file: File, maxDim = 1920, quality = 0.85): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else resolve(file);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image for compression'));
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Convert blob to DataURL fallback if cloud storage is restricted
  const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  // Upload image to Firebase Storage or seamless base64 fallback
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const compressedBlob = await compressImage(file);
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const timestamp = Date.now();
      const storagePath = `portfolio/${timestamp}_${cleanFileName}`;
      
      try {
        const fileRef = ref(storage, storagePath);
        const snapshot = await uploadBytes(fileRef, compressedBlob, {
          contentType: 'image/jpeg',
        });
        const downloadUrl = await getDownloadURL(snapshot.ref);
        return downloadUrl;
      } catch (storageErr) {
        console.warn('Storage direct upload note, using embedded high-res data URL fallback:', storageErr);
        const dataUrl = await blobToDataUrl(compressedBlob);
        return dataUrl;
      }
    } catch (err) {
      console.error('Image compression or upload error:', err);
      throw err;
    }
  };

  // Upload to media items
  const uploadMediaItem = async (file: File): Promise<MediaItem> => {
    const url = await uploadImage(file);
    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      name: file.name,
      url,
      uploadedAt: new Date().toISOString(),
      size: file.size,
    };
    setMediaItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const deleteMediaItem = async (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
  };

  // Save Project (Add or Update)
  const saveProject = async (projectData: Partial<Project> & { id?: string }): Promise<string> => {
    const id = projectData.id || `proj-${Date.now()}`;
    const path = `projects/${id}`;
    const now = new Date().toISOString();

    const dataToSave: Project = {
      id,
      title: projectData.title || 'Untitled Artwork',
      description: projectData.description || '',
      category: projectData.category || '3D Character Sculptures',
      coverImage: projectData.coverImage || '/src/assets/images/meek_hero_sculpture_1794441974326.jpg',
      images: projectData.images && projectData.images.length > 0 ? projectData.images : [projectData.coverImage || ''],
      completionDate: projectData.completionDate || new Date().getFullYear().toString(),
      isFeatured: !!projectData.isFeatured,
      isPublished: projectData.isPublished !== undefined ? projectData.isPublished : true,
      order: projectData.order ?? (projects.length + 1),
      createdAt: projectData.createdAt || now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'projects', id), dataToSave);
      // Optimistic local update
      setProjects(prev => {
        const index = prev.findIndex(p => p.id === id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = dataToSave;
          return next;
        }
        return [dataToSave, ...prev];
      });
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Delete Project
  const deleteProject = async (id: string): Promise<void> => {
    const path = `projects/${id}`;
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  // Save Service
  const saveService = async (serviceData: Partial<Service> & { id?: string }): Promise<string> => {
    const id = serviceData.id || `srv-${Date.now()}`;
    const path = `services/${id}`;
    const now = new Date().toISOString();

    const dataToSave: Service = {
      id,
      name: serviceData.name || 'Custom Sculpture Service',
      description: serviceData.description || '',
      imageUrl: serviceData.imageUrl || '',
      startingPrice: serviceData.startingPrice || '',
      order: serviceData.order ?? (services.length + 1),
      createdAt: serviceData.createdAt || now,
      updatedAt: now,
    };

    try {
      await setDoc(doc(db, 'services', id), dataToSave);
      setServices(prev => {
        const index = prev.findIndex(s => s.id === id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = dataToSave;
          return next;
        }
        return [...prev, dataToSave];
      });
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Delete Service
  const deleteService = async (id: string): Promise<void> => {
    const path = `services/${id}`;
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  // Update Settings
  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<void> => {
    const path = 'settings/site_config';
    const merged = { ...settings, ...newSettings, updatedAt: new Date().toISOString() };
    try {
      await setDoc(doc(db, 'settings', 'site_config'), merged, { merge: true });
      setSettings(merged);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Submit Customer Inquiry
  const submitInquiry = async (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    const id = `inq-${Date.now()}`;
    const path = `inquiries/${id}`;
    const payload: Inquiry = {
      id,
      ...inquiryData,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'inquiries', id), payload);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  // Update Inquiry Status (Admin only)
  const updateInquiryStatus = async (id: string, status: Inquiry['status']): Promise<void> => {
    const path = `inquiries/${id}`;
    try {
      await updateDoc(doc(db, 'inquiries', id), { status });
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  // Delete Inquiry (Admin only)
  const deleteInquiry = async (id: string): Promise<void> => {
    const path = `inquiries/${id}`;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setInquiries(prev => prev.filter(inq => inq.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  // Admin function to populate initial defaults into Firestore
  const initializeDefaultsToFirestore = useCallback(async () => {
    try {
      // 1. Settings
      await setDoc(doc(db, 'settings', 'site_config'), {
        ...DEFAULT_SETTINGS,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // 2. Services
      for (const service of INITIAL_SERVICES) {
        await setDoc(doc(db, 'services', service.id), service, { merge: true });
      }

      // 3. Projects
      for (const project of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', project.id), project, { merge: true });
      }
    } catch (err) {
      console.error('Error seeding initial Firestore items:', err);
    }
  }, []);

  // Check if initial items need seeding when an admin is active
  useEffect(() => {
    if (isAdmin) {
      const checkAndSeed = async () => {
        try {
          const snap = await getDocs(collection(db, 'projects'));
          if (snap.empty) {
            await initializeDefaultsToFirestore();
          }
        } catch {
          // Ignore
        }
      };
      checkAndSeed();
    }
  }, [isAdmin, initializeDefaultsToFirestore]);

  return (
    <DataContext.Provider
      value={{
        projects,
        services,
        inquiries,
        settings,
        mediaItems,
        loading,
        saveProject,
        deleteProject,
        saveService,
        deleteService,
        updateSettings,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        uploadImage,
        uploadMediaItem,
        deleteMediaItem,
        initializeDefaultsToFirestore,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
