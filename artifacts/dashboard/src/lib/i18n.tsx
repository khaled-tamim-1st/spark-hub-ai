import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en';

export interface Translations {
  // Brand
  brandName: string;
  brandTagline: string;
  
  // Navigation Sections
  navOperations: string;
  navCrm: string;
  navIntelligence: string;
  navPlatform: string;

  // Nav Items
  navDashboard: string;
  navInbox: string;
  navContacts: string;
  navDeals: string;
  navCompanies: string;
  navKnowledgeBase: string;
  navAiSettings: string;
  navAnalytics: string;
  navIntegrations: string;
  navTeam: string;
  navSettings: string;
  navWorkspaces: string;
  navSuperAdmin: string;

  // Common UI
  save: string;
  saving: string;
  savedSuccessfully: string;
  cancel: string;
  delete: string;
  deletedSuccessfully: string;
  edit: string;
  create: string;
  search: string;
  filter: string;
  all: string;
  loading: string;
  logout: string;
  back: string;
  actions: string;
  status: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  active: string;
  inactive: string;
  viewAll: string;
  noData: string;

  // Settings Page
  settingsTitle: string;
  settingsSubtitle: string;
  languageAndTheme: string;
  languageLabel: string;
  languageDesc: string;
  arabicLanguage: string;
  englishLanguage: string;
  subscriptionCardTitle: string;
  planBadge: string;
  teamQuota: string;
  channelsQuota: string;
  accountStatus: string;
  activeAndLicensed: string;
  storeProfileTitle: string;
  storeNameLabel: string;
  storeWebsiteLabel: string;
  personalProfileTitle: string;
  firstNameLabel: string;
  lastNameLabel: string;
  loginEmailLabel: string;

  // Dashboard Page
  dashboardGreetingMorning: string;
  dashboardGreetingEvening: string;
  dashboardSubtitle: string;
  newConversation: string;
  totalConversations: string;
  openConversations: string;
  resolvedToday: string;
  avgResponseTime: string;
  aiHandledRatio: string;
  activeChannels: string;
  conversationsTrend: string;
  recentConversations: string;
  quickStats: string;

  // Inbox Page
  inboxTitle: string;
  inboxSubtitle: string;
  allChannels: string;
  channelWhatsApp: string;
  channelInstagram: string;
  channelMessenger: string;
  channelSalla: string;
  searchConversationsPlaceholder: string;
  aiCopilotSuggestion: string;
  applySuggestion: string;
  internalNote: string;
  publicReply: string;
  typeMessagePlaceholder: string;
  send: string;
  customerDetails: string;
  ordersAndDeals: string;
  createDeal: string;
  cannedReplies: string;

  // CRM Page
  crmTitle: string;
  crmSubtitle: string;
  addOrderOrDeal: string;
  stageLead: string;
  stageProcessing: string;
  stageShipping: string;
  stageWon: string;
  stageLost: string;
  dealValue: string;

  // Knowledge Base Page
  kbTitle: string;
  kbSubtitle: string;
  addKnowledgeDoc: string;
  docTitle: string;
  contentType: string;
  contentDetails: string;
  trainAiButton: string;

  // AI Settings Page
  aiSettingsTitle: string;
  aiSettingsSubtitle: string;
  autoPilotToggle: string;
  autoPilotDesc: string;
  systemPromptTitle: string;
  systemPromptDesc: string;
  modelProviderTitle: string;
  testSandboxTitle: string;
  testSandboxDesc: string;
  testSandboxButton: string;
}

const translations: Record<Language, Translations> = {
  ar: {
    brandName: 'Ecomate',
    brandTagline: 'المساعد الذكي لمتجرك',

    navOperations: 'التشغيل والمحادثات',
    navCrm: 'العملاء والطلبات',
    navIntelligence: 'الذكاء الاصطناعي',
    navPlatform: 'إدارة المنصة',

    navDashboard: 'لوحة المؤشرات',
    navInbox: 'صندوق الوارد',
    navContacts: 'جهات الاتصال',
    navDeals: 'الطلبات والمبيعات',
    navCompanies: 'الشركات',
    navKnowledgeBase: 'قاعدة المعرفة',
    navAiSettings: 'إعدادات الذكاء الاصطناعي',
    navAnalytics: 'التقارير والإحصائيات',
    navIntegrations: 'قنوات الربط',
    navTeam: 'فريق العمل',
    navSettings: 'الإعدادات',
    navWorkspaces: 'مساحات العمل',
    navSuperAdmin: 'إدارة النظام',

    save: 'حفظ',
    saving: 'جاري الحفظ...',
    savedSuccessfully: 'تم الحفظ بنجاح',
    cancel: 'إلغاء',
    delete: 'حذف',
    deletedSuccessfully: 'تم الحذف بنجاح',
    edit: 'تعديل',
    create: 'إنشاء',
    search: 'بحث...',
    filter: 'تصفية',
    all: 'الكل',
    loading: 'جاري التحميل...',
    logout: 'تسجيل الخروج',
    back: 'رجوع',
    actions: 'الإجراءات',
    status: 'الحالة',
    date: 'التاريخ',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    role: 'الدور والصلاحية',
    active: 'نشط',
    inactive: 'غير نشط',
    viewAll: 'عرض الكل',
    noData: 'لا توجد بيانات متاحة',

    settingsTitle: 'إعدادات المنصة والحساب',
    settingsSubtitle: 'إدارة لغة الواجهة، بيانات المتجر، وباقة الاشتراك',
    languageAndTheme: 'لغة الواجهة والمظهر',
    languageLabel: 'لغة لوحة التحكم',
    languageDesc: 'اختر اللغة المناسبة لواجهة المستخدم، سيتم ضبط اتجاه الشاشة (RTL / LTR) تلقائياً.',
    arabicLanguage: 'العربية (Arabic) — من اليمين لليسار RTL',
    englishLanguage: 'الإنجليزية (English) — من اليسار لليمين LTR',
    subscriptionCardTitle: 'باقة الاشتراك وسعة الاستهلاك',
    planBadge: 'الباقة الحالية',
    teamQuota: 'عدد مقاعد الموظفين',
    channelsQuota: 'القنوات المسموحة',
    accountStatus: 'حالة الحساب',
    activeAndLicensed: 'مرخص ونشط',
    storeProfileTitle: 'بيانات المتجر والشركة',
    storeNameLabel: 'اسم المتجر',
    storeWebsiteLabel: 'رابط المتجر الإلكتروني',
    personalProfileTitle: 'بيانات الحساب الشخصي',
    firstNameLabel: 'الاسم الأول',
    lastNameLabel: 'اسم العائلة',
    loginEmailLabel: 'بريد تسجيل الدخول',

    dashboardGreetingMorning: 'صباح الخير',
    dashboardGreetingEvening: 'مساء الخير',
    dashboardSubtitle: 'نظرة عامة على أداء المحادثات والمبيعات والعمليات اليوم',
    newConversation: 'محادثة جديدة',
    totalConversations: 'إجمالي المحادثات',
    openConversations: 'المحادثات المفتوحة',
    resolvedToday: 'المغلقة اليوم',
    avgResponseTime: 'متوسط سرعة الرد',
    aiHandledRatio: 'أتمتة الذكاء الاصطناعي',
    activeChannels: 'القنوات المتصلة',
    conversationsTrend: 'مسار المحادثات والردود',
    recentConversations: 'أحدث المحادثات والعمليات',
    quickStats: 'إحصائيات سريعة',

    inboxTitle: 'صندوق الوارد الموحد',
    inboxSubtitle: 'إدارة كافة محادثات القنوات في منصة تشغيل واحدة',
    allChannels: 'الكل',
    channelWhatsApp: 'واتساب',
    channelInstagram: 'انستغرام',
    channelMessenger: 'ماسنجر',
    channelSalla: 'سلة',
    searchConversationsPlaceholder: 'بحث في المحادثات أو العملاء...',
    aiCopilotSuggestion: 'اقتراح الرد الذكي المباشر',
    applySuggestion: 'استخدام الرد المقترح',
    internalNote: 'ملاحظة داخلية خاصة بالفريق',
    publicReply: 'رد مباشر للعميل',
    typeMessagePlaceholder: 'اكتب رسالتك هنا للعميل...',
    send: 'إرسال',
    customerDetails: 'ملف العميل وسجل العمليات',
    ordersAndDeals: 'الطلبات والصفقات',
    createDeal: 'إنشاء طلب جديد',
    cannedReplies: 'الردود الجاهزة السريعة',

    crmTitle: 'إدارة الطلبات والصفقات',
    crmSubtitle: 'متابعة مسار مبيعات المتجر وحالات الشحن والتسليم',
    addOrderOrDeal: 'إضافة طلب جديد',
    stageLead: 'طلب جديد',
    stageProcessing: 'قيد التجهيز',
    stageShipping: 'جاري التوصيل',
    stageWon: 'تم التسليم بنجاح',
    stageLost: 'ملغي / مسترجع',
    dealValue: 'القيمة الإجمالية',

    kbTitle: 'قاعدة المعرفة والمنتجات',
    kbSubtitle: 'تدريب الذكاء الاصطناعي على سياسات المتجر، كتالوج المنتجات، والأسئلة الشائعة',
    addKnowledgeDoc: 'إضافة مستند أو سؤال',
    docTitle: 'العنوان',
    contentType: 'نوع المحتوى',
    contentDetails: 'المحتوى والتفاصيل',
    trainAiButton: 'حفظ وتدريب المساعد',

    aiSettingsTitle: 'إعدادات الذكاء الاصطناعي',
    aiSettingsSubtitle: 'تخصيص شخصية المساعد الذكي، تعليمات الرد، ونموذج التفكير',
    autoPilotToggle: 'تفعيل الرد التلقائي العام',
    autoPilotDesc: 'الرد التلقائي الفوري على رسائل العملاء عبر كافة القنوات المتصلة.',
    systemPromptTitle: 'شخصية وتعليمات المساعد الذكي',
    systemPromptDesc: 'اكتب التعليمات الأساسية للهجة المساعد وطريقة خدمة عملاء المتجر.',
    modelProviderTitle: 'مزود ونموذج الذكاء الاصطناعي',
    testSandboxTitle: 'تجربة واختبار الرد المباشر',
    testSandboxDesc: 'اختبر رد المساعد على رسائل وسيناريوهات عملائك قبل النشر.',
    testSandboxButton: 'إرسال واختبار الرد',
  },
  en: {
    brandName: 'Sanad',
    brandTagline: 'Intelligent Store Assistant',

    navOperations: 'Operations',
    navCrm: 'CRM & Orders',
    navIntelligence: 'Intelligence',
    navPlatform: 'Platform',

    navDashboard: 'Dashboard',
    navInbox: 'Inbox',
    navContacts: 'Contacts',
    navDeals: 'Orders & Deals',
    navCompanies: 'Companies',
    navKnowledgeBase: 'Knowledge Base',
    navAiSettings: 'AI Settings',
    navAnalytics: 'Analytics',
    navIntegrations: 'Integrations',
    navTeam: 'Team',
    navSettings: 'Settings',
    navWorkspaces: 'Workspaces',
    navSuperAdmin: 'SuperAdmin',

    save: 'Save',
    saving: 'Saving...',
    savedSuccessfully: 'Saved successfully',
    cancel: 'Cancel',
    delete: 'Delete',
    deletedSuccessfully: 'Deleted successfully',
    edit: 'Edit',
    create: 'Create',
    search: 'Search...',
    filter: 'Filter',
    all: 'All',
    loading: 'Loading...',
    logout: 'Sign Out',
    back: 'Back',
    actions: 'Actions',
    status: 'Status',
    date: 'Date',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    role: 'Role & Permissions',
    active: 'Active',
    inactive: 'Inactive',
    viewAll: 'View All',
    noData: 'No data available',

    settingsTitle: 'Settings & Profile',
    settingsSubtitle: 'Manage interface language, store profile, and subscription quotas',
    languageAndTheme: 'Language & Appearance',
    languageLabel: 'Dashboard Language',
    languageDesc: 'Select your preferred interface language. Layout direction (RTL / LTR) will adjust automatically.',
    arabicLanguage: 'العربية (Arabic) — Right-to-Left RTL',
    englishLanguage: 'English — Left-to-Right LTR',
    subscriptionCardTitle: 'Subscription & Usage Quotas',
    planBadge: 'Current Plan',
    teamQuota: 'Team Seats Quota',
    channelsQuota: 'Channels Allowed',
    accountStatus: 'Account Status',
    activeAndLicensed: 'Active & Licensed',
    storeProfileTitle: 'Store & Organization Profile',
    storeNameLabel: 'Store Name',
    storeWebsiteLabel: 'Store Website',
    personalProfileTitle: 'Personal Profile',
    firstNameLabel: 'First Name',
    lastNameLabel: 'Last Name',
    loginEmailLabel: 'Login Email',

    dashboardGreetingMorning: 'Good morning',
    dashboardGreetingEvening: 'Good evening',
    dashboardSubtitle: 'Overview of conversations, store sales, and operations today',
    newConversation: 'New Conversation',
    totalConversations: 'Total Conversations',
    openConversations: 'Open Conversations',
    resolvedToday: 'Resolved Today',
    avgResponseTime: 'Avg Response Time',
    aiHandledRatio: 'AI Resolution Rate',
    activeChannels: 'Active Channels',
    conversationsTrend: 'Conversations & Resolution Trend',
    recentConversations: 'Recent Conversations',
    quickStats: 'Quick Metrics',

    inboxTitle: 'Unified Inbox',
    inboxSubtitle: 'Manage all omnichannel customer conversations in one place',
    allChannels: 'All',
    channelWhatsApp: 'WhatsApp',
    channelInstagram: 'Instagram',
    channelMessenger: 'Messenger',
    channelSalla: 'Salla',
    searchConversationsPlaceholder: 'Search conversations or customers...',
    aiCopilotSuggestion: 'Instant AI Suggested Reply',
    applySuggestion: 'Use Suggestion',
    internalNote: 'Internal Private Note',
    publicReply: 'Public Reply to Customer',
    typeMessagePlaceholder: 'Type your message to customer...',
    send: 'Send',
    customerDetails: 'Customer 360° Profile',
    ordersAndDeals: 'Orders & Deals',
    createDeal: 'Create New Order',
    cannedReplies: 'Canned Replies',

    crmTitle: 'Orders & Deals Pipeline',
    crmSubtitle: 'Track store sales pipeline, courier shipments, and order fulfillment',
    addOrderOrDeal: 'Add Order / Deal',
    stageLead: 'New Order',
    stageProcessing: 'Processing',
    stageShipping: 'In Transit / Shipping',
    stageWon: 'Fulfilled & Delivered',
    stageLost: 'Cancelled / Returned',
    dealValue: 'Total Value',

    kbTitle: 'Knowledge Base',
    kbSubtitle: 'Train AI on store policies, product catalogs, and customer FAQs',
    addKnowledgeDoc: 'Add Document or FAQ',
    docTitle: 'Title',
    contentType: 'Content Type',
    contentDetails: 'Content & Details',
    trainAiButton: 'Save & Train AI',

    aiSettingsTitle: 'AI Prompt & Model Settings',
    aiSettingsSubtitle: 'Configure AI assistant persona, system instructions, and LLM provider',
    autoPilotToggle: 'Enable Global Auto-Pilot',
    autoPilotDesc: 'Automatically reply to customer messages across all connected channels.',
    systemPromptTitle: 'Assistant Persona & System Prompt',
    systemPromptDesc: 'Define assistant tone, guidelines, and store customer service rules.',
    modelProviderTitle: 'LLM Provider & Model',
    testSandboxTitle: 'Interactive Test Sandbox',
    testSandboxDesc: 'Test model responses to customer scenarios before going live.',
    testSandboxButton: 'Send & Test Reply',
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('sanad_language');
      if (saved === 'en' || saved === 'ar') return saved;
    } catch {
      // Fallback
    }
    return 'ar'; // Default Arabic
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('sanad_language', lang);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    const isRtl = language === 'ar';
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.body.dir = isRtl ? 'rtl' : 'ltr';
  }, [language]);

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: translations[language],
    isRtl: language === 'ar',
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
