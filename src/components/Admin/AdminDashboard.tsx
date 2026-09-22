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
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { WorkshopEvent, LeadershipMember } from '../../types';

interface AdminDashboardProps {
  onBackToSite: () => void;
  onLogout?: () => void;
}

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
  } = useData();

  const { user } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'applications' | 'events' | 'leadership'>('applications');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3000);
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
              SUPABASE CLOUD CONTROLLER
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

        {/* CMS Tabs */}
        <div className="mx-auto max-w-7xl mt-4 flex overflow-x-auto gap-2 border-t border-purple-900/60 pt-3">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                : 'text-purple-300 hover:bg-purple-900/40'
            }`}
          >
            <Inbox size={14} />
            <span>Applications ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                : 'text-purple-300 hover:bg-purple-900/40'
            }`}
          >
            <Calendar size={14} />
            <span>Events &amp; Workshops ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leadership')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'leadership'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                : 'text-purple-300 hover:bg-purple-900/40'
            }`}
          >
            <Users size={14} />
            <span>Leadership Team ({leadership.length})</span>
          </button>
        </div>
      </header>

      {/* Floating Status Notification */}
      {statusNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded border border-purple-500 bg-[#0d0718] px-4 py-3 text-xs text-purple-300 shadow-[0_0_20px_rgba(147,51,234,0.4)]">
          <Check size={16} />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Main CMS Container */}
      <main className="mx-auto max-w-7xl px-6 pt-8">
        {/* ======================= TAB: APPLICATIONS ======================= */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Student Membership Submissions
                </h2>
                <p className="text-xs text-purple-300 mt-1">
                  Applications stored directly in Supabase cloud database. Real-time updates enabled.
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

            {applications.length === 0 ? (
              <div className="rounded-xl border border-purple-900/60 bg-[#0d0718] p-12 text-center text-xs text-purple-300/70">
                No membership applications received yet. Submissions from the public portal will appear here in real-time.
              </div>
            ) : (
              <div className="grid gap-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-xl border border-purple-900/60 bg-[#0d0718] p-5 transition-all hover:border-purple-500/50 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-white">{app.name}</h3>
                          {app.usn && (
                            <span className="rounded bg-purple-900/60 px-2 py-0.5 text-[10px] text-purple-300">
                              {app.usn}
                            </span>
                          )}
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] uppercase font-bold ${
                              app.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {app.status || 'approved'}
                          </span>
                        </div>
                        <div className="text-xs text-purple-300/80 mt-0.5">
                          {app.email} {app.year ? `• ${app.year}` : ''} {app.department ? `• ${app.department}` : ''}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newStatus = app.status === 'approved' ? 'review' : 'approved';
                            updateApplicationStatus(app.id, newStatus);
                            notify(`Marked application as ${newStatus}.`);
                          }}
                          className="rounded border border-purple-800 px-2.5 py-1 text-[11px] text-purple-300 hover:bg-purple-900/40 cursor-pointer"
                        >
                          Toggle Status
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete application from ${app.name}?`)) {
                              deleteApplication(app.id);
                              notify('Application removed from database.');
                            }
                          }}
                          className="rounded border border-rose-900/60 px-2.5 py-1 text-[11px] text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

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
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB: EVENTS ======================= */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Events &amp; Workshops</h2>
                <p className="text-xs text-purple-300 mt-1">
                  Reorder positions using Up/Down controls. Synchronized with Supabase cloud.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newEv: WorkshopEvent = {
                    id: 'workshop-' + Date.now(),
                    date: 'UPCOMING',
                    tag: 'NEW WORKSHOP',
                    tagType: 'developer-lab',
                    title: 'New Technical Workshop',
                    description: 'Hands-on session description for participants.',
                    gallery: [],
                  };
                  addEvent(newEv);
                  notify('Added new workshop event to Supabase.');
                }}
                className="flex items-center gap-1.5 rounded bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-500 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Event</span>
              </button>
            </div>

            <div className="grid gap-3">
              {events.map((ev, idx) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-purple-900/60 bg-[#0d0718] p-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-purple-400 font-bold">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="font-bold text-white text-sm">{ev.title}</div>
                      <div className="text-purple-300/70 text-[11px]">{ev.date} • {ev.tag}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        reorderEvents(idx, idx - 1);
                        notify('Moved event up.');
                      }}
                      className="rounded border border-purple-900 p-1 text-purple-300 hover:bg-purple-900/40 disabled:opacity-30 cursor-pointer"
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
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB: LEADERSHIP ======================= */}
        {activeTab === 'leadership' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Leadership Council</h2>
                <p className="text-xs text-purple-300 mt-1">
                  Manage team leads, mentors, and student officers. Synchronized with Supabase cloud.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newMember: LeadershipMember = {
                    id: 'lead-' + Date.now(),
                    name: 'New Officer',
                    role: 'Technical Lead',
                    departmentRole: 'CSE Department',
                    category: 'student-lab' as any,
                    initials: 'NO',
                    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
                  };
                  addLeader(newMember);
                  notify('Added new leader to Supabase.');
                }}
                className="flex items-center gap-1.5 rounded bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-500 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Member</span>
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {leadership.map((leader, idx) => (
                <div
                  key={leader.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-purple-900/60 bg-[#0d0718] p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={leader.photoUrl}
                      alt={leader.name}
                      className="h-10 w-10 rounded-full object-cover border border-purple-800"
                    />
                    <div>
                      <div className="font-bold text-white">{leader.name}</div>
                      <div className="text-[11px] text-purple-300/70">{leader.role} • {leader.departmentRole}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        reorderLeadership(idx, idx - 1);
                        notify('Moved leader up.');
                      }}
                      className="rounded border border-purple-900 p-1 text-purple-300 hover:bg-purple-900/40 disabled:opacity-30 cursor-pointer"
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
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
