/**
 * This file contains the types for data from supabase
 */

export type PostLikesCount = {
  post_slug: string
  likes_count: number
}

export type PostUserLikes = {
  // `id` will be a generated id used to identify user's session
  // Each `id` can only add a maximum of 10 likes
  id: string
  post_slug: string
  likes_count: number
}