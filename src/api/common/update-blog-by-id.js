
import request from "@api/request";

export const updateBlogById = async (blogId, blogData) => {

  try {
    await request.put(`blogs/${blogId}`, blogData);
  }
  catch (error) {
    throw new Error("Failed to update blog: " + error.message);
  }

}