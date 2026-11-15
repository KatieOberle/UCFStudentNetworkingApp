// API endpoint wrappers, AI assisted code (Claude Sonnet v5.5)
import { authFetch } from "./auth";

export interface UserProfile {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  major: string;
  graduationYear: number | null;
  careerInterests: string[];
  companies: string[];
  bio: string;
  contact: Record<string, string>;
}

export interface Post {
  PostID: number;
  AuthorId: number;
  Title: string;
  Body: string;
  Tags: string[];
}

export interface Reply {
  ReplyID: number;
  PostID: number;
  AuthorId: number;
  Body: string;
  CreatedAt: string;
}

interface ConnectionRequest {
  RequesterId: number;
  RecipientId: number;
  Status: string;
  CreatedAt: string;
}

export interface PendingRequest {
  requesterId: number;
  name: string;
}

export interface ProfileUpdate {
  Major?: string;
  GraduationYear?: number | null;
  CareerInterests?: string[];
  Companies?: string[];
  Bio?: string;
  Contact?: Record<string, string>;
}

type ApiResult<T> = T & { error?: string };

// Calls the API and throws an Error with the server's message on failure.
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await authFetch(url, init);
  } catch {
    throw new Error("Could not reach the server. Please try again.");
  }

  const data = (await response.json().catch(() => null)) as
    | ApiResult<T>
    | null;

  if (!response.ok || !data || data.error) {
    throw new Error(data?.error ?? "Request failed. Please try again.");
  }

  return data;
}

export async function fetchProfile(userId: number): Promise<UserProfile> {
  const data = await request<{ user: UserProfile }>(`/api/profile/${userId}`);
  return data.user;
}

// /api/auth/me gives the logged-in userId, /api/profile/:userId the full profile.
export async function fetchMyProfile(): Promise<UserProfile> {
  const me = await request<{ user: { userId: number } }>("/api/auth/me");
  return fetchProfile(me.user.userId);
}

export async function saveProfile(
  userId: number,
  updates: ProfileUpdate
): Promise<UserProfile> {
  const data = await request<{ user: UserProfile }>(
    `/api/profile/${userId}`,
    { method: "PATCH", body: JSON.stringify(updates) }
  );
  return data.user;
}

export async function fetchUserPosts(userId: number): Promise<Post[]> {
  const data = await request<{ posts: Post[] }>(`/api/post/user/${userId}`);
  return data.posts;
}

export async function createPost(title: string, body: string): Promise<Post> {
  const data = await request<{ post: Post }>("/api/post", {
    method: "POST",
    body: JSON.stringify({ title, body }),
  });
  return data.post;
}

export async function deletePost(postId: number): Promise<void> {
  await request<{ message: string }>(`/api/post/${postId}`, {
    method: "DELETE",
  });
}

export async function fetchReplies(postId: number): Promise<Reply[]> {
  const data = await request<{ comments: Reply[] }>(`/api/replies/${postId}`);
  return data.comments;
}

export async function createReply(
  postId: number,
  body: string
): Promise<Reply> {
  const data = await request<{ comment: Reply }>(`/api/replies/${postId}`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
  return data.comment;
}

export async function deleteReply(replyId: number): Promise<void> {
  await request<{ message: string }>(`/api/replies/${replyId}`, {
    method: "DELETE",
  });
}

// Pending requests only contain IDs, so look up each requester's name.
export async function fetchPendingRequests(): Promise<PendingRequest[]> {
  const data = await request<{ requests: ConnectionRequest[] }>(
    "/api/connection/requests"
  );

  return Promise.all(
    data.requests.map(async (item) => {
      let name = `Student #${item.RequesterId}`;

      try {
        const requester = await fetchProfile(item.RequesterId);
        name = `${requester.firstName} ${requester.lastName}`.trim();
      } catch {
        // keep the generic label
      }

      return { requesterId: item.RequesterId, name };
    })
  );
}