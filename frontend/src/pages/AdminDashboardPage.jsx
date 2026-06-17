import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MessageSquare, CheckCircle, XCircle, Star, FileText,
  Search, RefreshCw, ChevronUp, ChevronDown, Trash2, Shield,
  UserCheck, UserX, Activity, BarChart3, ArrowUpDown, Eye, EyeOff, Loader2
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Logo from '../assets/Logo-transparent.png';
import Loader from '../components/common/Loader';

/* ─── Badge ──────────────────────────────────────────────────────────────────── */
const Badge = ({ children, variant = 'gray' }) => {
  const map = {
    gold:  'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700/40',
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/40',
    red:   'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700/40',
    blue:  'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/40',
    gray:  'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${map[variant]}`}>
      {children}
    </span>
  );
};

/* ─── Stat Card ──────────────────────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, sub, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }} whileHover={{ y: -4 }}
    className="bg-white dark:bg-[#161B2E] border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 flex items-center gap-5 shadow-sm"
  >
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30">
      <Icon size={20} className="text-amber-600 dark:text-amber-400" />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-900 dark:text-white">{value ?? '—'}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

/* ─── Sortable TH ────────────────────────────────────────────────────────────── */
const Th = ({ children, sortKey, sortState, onSort }) => {
  const active = sortState?.key === sortKey;
  return (
    <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 text-left whitespace-nowrap">
      {sortKey ? (
        <button onClick={() => onSort(sortKey)}
          className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
          {children}
          {active
            ? (sortState.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
            : <ArrowUpDown size={11} className="opacity-30" />}
        </button>
      ) : children}
    </th>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────────── */
const AdminDashboardPage = () => {
  const [tab, setTab]         = useState('users');
  const [users, setUsers]     = useState([]);
  const [resumes, setResumes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [sort, setSort]       = useState({ key: 'id', dir: 'desc' });
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [u, r, rv, s] = await Promise.allSettled([
        adminAPI.getUsers('desc', ''),
        adminAPI.getResumes('desc'),
        adminAPI.getReviews(),
        adminAPI.getStats(),
      ]);
      if (u.status === 'fulfilled') setUsers(Array.isArray(u.value.data) ? u.value.data : []);
      else console.error('Failed to load users:', u.reason);
      if (r.status === 'fulfilled') setResumes(Array.isArray(r.value.data) ? r.value.data : []);
      else console.error('Failed to load resumes:', r.reason);
      if (rv.status === 'fulfilled') setReviews(Array.isArray(rv.value.data) ? rv.value.data : []);
      else console.error('Failed to load reviews:', rv.reason);
      if (s.status === 'fulfilled') setStats(s.value.data);
      else console.error('Failed to load stats:', s.reason);

      const anyFailed = [u, r, rv, s].some(p => p.status === 'rejected');
      if (anyFailed) toast.error('Some admin data failed to load.');
    } catch { toast.error('Failed to load admin data.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* sort helper */
  const handleSort = (key) =>
    setSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));

  const sortArr = (arr, field) => [...arr].sort((a, b) => {
    const av = a[field] ?? ''; const bv = b[field] ?? '';
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
    return sort.dir === 'asc' ? cmp : -cmp;
  });

  const filteredUsers = users.filter(u =>
    !search ||
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const sortedUsers =
    sort.key === 'id'   ? sortArr(filteredUsers, 'id') :
    sort.key === 'name' ? sortArr(filteredUsers, 'full_name') :
    sort.key === 'date' ? sortArr(filteredUsers, 'created_at') :
    filteredUsers;

  /* actions */
  const toggleActive = async (id) => {
    setActionLoading(id + '-a');
    try {
      const res = await adminAPI.toggleUserActive(id);
      setUsers(p => p.map(u => u.id === id ? { ...u, is_active: res.data.is_active } : u));
      toast.success(res.data.message);
    } catch (e) { toast.error(e.message); }
    finally { setActionLoading(null); }
  };

  const changeRole = async (id, role) => {
    setActionLoading(id + '-r');
    try {
      const res = await adminAPI.changeUserRole(id, role);
      setUsers(p => p.map(u => u.id === id ? { ...u, role: res.data.role } : u));
      toast.success('Role updated!');
    } catch (e) { toast.error(e.message); }
    finally { setActionLoading(null); }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`"${name}" ko permanently delete karein?`)) return;
    setActionLoading(id + '-d');
    try {
      await adminAPI.deleteUser(id);
      setUsers(p => p.filter(u => u.id !== id));
      toast.success('User deleted.');
    } catch (e) { toast.error(e.message); }
    finally { setActionLoading(null); }
  };

  const deleteResume = async (id) => {
    if (!window.confirm('Is resume ko delete karein?')) return;
    try {
      await adminAPI.deleteResume(id);
      setResumes(p => p.filter(r => r.id !== id));
      toast.success('Resume deleted.');
    } catch (e) { toast.error(e.message); }
  };

  const toggleReview = async (id, visible) => {
    try {
      const res = await adminAPI.updateReview(id, { is_visible: !visible });
      setReviews(p => p.map(r => r.id === id ? res.data : r));
      toast.success(`Review ${!visible ? 'approved' : 'hidden'}.`);
    } catch (e) { toast.error(e.message); }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Is review ko permanently delete karein?')) return;
    try {
      await adminAPI.deleteReview(id);
      setReviews(p => p.filter(r => r.id !== id));
      toast.success('Review deleted.');
    } catch (e) { toast.error(e.message); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const TABS = [
    { key: 'users',   label: 'Users',   icon: Users,         count: users.length },
    { key: 'resumes', label: 'Resumes', icon: FileText,      count: resumes.length },
    { key: 'reviews', label: 'Reviews', icon: MessageSquare, count: reviews.length },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 font-sans bg-slate-50 dark:bg-[#0B0F1A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Helmet><title>Admin Control | ResumeAI</title></Helmet>

      <div className="max-w-screen-xl mx-auto px-4 lg:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="ResumeAI" className="h-10 w-auto" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 mb-0.5">
                Administrative Control
              </p>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Dashboard</h1>
            </div>
          </div>
          <button onClick={fetchData} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all
              border-amber-400 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={Users}     label="Total Users"   value={stats?.total_users}    sub={`${stats?.active_users ?? 0} active`} delay={0.05} />
          <StatCard icon={Activity}  label="Active Users"  value={stats?.active_users}   delay={0.1} />
          <StatCard icon={BarChart3} label="Analyses Run"  value={stats?.total_analyses} delay={0.15} />
          <StatCard icon={FileText}  label="Total Resumes" value={stats?.total_resumes}  delay={0.2} />
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                tab === t.key
                  ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                  : 'bg-white dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-400'
              }`}>
              <t.icon size={13} />
              {t.label}
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                tab === t.key ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
              }`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* ── Panel ── */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">

            {/* ══ USERS TAB ══ */}
            {tab === 'users' && (
              <>
                <div className="p-5 border-b border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:max-w-xs">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search by name or email…"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition
                        bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600
                        text-slate-900 dark:text-slate-100 placeholder-slate-400
                        focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400"
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-bold shrink-0">{sortedUsers.length} records</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/50">
                        <Th sortKey="id"   sortState={sort} onSort={handleSort}>#ID</Th>
                        <Th sortKey="name" sortState={sort} onSort={handleSort}>Name</Th>
                        <Th>Email</Th>
                        <Th>Role</Th>
                        <Th>Status</Th>
                        <Th sortKey="date" sortState={sort} onSort={handleSort}>Joined</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                      {sortedUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-5 py-4 font-mono text-xs text-slate-400">#{u.id}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 bg-gradient-to-br from-amber-400 to-amber-700">
                                {u.full_name?.[0]?.toUpperCase()}
                              </div>
                              <span className="font-semibold text-slate-900 dark:text-white">{u.full_name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">{u.email}</td>
                          <td className="px-5 py-4">
                            {u.role === 'admin' ? <Badge variant="gold">Admin</Badge> : (
                              <select value={u.role}
                                onChange={e => changeRole(u.id, e.target.value)}
                                disabled={!!actionLoading}
                                className="text-[10px] font-black uppercase rounded-lg px-2 py-1 border outline-none cursor-pointer
                                  bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600
                                  text-slate-700 dark:text-slate-300">
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                              </select>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <Badge variant={u.is_active ? 'green' : 'red'}>
                              {u.is_active
                                ? <><CheckCircle size={10} />Active</>
                                : <><XCircle size={10} />Inactive</>}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-400">{fmt(u.created_at)}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              {u.role !== 'admin' && (
                                <>
                                  <button onClick={() => toggleActive(u.id)}
                                    disabled={actionLoading === u.id + '-a'}
                                    title={u.is_active ? 'Deactivate' : 'Activate'}
                                    className={`p-1.5 rounded-lg border transition-colors ${
                                      u.is_active
                                        ? 'border-red-200 dark:border-red-800/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                        : 'border-emerald-200 dark:border-emerald-800/50 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                    }`}>
                                    {actionLoading === u.id + '-a'
                                      ? <Loader2 size={13} className="animate-spin" />
                                      : u.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
                                  </button>
                                  <button onClick={() => deleteUser(u.id, u.full_name)}
                                    disabled={actionLoading === u.id + '-d'}
                                    title="Delete User"
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 transition-colors">
                                    {actionLoading === u.id + '-d'
                                      ? <Loader2 size={13} className="animate-spin" />
                                      : <Trash2 size={13} />}
                                  </button>
                                </>
                              )}
                              {u.role === 'admin' && (
                                <Shield size={14} className="text-amber-500" title="Admin Protected" />
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {sortedUsers.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">No users found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ══ RESUMES TAB (Leaderboard) ══ */}
            {tab === 'resumes' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/50">
                      <Th>Rank</Th>
                      <Th>#ID</Th>
                      <Th>Filename</Th>
                      <Th>User</Th>
                      <Th>Best ATS Score</Th>
                      <Th>Skills Detected</Th>
                      <Th>Uploaded</Th>
                      <Th>Action</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                    {[...resumes].sort((a, b) => (b.best_score ?? 0) - (a.best_score ?? 0)).map((r, idx) => {
                      const rank = idx + 1;
                      const hasScore = r.best_score > 0;
                      return (
                        <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-5 py-4">
                            {hasScore ? (
                              rank === 1 ? <Badge variant="gold">🥇 Rank #1</Badge> :
                              rank === 2 ? <Badge variant="gray">🥈 Rank #2</Badge> :
                              rank === 3 ? <Badge variant="blue">🥉 Rank #3</Badge> :
                              <Badge variant="gray">Rank #{rank}</Badge>
                            ) : (
                              <span className="text-slate-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4 font-mono text-xs text-slate-400">#{r.id}</td>
                          <td className="px-5 py-4 font-medium text-slate-800 dark:text-slate-200 max-w-[180px] truncate">{r.filename}</td>
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{r.user_name}</p>
                              <p className="text-[10px] text-slate-400">{r.user_email}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {hasScore ? (
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                                r.best_score >= 80 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                r.best_score >= 50 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                              }`}>
                                {Math.round(r.best_score)}%
                              </span>
                            ) : (
                              <Badge variant="gray">No Run</Badge>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {(Array.isArray(r.skills) ? r.skills.slice(0, 4) : []).map((s, i) => (
                                <span key={i}
                                  className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/30">
                                  {s}
                                </span>
                              ))}
                              {Array.isArray(r.skills) && r.skills.length > 4 && (
                                <span className="text-[10px] text-slate-400">+{r.skills.length - 4}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-400">{fmt(r.created_at)}</td>
                          <td className="px-5 py-4">
                            <button onClick={() => deleteResume(r.id)} title="Delete Resume"
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {resumes.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-16 text-slate-400 text-sm">No resumes uploaded yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ══ REVIEWS TAB ══ */}
            {tab === 'reviews' && (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {reviews.length === 0 && (
                  <div className="py-20 text-center text-slate-400 text-sm">No reviews yet.</div>
                )}
                {reviews.map(rv => (
                  <div key={rv.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <div className="flex flex-col lg:flex-row gap-6 justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="font-bold text-slate-900 dark:text-white">{rv.user_name}</span>
                          <Badge variant="gray">#{rv.user_id}</Badge>
                          <Badge variant={rv.is_visible ? 'green' : 'gray'}>
                            {rv.is_visible ? 'Visible' : 'Hidden'}
                          </Badge>
                        </div>
                        <div className="flex gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14}
                              className={i < rv.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'} />
                          ))}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm italic">"{rv.content}"</p>
                      </div>
                      <div className="flex items-start gap-2 shrink-0">
                        <button onClick={() => toggleReview(rv.id, rv.is_visible)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-black uppercase tracking-widest transition-all ${
                            rv.is_visible
                              ? 'border-red-200 dark:border-red-800 text-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20'
                              : 'border-emerald-200 dark:border-emerald-800 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
                          }`}>
                          {rv.is_visible ? <><EyeOff size={12} />Hide</> : <><Eye size={12} />Approve</>}
                        </button>
                        <button onClick={() => deleteReview(rv.id)}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* ── Footer ── */}
        <div className="mt-8 flex items-center justify-between text-xs text-slate-400">
          <span>ResumeAI Admin Panel</span>
          <span className="text-amber-500 dark:text-amber-400 font-bold">All changes are live & instant</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
