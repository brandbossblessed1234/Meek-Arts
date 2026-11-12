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

// Default initial data for MEEK Studio 3D Art
export const DEFAULT_SETTINGS: SiteSettings = {
  businessName: 'MEEK Studio 3D Art',
  headline: 'Envision. Build. Iconic.',
  supportingText: 'Custom 3D Art. Exceptional Craftsmanship. Extraordinary Details.',
  bibleVerse: 'Blessed are the meek: for they shall inherit the earth.',
  bibleReference: 'Matthew 5:5',
  aboutTitle: 'THE ART OF BRINGING IDEAS TO LIFE',
  aboutText: 'MEEK Studio 3D Art is a creative studio based in Iloilo City, specializing in unique 3D art, custom collectibles, character figures, and creative artwork. We transform ideas and imagination into tangible works of art through creativity, craftsmanship, and attention to detail.',
  contactNumber: '09385667572',
  location: 'Iloilo City, Philippines',
  facebookUrl: 'https://www.facebook.com/profile.php?id=100091903210785',
};

// 10 Real Finished 3D Artworks from Meek Studio
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'port-of-iloilo-anniversary-statues',
    title: 'Port of Iloilo 171st Founding Anniversary – Dinagyang Warrior Statues',
    description: "Official commemorative fine art bronze warrior sculptures commissioned for the Bureau of Customs Port of Iloilo's 171st Founding Anniversary. Features hyper-intricate feathered headdresses, authentic warrior shields, tribal beadwork, and custom engraved pedestal bases.",
    category: 'Collectible Art',
    coverImage: '/assets/aistudio/825278790_1025978370475594_8031018495389838943_n_238b4cc5.jpg',
    images: [
      '/assets/aistudio/825278790_1025978370475594_8031018495389838943_n_238b4cc5.jpg'
    ],
    completionDate: '2026',
    isFeatured: true,
    isPublished: true,
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'goku-ramen-chef-lifesize',
    title: 'Life-Size Goku Ramen Chef – Restaurant Centerpiece',
    description: 'Life-size custom 3D sculpture of Son Goku in his iconic orange gi serving a freshly sculpted bowl of Japanese ramen. Built with reinforced internal armature, vibrant anime paintwork, custom restaurant logo chest crest, and official brass Meek Studio 3D Art plaque on the base.',
    category: 'Display Sculptures',
    coverImage: '/assets/aistudio/772824235_983691351370963_7766864389843390485_n_1d1aa322.jpg',
    images: [
      '/assets/aistudio/772824235_983691351370963_7766864389843390485_n_1d1aa322.jpg'
    ],
    completionDate: '2026',
    isFeatured: true,
    isPublished: true,
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hulk-fighter-squad-monument',
    title: 'Colossal Incredible Hulk & Champion Fighter Ensemble',
    description: 'Monumental display sculpture featuring a massive, hyper-muscular Incredible Hulk flanked by Super Saiyan Blue Goku, Baki Hanma, and Akuma. Demonstrates multi-figure scale mastering, anatomical muscle sculpting, cloth tearing dynamics, and official studio branding standee.',
    category: '3D Character Sculptures',
    coverImage: '/assets/aistudio/729451843_942711932135572_5301652161774653015_n__1__95a57a76.jpg',
    images: [
      '/assets/aistudio/729451843_942711932135572_5301652161774653015_n__1__95a57a76.jpg',
      '/assets/aistudio/774712271_987100614363370_1298902464828953343_n_0eda4444.jpg'
    ],
    completionDate: '2026',
    isFeatured: true,
    isPublished: true,
    order: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'charizard-lifesize-workshop',
    title: 'Life-Scale Charizard Dragon Sculpture',
    description: 'Gigantic full-scale Charizard sculpted in the Meek Studio Iloilo workshop. Features expansive aerodynamic wings, open roaring jaws, high-gloss lacquer finish, and reinforced structural stability for commercial exhibition and theme installations.',
    category: 'Display Sculptures',
    coverImage: '/assets/aistudio/773167137_984629687943796_2392283727810284078_n_8d92f796.jpg',
    images: [
      '/assets/aistudio/773167137_984629687943796_2392283727810284078_n_8d92f796.jpg'
    ],
    completionDate: '2026',
    isFeatured: true,
    isPublished: true,
    order: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'islandvault-teemo-diorama',
    title: 'IslandVault.ph – Teemo Scout & Toxic Mushroom Diorama',
    description: 'Full commercial installation of League of Legends Teemo with brass telescope, avian scout companion, and vibrant spotted toxic mushrooms, permanently installed in IslandVault.ph trading card and collectible cafe in Iloilo.',
    category: 'Custom Figures',
    coverImage: '/assets/aistudio/856080635_1048606644879433_5252238733541754884_n_f530eec4.jpg',
    images: [
      '/assets/aistudio/856080635_1048606644879433_5252238733541754884_n_f530eec4.jpg'
    ],
    completionDate: '2026',
    isFeatured: true,
    isPublished: true,
    order: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'toothless-night-fury-sculpture',
    title: 'Toothless Night Fury – Matte Black Collectible Figurine',
    description: 'Intricately detailed custom 3D sculpture of baby Toothless featuring velvety matte black finish, individual scale textures, golden claws, articulated wings, and hyper-realistic glass-like iridescent emerald eyes.',
    category: 'Collectible Art',
    coverImage: '/assets/aistudio/758854701_973436335729798_6491782083984560811_n_7f1006c7.jpg',
    images: [
      '/assets/aistudio/758854701_973436335729798_6491782083984560811_n_7f1006c7.jpg'
    ],
    completionDate: '2026',
    isFeatured: false,
    isPublished: true,
    order: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'barista-goku-coffee-sculpture',
    title: 'Barista Goku – Custom Cafe Mascot Sculpture',
    description: 'Unique collectible sculpture depicting Goku as an artisanal barista wearing a leather apron with brass clasps, proudly offering a freshly poured cup of coffee topped with dynamic swirling smoke sculpture.',
    category: 'Custom Figures',
    coverImage: '/assets/aistudio/829555833_1029085393498225_1441179482039666599_n_669ad425.jpg',
    images: [
      '/assets/aistudio/829555833_1029085393498225_1441179482039666599_n_669ad425.jpg'
    ],
    completionDate: '2026',
    isFeatured: false,
    isPublished: true,
    order: 7,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'general-m-bison-crimson',
    title: 'General M. Bison – High-Fidelity Fighting Statue',
    description: 'Hyper-muscular Street Fighter villain statue in dynamic clutched-fist combat stance. Features deep crimson shading, flared military coat dynamics, metallic plated armor pauldrons, and menacing expression.',
    category: '3D Character Sculptures',
    coverImage: '/assets/aistudio/808414872_1013416491731782_6568560019846190914_n_22952165.jpg',
    images: [
      '/assets/aistudio/808414872_1013416491731782_6568560019846190914_n_22952165.jpg'
    ],
    completionDate: '2026',
    isFeatured: false,
    isPublished: true,
    order: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'chow-chow-dog-sculpture',
    title: 'Handcrafted Chow Chow Canine Sculpture',
    description: 'Bespoke pet portrait sculpture of a fluffy Chow Chow dog. Meticulously modeled fur layering, folds, expressive dark eyes, and warm chestnut airbrushed gradient finish on studio pedestal.',
    category: 'Personalized 3D Art',
    coverImage: '/assets/aistudio/795641522_1021115770961854_6727061878692991185_n_2315f772.jpg',
    images: [
      '/assets/aistudio/795641522_1021115770961854_6727061878692991185_n_2315f772.jpg'
    ],
    completionDate: '2026',
    isFeatured: false,
    isPublished: true,
    order: 9,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'incredible-hulk-solo-plinth',
    title: 'The Incredible Hulk – Solitary Gallery Edition',
    description: 'Standing full-figure study of the green behemoth on round exhibition plinth, showcasing anatomical vascularity, shredded purple denim texture, and gladiatorial hand-wrapped foot wraps.',
    category: 'Display Sculptures',
    coverImage: '/assets/aistudio/774712271_987100614363370_1298902464828953343_n_0eda4444.jpg',
    images: [
      '/assets/aistudio/774712271_987100614363370_1298902464828953343_n_0eda4444.jpg'
    ],
    completionDate: '2026',
    isFeatured: false,
    isPublished: true,
    order: 10,
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'custom-3d-sculptures',
    name: 'Custom 3D Sculptures',
    description: 'Life-size commercial display centerpieces, restaurant mascots, and monumental installations engineered with reinforced internal steel armatures.',
    imageUrl: '/assets/aistudio/772824235_983691351370963_7766864389843390485_n_1d1aa322.jpg',
    order: 1,
  },
  {
    id: 'character-figures',
    name: 'Character Figures',
    description: 'High-detail anime, gaming, comic, and pop culture figures featuring complex muscle anatomy, flowing apparel, and vibrant studio-grade airbrushing.',
    imageUrl: '/assets/aistudio/729451843_942711932135572_5301652161774653015_n__1__95a57a76.jpg',
    order: 2,
  },
  {
    id: 'collectible-figures',
    name: 'Collectible Figures',
    description: 'Limited edition art pieces, commemorative historical warrior trophies, and museum-grade bronze statues crafted for organizations and private collectors.',
    imageUrl: '/assets/aistudio/825278790_1025978370475594_8031018495389838943_n_238b4cc5.jpg',
    order: 3,
  },
  {
    id: 'personalized-3d-art',
    name: 'Personalized 3D Art',
    description: 'Custom pet memorials, lifelike animal sculptures, personal portrait busts, and unique gifts sculpted directly from your photographs.',
    imageUrl: '/assets/aistudio/795641522_1021115770961854_6727061878692991185_n_2315f772.jpg',
    order: 4,
  },
  {
    id: 'custom-art-projects',
    name: 'Commercial Displays & Props',
    description: 'Large theme park dragons, retail store mascots, cafe dioramas, and specialized props customized for brands and entertainment venues.',
    imageUrl: '/assets/aistudio/773167137_984629687943796_2392283727810284078_n_8d92f796.jpg',
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
  
  // Media items populated with the real 10 Meek Studio photographs
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: 'media-1',
      name: 'Port_of_Iloilo_Warrior_Anniversary_Statues.jpg',
      url: '/assets/aistudio/825278790_1025978370475594_8031018495389838943_n_238b4cc5.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-2',
      name: 'Goku_LifeSize_Ramen_Chef_Centerpiece.jpg',
      url: '/assets/aistudio/772824235_983691351370963_7766864389843390485_n_1d1aa322.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-3',
      name: 'Colossal_Hulk_Martial_Artists_Ensemble.jpg',
      url: '/assets/aistudio/729451843_942711932135572_5301652161774653015_n__1__95a57a76.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-4',
      name: 'Charizard_LifeScale_Dragon_Sculpture.jpg',
      url: '/assets/aistudio/773167137_984629687943796_2392283727810284078_n_8d92f796.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-5',
      name: 'IslandVault_Teemo_Scout_Mushroom_Diorama.jpg',
      url: '/assets/aistudio/856080635_1048606644879433_5252238733541754884_n_f530eec4.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-6',
      name: 'Toothless_Night_Fury_Matte_Black_Sculpture.jpg',
      url: '/assets/aistudio/758854701_973436335729798_6491782083984560811_n_7f1006c7.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-7',
      name: 'Barista_Goku_Coffee_Cup_Sculpture.jpg',
      url: '/assets/aistudio/829555833_1029085393498225_1441179482039666599_n_669ad425.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-8',
      name: 'General_M_Bison_Street_Fighter_Statue.jpg',
      url: '/assets/aistudio/808414872_1013416491731782_6568560019846190914_n_22952165.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-9',
      name: 'Chow_Chow_Dog_Custom_Pet_Sculpture.jpg',
      url: '/assets/aistudio/795641522_1021115770961854_6727061878692991185_n_2315f772.jpg',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: 'media-10',
      name: 'Incredible_Hulk_Solo_Pedestal_Exhibition.jpg',
      url: '/assets/aistudio/774712271_987100614363370_1298902464828953343_n_0eda4444.jpg',
      uploadedAt: new Date().toISOString(),
    }
  ]);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync Settings from Firestore
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

  // Sync Services from Firestore
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

  // Sync Projects from Firestore
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

  const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

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

  const saveProject = async (projectData: Partial<Project> & { id?: string }): Promise<string> => {
    const id = projectData.id || `proj-${Date.now()}`;
    const path = `projects/${id}`;
    const now = new Date().toISOString();

    const dataToSave: Project = {
      id,
      title: projectData.title || 'Untitled Artwork',
      description: projectData.description || '',
      category: projectData.category || '3D Character Sculptures',
      coverImage: projectData.coverImage || '/assets/aistudio/825278790_1025978370475594_8031018495389838943_n_238b4cc5.jpg',
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

  const deleteProject = async (id: string): Promise<void> => {
    const path = `projects/${id}`;
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

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

  const deleteService = async (id: string): Promise<void> => {
    const path = `services/${id}`;
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

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

  const updateInquiryStatus = async (id: string, status: Inquiry['status']): Promise<void> => {
    const path = `inquiries/${id}`;
    try {
      await updateDoc(doc(db, 'inquiries', id), { status });
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteInquiry = async (id: string): Promise<void> => {
    const path = `inquiries/${id}`;
    try {
      await deleteDoc(doc(db, 'inquiries', id));
      setInquiries(prev => prev.filter(inq => inq.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const initializeDefaultsToFirestore = useCallback(async () => {
    try {
      await setDoc(doc(db, 'settings', 'site_config'), {
        ...DEFAULT_SETTINGS,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      for (const service of INITIAL_SERVICES) {
        await setDoc(doc(db, 'services', service.id), service, { merge: true });
      }

      for (const project of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', project.id), project, { merge: true });
      }
    } catch (err) {
      console.error('Error seeding initial Firestore items:', err);
    }
  }, []);

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
