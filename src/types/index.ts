export type ProjectCategory = 
  | '3D Character Sculptures'
  | 'Custom Figures'
  | 'Collectible Art'
  | 'Display Sculptures'
  | 'Other Custom Projects';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory | string;
  coverImage: string;
  images: string[];
  completionDate?: string;
  isFeatured?: boolean;
  isPublished: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  startingPrice?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type InquiryStatus = 'New' | 'Contacted' | 'Completed';

export interface Inquiry {
  id: string;
  customerName: string;
  contactNumber: string;
  artworkType: string;
  description: string;
  referenceImage?: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface SiteSettings {
  businessName: string;
  headline: string;
  supportingText: string;
  bibleVerse: string;
  bibleReference: string;
  aboutTitle: string;
  aboutText: string;
  contactNumber: string;
  location: string;
  facebookUrl: string;
  updatedAt?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  size?: number;
}
