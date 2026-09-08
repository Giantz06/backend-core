import { sendJson } from "../utils/response.js";
import { parseBody } from "../utils/body.js";

import {
  getAllPosts,
  getPostById,
  createPost as createPostInService,
  updatePost as updatePostInService,
  deletePost as deletePostInService,
} from "../service/postService.js";

export async function getPosts(req, res) {
  const posts = await getAllPosts();
  sendJson(res, 200, posts);
}

export async function getPost(req, res, postId) {
  const post = await getPostById(postId);
  sendJson(res, 200, post);
}

export async function createPost(req, res) {
  const body = await parseBody(req);
  const data = parseJsonBody(body);

  const newPost = await createPostInService(data);
  sendJson(res, 201, newPost);
}

export async function updatePost(req, res, postId) {
  const body = await parseBody(req);
  const data = parseJsonBody(body);

  const post = await updatePostInService(postId, data);
  sendJson(res, 200, post);
}

export async function deletePost(req, res, postId) {
  const result = await deletePostInService(postId);
  sendJson(res, 200, result);
}

function parseJsonBody(body) {
  try {
    return JSON.parse(body);
  } catch {
    const err = new Error("Invalid Json");
    err.statusCode = 400;
    throw err;
  }
}
