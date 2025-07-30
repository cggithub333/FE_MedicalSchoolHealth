"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  Button,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"

import ModeEditIcon from '@mui/icons-material/ModeEdit';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { Link, Outlet } from "react-router-dom";

import useAllBlogs from "@hooks/common/useAllBlogs";
import { useNavigate } from "react-router-dom";

const BlogManageBoard = () => {

  const navigate = useNavigate();
  const { sortedBlogsByDescId: originBlogs, refetchBlogs } = useAllBlogs();
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [fetchedBlogs, setFetchedBlogs] = useState(originBlogs || []);

  useEffect(() => {
    if (originBlogs) {
      // Update fetchedBlogs with the latest originBlogs
      setFetchedBlogs(originBlogs);
    }
  }, [originBlogs]);

  // debug:
  console.log("Fetched Blogs:", fetchedBlogs);

  // Filter blogs based on search term
  const filteredBlogs = useMemo(() => {
    if (!searchTerm.trim()) return fetchedBlogs

    return fetchedBlogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm, fetchedBlogs])

  // Handle search change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  // Handle blog card click
  const handleBlogClick = (blog) => {
    setSelectedBlog(blog)
    navigate(`/blogs/manage/edit/${blog.blogId}`);
  }

  // Truncate title for display
  const truncateTitle = (title, maxLength = 60) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + "..."
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Left Section - 60% width */}
      <Box
        sx={{
          width: "60%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            width: "100%",
            height: "90%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fafafa",
            border: "2px dashed #ccc",
            position: "relative",
          }}
        >
          {selectedBlog ? (
            <Outlet context={{ selectedBlog }} />
          ) : (
            <Typography variant="h5" color="text.secondary">
              Select a blog to continue
            </Typography>
          )}
          <Box position={'absolute'} zIndex={99} backgroundColor={'#fff'} display={'flex'} top={10} left={10} width={'30%'}>
            {selectedBlog && (
              <Box width={'10%'} component={Link} to={`/blogs/manage/edit/${selectedBlog?.blogId}`} sx={{ textDecoration: 'none', flexGrow: 1 }}>
                <Button>
                  <Box display={'flex'} alignItems={'center'} gap={1}>
                    <ModeEditIcon />
                    <Typography variant="caption" color="text.secondary">
                      Edit
                    </Typography>
                  </Box>
                </Button>
              </Box>
            )}
            <Box component={Link} to="/blogs/manage/create" sx={{ textDecoration: 'none', flexGrow: 1 }}>
              <Button>
                <Box display={'flex'} alignItems={'center'} gap={1}>
                  <NoteAddIcon />
                  <Typography variant="caption" color="text.secondary">
                    Create New
                  </Typography>
                </Box>
              </Button>
            </Box>
          </Box>
        </Paper>
        
      </Box>

      {/* Right Section - 40% width */}
      <Box
        sx={{
          width: "40%",
          height: "97%",
          p: 2,
          pt: 5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box sx={{ p: 3, pb: 2, borderBottom: "1px solid #e0e0e0" }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "primary.main",
                mb: 2,
              }}
            >
              Published Blogs
            </Typography>

            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search by title or author name..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Blog List - Scrollable */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c1c1c1",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#a8a8a8",
              },
            }}
          >
            {(filteredBlogs || []).length > 0 ? (
              <List sx={{ p: 0 }}>
                {(filteredBlogs || []).map((blog) => (
                  <ListItem key={blog.blogId} sx={{ p: 0 }}>
                    <Card
                      sx={{
                        width: "100%",
                        m: 1,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        border: selectedBlog?.blogId === blog.blogId ? "2px solid" : "1px solid transparent",
                        borderColor: selectedBlog?.blogId === blog.blogId ? "primary.main" : "transparent",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleBlogClick(blog)}
                    >
                      <Box sx={{ display: "flex" }}>
                        <CardMedia
                          component="img"
                          sx={{
                            width: 120,
                            height: 100,
                            objectFit: "cover",
                          }}
                          image={blog.imageUrl}
                          alt={blog.title}
                        />
                        <CardContent sx={{ flex: 1, p: 2, "&:last-child": { pb: 2 } }}>
                          <Typography
                            variant="h6"
                            component="h3"
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 600,
                              lineHeight: 1.3,
                              mb: 1,
                              color: "text.primary",
                            }}
                          >
                            {truncateTitle(blog.title)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="primary"
                            sx={{
                              fontWeight: 500,
                              fontSize: "0.75rem",
                            }}
                          >
                            By {blog.author.name}
                          </Typography>
                        </CardContent>
                      </Box>
                    </Card>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No blogs found matching your search.
                </Typography>
              </Box>
            )}
          </Box>

          {/* Footer Info */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#fafafa",
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", display: "block" }}>
              {(filteredBlogs || []).length} blog{(filteredBlogs || []).length !== 1 ? "s" : ""} found
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default BlogManageBoard