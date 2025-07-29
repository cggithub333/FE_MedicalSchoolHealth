
import { getAllBlogs } from "@api/common/get-all-blogs";

import { useEffect, useState, useCallback } from "react";

const useAllBlogs = () => {

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      const fetchedBlogs = await getAllBlogs();
      setBlogs(fetchedBlogs);
    }
    catch(err) {
      setError(err.message || "Failed to fetch blogs");
      console.error("Error fetching blogs:", err);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return {
    loading, error, blogs, sortedBlogsByDescId: sortDescBlogsById(blogs), refetchBlogs: fetchBlogs
  }

}

const sortDescBlogsById = (blogs) => {

  if (!blogs || !Array.isArray(blogs)) {
    return [];
  }

  return blogs.sort((a, b) => b.blogId - a.blogId);
}

export default useAllBlogs;