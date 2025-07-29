
import request from "@api/request";

export const getBlogById = async (blogId) => {

  try {
    const response = await request.get(`blogs/public/${blogId}`);
    return await response.data || undefined;
  }
  catch (error) {
    throw new Error(`Failed to fetch blog with id : ${blogId}, error: ` + error.message);
  }
}