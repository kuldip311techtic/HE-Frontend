import { apiRequest } from '@/lib/api/client';

// Coach
export interface ClearCacheRequest {
  cache_type: string;
}

export interface ClearCacheResponse {
  clear_status: string;
}

export interface CoachSyncRequest {
  phone: string;
}

export interface CoachSyncResponse {
  sync_status: string;
}

export interface CoachHomeResponse {
  total_sessions: number;
  total_players: number;
  recent_activities: unknown[];
  attendance_records: unknown[];
}

export function clearCoachCache(data: ClearCacheRequest) {
  return apiRequest<ClearCacheResponse>({
    method: 'POST',
    url: '/coach/clear-cache',
    data,
  });
}

export function syncCoach(data: CoachSyncRequest) {
  return apiRequest<CoachSyncResponse>({
    method: 'POST',
    url: '/coach/sync',
    data,
  });
}

export function getCoachHome() {
  return apiRequest<CoachHomeResponse>({ method: 'GET', url: '/coach/home' });
}

// Sessions
export interface RecordSessionRequest {
  session_mode: string;
  session_details: { description: string };
  phone: string;
}

export interface RecordSessionResponse {
  success: boolean;
  session_mode: string;
  id: string;
  error: null;
}

export interface SessionResponse {
  id?: string;
  [key: string]: unknown;
}

export function recordSession(data: RecordSessionRequest) {
  return apiRequest<RecordSessionResponse>({
    method: 'POST',
    url: '/api/v1/sessions/record',
    data,
  });
}

export function getSession(sessionId: string) {
  return apiRequest<SessionResponse>({
    method: 'GET',
    url: `/sessions/${sessionId}`,
  });
}

export function nextSessionDrill(sessionId: string) {
  return apiRequest<unknown>({
    method: 'POST',
    url: `/sessions/${sessionId}/next-drill`,
  });
}

export function endSession(sessionId: string) {
  return apiRequest<unknown>({
    method: 'POST',
    url: `/sessions/${sessionId}/end`,
  });
}

// Admin
export interface CreateTeamRequest {
  team_name: string;
  age_group: string;
  coaches: { id: string }[];
  players: { id: string }[];
}

export interface CreateTeamResponse {
  id: string;
  team_name: string;
  age_group: string;
}

export interface InviteCoachRequest {
  email: string;
  phone: string;
  company: string;
}

export interface InviteCoachResponse {
  success: boolean;
  message: string;
}

export function createTeam(data: CreateTeamRequest) {
  return apiRequest<CreateTeamResponse>({
    method: 'POST',
    url: '/admin/teams',
    data,
  });
}

export function inviteCoach(data: InviteCoachRequest) {
  return apiRequest<InviteCoachResponse>({
    method: 'POST',
    url: '/admin/invite-coach',
    data,
  });
}

// Organization
export interface OrganizationProfile {
  organization_name: string;
  name: string;
  description: string;
  contact_info: string;
  first_name: string;
  last_name: string;
}

export interface OrganizationProfileResponse {
  success: boolean;
  profile: OrganizationProfile;
}

export interface UpdateOrganizationProfileResponse {
  success: boolean;
  message: string;
}

export function getOrganizationProfile() {
  return apiRequest<OrganizationProfileResponse>({
    method: 'GET',
    url: '/organization/profile',
  });
}

export function updateOrganizationProfile(data: OrganizationProfile) {
  return apiRequest<UpdateOrganizationProfileResponse>({
    method: 'POST',
    url: '/organization/profile',
    data,
  });
}

// Coach Drills
export interface CoachDrillSearchRequest {
  search_query: string;
  full_name: string;
  phone: string;
}

export interface CoachDrillSearchResponse {
  success: boolean;
  error: null;
  search_query: string;
  players: { name: string }[];
}

export interface SelectPlayerRequest {
  selected_player_id: string;
  full_name: string;
  phone: string;
}

export interface SelectPlayerResponse {
  success: boolean;
  selected_player_id: string;
  link: string;
  error: null;
}

export function searchCoachDrills(data: CoachDrillSearchRequest) {
  return apiRequest<CoachDrillSearchResponse>({
    method: 'POST',
    url: '/api/v1/coach_drills/search',
    data,
  });
}

export function selectCoachDrillPlayer(data: SelectPlayerRequest) {
  return apiRequest<SelectPlayerResponse>({
    method: 'POST',
    url: '/api/v1/coach_drills/select_player',
    data,
  });
}

// Super Admin
export interface Organization {
  id: string;
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
  join_code: string;
}

export interface OrganizationsListResponse {
  items: Organization[];
  pagination: { page: number; total: number };
}

export interface CreateOrganizationRequest {
  name: string;
  contact_email: string;
  phone_number: string;
  address: string;
}

export interface CreateOrganizationResponse extends Organization {
  message: string;
}

export interface SuperAdminUser {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  is_self: boolean;
}

export interface UsersListResponse {
  items: SuperAdminUser[];
  pagination: { page: number; total: number };
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

export interface CreateUserResponse extends SuperAdminUser {
  message: string;
  is_active: boolean;
}

export interface SuperAdminDashboardResponse {
  total_organizations: number;
  total_coaches: number;
  total_players: number;
  total_sessions: number;
  active_subscriptions: number;
  revenue_overview: number;
  description: null;
  link: null;
  error: null;
}

export function getOrganizations() {
  return apiRequest<OrganizationsListResponse>({
    method: 'GET',
    url: '/super-admin/organizations',
  });
}

export function createOrganization(data: CreateOrganizationRequest) {
  return apiRequest<CreateOrganizationResponse>({
    method: 'POST',
    url: '/super-admin/organizations',
    data,
  });
}

export function getSuperAdminUsers() {
  return apiRequest<UsersListResponse>({
    method: 'GET',
    url: '/super-admin/users',
  });
}

export function createSuperAdminUser(data: CreateUserRequest) {
  return apiRequest<CreateUserResponse>({
    method: 'POST',
    url: '/super-admin/users',
    data,
  });
}

export function getSuperAdminDashboard() {
  return apiRequest<SuperAdminDashboardResponse>({
    method: 'GET',
    url: '/api/v1/super-admin/dashboard',
  });
}

// Drills
export interface Drill {
  id: string;
  name: string;
}

export interface DrillsListResponse {
  success: boolean;
  drills: Drill[];
}

export interface CreateDrillRequest {
  drill_name: string;
  drill_category: string;
}

export interface CreateDrillResponse {
  success: boolean;
  id: string;
}

export interface DeleteDrillResponse {
  success: boolean;
}

export function getDrills() {
  return apiRequest<DrillsListResponse>({ method: 'GET', url: '/drills' });
}

export function createDrill(data: CreateDrillRequest) {
  return apiRequest<CreateDrillResponse>({
    method: 'POST',
    url: '/drills',
    data,
  });
}

export function deleteDrill(id: string) {
  return apiRequest<DeleteDrillResponse>({
    method: 'DELETE',
    url: `/drills/${id}`,
  });
}

// Player
export interface PlayerDrill {
  drill_id: string;
  status: string;
  time_remaining: string;
}

export interface PlayerDrillsResponse {
  success: boolean;
  drills: PlayerDrill[];
}

export interface StartDrillRequest {
  phone: string;
}

export interface StartDrillResponse {
  success: boolean;
  status: string;
  time_remaining: string;
  drill_id: string;
}

export interface PlayDrillRequest {
  phone: string;
}

export interface PlayDrillResponse {
  success: boolean;
  id: string;
  status: string;
  timer: string;
  progress: number;
}

export interface UpdateTimerRequest {
  timer: string;
}

export interface UpdateTimerResponse {
  success: boolean;
  status: string;
  time_remaining: string;
}

export interface PlayerProgressResponse {
  success: boolean;
  error: null;
  status: string;
  id: string;
  name: string;
  completed_sessions: number;
  total_attempts: number;
  makes: number;
  shooting_percentage: string;
  phone: string;
}

export interface RoleSelectionRequest {
  selected_role: string;
  phone: string;
}

export interface RoleSelectionResponse {
  success: boolean;
  error: null;
  selected_role: string;
  role: string;
  session_token: string;
  link: string;
  title: string;
}

export interface GetRoleSelectionResponse {
  success: boolean;
  selected_role: string;
  role: string;
  session_token: string;
}

export interface DrillSubmissionRequest {
  [key: string]: unknown;
}

export interface ResetDrillsRequest {
  [key: string]: unknown;
}

export function getPlayerDrills() {
  return apiRequest<PlayerDrillsResponse>({
    method: 'GET',
    url: '/player/drills',
  });
}

export function startPlayerDrill(data: StartDrillRequest) {
  return apiRequest<StartDrillResponse>({
    method: 'POST',
    url: '/player/drills/start',
    data,
  });
}

export function playPlayerDrill(id: string, data: PlayDrillRequest) {
  return apiRequest<PlayDrillResponse>({
    method: 'POST',
    url: `/player/drills/${id}/play`,
    data,
  });
}

export function updatePlayerDrillTimer(id: string, data: UpdateTimerRequest) {
  return apiRequest<UpdateTimerResponse>({
    method: 'PUT',
    url: `/player/drills/${id}/timer`,
    data,
  });
}

export function getPlayerProgress() {
  return apiRequest<PlayerProgressResponse>({
    method: 'GET',
    url: '/player/my-progress',
  });
}

export function submitPlayerRoleSelection(data: RoleSelectionRequest) {
  return apiRequest<RoleSelectionResponse>({
    method: 'POST',
    url: '/api/v1/player/role-selection',
    data,
  });
}

export function getPlayerRoleSelection() {
  return apiRequest<GetRoleSelectionResponse>({
    method: 'GET',
    url: '/api/v1/player/role-selection',
  });
}

export function submitDrillSubmission(data: DrillSubmissionRequest) {
  return apiRequest<unknown>({
    method: 'POST',
    url: '/player/drill-submissions',
    data,
  });
}

export function resetPlayerDrills(data: ResetDrillsRequest) {
  return apiRequest<unknown>({
    method: 'POST',
    url: '/player/drills/reset',
    data,
  });
}

// Verification
export interface CancelVerificationRequest {
  cancel_verification: boolean;
  phone: string;
}

export interface CancelVerificationResponse {
  success: boolean;
  status: string;
  message: string;
}

export interface ContinueVerificationRequest {
  otp_code: string;
}

export interface ContinueVerificationResponse {
  success: boolean;
  message: string;
}

export interface ResendVerificationRequest {
  [key: string]: unknown;
}

export interface VerifyEmailRequest {
  [key: string]: unknown;
}

export interface ResetPasswordRequest {
  [key: string]: unknown;
}

export function cancelCoachVerification(data: CancelVerificationRequest) {
  return apiRequest<CancelVerificationResponse>({
    method: 'POST',
    url: '/api/v1/coach/cancel-verification',
    data,
  });
}

export function continueCoachVerification(data: ContinueVerificationRequest) {
  return apiRequest<ContinueVerificationResponse>({
    method: 'POST',
    url: '/api/v1/coach/continue-verification',
    data,
  });
}

export function resendVerificationCode(data: ResendVerificationRequest) {
  return apiRequest<unknown>({
    method: 'POST',
    url: '/api/v1/verification/resend-verification-code',
    data,
  });
}

export function verifyEmail(data: VerifyEmailRequest) {
  return apiRequest<unknown>({
    method: 'POST',
    url: '/api/v1/verification/verify-email',
    data,
  });
}

export function resetPassword(data: ResetPasswordRequest) {
  return apiRequest<unknown>({
    method: 'POST',
    url: '/api/v1/reset-password',
    data,
  });
}

// Practice Plans
export interface PracticePlan {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

export interface PracticePlansResponse {
  plans: PracticePlan[];
}

export function getPracticePlans() {
  return apiRequest<PracticePlansResponse>({
    method: 'GET',
    url: '/practice-plans',
  });
}

export function createPracticePlan(data: Record<string, unknown>) {
  return apiRequest<unknown>({
    method: 'POST',
    url: '/practice-plans',
    data,
  });
}

export function createCoachPracticePlan(data: Record<string, unknown>) {
  return apiRequest<unknown>({
    method: 'POST',
    url: '/coach/practice-plans',
    data,
  });
}

// Support
export function contactSupport(data: Record<string, unknown>) {
  return apiRequest<unknown>({
    method: 'POST',
    url: '/api/v1/support/contact',
    data,
  });
}

export function submitSupportInquiry(data: Record<string, unknown>) {
  return apiRequest<unknown>({
    method: 'POST',
    url: '/support/inquiries',
    data,
  });
}
