import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Project, Service, Inquiry, SiteSettings } from '../../types';
import { 
  LayoutDashboard, 
  Layers, 
  Wrench, 
  FileText, 
  Inbox, 
  Image as ImageIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  CheckCircle, 
  Clock, 
  ArrowLeft, 
  Star, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck, 
  Save, 
  Database,
  ExternalLink,
  Phone,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

type TabType = 'overview' | 'portfolio' | 'services' | 'content' | 'inquiries' | 'media';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  const { user, isAdmin, loginWithGoogle, loginWithEmail, signUpAdmin, logout, loading: authLoading, error: authError } = useAuth();
  const { 
    projects, 
    services, 
    inquiries, 
    settings, 
    mediaItems, 
    saveProject, 
    deleteProject, 
    saveService, 
    deleteService, 
    updateSettings, 
    updateInquiryStatus, 
    deleteInquiry, 
    uploadImage, 
    uploadMediaItem, 
    deleteMediaItem,
    initializeDefaultsToFirestore 
  } = useData();

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Login form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Project Editor state
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectCategory, setProjectCategory] = useState('3D Character Sculptures');
  const [projectCompletionDate, setProjectCompletionDate] = useState(new Date().getFullYear().toString());
  const [projectCoverImage, setProjectCoverImage] = useState('');
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [projectIsFeatured, setProjectIsFeatured] = useState(false);
  const [projectIsPublished, setProjectIsPublished] = useState(true);
  const [projectSaving, setProjectSaving] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [uploadingProjectImages, setUploadingProjectImages] = useState(false);

  // Delete Project Confirmation Modal
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Service Editor state
  const [isEditingService, setIsEditingService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceImage, setServiceImage] = useState('');
  const [serviceStartingPrice, setServiceStartingPrice] = useState('');
  const [serviceSaving, setServiceSaving] = useState(false);

  // Content Settings state
  const [contentForm, setContentForm] = useState<SiteSettings>(settings);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentSavedSuccess, setContentSavedSuccess] = useState(false);

  // Seeding status
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [seedingSuccess, setSeedingSuccess] = useState(false);

  // Sync content form with current settings
  React.useEffect(() => {
    setContentForm(settings);
  }, [settings]);

  // Auth Submit Handlers
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      if (isRegisterMode) {
        await signUpAdmin(emailInput.trim(), passwordInput);
      } else {
        await loginWithEmail(emailInput.trim(), passwordInput);
      }
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoginError(null);
    setLoginLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Google authentication failed');
    } finally {
      setLoginLoading(false);
    }
  };

  // Open Project Editor
  const openNewProject = () => {
    setEditingProjectId(null);
    setProjectTitle('');
    setProjectDesc('');
    setProjectCategory('3D Character Sculptures');
    setProjectCompletionDate(new Date().getFullYear().toString());
    setProjectCoverImage('/src/assets/images/meek_hero_sculpture_1794441974326.jpg');
    setProjectImages(['/src/assets/images/meek_hero_sculpture_1794441974326.jpg']);
    setProjectIsFeatured(false);
    setProjectIsPublished(true);
    setIsEditingProject(true);
    setProjectError(null);
  };

  const openEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setProjectTitle(p.title);
    setProjectDesc(p.description);
    setProjectCategory(p.category);
    setProjectCompletionDate(p.completionDate || '');
    setProjectCoverImage(p.coverImage);
    setProjectImages(p.images && p.images.length > 0 ? p.images : [p.coverImage]);
    setProjectIsFeatured(!!p.isFeatured);
    setProjectIsPublished(p.isPublished);
    setIsEditingProject(true);
    setProjectError(null);
  };

  // Upload multiple images for project
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingProjectImages(true);
    const files = Array.from(e.target.files);
    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }
      setProjectImages(prev => [...prev, ...uploadedUrls]);
      if (!projectCoverImage && uploadedUrls.length > 0) {
        setProjectCoverImage(uploadedUrls[0]);
      }
    } catch (err) {
      console.error('Failed uploading multiple images:', err);
      setProjectError('Some images could not be uploaded. Please try again.');
    } finally {
      setUploadingProjectImages(false);
    }
  };

  const removeProjectImage = (indexToRemove: number) => {
    const nextImages = projectImages.filter((_, idx) => idx !== indexToRemove);
    setProjectImages(nextImages);
    if (projectCoverImage === projectImages[indexToRemove]) {
      setProjectCoverImage(nextImages[0] || '');
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDesc.trim()) {
      setProjectError('Please provide a title and description.');
      return;
    }
    if (projectImages.length === 0) {
      setProjectError('Please add at least one photograph for this project.');
      return;
    }

    setProjectSaving(true);
    setProjectError(null);
    try {
      const cover = projectCoverImage || projectImages[0];
      await saveProject({
        id: editingProjectId || undefined,
        title: projectTitle.trim(),
        description: projectDesc.trim(),
        category: projectCategory,
        completionDate: projectCompletionDate.trim() || undefined,
        coverImage: cover,
        images: projectImages,
        isFeatured: projectIsFeatured,
        isPublished: projectIsPublished,
      });
      setIsEditingProject(false);
    } catch (err: unknown) {
      setProjectError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setProjectSaving(false);
    }
  };

  // Delete project confirmed
  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  // Service Handlers
  const openNewService = () => {
    setEditingServiceId(null);
    setServiceName('');
    setServiceDesc('');
    setServiceImage('');
    setServiceStartingPrice('');
    setIsEditingService(true);
  };

  const openEditService = (s: Service) => {
    setEditingServiceId(s.id);
    setServiceName(s.name);
    setServiceDesc(s.description);
    setServiceImage(s.imageUrl || '');
    setServiceStartingPrice(s.startingPrice || '');
    setIsEditingService(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !serviceDesc.trim()) return;
    setServiceSaving(true);
    try {
      await saveService({
        id: editingServiceId || undefined,
        name: serviceName.trim(),
        description: serviceDesc.trim(),
        imageUrl: serviceImage.trim() || undefined,
        startingPrice: serviceStartingPrice.trim() || undefined,
      });
      setIsEditingService(false);
    } catch (err) {
      console.error('Failed to save service:', err);
    } finally {
      setServiceSaving(false);
    }
  };

  // Content Settings Save
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentSaving(true);
    setContentSavedSuccess(false);
    try {
      await updateSettings(contentForm);
      setContentSavedSuccess(true);
      setTimeout(() => setContentSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save content settings:', err);
    } finally {
      setContentSaving(false);
    }
  };

  // Seed Initial Firestore Data
  const handleSeedDefaults = async () => {
    setSeedingLoading(true);
    setSeedingSuccess(false);
    try {
      await initializeDefaultsToFirestore();
      setSeedingSuccess(true);
      setTimeout(() => setSeedingSuccess(false), 3000);
    } catch (err) {
      console.error('Error seeding defaults:', err);
    } finally {
      setSeedingLoading(false);
    }
  };

  // Total uploaded photos count
  const totalPhotosCount = projects.reduce((acc, p) => acc + (p.images ? p.images.length : 1), 0) + mediaItems.length;

  // Unauthenticated or Non-Admin Screen
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 sm:p-6 text-neutral-100">
        
        {/* Top return bar */}
        <div className="absolute top-6 left-6">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </button>
        </div>

        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 block">
              Meek Studio 3D Art
            </span>
            <h1 className="font-heading text-xl font-bold uppercase tracking-wide text-neutral-100">
              Studio Owner Portal
            </h1>
            <p className="text-xs text-neutral-400">
              Sign in with your authorized studio account to manage portfolio artwork, services, and inquiries.
            </p>
          </div>

          {(loginError || authError) && (
            <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs text-left">
              {loginError || authError}
            </div>
          )}

          {user && !isAdmin && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs text-left space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Signed In: {user.email}</span>
              </div>
              <p className="text-neutral-300">
                This account is not yet authorized as an administrator. The primary administrator email is <span className="font-mono text-amber-300">valpeterjames@gmail.com</span>.
              </p>
              <button
                onClick={logout}
                className="mt-2 text-xs text-amber-400 underline hover:text-amber-300"
              >
                Sign out & switch account
              </button>
            </div>
          )}

          {/* Google Sign In (Recommended) */}
          <button
            onClick={handleGoogleAuth}
            disabled={loginLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-neutral-950 border border-neutral-700 hover:border-amber-400 text-neutral-200 font-medium text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-colors shadow"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <span className="h-[1px] w-full bg-neutral-800" />
            <span className="px-3 bg-neutral-900 text-[10px] uppercase tracking-widest text-neutral-500">
              Or email login
            </span>
            <span className="h-[1px] w-full bg-neutral-800" />
          </div>

          {/* Email / Password fallback */}
          <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="valpeterjames@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 text-xs font-bold uppercase tracking-wider text-neutral-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 rounded-lg hover:from-amber-200 hover:to-amber-400 transition-all flex items-center justify-center gap-2"
            >
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{isRegisterMode ? 'Register Admin Account' : 'Sign In as Owner'}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-[11px] text-neutral-400 hover:text-amber-400"
              >
                {isRegisterMode 
                  ? 'Already have an admin account? Sign In' 
                  : 'First time setup? Register Initial Admin Account'}
              </button>
            </div>
          </form>

        </div>

      </div>
    );
  }

  // Authenticated Admin Dashboard Interface
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 bg-neutral-900 border-b border-neutral-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToSite}
            className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-800 transition-colors"
            title="View Live Public Website"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <h1 className="font-heading text-sm sm:text-base font-bold uppercase text-neutral-100 tracking-wider flex items-center gap-2">
              <span>MEEK STUDIO</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono">
                ADMIN
              </span>
            </h1>
            <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">
              Logged in: {user.email}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToSite}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 hover:border-amber-500 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-amber-300 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>View Live Site</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-rose-950/40 border border-neutral-800 hover:border-rose-500 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar Navigation */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-neutral-900/70 border-b md:border-b-0 md:border-r border-neutral-800 p-3 sm:p-4 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
            
            <button
              onClick={() => { setActiveTab('overview'); setIsEditingProject(false); }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 text-left ${
                activeTab === 'overview'
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('portfolio'); setIsEditingProject(false); }}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 text-left ${
                activeTab === 'portfolio'
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Portfolio</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('services'); setIsEditingService(false); }}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 text-left ${
                activeTab === 'services'
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>Services</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400">
                {services.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 text-left ${
                activeTab === 'content'
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Website Content</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 text-left ${
                activeTab === 'inquiries'
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4 text-amber-400" />
                <span>Inquiries</span>
              </div>
              {inquiries.filter(i => i.status === 'New').length > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500 text-neutral-950 font-bold">
                  {inquiries.filter(i => i.status === 'New').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 text-left ${
                activeTab === 'media'
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Media Library</span>
            </button>

          </nav>
        </aside>

        {/* Tab Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* TAB A: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="font-heading text-2xl font-bold uppercase text-neutral-100">
                  Studio Dashboard Overview
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Live metrics for Meek Studio 3D Art web operations and client engagement.
                </p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                    <span>Published Projects</span>
                    <Layers className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-heading font-black text-neutral-100 font-mono">
                      {projects.filter(p => p.isPublished).length}
                    </span>
                    <span className="text-xs text-neutral-500 ml-2">/ {projects.length} total</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                    <span>Uploaded Artwork Photos</span>
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-heading font-black text-neutral-100 font-mono">
                      {totalPhotosCount}
                    </span>
                    <span className="text-xs text-neutral-500 ml-2">in storage</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                    <span>Total Inquiries</span>
                    <Inbox className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-heading font-black text-neutral-100 font-mono">
                      {inquiries.length}
                    </span>
                    <span className="text-xs text-amber-400 ml-2">
                      ({inquiries.filter(i => i.status === 'New').length} new)
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-neutral-400 text-xs uppercase tracking-wider font-semibold">
                    <span>Active Services</span>
                    <Wrench className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-heading font-black text-neutral-100 font-mono">
                      {services.length}
                    </span>
                    <span className="text-xs text-neutral-500 ml-2">offerings</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Seeding Utility */}
              <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading text-sm font-bold uppercase text-neutral-200">
                    Database Synchronization Status
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Firestore connected to database: <span className="font-mono text-amber-400">ai-studio-meekstudio3dart</span>.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleSeedDefaults}
                    disabled={seedingLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold uppercase tracking-wider text-neutral-200 border border-neutral-700 transition-colors"
                  >
                    {seedingLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> : <Database className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{seedingSuccess ? 'Defaults Seeded!' : 'Seed Initial Studio Content'}</span>
                  </button>

                  <button
                    onClick={openNewProject}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-950 text-xs font-bold uppercase tracking-wider hover:from-amber-200 hover:to-amber-400 transition-all shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload New Artwork</span>
                  </button>
                </div>
              </div>

              {/* Recent Inquiries Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold uppercase text-neutral-200">
                    Recent Customer Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-amber-400 hover:underline uppercase tracking-wider font-semibold"
                  >
                    View All ({inquiries.length})
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-center text-xs text-neutral-400">
                    No inquiries received yet. Customer submissions from the public website will appear here in real time.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.slice(0, 3).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-sm text-neutral-100">{inq.customerName}</span>
                            <span className="text-xs text-amber-400 font-mono">{inq.contactNumber}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              inq.status === 'New' ? 'bg-amber-500 text-neutral-950' : 
                              inq.status === 'Contacted' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 
                              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 line-clamp-1">
                            [{inq.artworkType}] {inq.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`tel:${inq.contactNumber.replace(/[^0-9]/g, '')}`}
                            className="px-3 py-1 rounded bg-neutral-950 border border-neutral-800 hover:border-amber-400 text-xs text-neutral-300 hover:text-amber-400 flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-amber-400" />
                            <span>Call</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB B: PORTFOLIO MANAGEMENT */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 max-w-6xl">
              
              {!isEditingProject ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                    <div>
                      <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase text-neutral-100">
                        Portfolio Management
                      </h2>
                      <p className="text-xs text-neutral-400 mt-1">
                        Add, edit, reorder, feature, and manage multi-photo 3D artwork projects. Newly published projects appear on the public site immediately.
                      </p>
                    </div>

                    <button
                      onClick={openNewProject}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-950 text-xs font-bold uppercase tracking-wider hover:from-amber-200 hover:to-amber-400 transition-all shadow shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Artwork Project</span>
                    </button>
                  </div>

                  {/* Projects List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative aspect-[16/10] bg-neutral-950">
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 flex gap-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              project.isPublished ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                            }`}>
                              {project.isPublished ? 'Published' : 'Draft'}
                            </span>
                            {project.isFeatured && (
                              <span className="px-2 py-0.5 rounded bg-amber-500 text-neutral-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-neutral-950/80 text-[10px] font-mono text-neutral-300">
                            {project.images?.length || 1} photos
                          </span>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                              {project.category}
                            </span>
                            <h3 className="font-heading text-base font-bold text-neutral-100 mt-1 line-clamp-1">
                              {project.title}
                            </h3>
                            <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                              {project.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditProject(project)}
                                className="p-2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => setProjectToDelete(project)}
                                className="p-2 rounded bg-neutral-950 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 transition-colors"
                                title="Delete Project"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={async () => {
                                await saveProject({
                                  ...project,
                                  isPublished: !project.isPublished,
                                });
                              }}
                              className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
                              title={project.isPublished ? 'Unpublish' : 'Publish'}
                            >
                              {project.isPublished ? (
                                <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                              ) : (
                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Project Editor Form */
                <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                    <div>
                      <h3 className="font-heading text-lg font-bold uppercase text-neutral-100">
                        {editingProjectId ? 'Edit Artwork Project' : 'Add New 3D Artwork Project'}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Upload real photographs, select cover image, and set project visibility.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingProject(false)}
                      className="text-xs text-neutral-400 hover:text-neutral-200"
                    >
                      Cancel & Return
                    </button>
                  </div>

                  {projectError && (
                    <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs">
                      {projectError}
                    </div>
                  )}

                  <form onSubmit={handleSaveProject} className="space-y-6">
                    
                    {/* Title & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                          Project Title <span className="text-amber-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={projectTitle}
                          onChange={(e) => setProjectTitle(e.target.value)}
                          placeholder="e.g. Mythos Wyrm – Metallic Gold Edition"
                          className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                          Category <span className="text-amber-500">*</span>
                        </label>
                        <select
                          value={projectCategory}
                          onChange={(e) => setProjectCategory(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
                        >
                          <option value="3D Character Sculptures">3D Character Sculptures</option>
                          <option value="Custom Figures">Custom Figures</option>
                          <option value="Collectible Art">Collectible Art</option>
                          <option value="Display Sculptures">Display Sculptures</option>
                          <option value="Other Custom Projects">Other Custom Projects</option>
                        </select>
                      </div>
                    </div>

                    {/* Completion Date */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Completion Date or Year (Optional)
                      </label>
                      <input
                        type="text"
                        value={projectCompletionDate}
                        onChange={(e) => setProjectCompletionDate(e.target.value)}
                        placeholder="e.g. 2026 or Spring 2026"
                        className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Artwork Description & Specifications <span className="text-amber-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        placeholder="Describe the 3D sculpting technique, armor detailing, paints/gilding used, scale/height, and plinth presentation..."
                        className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400 leading-relaxed"
                      />
                    </div>

                    {/* Multiple Photos Upload Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                          Artwork Photographs ({projectImages.length}) <span className="text-amber-500">*</span>
                        </label>
                        <span className="text-[11px] text-neutral-400">
                          Click star to set as main cover photo
                        </span>
                      </div>

                      {/* Photo Grid Preview */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {projectImages.map((img, idx) => (
                          <div
                            key={idx}
                            className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 bg-neutral-950 group ${
                              img === projectCoverImage ? 'border-amber-400' : 'border-neutral-800'
                            }`}
                          >
                            <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                            
                            {/* Star Cover Button */}
                            <button
                              type="button"
                              onClick={() => setProjectCoverImage(img)}
                              title="Set as Cover Image"
                              className={`absolute top-2 left-2 p-1.5 rounded-md ${
                                img === projectCoverImage ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-neutral-900/80 text-neutral-400 hover:text-amber-400'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </button>

                            {/* Remove photo */}
                            <button
                              type="button"
                              onClick={() => removeProjectImage(idx)}
                              title="Remove photo"
                              className="absolute top-2 right-2 p-1.5 rounded-md bg-neutral-900/80 hover:bg-rose-900/80 text-neutral-400 hover:text-rose-200 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {/* Upload Trigger Card */}
                        <label className="flex flex-col items-center justify-center aspect-[4/3] rounded-xl border border-dashed border-neutral-700 hover:border-amber-400 bg-neutral-950/60 cursor-pointer text-center p-4 transition-colors group">
                          {uploadingProjectImages ? (
                            <Loader2 className="w-6 h-6 text-amber-400 animate-spin mb-2" />
                          ) : (
                            <Upload className="w-6 h-6 text-neutral-500 group-hover:text-amber-400 mb-2 transition-colors" />
                          )}
                          <span className="text-xs text-neutral-300 font-semibold uppercase tracking-wider">
                            Upload Photos
                          </span>
                          <span className="text-[10px] text-neutral-500 mt-1">
                            Select multiple from mobile or PC
                          </span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleMultipleImageUpload}
                            className="hidden"
                            disabled={uploadingProjectImages}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Visibility & Featured toggles */}
                    <div className="pt-4 border-t border-neutral-800 flex flex-wrap gap-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={projectIsPublished}
                          onChange={(e) => setProjectIsPublished(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-neutral-950 border-neutral-700"
                        />
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                          Publish to public website
                        </span>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={projectIsFeatured}
                          onChange={(e) => setProjectIsFeatured(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-neutral-950 border-neutral-700"
                        />
                        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                          Feature in hero & top spotlights
                        </span>
                      </label>
                    </div>

                    {/* Submit & Cancel */}
                    <div className="pt-4 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditingProject(false)}
                        className="px-5 py-2.5 rounded-lg border border-neutral-700 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-200"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={projectSaving || uploadingProjectImages}
                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-950 text-xs font-bold uppercase tracking-wider hover:from-amber-200 hover:to-amber-400 transition-all flex items-center gap-2"
                      >
                        {projectSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Save Project</span>
                      </button>
                    </div>

                  </form>

                </div>
              )}

            </div>
          )}

          {/* TAB C: SERVICES MANAGEMENT */}
          {activeTab === 'services' && (
            <div className="space-y-6 max-w-6xl">
              
              {!isEditingService ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                    <div>
                      <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase text-neutral-100">
                        Services Management
                      </h2>
                      <p className="text-xs text-neutral-400 mt-1">
                        Configure customized 3D art offerings, descriptions, photographs, and optional starting prices.
                      </p>
                    </div>

                    <button
                      onClick={openNewService}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-950 text-xs font-bold uppercase tracking-wider hover:from-amber-200 hover:to-amber-400 transition-all shadow shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, idx) => (
                      <div
                        key={service.id}
                        className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-3">
                          {service.imageUrl && (
                            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
                              <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-amber-400 font-bold">
                              {(idx + 1).toString().padStart(2, '0')}.
                            </span>
                            {service.startingPrice && (
                              <span className="text-xs text-amber-300 font-mono bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                                {service.startingPrice}
                              </span>
                            )}
                          </div>
                          <h3 className="font-heading text-base font-bold uppercase text-neutral-100">
                            {service.name}
                          </h3>
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                          <button
                            onClick={() => openEditService(service)}
                            className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 font-semibold flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => deleteService(service.id)}
                            className="p-1.5 rounded text-neutral-400 hover:text-rose-400 transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Service Editor Form */
                <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                    <h3 className="font-heading text-lg font-bold uppercase text-neutral-100">
                      {editingServiceId ? 'Edit Service' : 'Add New Service'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingService(false)}
                      className="text-xs text-neutral-400 hover:text-neutral-200"
                    >
                      Cancel & Return
                    </button>
                  </div>

                  <form onSubmit={handleSaveService} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Service Name <span className="text-amber-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="e.g. Custom 3D Character Sculptures"
                        className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                        Description <span className="text-amber-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={serviceDesc}
                        onChange={(e) => setServiceDesc(e.target.value)}
                        placeholder="Describe what is included in this service, detailing capabilities, materials, and turnaround..."
                        className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                          Starting Price (Optional)
                        </label>
                        <input
                          type="text"
                          value={serviceStartingPrice}
                          onChange={(e) => setServiceStartingPrice(e.target.value)}
                          placeholder="e.g. ₱3,500 or Inquire for Quote"
                          className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                          Service Sample Photo
                        </label>
                        <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-400 cursor-pointer text-xs text-neutral-300">
                          <Upload className="w-4 h-4 text-amber-500" />
                          <span>Upload Service Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              if (e.target.files && e.target.files[0]) {
                                const url = await uploadImage(e.target.files[0]);
                                setServiceImage(url);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        {serviceImage && (
                          <div className="mt-2 text-[10px] text-amber-400 truncate max-w-xs">
                            Image attached
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditingService(false)}
                        className="px-4 py-2 rounded-lg border border-neutral-700 text-xs font-semibold uppercase tracking-wider text-neutral-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={serviceSaving}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-950 text-xs font-bold uppercase tracking-wider"
                      >
                        {serviceSaving ? 'Saving...' : 'Save Service'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* TAB D: WEBSITE CONTENT MANAGEMENT */}
          {activeTab === 'content' && (
            <div className="space-y-6 max-w-4xl">
              <div className="pb-4 border-b border-neutral-800">
                <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase text-neutral-100">
                  Website Content Management
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Edit all public text, business credentials, Bible verse, and contact information. Updates are saved to Cloud Firestore and instantly update the public website.
                </p>
              </div>

              {contentSavedSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Website content updated successfully and published live!</span>
                </div>
              )}

              <form onSubmit={handleSaveContent} className="space-y-6 p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800">
                
                {/* Business Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={contentForm.businessName}
                      onChange={(e) => setContentForm({ ...contentForm, businessName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400 font-heading"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={contentForm.location}
                      onChange={(e) => setContentForm({ ...contentForm, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Hero Headline & Supporting Text */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={contentForm.headline}
                    onChange={(e) => setContentForm({ ...contentForm, headline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400 font-heading"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    Hero Supporting Text
                  </label>
                  <input
                    type="text"
                    value={contentForm.supportingText}
                    onChange={(e) => setContentForm({ ...contentForm, supportingText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Bible Verse */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Inspirational Bible Verse
                    </label>
                    <input
                      type="text"
                      value={contentForm.bibleVerse}
                      onChange={(e) => setContentForm({ ...contentForm, bibleVerse: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400 font-serif italic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Reference
                    </label>
                    <input
                      type="text"
                      value={contentForm.bibleReference}
                      onChange={(e) => setContentForm({ ...contentForm, bibleReference: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400 font-semibold"
                    />
                  </div>
                </div>

                {/* About Section */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    About Section Title
                  </label>
                  <input
                    type="text"
                    value={contentForm.aboutTitle}
                    onChange={(e) => setContentForm({ ...contentForm, aboutTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400 font-heading"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                    About Studio Text
                  </label>
                  <textarea
                    rows={4}
                    value={contentForm.aboutText}
                    onChange={(e) => setContentForm({ ...contentForm, aboutText: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>

                {/* Contacts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Contact Phone / Mobile Number
                    </label>
                    <input
                      type="text"
                      value={contentForm.contactNumber}
                      onChange={(e) => setContentForm({ ...contentForm, contactNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Facebook Page URL
                    </label>
                    <input
                      type="url"
                      value={contentForm.facebookUrl}
                      onChange={(e) => setContentForm({ ...contentForm, facebookUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={contentSaving}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-950 text-xs font-bold uppercase tracking-wider hover:from-amber-200 hover:to-amber-400 transition-all flex items-center gap-2 shadow"
                  >
                    {contentSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Website Content to Database</span>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB E: INQUIRY MANAGEMENT */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6 max-w-6xl">
              <div className="pb-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase text-neutral-100">
                    Customer Inquiries
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage commission requests submitted through the public website. Customer PII is protected in Cloud Firestore.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <span>Total: {inquiries.length}</span>
                  <span>·</span>
                  <span className="text-amber-400">{inquiries.filter(i => i.status === 'New').length} pending review</span>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-2">
                  <Inbox className="w-10 h-10 text-neutral-600 mx-auto" />
                  <h3 className="font-heading text-base font-bold uppercase text-neutral-300">
                    No Customer Inquiries Yet
                  </h3>
                  <p className="text-xs text-neutral-500">
                    When visitors submit custom artwork requests on the public website, they will appear here with contact numbers and reference photos.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-neutral-800">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-heading text-base font-bold text-neutral-100">
                              {inquiry.customerName}
                            </h3>
                            <a
                              href={`tel:${inquiry.contactNumber.replace(/[^0-9]/g, '')}`}
                              className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{inquiry.contactNumber}</span>
                            </a>
                          </div>
                          <span className="text-[11px] text-neutral-400">
                            Artwork: <strong className="text-neutral-200">{inquiry.artworkType}</strong> · Received: {new Date(inquiry.createdAt).toLocaleString()}
                          </span>
                        </div>

                        {/* Status Switcher */}
                        <div className="flex items-center gap-2">
                          {(['New', 'Contacted', 'Completed'] as const).map((status) => (
                            <button
                              key={status}
                              onClick={() => updateInquiryStatus(inquiry.id, status)}
                              className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                                inquiry.status === status
                                  ? status === 'New' ? 'bg-amber-500 text-neutral-950' : 
                                    status === 'Contacted' ? 'bg-blue-500 text-neutral-950' : 
                                    'bg-emerald-500 text-neutral-950'
                                  : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                              }`}
                            >
                              {status}
                            </button>
                          ))}

                          <button
                            onClick={() => deleteInquiry(inquiry.id)}
                            className="p-1.5 rounded text-neutral-500 hover:text-rose-400 transition-colors ml-2"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Description & Reference Image */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                        <div className="md:col-span-9 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light whitespace-pre-line bg-neutral-950 p-4 rounded-xl border border-neutral-800/80">
                          {inquiry.description}
                        </div>

                        {inquiry.referenceImage && (
                          <div className="md:col-span-3">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block mb-1">
                              Reference Photo
                            </span>
                            <a
                              href={inquiry.referenceImage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block aspect-[4/3] rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 group relative"
                            >
                              <img
                                src={inquiry.referenceImage}
                                alt="Reference"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs">
                                <ExternalLink className="w-4 h-4" />
                              </div>
                            </a>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB F: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6 max-w-6xl">
              <div className="pb-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase text-neutral-100">
                    Studio Media Library
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Manage studio sculpture photos, workshop shots, and image assets.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-neutral-950 text-xs font-bold uppercase tracking-wider hover:from-amber-200 hover:to-amber-400 transition-all shadow cursor-pointer shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image to Library</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        await uploadMediaItem(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {mediaItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col justify-between group"
                  >
                    <div className="aspect-square bg-neutral-950 overflow-hidden relative">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={() => deleteMediaItem(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-neutral-950/80 hover:bg-rose-900 text-neutral-400 hover:text-white transition-colors"
                        title="Delete from Library"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-3 bg-neutral-950 border-t border-neutral-850">
                      <p className="text-xs text-neutral-300 truncate font-mono">
                        {item.name}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.url);
                          alert('Image URL copied to clipboard');
                        }}
                        className="mt-2 text-[10px] text-amber-400 hover:underline uppercase tracking-wider block"
                      >
                        Copy Image URL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Delete Project Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading text-lg font-bold uppercase text-neutral-100">
              Confirm Project Deletion
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to delete <strong className="text-neutral-100">{projectToDelete.title}</strong>? This artwork will be removed from your portfolio and database.
            </p>
            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-lg border border-neutral-700 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProject}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
