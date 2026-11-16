const API_BASE = "/api";

type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  const data: unknown = await response.json().catch(() => null);
  const error = data && typeof data === "object" && "error" in data && typeof data.error === "string" ? data.error : "";
  if (!response.ok || error) throw new Error(error || `Request failed (${response.status})`);
  return data as T;
}

export function getLoggedInUserId(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const body = token.split(".")[1];
    if (!body) return null;
    const normalized = body.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(normalized)) as {userId?: number};
    const id = Number(payload.userId);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  } catch { return null; }
}

export interface Post {
  PostID: number;
  AuthorId: number;
  Title: string;
  Body: string;
  Tags: string[];
}
export interface StudentProfile {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  major: string;
  graduationYear: number | null;
  careerInterests: string[];
  companies: string[];
  bio: string;
  contact: Record<string, unknown>;
}

export function createPost(title: string, body: string, tags: string[] = []) {
  return apiRequest<{message: string; post: Post}>("/post", {method: "POST", body: {title, body, tags}});
}
export function getUserPosts(userId: number) {
  return apiRequest<{posts: Post[]}>(`/post/user/${userId}`);
}
export function deletePost(postId: number) {
  return apiRequest<{message: string}>(`/post/${postId}`, {method: "DELETE"});
}
export function getProfile(userId: number) {
  return apiRequest<{user: StudentProfile}>(`/profile/${userId}`);
}
export function updateProfile(userId: number, updates: {
  Major?: string;
  GraduationYear?: number | null;
  CareerInterests?: string[];
  Companies?: string[];
  Bio?: string;
  Contact?: Record<string, unknown>;
}) {
  return apiRequest<{message: string; user: StudentProfile}>(`/profile/${userId}`, {method: "PATCH", body: updates});
}
export function searchStudents(query: string) {
  return apiRequest<{users: StudentProfile[]}>(`/profile/search?q=${encodeURIComponent(query)}`);
}
export function sendConnectionRequest(userId: number) {
  return apiRequest<{message: string}>(`/connection/request/${userId}`, {method: "POST"});
}
export function acceptConnectionRequest(userId: number) {
  return apiRequest<{message: string}>(`/connection/accept/${userId}`, {method: "PATCH"});
}
export function declineConnectionRequest(userId: number) {
  return apiRequest<{message: string}>(`/connection/decline/${userId}`, {method: "PATCH"});
}
export interface ConnectionRequest {
  RequesterId: number; RecipientId: number; Status: string; CreatedAt: string;
}
export function getIncomingRequests() {
  return apiRequest<{requests: ConnectionRequest[]}>("/connection/requests");
}
export function getConnections(userId: number) {
  return apiRequest<{connections: {userId: number}[]}>(`/connection/user/${userId}`);
}
export interface ApiComment {
  ReplyID: number; PostID: number; AuthorId: number; Body: string; CreatedAt?: string;
}
export function getPostComments(postId: number) {
  return apiRequest<{comments: ApiComment[]}>(`/replies/${postId}`);
}
export function addComment(postId: number, body: string) {
  return apiRequest<{message: string; comment: ApiComment}>(`/replies/${postId}`, {method: "POST", body: {body}});
}
export function deleteComment(replyId: number) {
  return apiRequest<{message: string}>(`/replies/${replyId}`, {method: "DELETE"});
}
export function submitReport(reportedUserId: number, reason: string, description: string) {
  return apiRequest<{message: string}>("/reports/path", {method: "POST", body: {reportedUserId, reason, description}});
}
export function verifyEmail(token: string) {
  return apiRequest<{message: string}>(`/auth/verify?token=${encodeURIComponent(token)}`);
}
export function logout() {
  return apiRequest<{message: string}>("/auth/logout", {method: "POST"});
}

export interface FeedPost extends Post {
  authorName: string;
}
export function getRecentPosts() {
  return apiRequest<{ posts: FeedPost[] }>("/post/recent");
}

// Separate from submitReport(), which reports a user's account.
export function submitDiscussionReport(postId: number, reason: string) {
  return apiRequest<{message: string; reportCount: number; hidden: boolean}>(
    `/post/${postId}/report`, {method: "POST", body: {reason}}
  );
}
