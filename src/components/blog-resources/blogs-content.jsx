"use client"

import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Avatar,
  Stack,
  Button,
  Paper,
} from "@mui/material"
import { AccessTime, Person, Verified } from "@mui/icons-material"

import { ImNewspaper } from "react-icons/im";

import { useEffect, useState } from "react";

import useAllBlogs from "@hooks/common/useAllBlogs";

export default function BlogContent() {

  const { loading, error, sortedBlogsByDescId: blogPosts, refetchBlogs } = useAllBlogs();
  const [newestBlog, setNewestBlog] = useState(blogPosts ? blogPosts[0] : null);
  const sidebarPosts = blogPosts.slice(1)

  const [otherArticlesStartIdx, setOtherArticlesStartIdx] = useState(2);
  const [otherArticlesEndIdx, setOtherArticlesEndIdx] = useState(6);

  // debug:
  console.log("descBlogsById", JSON.stringify(blogPosts, null, 2));

  useEffect(() => {
    setNewestBlog(blogPosts ? blogPosts[0] : null);
  }, [blogPosts]);

  return (
    <Box sx={{ py: 4 }}>
      {/* Hero/Promotional Banner */}
      <Paper
        sx={{
          background: "linear-gradient(135deg, #a7c5d2 0%, #56a8ed 100%)",
          color: "white",
          p: 4,
          mb: 4,
          borderRadius: 2,
          textAlign: "center",
          display: "flex",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <Avatar sx={{ bgcolor: "#56a8ed", mx: "auto", width: 60, height: 60, mb: 2 }}>
            <ImNewspaper fontSize={'40px'} />
          </Avatar>
        </Box>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          School Health Blogs
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        {/* Main Content Area - Left Section */}
        <Grid item size={{xs: 12, md:8}}>
          {/* Newest Section */}
          <Box sx={{ mb: 4 }}>
            {/* Featured Article */}
            {newestBlog && (
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={newestBlog.imageUrl}
                  alt={newestBlog.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h4"
                    component="h3"
                    gutterBottom
                    sx={{ color: "#333", fontWeight: "bold", lineHeight: 1.3 }}
                  >
                    {newestBlog.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: "16px", lineHeight: 1.6 }}>
                    {newestBlog.content}
                  </Typography>

                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "#56a8ed" }}>
                        <Person fontSize="small" />
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {newestBlog.author?.name}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Verified fontSize="small" sx={{ color: "#56a8ed" }} />
                      <Typography variant="body2" color="text.secondary">
                        Verified by {newestBlog.verifierName}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTime fontSize="small" sx={{ color: "#56a8ed" }} />
                      <Typography variant="body2" color="text.secondary">
                        {newestBlog.createdAt}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            )}
            {!newestBlog && (
              <Typography variant="h5" color="text.secondary" align="center">
                No blog posts available at the moment.
              </Typography>
            )}
          </Box>

          {/* Other Articles Grid */}
          <Box>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: "#56a8ed", fontWeight: "bold", mb: 3 }}>
              Other Articles
            </Typography>
            <Grid container spacing={3}>
              {sidebarPosts.slice(otherArticlesStartIdx, otherArticlesEndIdx).map((post) => (
                <Grid item size={{xs: 12, sm: 6}} key={post.blogId}>
                  <Card
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "translateY(-2px)" },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={post.imageUrl}
                      alt={post.title}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {post.content.length > 50 ? `${post.content.substring(0, 50)}...` : post.content}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Person fontSize="small" sx={{ color: "#56a8ed" }} />
                        <Typography variant="caption" color="text.secondary">
                          {post.author?.name}
                        </Typography>
                        <AccessTime fontSize="small" sx={{ color: "#56a8ed" }} />
                        <Typography variant="caption" color="text.secondary">
                          {post.createdAt}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Grid container justifyContent={'center'} margin={'30px 20px 0px 0px'}>
            <Box>
              {blogPosts.length > otherArticlesEndIdx ? 
                (<Button variant="outlined" onClick={(e) => setOtherArticlesEndIdx(prev => prev + 2)} >
                  {(blogPosts) && <>Show more blogs</>}
                </Button>) 
                : 
                (<Button variant="outlined" onClick={(e) => setOtherArticlesEndIdx(6)} > {/* reset default values */}
                  {(blogPosts) && <>Show less</>}
                </Button>)
              }
            </Box>
          </Grid>
        </Grid>

        {/* Sidebar - Right Section */}
        <Grid item size={{xs: 12, md: 4}}>
          <Box sx={{ position: "sticky", top: 20 }}>
            {/* Newsletter Signup */}
            <Box>
              <Typography variant="h5" component="h2" gutterBottom sx={{ color: "#56a8ed", fontWeight: "bold", mb: 3 }}>
                Hot Articles
              </Typography>
              <Grid container spacing={3}>
                {sidebarPosts.slice(0, 2).map((post) => (
                  <Grid size={{ xs: 12 }} key={post.blogId}>
                    <Card
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        "&:hover": { transform: "translateY(-2px)" },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={post.imageUrl}
                        alt={post.title}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: "bold" }}>
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {post.content.length > 50 ? `${post.content.substring(0, 50)}...` : post.content}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Person fontSize="small" sx={{ color: "#56a8ed" }} />
                          <Typography variant="caption" color="text.secondary">
                            {post.author?.name}
                          </Typography>
                          <AccessTime fontSize="small" sx={{ color: "#56a8ed" }} />
                          <Typography variant="caption" color="text.secondary">
                            {post.createdAt}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Card sx={{ bgcolor: "#f8f9fa" }}>
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: "#56a8ed", fontWeight: "bold" }}>
                  Stay Updated
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  We're staying updated with the latest school health insights and educational wellness tips.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}