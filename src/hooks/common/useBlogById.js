
import { getBlogById } from "@api/common/get-blogs-by-id";
import { useEffect, useState, useCallback } from "react";

const useBlogById = (blogId) => {

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlog = useCallback(async (localBlogId) => {
    setLoading(true);
    setError(null);
    try {

      const fetchedBlog = await getBlogById(localBlogId);
      setBlog(fetchedBlog);
    }
    catch (err) {
      setError(err.message || "Failed to fetch blog");
      console.error("Error fetching blog:", err);
    }
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlog(blogId);
  }, [fetchBlog, blogId]);

  return {
    loading, error, blog,
    refetchBlog: fetchBlog
  }
}
export default useBlogById;