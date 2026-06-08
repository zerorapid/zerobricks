import { pb } from './pocketbase';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  content: string;
  created: string;
}

export type BlogPostInput = Omit<BlogPost, 'id' | 'created'>;

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const records = await pb.collection('blog_posts').getFullList<BlogPost>({
      sort: '-created',
    });
    return records;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const record = await pb.collection('blog_posts').getFirstListItem<BlogPost>(`slug="${slug}"`);
    return record;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
}

export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const record = await pb.collection('blog_posts').getOne<BlogPost>(id);
    return record;
  } catch (error) {
    console.error(`Error fetching blog post with id ${id}:`, error);
    return null;
  }
}

export async function createBlogPost(post: BlogPostInput): Promise<BlogPost | null> {
  try {
    const record = await pb.collection('blog_posts').create<BlogPost>(post);
    return record;
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    throw new Error(error.message);
  }
}

export async function updateBlogPost(id: string, post: Partial<BlogPostInput>): Promise<BlogPost | null> {
  try {
    const record = await pb.collection('blog_posts').update<BlogPost>(id, post);
    return record;
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    throw new Error(error.message);
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    await pb.collection('blog_posts').delete(id);
    return true;
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return false;
  }
}
