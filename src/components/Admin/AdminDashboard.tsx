import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Inbox,
  Trash2,
  Check,
  Eye,
  LogOut,
  ArrowUp,
  ArrowDown,
  Plus,
  RefreshCw,
  KeyRound,
  Pencil,
  X,
  Shield,
  ShieldCheck,
  Sparkles,
  EyeOff,
  UserCheck,
  Tag,
  MapPin,
  Clock,
  Image as ImageIcon,
  Mail,
  Send,
  Phone,
  Building,
  Globe,
  Star,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Undo2,
  HelpCircle,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import {
  WorkshopEvent,
  LeadershipMember,
  AdminPermissions,
  RegisteredAdmin,
  MailSettings,
  ScheduledEmail,
  ContactDetail,
} from '../../types';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onLogout?: () => void;
}

const DEFAULT_EVENT_FORM = {
  title: '',
  description: '',
  date: '',
  location: '',
  posterUrl: '',
  tag: 'NEW WORKSHOP',
  tagType: 'developer-lab' as WorkshopEvent['tagType'],
  sessionLeads: '',
  guestSpeaker: '',
  attendees: '',
};

const DEFAULT_LEADER_FORM = {
  name: '',
  role: '',
  departmentRole: '',
  category: 'core-officer' as LeadershipMember['category'],
  subCategoryTitle: '',
  photoUrl: '',
  initials: '',
  description: '',
  college: 'SJEC CSE',
  badge: 'LEADERSHIP',
  tag: '',
  linkedin: '',
};

const DEFAULT_PERMISSIONS: AdminPermissions = {
  membershipApproval: true,
  manageEvents: true,
  manageLeadership: true,
  manageCredentials: false,
};

const DEFAULT_CONTACT_FORM: Omit<ContactDetail, 'id'> = {
  title: '',
  type: 'email',
  value: '',
  description: '',
  isPrimary: false,
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite, onLogout }) => {
  const {
    events,
    leadership,
    applications,
    isLoadingApplications,
    refreshApplications,
    deleteApplication,
    updateApplicationStatus,
    updateEvent,
    addEvent,
    deleteEvent,
    reorderEvents,
    updateLeader,
    addLeader,
    deleteLeader,
    reorderLeadership,
    mailSettings,
    scheduledEmails,
    updateMailSettings,
    scheduleApplicationEmail,
    cancelScheduledEmail,
    dispatchScheduledEmailNow,
    contactDetails,
    addContactDetail,
    updateContactDetail,
    deleteContactDetail,
  } = useData();

  const {
    user,
    isMainAdmin,
    currentPermissions,
    adminRequests,
    fetchAdminRequests,
    deleteAdmin,
    createMemberCredential,
    updateMemberCredential,
    isLoadingRequests,
  } = useAdminAuth();

  // Top level active tab: applications | events | leadership | credentials | mail | contact
  const [activeTab, setActiveTab] = useState<
    'applications' | 'events' | 'leadership' | 'credentials' | 'mail' | 'contact'
  >('applications');

  // Applications sub-filter tab: all | accepted | shortlisted | pending | rejected
  const [appFilter, setAppFilter] = useState<'all' | 'accepted' | 'shortlisted' | 'pending' | 'rejected'>('all');

  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // ===================== EVENT MODAL STATE =====================
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState(DEFAULT_EVENT_FORM);

  // ===================== LEADER MODAL STATE =====================
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const [leaderForm, setLeaderForm] = useState(DEFAULT_LEADER_FORM);

  // ===================== CREDENTIALS MODAL STATE =====================
  const [isCredModalOpen, setIsCredModalOpen] = useState(false);
  const [editingCredUsername, setEditingCredUsername] = useState<string | null>(null);
  const [credUsername, setCredUsername] = useState('');
  const [credPassword, setCredPassword] = useState('');
  const [credRoleTitle, setCredRoleTitle] = useState('');
  const [credPermissions, setCredPermissions] = useState<AdminPermissions>(DEFAULT_PERMISSIONS);
  const [showCredPassword, setShowCredPassword] = useState(false);
  const [credError, setCredError] = useState<string | null>(null);
  const [isSubmittingCred, setIsSubmittingCred] = useState(false);

  // ===================== MAIL SETTINGS FORM STATE =====================
  const [mailForm, setMailForm] = useState<MailSettings>(mailSettings);
  const [hasSavedMailSettings, setHasSavedMailSettings] = useState(false);

  // Synchronize local mailForm when mailSettings loads from Supabase
  React.useEffect(() => {
    setMailForm(mailSettings);
  }, [mailSettings]);

  // ===================== CONTACT MODAL STATE =====================
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState(DEFAULT_CONTACT_FORM);

  const notify = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  // ===================== PERMISSIONS CHECKERS =====================
  const canManageApps = isMainAdmin || currentPermissions.membershipApproval;
  const canManageEvents = isMainAdmin || currentPermissions.manageEvents;
  const canManageLeadership = isMainAdmin || currentPermissions.manageLeadership;
  const canManageCredentials = isMainAdmin || currentPermissions.manageCredentials;

  // ===================== APPLICATION DECISION HANDLERS =====================
  const handleDecisionClick = (app: (typeof applications)[0], decision: 'accepted' | 'shortlisted' | 'rejected') => {
    if (!canManageApps) {
      notify('You do not have permission to manage applications.');
      return;
    }

    const currentStatus = (app.status || 'pending').toLowerCase();
    const isAccepted = currentStatus === 'accepted' || currentStatus === 'approved';
    const isShortlisted = currentStatus === 'shortlisted';
    const isRejected = currentStatus === 'rejected';

    // Check if the clicked button is already active -> UNCLICK / TOGGLE BACK TO PENDING
    if ((decision === 'accepted' && isAccepted) ||
        (decision === 'shortlisted' && isShortlisted) ||
        (decision === 'rejected' && isRejected)) {
      updateApplicationStatus(app.id, 'pending');
      cancelScheduledEmail(app.id);
      notify(`Unclicked: Reset "${app.name}" status to Pending and cancelled any scheduled email.`);
      return;
    }

    // Set new status
    updateApplicationStatus(app.id, decision);

    if (decision === 'accepted') {
      scheduleApplicationEmail(app.id, app.name, app.email, 'accept', {
        usn: app.usn,
        track: app.track,
      });
      notify(
        `Accepted "${app.name}". Email scheduled for delivery in ${mailSettings.delayHours}h from ${mailSettings.clubEmail}.`
      );
    } else if (decision === 'shortlisted') {
      scheduleApplicationEmail(app.id, app.name, app.email, 'shortlist', {
        usn: app.usn,
        track: app.track,
      });
      notify(
        `Shortlisted "${app.name}". Email scheduled for delivery in ${mailSettings.delayHours}h from ${mailSettings.clubEmail}.`
      );
    } else if (decision === 'rejected') {
      cancelScheduledEmail(app.id);
      notify(`Application from "${app.name}" marked as Rejected.`);
    }
  };

  // Filtered applications based on active sub-tab
  const acceptedApps = applications.filter(
    (a) => (a.status || '').toLowerCase() === 'accepted' || (a.status || '').toLowerCase() === 'approved'
  );
  const shortlistedApps = applications.filter((a) => (a.status || '').toLowerCase() === 'shortlisted');
  const rejectedApps = applications.filter((a) => (a.status || '').toLowerCase() === 'rejected');
  const pendingApps = applications.filter(
    (a) =>
      !a.status ||
      (a.status.toLowerCase() !== 'accepted' &&
        a.status.toLowerCase() !== 'approved' &&
        a.status.toLowerCase() !== 'shortlisted' &&
        a.status.toLowerCase() !== 'rejected')
  );

  const displayedApplications =
    appFilter === 'accepted'
      ? acceptedApps
      : appFilter === 'shortlisted'
      ? shortlistedApps
      : appFilter === 'rejected'
      ? rejectedApps
      : appFilter === 'pending'
      ? pendingApps
      : applications;

  // ===================== EVENT HANDLERS =====================
  const handleOpenAddEvent = () => {
    setEditingEventId(null);
    setEventForm(DEFAULT_EVENT_FORM);
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (ev: WorkshopEvent) => {
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title || '',
      description: ev.description || '',
      date: ev.timeline || ev.date || '',
      location: ev.location || ev.venue || '',
      posterUrl: ev.posterUrl || (ev.gallery && ev.gallery[0]?.url) || '',
      tag: ev.tag || 'NEW WORKSHOP',
      tagType: ev.tagType || 'developer-lab',
      sessionLeads: ev.sessionLeads || '',
      guestSpeaker: ev.guestSpeaker || '',
      attendees: ev.attendees || '',
    });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      notify('Event name is required.');
      return;
    }

    if (editingEventId) {
      updateEvent(editingEventId, {
        title: eventForm.title.trim(),
        description: eventForm.description.trim(),
        date: eventForm.date.trim() || 'UPCOMING',
        timeline: eventForm.date.trim(),
        location: eventForm.location.trim(),
        venue: eventForm.location.trim(),
        posterUrl: eventForm.posterUrl.trim(),
        tag: eventForm.tag.trim() || 'WORKSHOP',
        tagType: eventForm.tagType,
        sessionLeads: eventForm.sessionLeads.trim() || undefined,
        guestSpeaker: eventForm.guestSpeaker.trim() || undefined,
        attendees: eventForm.attendees.trim() || undefined,
      });
      notify(`Updated event "${eventForm.title}".`);
    } else {
      const newEv: WorkshopEvent = {
        id: 'workshop-' + Date.now(),
        title: eventForm.title.trim(),
        description: eventForm.description.trim(),
        date: eventForm.date.trim() || 'UPCOMING',
        timeline: eventForm.date.trim(),
        location: eventForm.location.trim(),
        venue: eventForm.location.trim(),
        posterUrl: eventForm.posterUrl.trim(),
        tag: eventForm.tag.trim() || 'WORKSHOP',
        tagType: eventForm.tagType,
        sessionLeads: eventForm.sessionLeads.trim() || undefined,
        guestSpeaker: eventForm.guestSpeaker.trim() || undefined,
        attendees: eventForm.attendees.trim() || undefined,
        gallery: eventForm.posterUrl.trim()
          ? [
              {
                id: 'poster-' + Date.now(),
                url: eventForm.posterUrl.trim(),
                title: eventForm.title.trim(),
                caption: 'Official Event Poster',
                tag: 'Poster',
              },
            ]
          : [],
      };
      addEvent(newEv);
      notify(`Added new event "${eventForm.title}".`);
    }

    setIsEventModalOpen(false);
  };

  // ===================== LEADERSHIP HANDLERS =====================
  const handleOpenAddLeader = () => {
    setEditingLeaderId(null);
    setLeaderForm(DEFAULT_LEADER_FORM);
    setIsLeaderModalOpen(true);
  };

  const handleOpenEditLeader = (leader: LeadershipMember) => {
    setEditingLeaderId(leader.id);
    setLeaderForm({
      name: leader.name || '',
      role: leader.role || '',
      departmentRole: leader.departmentRole || '',
      category: leader.category || 'core-officer',
      subCategoryTitle: leader.subCategoryTitle || '',
      photoUrl: leader.photoUrl || '',
      initials: leader.initials || '',
      description: leader.description || '',
      college: leader.college || 'SJEC CSE',
      badge: leader.badge || 'LEADERSHIP',
      tag: leader.tag || '',
      linkedin: leader.linkedin || '',
    });
    setIsLeaderModalOpen(true);
  };

  const handleSaveLeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderForm.name.trim() || !leaderForm.role.trim()) {
      notify('Member name and role are required.');
      return;
    }

    const calculatedInitials =
      leaderForm.initials.trim() ||
      leaderForm.name
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const photo =
      leaderForm.photoUrl.trim() ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80';

    if (editingLeaderId) {
      updateLeader(editingLeaderId, {
        name: leaderForm.name.trim(),
        role: leaderForm.role.trim(),
        departmentRole: leaderForm.departmentRole.trim(),
        category: leaderForm.category,
        subCategoryTitle: leaderForm.subCategoryTitle.trim() || undefined,
        photoUrl: photo,
        initials: calculatedInitials,
        description: leaderForm.description.trim() || undefined,
        college: leaderForm.college.trim() || 'SJEC CSE',
        badge: leaderForm.badge.trim() || undefined,
        tag: leaderForm.tag.trim() || undefined,
        linkedin: leaderForm.linkedin.trim() || undefined,
      });
      notify(`Updated leadership details for "${leaderForm.name}".`);
    } else {
      const newLeader: LeadershipMember = {
        id: 'lead-' + Date.now(),
        name: leaderForm.name.trim(),
        role: leaderForm.role.trim(),
        departmentRole: leaderForm.departmentRole.trim(),
        category: leaderForm.category,
        subCategoryTitle: leaderForm.subCategoryTitle.trim() || undefined,
        photoUrl: photo,
        initials: calculatedInitials,
        description: leaderForm.description.trim() || undefined,
        college: leaderForm.college.trim() || 'SJEC CSE',
        badge: leaderForm.badge.trim() || undefined,
        tag: leaderForm.tag.trim() || undefined,
        linkedin: leaderForm.linkedin.trim() || undefined,
      };
      addLeader(newLeader);
      notify(`Added new member "${leaderForm.name}".`);
    }

    setIsLeaderModalOpen(false);
  };

  // ===================== CREDENTIALS HANDLERS =====================
  const handleOpenCreateCred = () => {
    setEditingCredUsername(null);
    setCredUsername('');
    setCredPassword('');
    setCredRoleTitle('Club Member Lead');
    setCredPermissions(DEFAULT_PERMISSIONS);
    setCredError(null);
    setIsCredModalOpen(true);
  };

  const handleOpenEditCred = (account: RegisteredAdmin) => {
    setEditingCredUsername(account.username);
    setCredUsername(account.username);
    setCredPassword(account.password || '');
    setCredRoleTitle(account.roleTitle || 'Club Member Lead');
    setCredPermissions(
      account.permissions || {
        membershipApproval: true,
        manageEvents: true,
        manageLeadership: true,
        manageCredentials: false,
      }
    );
    setCredError(null);
    setIsCredModalOpen(true);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let res = 'AB-';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCredPassword(res);
  };

  const handleSaveCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError(null);

    if (!credUsername.trim()) {
      setCredError('Username is required.');
      return;
    }

    if (!editingCredUsername && credPassword.length < 6) {
      setCredError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmittingCred(true);

    if (editingCredUsername) {
      const updates: Partial<RegisteredAdmin> = {
        roleTitle: credRoleTitle.trim(),
        permissions: credPermissions,
      };
      if (credPassword.trim().length >= 6) {
        updates.password = credPassword.trim();
      }
      const res = await updateMemberCredential(editingCredUsername, updates);
      setIsSubmittingCred(false);
      if (res.success) {
        notify(res.message || `Updated credentials for "${editingCredUsername}".`);
        setIsCredModalOpen(false);
      } else {
        setCredError(res.error || 'Failed to update credentials.');
      }
    } else {
      const res = await createMemberCredential(
        credUsername.trim(),
        credPassword.trim(),
        credRoleTitle.trim(),
        credPermissions
      );
      setIsSubmittingCred(false);
      if (res.success) {
        notify(res.message || `Created credentials for "${credUsername}".`);
        setIsCredModalOpen(false);
      } else {
        setCredError(res.error || 'Failed to create credentials.');
      }
    }
  };

  // ===================== MAIL SETTINGS HANDLERS =====================
  const handleSaveMailSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailForm.clubEmail.trim()) {
      notify('Club email is required.');
      return;
    }
    updateMailSettings({
      clubEmail: mailForm.clubEmail.trim(),
      senderName: mailForm.senderName.trim(),
      delayHours: Number(mailForm.delayHours) || 24,
      acceptSubject: mailForm.acceptSubject.trim(),
      acceptBody: mailForm.acceptBody.trim(),
      shortlistSubject: mailForm.shortlistSubject.trim(),
      shortlistBody: mailForm.shortlistBody.trim(),
    });
    setHasSavedMailSettings(true);
    notify(`Mail settings saved! Notification delay set to ${mailForm.delayHours}h from ${mailForm.clubEmail}.`);
    setTimeout(() => setHasSavedMailSettings(false), 3000);
  };

  // ===================== CONTACT HANDLERS =====================
  const handleOpenAddContact = () => {
    setEditingContactId(null);
    setContactForm(DEFAULT_CONTACT_FORM);
    setIsContactModalOpen(true);
  };

  const handleOpenEditContact = (item: ContactDetail) => {
    setEditingContactId(item.id);
    setContactForm({
      title: item.title,
      type: item.type,
      value: item.value,
      description: item.description || '',
      isPrimary: Boolean(item.isPrimary),
    });
    setIsContactModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.title.trim() || !contactForm.value.trim()) {
      notify('Title and Contact value are required.');
      return;
    }

    if (editingContactId) {
      updateContactDetail(editingContactId, {
        title: contactForm.title.trim(),
        type: contactForm.type,
        value: contactForm.value.trim(),
        description: contactForm.description?.trim(),
        isPrimary: contactForm.isPrimary,
      });
      notify(`Updated contact channel "${contactForm.title}".`);
    } else {
      const newContact: ContactDetail = {
        id: 'contact-' + Date.now(),
        title: contactForm.title.trim(),
        type: contactForm.type,
        value: contactForm.value.trim(),
        description: contactForm.description?.trim(),
        isPrimary: contactForm.isPrimary,
      };
      addContactDetail(newContact);
      notify(`Added new contact channel "${contactForm.title}".`);
    }

    setIsContactModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#07040e] text-white font-mono pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-purple-900/60 bg-[#0d0718]/90 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-purple-500 animate-ping" />
            <h1 className="text-xl font-bold tracking-wider text-purple-300">
              AGENTBLAZER // ADMIN CMS
            </h1>
            <span className="hidden sm:inline-block rounded border border-purple-900 bg-[#07040e] px-2.5 py-0.5 text-[10px] text-purple-300">
              {isMainAdmin ? 'HEAD ADMINISTRATOR' : 'CLUB MEMBER OFFICER'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={onBackToSite}
              className="flex items-center gap-1.5 rounded border border-purple-500 bg-purple-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-purple-500 transition-colors cursor-pointer"
            >
              <Eye size={13} />
              <span>PUBLIC SITE</span>
            </button>

            {user?.email && (
              <div className="hidden md:flex items-center gap-1.5 rounded border border-purple-900 bg-[#07040e] px-2.5 py-1 text-[11px] font-mono text-purple-300">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span>{user.email}</span>
              </div>
            )}

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded border border-purple-900 bg-[#0d0718] px-3 py-1.5 text-xs text-purple-300 hover:border-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">LOGOUT</span>
              </button>
            )}
          </div>
        </div>

        {/* CMS Tabs Navigation */}
        <div className="mx-auto max-w-7xl mt-4 flex overflow-x-auto gap-2 border-t border-purple-900/60 pt-3">
          {/* 1. Applications */}
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'applications'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                : 'text-purple-300 hover:bg-purple-900/40'
            }`}
          >
            <Inbox size={14} />
            <span>Applications ({applications.length})</span>
          </button>

          {/* 2. Events */}
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'events'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                : 'text-purple-300 hover:bg-purple-900/40'
            }`}
          >
            <Calendar size={14} />
            <span>Events ({events.length})</span>
          </button>

          {/* 3. Leadership */}
          <button
            onClick={() => setActiveTab('leadership')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'leadership'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                : 'text-purple-300 hover:bg-purple-900/40'
            }`}
          >
            <Users size={14} />
            <span>Leadership ({leadership.length})</span>
          </button>

          {/* 4. Login Credentials */}
          <button
            onClick={() => setActiveTab('credentials')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'credentials'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                : 'text-purple-300 hover:bg-purple-900/40'
            }`}
          >
            <KeyRound size={14} />
            <span>Login Credentials</span>
            <span className="ml-1 rounded-full bg-purple-900/80 px-2 py-0.5 text-[10px] text-purple-200">
              {adminRequests.length}
            </span>
          </button>

          {/* 5. Mail Setting (Next to Login Credentials) */}
          <button
            onClick={() => setActiveTab('mail')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'mail'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                : 'text-purple-300 hover:bg-purple-900/40'
            }`}
          >
            <Mail size={14} />
            <span>Mail Setting</span>
            {scheduledEmails.filter((e) => e.status === 'scheduled').length > 0 && (
              <span className="ml-1 rounded-full bg-cyan-500/30 border border-cyan-400/60 px-1.5 py-0.2 text-[10px] text-cyan-300 font-bold">
                {scheduledEmails.filter((e) => e.status === 'scheduled').length} Queued
              </span>
            )}
          </button>

          {/* 6. Contact */}
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              activeTab === 'contact'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                : 'text-purple-300 hover:bg-purple-900/40'
            }`}
          >
            <Phone size={14} />
            <span>Contact ({contactDetails.length})</span>
          </button>
        </div>
      </header>

      {/* Floating Status Notification */}
      {statusNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded border border-purple-500 bg-[#0d0718] px-4 py-3 text-xs text-purple-300 shadow-[0_0_20px_rgba(147,51,234,0.4)] animate-in fade-in">
          <Check size={16} />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 pt-8">
        {/* ========================================================================= */}
        {/* 1. APPLICATIONS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Student Membership Submissions</h2>
                <p className="text-xs text-purple-300 mt-1">
                  Review applications. Click Accept or Shortlist to schedule an automated notification email after {mailSettings.delayHours} hours.
                  Clicking an active button again unclicks and reverts status.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  refreshApplications();
                  notify('Refreshed applications feed from Supabase.');
                }}
                disabled={isLoadingApplications}
                className="flex items-center gap-1.5 rounded border border-purple-800 bg-[#0d0718] px-3 py-1.5 text-xs text-purple-300 hover:bg-purple-900/40 transition-colors cursor-pointer"
              >
                <RefreshCw size={13} className={isLoadingApplications ? 'animate-spin' : ''} />
                <span>Refresh Feed</span>
              </button>
            </div>

            {/* Applications Filter Sub-tabs (All, Accepted, Shortlisted, Pending, Rejected) */}
            <div className="flex flex-wrap gap-2 border-b border-purple-950 pb-3 text-xs">
              <button
                type="button"
                onClick={() => setAppFilter('all')}
                className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer font-medium ${
                  appFilter === 'all'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-[#0d0718] text-purple-300 hover:bg-purple-900/30'
                }`}
              >
                All Applications ({applications.length})
              </button>
              <button
                type="button"
                onClick={() => setAppFilter('accepted')}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 transition-all cursor-pointer font-medium ${
                  appFilter === 'accepted'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-[#0d0718] text-emerald-400 hover:bg-emerald-950/40 border border-emerald-900/40'
                }`}
              >
                <Check size={12} />
                <span>Accepted ({acceptedApps.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setAppFilter('shortlisted')}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 transition-all cursor-pointer font-medium ${
                  appFilter === 'shortlisted'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-[#0d0718] text-amber-400 hover:bg-amber-950/40 border border-amber-900/40'
                }`}
              >
                <Star size={12} />
                <span>Shortlisted ({shortlistedApps.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setAppFilter('pending')}
                className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer font-medium ${
                  appFilter === 'pending'
                    ? 'bg-purple-800 text-white font-bold'
                    : 'bg-[#0d0718] text-purple-300 hover:bg-purple-900/30'
                }`}
              >
                Pending Review ({pendingApps.length})
              </button>
              <button
                type="button"
                onClick={() => setAppFilter('rejected')}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 transition-all cursor-pointer font-medium ${
                  appFilter === 'rejected'
                    ? 'bg-rose-700 text-white font-bold'
                    : 'bg-[#0d0718] text-rose-400 hover:bg-rose-950/40 border border-rose-900/40'
                }`}
              >
                <XCircle size={12} />
                <span>Rejected ({rejectedApps.length})</span>
              </button>
            </div>

            {displayedApplications.length === 0 ? (
              <div className="rounded-xl border border-purple-900/60 bg-[#0d0718] p-12 text-center text-xs text-purple-300/70">
                {appFilter === 'all'
                  ? 'No membership applications received yet.'
                  : `No applications found with status "${appFilter.toUpperCase()}".`}
              </div>
            ) : (
              <div className="grid gap-4">
                {displayedApplications.map((app) => {
                  const statusNormalized = (app.status || 'pending').toLowerCase();
                  const isAccepted = statusNormalized === 'accepted' || statusNormalized === 'approved';
                  const isShortlisted = statusNormalized === 'shortlisted';
                  const isRejected = statusNormalized === 'rejected';

                  // Check if there is an email scheduled for this application
                  const scheduledMail = scheduledEmails.find(
                    (e) => e.applicationId === app.id && e.status === 'scheduled'
                  );

                  return (
                    <div
                      key={app.id}
                      className={`rounded-xl border p-5 transition-all space-y-3 ${
                        isAccepted
                          ? 'border-emerald-500/40 bg-emerald-950/10'
                          : isShortlisted
                          ? 'border-amber-500/40 bg-amber-950/10'
                          : isRejected
                          ? 'border-rose-900/40 bg-rose-950/10 opacity-75'
                          : 'border-purple-900/60 bg-[#0d0718] hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm text-white">{app.name}</h3>
                            {app.usn && (
                              <span className="rounded bg-purple-900/60 px-2 py-0.5 text-[10px] text-purple-300 font-mono">
                                {app.usn}
                              </span>
                            )}

                            {/* Status Badge */}
                            {isAccepted && (
                              <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                                <Check size={11} />
                                <span>ACCEPTED</span>
                              </span>
                            )}
                            {isShortlisted && (
                              <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1">
                                <Star size={11} />
                                <span>SHORTLISTED</span>
                              </span>
                            )}
                            {isRejected && (
                              <span className="rounded bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] uppercase font-bold text-rose-400 flex items-center gap-1">
                                <XCircle size={11} />
                                <span>REJECTED</span>
                              </span>
                            )}
                            {!isAccepted && !isShortlisted && !isRejected && (
                              <span className="rounded bg-purple-900/40 border border-purple-800 px-2 py-0.5 text-[10px] uppercase font-bold text-purple-300">
                                PENDING REVIEW
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-purple-300/80 mt-0.5">
                            {app.email} {app.year ? `• ${app.year}` : ''} {app.department ? `• ${app.department}` : ''}
                          </div>
                        </div>

                        {/* 3 Decision Action Buttons + Delete */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* ACCEPT BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleDecisionClick(app, 'accepted')}
                            className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                              isAccepted
                                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] ring-1 ring-emerald-300'
                                : 'border border-emerald-800/80 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-600 hover:text-white'
                            }`}
                            title={isAccepted ? 'Click to unclick / reset to pending' : 'Accept application and schedule welcome email'}
                          >
                            <Check size={13} />
                            <span>{isAccepted ? 'Accepted ✓' : 'Accept'}</span>
                          </button>

                          {/* SHORTLIST BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleDecisionClick(app, 'shortlisted')}
                            className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                              isShortlisted
                                ? 'bg-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] ring-1 ring-amber-300'
                                : 'border border-amber-800/80 bg-amber-950/40 text-amber-300 hover:bg-amber-600 hover:text-white'
                            }`}
                            title={isShortlisted ? 'Click to unclick / reset to pending' : 'Shortlist candidate for interview round'}
                          >
                            <Star size={13} />
                            <span>{isShortlisted ? 'Shortlisted ★' : 'Shortlist'}</span>
                          </button>

                          {/* REJECT BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleDecisionClick(app, 'rejected')}
                            className={`flex items-center gap-1 rounded px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                              isRejected
                                ? 'bg-rose-700 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] ring-1 ring-rose-400'
                                : 'border border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-700 hover:text-white'
                            }`}
                            title={isRejected ? 'Click to unclick / reset to pending' : 'Reject application'}
                          >
                            <XCircle size={13} />
                            <span>{isRejected ? 'Rejected ✕' : 'Reject'}</span>
                          </button>

                          {/* DELETE SUBMISSION */}
                          {canManageApps && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Delete application submission from ${app.name}?`)) {
                                  deleteApplication(app.id);
                                  cancelScheduledEmail(app.id);
                                  notify('Application removed from database.');
                                }
                              }}
                              className="rounded border border-rose-900/60 p-2 text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer ml-1"
                              title="Delete Record"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Scheduled Email Notification Banner */}
                      {scheduledMail && (
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-cyan-500/40 bg-cyan-950/30 p-2.5 text-xs text-cyan-300 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-cyan-400 animate-pulse shrink-0" />
                            <span>
                              <strong>{scheduledMail.type === 'accept' ? 'Acceptance' : 'Shortlist'} Email Scheduled</strong>
                              {' • '}
                              Delivering in ~{Math.max(0, Math.round((new Date(scheduledMail.scheduledFor).getTime() - Date.now()) / (3600 * 1000)))}h
                              {' '}to {scheduledMail.recipientEmail} from {scheduledMail.senderEmail}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                dispatchScheduledEmailNow(scheduledMail.id);
                                notify(`Dispatched ${scheduledMail.type} email immediately to ${scheduledMail.recipientEmail}!`);
                              }}
                              className="flex items-center gap-1 rounded bg-cyan-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-cyan-500 cursor-pointer"
                            >
                              <Send size={11} />
                              <span>Dispatch Now</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                cancelScheduledEmail(app.id);
                                notify('Cancelled scheduled email.');
                              }}
                              className="rounded border border-cyan-800 px-2 py-1 text-[11px] text-cyan-300 hover:bg-cyan-900/40 cursor-pointer"
                            >
                              Cancel Mail
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-purple-950/80">
                        <div>
                          <span className="text-purple-400/60 uppercase text-[10px]">Track:</span>
                          <div className="text-purple-200">{app.track || 'General AI'}</div>
                        </div>
                        <div>
                          <span className="text-purple-400/60 uppercase text-[10px]">Interest / Statement:</span>
                          <div className="text-purple-200">{app.interest || app.statement || 'N/A'}</div>
                        </div>
                      </div>

                      <div className="text-[10px] text-purple-400/50 pt-1">
                        Submitted: {app.created_at} • ID: {app.id}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. EVENTS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Events &amp; Workshops</h2>
                <p className="text-xs text-purple-300 mt-1">
                  Add, edit event details, venue, duration, poster, or reorder workshops. Synchronized with Supabase cloud.
                </p>
              </div>
              {canManageEvents && (
                <button
                  type="button"
                  onClick={handleOpenAddEvent}
                  className="flex items-center gap-1.5 rounded bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)] cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add New Event</span>
                </button>
              )}
            </div>

            <div className="grid gap-3">
              {events.map((ev, idx) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-purple-900/60 bg-[#0d0718] p-4 text-xs transition-all hover:border-purple-500/50"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="font-mono text-purple-400 font-bold shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    {(ev.posterUrl || (ev.gallery && ev.gallery[0]?.url)) && (
                      <div className="h-12 w-12 rounded-lg overflow-hidden border border-purple-800 shrink-0 bg-black/40">
                        <img
                          src={ev.posterUrl || ev.gallery[0]?.url}
                          alt={ev.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">{ev.title}</div>
                      <div className="text-purple-300/70 text-[11px] flex items-center gap-2 flex-wrap mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-purple-400" />
                          <span>{ev.timeline || ev.date}</span>
                        </span>
                        {(ev.location || ev.venue) && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} className="text-purple-400" />
                            <span>{ev.location || ev.venue}</span>
                          </span>
                        )}
                        <span className="rounded bg-purple-950/80 border border-purple-800 px-1.5 py-0.2 text-[10px] text-cyan-300 uppercase">
                          {ev.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {canManageEvents && (
                      <button
                        type="button"
                        onClick={() => handleOpenEditEvent(ev)}
                        className="flex items-center gap-1 rounded border border-purple-800 bg-purple-950/40 px-2.5 py-1 text-purple-300 hover:bg-purple-800 hover:text-white transition-colors cursor-pointer"
                        title="Edit Event Details"
                      >
                        <Pencil size={12} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    )}

                    {canManageEvents && (
                      <>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            reorderEvents(idx, idx - 1);
                            notify('Moved event up.');
                          }}
                          className="rounded border border-purple-900 p-1 text-purple-300 hover:bg-purple-900/40 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === events.length - 1}
                          onClick={() => {
                            reorderEvents(idx, idx + 1);
                            notify('Moved event down.');
                          }}
                          className="rounded border border-purple-900 p-1 text-purple-300 hover:bg-purple-900/40 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete event "${ev.title}"?`)) {
                              deleteEvent(ev.id);
                              notify('Event deleted.');
                            }
                          }}
                          className="rounded border border-rose-900/60 p-1 text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. LEADERSHIP TAB */}
        {/* ========================================================================= */}
        {activeTab === 'leadership' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Leadership Council</h2>
                <p className="text-xs text-purple-300 mt-1">
                  Add, edit member profiles, roles, and categories. Synchronized with Supabase cloud.
                </p>
              </div>
              {canManageLeadership && (
                <button
                  type="button"
                  onClick={handleOpenAddLeader}
                  className="flex items-center gap-1.5 rounded bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)] cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Member</span>
                </button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {leadership.map((leader, idx) => (
                <div
                  key={leader.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-purple-900/60 bg-[#0d0718] p-3 text-xs transition-all hover:border-purple-500/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={leader.photoUrl}
                      alt={leader.name}
                      className="h-11 w-11 rounded-full object-cover border border-purple-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{leader.name}</div>
                      <div className="text-[11px] text-purple-300/70 truncate">
                        {leader.role} • {leader.departmentRole}
                      </div>
                      <span className="inline-block mt-0.5 rounded bg-purple-950/80 px-1.5 py-0.2 text-[9px] uppercase text-cyan-300 border border-purple-800">
                        {leader.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {canManageLeadership && (
                      <button
                        type="button"
                        onClick={() => handleOpenEditLeader(leader)}
                        className="flex items-center gap-1 rounded border border-purple-800 bg-purple-950/40 px-2 py-1 text-purple-300 hover:bg-purple-800 hover:text-white transition-colors cursor-pointer"
                        title="Edit Member Details"
                      >
                        <Pencil size={12} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    )}

                    {canManageLeadership && (
                      <>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            reorderLeadership(idx, idx - 1);
                            notify('Moved leader up.');
                          }}
                          className="rounded border border-purple-900 p-1 text-purple-300 hover:bg-purple-900/40 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === leadership.length - 1}
                          onClick={() => {
                            reorderLeadership(idx, idx + 1);
                            notify('Moved leader down.');
                          }}
                          className="rounded border border-purple-900 p-1 text-purple-300 hover:bg-purple-900/40 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete leader "${leader.name}"?`)) {
                              deleteLeader(leader.id);
                              notify('Leader removed.');
                            }
                          }}
                          className="rounded border border-rose-900/60 p-1 text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                          title="Delete Member"
                        >
                          <Trash2 size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. LOGIN CREDENTIALS TAB */}
        {/* ========================================================================= */}
        {activeTab === 'credentials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <KeyRound className="text-purple-400" />
                  <span>Club Member Login Credentials</span>
                </h2>
                <p className="text-xs text-purple-300 mt-1">
                  Create usernames and passwords for club members and specify their management permissions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    fetchAdminRequests();
                    notify('Refreshed credentials list.');
                  }}
                  disabled={isLoadingRequests}
                  className="flex items-center gap-1.5 rounded border border-purple-800 bg-[#0d0718] px-3 py-1.5 text-xs text-purple-300 hover:bg-purple-900/40 transition-colors cursor-pointer"
                >
                  <RefreshCw size={13} className={isLoadingRequests ? 'animate-spin' : ''} />
                  <span>Refresh</span>
                </button>

                {canManageCredentials && (
                  <button
                    type="button"
                    onClick={handleOpenCreateCred}
                    className="flex items-center gap-1.5 rounded bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)] cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create Member Credential</span>
                  </button>
                )}
              </div>
            </div>

            {/* Built-in Root Administrator Card */}
            <div className="rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-950/30 to-[#0d0718] p-5 space-y-2 shadow-[0_0_25px_rgba(147,51,234,0.15)]">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-purple-400" />
                    <span className="font-bold text-base text-white">admin</span>
                    <span className="text-xs text-purple-300 font-mono">(admin@agentblazer.sjec.ac.in)</span>
                    <span className="rounded bg-purple-600/30 border border-purple-500/60 px-2 py-0.5 text-[10px] font-bold text-purple-200">
                      HEAD ADMINISTRATOR (ROOT)
                    </span>
                  </div>
                  <p className="text-xs text-purple-300/70">
                    Primary master account with unrestricted access to applications, events, leadership, mail, and credentials.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-1 text-[11px] font-bold text-emerald-400">
                    ALL PERMISSIONS GRANTED
                  </span>
                </div>
              </div>
            </div>

            {/* Member Credentials List */}
            {adminRequests.length === 0 ? (
              <div className="rounded-xl border border-purple-900/60 bg-[#0d0718] p-12 text-center text-xs text-purple-300/70 space-y-3">
                <KeyRound size={32} className="mx-auto text-purple-400 opacity-60" />
                <div className="font-bold text-sm text-purple-200">No Member Credentials Created Yet</div>
                <p className="max-w-md mx-auto">
                  Click &ldquo;Create Member Credential&rdquo; above to set up dedicated login accounts for club leads with customized access permissions.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {adminRequests.map((account) => {
                  const perms = account.permissions || {
                    membershipApproval: true,
                    manageEvents: true,
                    manageLeadership: true,
                    manageCredentials: false,
                  };

                  return (
                    <div
                      key={account.username}
                      className="rounded-xl border border-purple-900/60 bg-[#0d0718] p-5 transition-all hover:border-purple-500/50 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-bold text-base text-white">{account.username}</span>
                            <span className="text-xs text-purple-400 font-mono">
                              ({account.username}@agentblazer.sjec.ac.in)
                            </span>
                            {account.roleTitle && (
                              <span className="rounded bg-purple-900/60 border border-purple-800 px-2 py-0.5 text-[10px] text-purple-300">
                                {account.roleTitle}
                              </span>
                            )}
                            <span className="flex items-center gap-1 rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
                              <Check size={11} />
                              <span>ACTIVE</span>
                            </span>
                          </div>

                          <div className="text-[11px] text-purple-300/70">
                            Created: {new Date(account.registeredAt).toLocaleString()}
                          </div>
                        </div>

                        {canManageCredentials && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCred(account)}
                              className="flex items-center gap-1.5 rounded border border-purple-800 bg-purple-950/40 px-3 py-1.5 text-xs text-purple-300 hover:bg-purple-800 hover:text-white transition-colors cursor-pointer"
                            >
                              <Pencil size={12} />
                              <span>Edit Permissions</span>
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm(`Completely delete credentials for "${account.username}"?`)) {
                                  await deleteAdmin(account.username);
                                  notify(`Deleted credentials for "${account.username}".`);
                                }
                              }}
                              className="rounded border border-purple-900 p-2 text-purple-400 hover:text-rose-400 hover:border-rose-900/60 transition-colors cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Permissions Chips */}
                      <div className="pt-2 border-t border-purple-950/80">
                        <span className="text-[10px] uppercase text-purple-400/70 font-semibold block mb-1.5">
                          Assigned Permissions:
                        </span>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span
                            className={`flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-semibold border ${
                              perms.membershipApproval
                                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 line-through'
                            }`}
                          >
                            <Shield size={12} />
                            <span>Membership Applications</span>
                          </span>

                          <span
                            className={`flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-semibold border ${
                              perms.manageEvents
                                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 line-through'
                            }`}
                          >
                            <Calendar size={12} />
                            <span>Announcing &amp; Managing Events</span>
                          </span>

                          <span
                            className={`flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-semibold border ${
                              perms.manageLeadership
                                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                                : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 line-through'
                            }`}
                          >
                            <Users size={12} />
                            <span>Editing Leadership Details</span>
                          </span>

                          {perms.manageCredentials && (
                            <span className="flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-semibold border bg-amber-950/60 border-amber-500/50 text-amber-300">
                              <KeyRound size={12} />
                              <span>Manage Credentials</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. MAIL SETTING TAB (Next to Login Credentials) */}
        {/* ========================================================================= */}
        {activeTab === 'mail' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Mail className="text-purple-400" />
                  <span>Automated Mail Settings &amp; Dispatch Timing</span>
                </h2>
                <p className="text-xs text-purple-300 mt-1">
                  Configure the official club sender email, dispatch delay (in hours), and automated templates for accepted and shortlisted candidates.
                </p>
              </div>

              {hasSavedMailSettings && (
                <div className="flex items-center gap-1 rounded border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 animate-in fade-in">
                  <CheckCircle2 size={14} />
                  <span>Settings Saved</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveMailSettings} className="space-y-6">
              {/* Card 1: Sender & Timing Settings */}
              <div className="rounded-xl border border-purple-900/60 bg-[#0d0718] p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2 border-b border-purple-950 pb-2">
                  <Clock size={16} className="text-purple-400" />
                  <span>Sender Email &amp; Delivery Delay</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                  {/* 3) Club Email */}
                  <div className="space-y-1.5">
                    <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                      Club Sender Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={mailForm.clubEmail}
                      onChange={(e) => setMailForm({ ...mailForm, clubEmail: e.target.value })}
                      placeholder="e.g. agentblazer@sjec.ac.in"
                      className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                    />
                    <span className="text-[10px] text-purple-400/60">
                      All applicant notifications are sent from this email address.
                    </span>
                  </div>

                  {/* Sender Display Name */}
                  <div className="space-y-1.5">
                    <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                      Sender Organization Name
                    </label>
                    <input
                      type="text"
                      value={mailForm.senderName}
                      onChange={(e) => setMailForm({ ...mailForm, senderName: e.target.value })}
                      placeholder="e.g. AgentBlazer Executive Council"
                      className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                    />
                    <span className="text-[10px] text-purple-400/60">
                      Display name shown in applicant's inbox.
                    </span>
                  </div>

                  {/* 2) Delay Hours */}
                  <div className="space-y-1.5">
                    <label className="block uppercase text-purple-200 text-[11px] font-semibold flex items-center gap-1">
                      <Clock size={12} className="text-cyan-400" />
                      <span>Dispatch Delay (Hours) *</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={168}
                      value={mailForm.delayHours}
                      onChange={(e) => setMailForm({ ...mailForm, delayHours: Number(e.target.value) })}
                      className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                    />
                    <span className="text-[10px] text-cyan-300/80">
                      Emails will be automatically scheduled to send {mailForm.delayHours}h after clicking Accept / Shortlist.
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Accept Email Template */}
              <div className="rounded-xl border border-purple-900/60 bg-[#0d0718] p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-purple-950 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>1) Acceptance Email Template</span>
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-purple-400/70">
                    <span>Variables:</span>
                    <code className="rounded bg-black/50 px-1 py-0.5 text-cyan-300">{"{name}"}</code>
                    <code className="rounded bg-black/50 px-1 py-0.5 text-cyan-300">{"{usn}"}</code>
                    <code className="rounded bg-black/50 px-1 py-0.5 text-cyan-300">{"{track}"}</code>
                    <code className="rounded bg-black/50 px-1 py-0.5 text-cyan-300">{"{club_email}"}</code>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                      Subject Line *
                    </label>
                    <input
                      type="text"
                      required
                      value={mailForm.acceptSubject}
                      onChange={(e) => setMailForm({ ...mailForm, acceptSubject: e.target.value })}
                      placeholder="e.g. 🎉 Congratulations! Your AgentBlazer Application is Accepted"
                      className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                      Email Body Content *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={mailForm.acceptBody}
                      onChange={(e) => setMailForm({ ...mailForm, acceptBody: e.target.value })}
                      className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none font-mono text-[11px] leading-relaxed resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Shortlist Email Template */}
              <div className="rounded-xl border border-purple-900/60 bg-[#0d0718] p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-purple-950 pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Star size={16} />
                    <span>2) Shortlist Email Template</span>
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-purple-400/70">
                    <span>Variables:</span>
                    <code className="rounded bg-black/50 px-1 py-0.5 text-cyan-300">{"{name}"}</code>
                    <code className="rounded bg-black/50 px-1 py-0.5 text-cyan-300">{"{usn}"}</code>
                    <code className="rounded bg-black/50 px-1 py-0.5 text-cyan-300">{"{track}"}</code>
                    <code className="rounded bg-black/50 px-1 py-0.5 text-cyan-300">{"{club_email}"}</code>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                      Subject Line *
                    </label>
                    <input
                      type="text"
                      required
                      value={mailForm.shortlistSubject}
                      onChange={(e) => setMailForm({ ...mailForm, shortlistSubject: e.target.value })}
                      placeholder="e.g. 📋 Update: You Have Been Shortlisted for AgentBlazer Club Interview"
                      className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                      Email Body Content *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={mailForm.shortlistBody}
                      onChange={(e) => setMailForm({ ...mailForm, shortlistBody: e.target.value })}
                      className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none font-mono text-[11px] leading-relaxed resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* Save Settings Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 text-xs font-bold uppercase text-white hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.4)] cursor-pointer"
                >
                  <Check size={14} />
                  <span>Save Mail Settings</span>
                </button>
              </div>
            </form>

            {/* Outgoing Email Queue List */}
            <div className="rounded-xl border border-purple-900/60 bg-[#0d0718] p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-purple-950 pb-2">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Send size={15} className="text-cyan-400" />
                    <span>Active Email Dispatch Queue ({scheduledEmails.length})</span>
                  </h3>
                  <p className="text-xs text-purple-300/70 mt-0.5">
                    Automated emails scheduled upon clicking Accept or Shortlist on applications.
                  </p>
                </div>
              </div>

              {scheduledEmails.length === 0 ? (
                <div className="p-8 text-center text-xs text-purple-300/60 space-y-2">
                  <Mail size={24} className="mx-auto opacity-50 text-purple-400" />
                  <div>No emails currently queued. When you click Accept or Shortlist on an applicant, their email will appear here scheduled for {mailSettings.delayHours}h delivery.</div>
                </div>
              ) : (
                <div className="grid gap-3">
                  {scheduledEmails.map((email) => {
                    const isPending = email.status === 'scheduled';
                    const diffHours = Math.max(
                      0,
                      Math.round((new Date(email.scheduledFor).getTime() - Date.now()) / (3600 * 1000))
                    );

                    return (
                      <div
                        key={email.id}
                        className={`rounded-lg border p-4 text-xs space-y-2 transition-all ${
                          isPending ? 'border-cyan-500/40 bg-cyan-950/20' : 'border-purple-900/40 bg-black/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                  email.type === 'accept'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                }`}
                              >
                                {email.type === 'accept' ? 'Acceptance Email' : 'Shortlist Email'}
                              </span>

                              <span className="font-bold text-white">{email.applicantName}</span>
                              <span className="text-purple-300 font-mono">({email.recipientEmail})</span>
                            </div>

                            <div className="text-[11px] text-purple-300/70">
                              Subject: <span className="text-purple-100">{email.subject}</span>
                            </div>

                            <div className="text-[10px] text-cyan-400 flex items-center gap-1.5">
                              <Clock size={11} />
                              {isPending ? (
                                <span>
                                  Scheduled for dispatch: {new Date(email.scheduledFor).toLocaleString()} (~{diffHours}h remaining) from {email.senderEmail}
                                </span>
                              ) : (
                                <span className="text-emerald-400 font-semibold">Dispatched / Sent</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isPending && (
                              <button
                                type="button"
                                onClick={() => {
                                  dispatchScheduledEmailNow(email.id);
                                  notify(`Dispatched email now to ${email.recipientEmail}!`);
                                }}
                                className="flex items-center gap-1 rounded bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-500 cursor-pointer"
                              >
                                <Send size={12} />
                                <span>Send Now</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                cancelScheduledEmail(email.applicationId);
                                notify(`Removed email from dispatch queue.`);
                              }}
                              className="rounded border border-purple-900 p-2 text-purple-400 hover:text-rose-400 hover:border-rose-900 cursor-pointer"
                              title="Delete from Queue"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. CONTACT TAB */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Phone className="text-purple-400" />
                  <span>Club Contact Details &amp; Helpline Channels</span>
                </h2>
                <p className="text-xs text-purple-300 mt-1">
                  Manage official contact channels, helpline numbers, campus office addresses, and social links. Synchronized with Supabase and live site.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddContact}
                className="flex items-center gap-1.5 rounded bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)] cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Contact Channel</span>
              </button>
            </div>

            {contactDetails.length === 0 ? (
              <div className="rounded-xl border border-purple-900/60 bg-[#0d0718] p-12 text-center text-xs text-purple-300/70 space-y-2">
                <Phone size={28} className="mx-auto opacity-50 text-purple-400" />
                <div className="font-bold text-sm text-purple-200">No Contact Channels Added</div>
                <div>Click &ldquo;Add Contact Channel&rdquo; to add emails, phone numbers, or lab locations.</div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {contactDetails.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-purple-900/60 bg-[#0d0718] p-5 transition-all hover:border-purple-500/50 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-lg border border-purple-800 bg-[#07040e] flex items-center justify-center text-purple-400 shrink-0">
                            {item.type === 'email' && <Mail size={16} />}
                            {item.type === 'phone' && <Phone size={16} />}
                            {item.type === 'location' && <MapPin size={16} />}
                            {item.type === 'office' && <Building size={16} />}
                            {item.type === 'social' && <Globe size={16} />}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-white">{item.title}</h3>
                            <span className="text-[10px] uppercase font-mono text-purple-400 font-semibold">
                              {item.type}
                            </span>
                          </div>
                        </div>

                        {item.isPrimary && (
                          <span className="rounded bg-purple-600/30 border border-purple-500/60 px-2 py-0.5 text-[9px] font-bold text-purple-200">
                            PRIMARY
                          </span>
                        )}
                      </div>

                      <div className="font-mono text-xs text-purple-200 break-all select-all pt-1">
                        {item.value}
                      </div>

                      {item.description && (
                        <p className="text-[11px] text-purple-300/70 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-950/80">
                      <button
                        type="button"
                        onClick={() => handleOpenEditContact(item)}
                        className="flex items-center gap-1 rounded border border-purple-800 bg-purple-950/40 px-2.5 py-1 text-xs text-purple-300 hover:bg-purple-800 hover:text-white transition-colors cursor-pointer"
                      >
                        <Pencil size={12} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete contact channel "${item.title}"?`)) {
                            deleteContactDetail(item.id);
                            notify(`Deleted contact channel "${item.title}".`);
                          }
                        }}
                        className="rounded border border-rose-900/60 p-1.5 text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                        title="Delete Channel"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT WORKSHOP EVENT */}
      {/* ========================================================================= */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-purple-500/50 bg-[#0d0718] p-6 sm:p-8 shadow-[0_0_60px_rgba(147,51,234,0.3)] my-8">
            <button
              onClick={() => setIsEventModalOpen(false)}
              className="absolute top-5 right-5 text-purple-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
              <Calendar className="text-purple-400" size={20} />
              <span>{editingEventId ? 'Edit Event Details' : 'Add New Event'}</span>
            </h3>
            <p className="text-xs text-purple-300/70 mb-5">
              Specify event name, description, duration/timeline, poster image, and venue.
            </p>

            <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                  Event Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Master the Future: A Hands-on GSoC & LLMs Workshop"
                  className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                  Event Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Provide a comprehensive summary of the workshop..."
                  className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold flex items-center gap-1">
                    <Clock size={12} className="text-purple-400" />
                    <span>Timeline / Duration *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    placeholder="e.g. March 25, 2026 • 2:00 PM - 5:00 PM (3 Hours)"
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold flex items-center gap-1">
                    <MapPin size={12} className="text-purple-400" />
                    <span>Venue / Location *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    placeholder="e.g. CSE Systems Lab 3, Block 2"
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block uppercase text-purple-200 text-[11px] font-semibold flex items-center gap-1">
                  <ImageIcon size={12} className="text-purple-400" />
                  <span>Poster Image URL</span>
                </label>
                <input
                  type="text"
                  value={eventForm.posterUrl}
                  onChange={(e) => setEventForm({ ...eventForm, posterUrl: e.target.value })}
                  placeholder="e.g. /events/gsoc-llm-1.jpg or https://images.unsplash.com/..."
                  className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                />
                {eventForm.posterUrl && (
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-purple-900 bg-black/40 p-2">
                    <img
                      src={eventForm.posterUrl}
                      alt="Poster preview"
                      className="h-14 w-14 rounded object-cover border border-purple-700"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-[11px] text-purple-300">Poster Preview Loaded</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    Tag Label
                  </label>
                  <input
                    type="text"
                    value={eventForm.tag}
                    onChange={(e) => setEventForm({ ...eventForm, tag: e.target.value })}
                    placeholder="e.g. FLAGSHIP MASTERCLASS"
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    Category Theme
                  </label>
                  <select
                    value={eventForm.tagType}
                    onChange={(e) =>
                      setEventForm({ ...eventForm, tagType: e.target.value as WorkshopEvent['tagType'] })
                    }
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="flagship">Flagship Masterclass</option>
                    <option value="contest">Live Contest / Hackathon</option>
                    <option value="symposium">Symposium Keynote</option>
                    <option value="student-lab">Student Hands-on Lab</option>
                    <option value="security">Cyber Security Workshop</option>
                    <option value="developer-lab">Developer Sandbox Lab</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    Session Lead / Speaker
                  </label>
                  <input
                    type="text"
                    value={eventForm.guestSpeaker || eventForm.sessionLeads}
                    onChange={(e) =>
                      setEventForm({
                        ...eventForm,
                        guestSpeaker: e.target.value,
                        sessionLeads: e.target.value,
                      })
                    }
                    placeholder="e.g. Mr. Santosh Rebello (Salesforce)"
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    Attendees / Cohort
                  </label>
                  <input
                    type="text"
                    value={eventForm.attendees}
                    onChange={(e) => setEventForm({ ...eventForm, attendees: e.target.value })}
                    placeholder="e.g. 80 Shortlisted Engineers"
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-950">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="rounded-lg border border-purple-900 px-4 py-2 text-xs text-purple-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-5 py-2 text-xs font-bold uppercase text-white hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.4)] cursor-pointer"
                >
                  {editingEventId ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT LEADERSHIP MEMBER */}
      {/* ========================================================================= */}
      {isLeaderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-purple-500/50 bg-[#0d0718] p-6 sm:p-8 shadow-[0_0_60px_rgba(147,51,234,0.3)] my-8">
            <button
              onClick={() => setIsLeaderModalOpen(false)}
              className="absolute top-5 right-5 text-purple-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
              <Users className="text-purple-400" size={20} />
              <span>{editingLeaderId ? 'Edit Member Details' : 'Add Leadership Member'}</span>
            </h3>
            <p className="text-xs text-purple-300/70 mb-5">
              Update name, executive title, council category, bio, and profile photo.
            </p>

            <form onSubmit={handleSaveLeader} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderForm.name}
                    onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })}
                    placeholder="e.g. Ruben Saldanha"
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    Initials
                  </label>
                  <input
                    type="text"
                    value={leaderForm.initials}
                    onChange={(e) => setLeaderForm({ ...leaderForm, initials: e.target.value })}
                    placeholder="e.g. RS"
                    maxLength={3}
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    Primary Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderForm.role}
                    onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })}
                    placeholder="e.g. President / Faculty Coordinator"
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    Department Role / Subtitle
                  </label>
                  <input
                    type="text"
                    value={leaderForm.departmentRole}
                    onChange={(e) => setLeaderForm({ ...leaderForm, departmentRole: e.target.value })}
                    placeholder="e.g. Student President • AgentBlazer Club"
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    Council Category *
                  </label>
                  <select
                    value={leaderForm.category}
                    onChange={(e) =>
                      setLeaderForm({ ...leaderForm, category: e.target.value as LeadershipMember['category'] })
                    }
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="core-officer">Student Core Team &amp; Officers</option>
                    <option value="faculty">Faculty Advisory Council</option>
                    <option value="guest">Honored Guests &amp; Leadership</option>
                    <option value="working-committee">Core Working Committee</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    Sub-category Badge Title
                  </label>
                  <input
                    type="text"
                    value={leaderForm.subCategoryTitle}
                    onChange={(e) => setLeaderForm({ ...leaderForm, subCategoryTitle: e.target.value })}
                    placeholder="e.g. Executive President / Keynote Speaker"
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block uppercase text-purple-200 text-[11px] font-semibold flex items-center gap-1">
                  <ImageIcon size={12} className="text-purple-400" />
                  <span>Profile Photo URL</span>
                </label>
                <input
                  type="text"
                  value={leaderForm.photoUrl}
                  onChange={(e) => setLeaderForm({ ...leaderForm, photoUrl: e.target.value })}
                  placeholder="e.g. /people/ruben-saldanha.jpg or https://images.unsplash.com/..."
                  className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                />
                {leaderForm.photoUrl && (
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-purple-900 bg-black/40 p-2">
                    <img
                      src={leaderForm.photoUrl}
                      alt="Avatar preview"
                      className="h-12 w-12 rounded-full object-cover border border-purple-700"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-[11px] text-purple-300">Photo Loaded</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                  Bio / Statement
                </label>
                <textarea
                  rows={2}
                  value={leaderForm.description}
                  onChange={(e) => setLeaderForm({ ...leaderForm, description: e.target.value })}
                  placeholder="Short bio regarding their leadership contribution, research interests, or background..."
                  className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    College / Department
                  </label>
                  <input
                    type="text"
                    value={leaderForm.college}
                    onChange={(e) => setLeaderForm({ ...leaderForm, college: e.target.value })}
                    placeholder="e.g. SJEC CSE"
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    value={leaderForm.linkedin}
                    onChange={(e) => setLeaderForm({ ...leaderForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-950">
                <button
                  type="button"
                  onClick={() => setIsLeaderModalOpen(false)}
                  className="rounded-lg border border-purple-900 px-4 py-2 text-xs text-purple-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-5 py-2 text-xs font-bold uppercase text-white hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.4)] cursor-pointer"
                >
                  {editingLeaderId ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CREATE / EDIT LOGIN CREDENTIALS */}
      {/* ========================================================================= */}
      {isCredModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-purple-500/50 bg-[#0d0718] p-6 sm:p-8 shadow-[0_0_60px_rgba(147,51,234,0.3)] my-8">
            <button
              onClick={() => setIsCredModalOpen(false)}
              className="absolute top-5 right-5 text-purple-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
              <KeyRound className="text-purple-400" size={20} />
              <span>{editingCredUsername ? 'Edit Member Credentials' : 'Create Member Credentials'}</span>
            </h3>
            <p className="text-xs text-purple-300/70 mb-5">
              Set username, password, and assign granular permissions for this club member account.
            </p>

            {credError && (
              <div className="mb-4 rounded border border-rose-500/50 bg-rose-500/10 p-3 text-xs text-rose-400">
                {credError}
              </div>
            )}

            <form onSubmit={handleSaveCredential} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                  Member Username *
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingCredUsername)}
                  value={credUsername}
                  onChange={(e) => setCredUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
                  placeholder="e.g. event_lead_alex"
                  className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none disabled:opacity-50"
                />
                <span className="text-[10px] text-purple-400/60">
                  Login alias will be: {credUsername ? `${credUsername}@agentblazer.sjec.ac.in` : 'username@agentblazer.sjec.ac.in'}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                    {editingCredUsername ? 'New Password (leave blank to keep current)' : 'Member Password *'}
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    <Sparkles size={11} />
                    <span>Generate Random</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showCredPassword ? 'text' : 'password'}
                    required={!editingCredUsername}
                    value={credPassword}
                    onChange={(e) => setCredPassword(e.target.value)}
                    placeholder={editingCredUsername ? 'Enter new password to change' : 'Min 6 characters'}
                    className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 pr-10 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCredPassword(!showCredPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white cursor-pointer"
                  >
                    {showCredPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  value={credRoleTitle}
                  onChange={(e) => setCredRoleTitle(e.target.value)}
                  placeholder="e.g. Lead Event Coordinator, Secretarial Lead"
                  className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-purple-950">
                <span className="block uppercase text-purple-200 text-[11px] font-bold tracking-wider">
                  Assigned Permissions:
                </span>

                <div className="space-y-2 bg-[#07040e] rounded-xl border border-purple-900/70 p-3">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={credPermissions.membershipApproval}
                      onChange={(e) =>
                        setCredPermissions({ ...credPermissions, membershipApproval: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-purple-700 bg-purple-950 text-purple-600 focus:ring-0 cursor-pointer accent-purple-600"
                    />
                    <div>
                      <div className="font-semibold text-white">Membership Applications Approval</div>
                      <div className="text-[10px] text-purple-300/70">
                        View, accept, shortlist, and reject incoming student applications.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none pt-2 border-t border-purple-950">
                    <input
                      type="checkbox"
                      checked={credPermissions.manageEvents}
                      onChange={(e) =>
                        setCredPermissions({ ...credPermissions, manageEvents: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-purple-700 bg-purple-950 text-purple-600 focus:ring-0 cursor-pointer accent-purple-600"
                    />
                    <div>
                      <div className="font-semibold text-white">Announcing &amp; Managing Events</div>
                      <div className="text-[10px] text-purple-300/70">
                        Create, edit details, upload posters, set venues, and reorder events.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none pt-2 border-t border-purple-950">
                    <input
                      type="checkbox"
                      checked={credPermissions.manageLeadership}
                      onChange={(e) =>
                        setCredPermissions({ ...credPermissions, manageLeadership: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-purple-700 bg-purple-950 text-purple-600 focus:ring-0 cursor-pointer accent-purple-600"
                    />
                    <div>
                      <div className="font-semibold text-white">Editing Leadership Details</div>
                      <div className="text-[10px] text-purple-300/70">
                        Add, edit member bios, photos, and roles in the leadership council.
                      </div>
                    </div>
                  </label>

                  {isMainAdmin && (
                    <label className="flex items-center gap-3 cursor-pointer select-none pt-2 border-t border-purple-950">
                      <input
                        type="checkbox"
                        checked={Boolean(credPermissions.manageCredentials)}
                        onChange={(e) =>
                          setCredPermissions({ ...credPermissions, manageCredentials: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-purple-700 bg-purple-950 text-purple-600 focus:ring-0 cursor-pointer accent-purple-600"
                      />
                      <div>
                        <div className="font-semibold text-amber-300">Manage Member Credentials</div>
                        <div className="text-[10px] text-purple-300/70">
                          Allow this user to create and edit other members' login accounts.
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-950">
                <button
                  type="button"
                  onClick={() => setIsCredModalOpen(false)}
                  className="rounded-lg border border-purple-900 px-4 py-2 text-xs text-purple-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCred}
                  className="rounded-lg bg-purple-600 px-5 py-2 text-xs font-bold uppercase text-white hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.4)] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingCred
                    ? 'Saving...'
                    : editingCredUsername
                    ? 'Update Credentials'
                    : 'Create Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD / EDIT CONTACT DETAIL */}
      {/* ========================================================================= */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-purple-500/50 bg-[#0d0718] p-6 sm:p-8 shadow-[0_0_60px_rgba(147,51,234,0.3)] my-8">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-5 right-5 text-purple-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-1">
              <Phone className="text-purple-400" size={20} />
              <span>{editingContactId ? 'Edit Contact Channel' : 'Add Contact Channel'}</span>
            </h3>
            <p className="text-xs text-purple-300/70 mb-5">
              Specify the title, channel category (email, phone, address, etc.), and contact information.
            </p>

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                  Channel Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.title}
                  onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                  placeholder="e.g. Official Inquiries Email, Helpline Desk"
                  className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                  Channel Category *
                </label>
                <select
                  value={contactForm.type}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, type: e.target.value as ContactDetail['type'] })
                  }
                  className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="email">Email Address</option>
                  <option value="phone">Telephone / Mobile Helpline</option>
                  <option value="location">Campus Location / Address</option>
                  <option value="office">Faculty / Coordinator Desk</option>
                  <option value="social">Social Link / Trailhead Group</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                  Contact Value / Address / Number *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.value}
                  onChange={(e) => setContactForm({ ...contactForm, value: e.target.value })}
                  placeholder="e.g. agentblazer@sjec.ac.in or +91 98765 43210"
                  className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block uppercase text-purple-200 text-[11px] font-semibold">
                  Working Hours / Description
                </label>
                <input
                  type="text"
                  value={contactForm.description}
                  onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                  placeholder="e.g. Available Mon - Fri, 9:00 AM - 5:00 PM"
                  className="w-full rounded-lg border border-purple-900/80 bg-[#07040e] px-3.5 py-2.5 text-white placeholder-purple-400/40 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={contactForm.isPrimary}
                    onChange={(e) => setContactForm({ ...contactForm, isPrimary: e.target.checked })}
                    className="h-4 w-4 rounded border-purple-700 bg-purple-950 text-purple-600 focus:ring-0 cursor-pointer accent-purple-600"
                  />
                  <span className="text-purple-200">Mark as Primary Contact Channel</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-950">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="rounded-lg border border-purple-900 px-4 py-2 text-xs text-purple-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-purple-600 px-5 py-2 text-xs font-bold uppercase text-white hover:bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.4)] cursor-pointer"
                >
                  {editingContactId ? 'Save Changes' : 'Add Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
