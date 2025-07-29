
import request from "@api/request";

export const getAllBlogs =  async () => {

  try {
    const response =  await request.get("blogs/public");
    return await response.data || [];
  }
  catch (error) {
    throw new Error("Failed to fetch blogs: " + error.message);
  }

}