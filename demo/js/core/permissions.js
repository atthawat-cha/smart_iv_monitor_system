// Role-based access rules for the demo. One source of truth for "who can see which ward's
// data" and "who can perform clinical actions" — every page filters through this instead of
// re-implementing role checks inline.
//
// Roles:
//   superadmin  - full system control (Settings) + hospital-wide read-only clinical view
//   admin       - hospital-wide oversight (all wards, all pages) but read-only, no clinical actions
//   head_nurse  - hospital-wide clinical: sees + acts on every ward
//   nurse       - ward-scoped clinical: sees + acts on their assigned ward only
//   guest       - public/presentation view only (tv.html), no PII, no actions, no other pages
window.SMIS = window.SMIS || {};

SMIS.Permissions = (function () {
  function role(state) {
    return (state.session && state.session.role) || 'guest';
  }

  // null = unscoped (sees every ward). A string = restricted to that one ward.
  function myWardId(state) {
    const r = role(state);
    if (r !== 'nurse') return null;
    return (state.session && state.session.wardId) || null;
  }

  function scopedWards(state) {
    const wardId = myWardId(state);
    return wardId ? state.wards.filter((w) => w.id === wardId) : state.wards;
  }

  function scopedBeds(state) {
    const wardId = myWardId(state);
    return wardId ? state.beds.filter((b) => b.wardId === wardId) : state.beds;
  }

  function scopedDevices(state) {
    const wardId = myWardId(state);
    if (!wardId) return state.devices;
    const bedIds = new Set(state.beds.filter((b) => b.wardId === wardId).map((b) => b.id));
    return state.devices.filter((d) => {
      const bed = state.beds.find((b) => b.deviceId === d.id);
      return bed && bedIds.has(bed.id);
    });
  }

  function scopedAlerts(state) {
    const wardId = myWardId(state);
    if (!wardId) return state.alerts;
    const bedIds = new Set(state.beds.filter((b) => b.wardId === wardId).map((b) => b.id));
    return state.alerts.filter((a) => bedIds.has(a.bedId));
  }

  // Can this bed be viewed/acted on given the current session's ward scope?
  function canAccessBed(state, bedId) {
    const wardId = myWardId(state);
    if (!wardId) return true;
    const bed = state.beds.find((b) => b.id === bedId);
    return !!bed && bed.wardId === wardId;
  }

  function canManageSystem(state) {
    return role(state) === 'superadmin';
  }

  function canViewAnalytics(state) {
    return ['head_nurse', 'admin', 'superadmin'].includes(role(state));
  }

  // Clinical actions: acknowledge, resolve/mark IV changed, temporary mobility, mark alert
  // read/resolve alert. Bedside/charge nursing staff only — admin/superadmin are oversight-only,
  // guest has no access at all.
  function canAct(state) {
    return ['nurse', 'head_nurse'].includes(role(state));
  }

  function isGuest(state) {
    return role(state) === 'guest';
  }

  return {
    role, myWardId, scopedWards, scopedBeds, scopedDevices, scopedAlerts,
    canAccessBed, canManageSystem, canViewAnalytics, canAct, isGuest,
  };
})();
