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

const blogPosts = [
  {
    blogId: 1,
    title: "Creating a Safe and Healthy School Environment for Primary Students",
    content: "Building a positive school environment helps children aged 6–12 develop both physically and mentally. Teachers and parents must work closely to ensure students learn and play in a safe setting, especially during outdoor activities and group interactions.",
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.fCrrvJQKjCU6uO_buNNQpwHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    authorName: "Cường Văn",
    verifierName: "Cường Văn",
    createdAt: "18-07-2025 00:00:00",
    lastUpdatedAt: "18-07-2025 00:00:00"
  },
  {
    blogId: 2,
    title: "Healthy Playtime: A Key Factor in Child Development",
    content: "Outdoor play like sports and traditional games not only enhances physical health but also nurtures emotional well-being and social skills in primary school children. Playgrounds should be safe and encourage children to be active and creative.",
    imageUrl: "https://th.bing.com/th/id/R.f4ccc9a3e7336e5a94f0fa3ac6e42762?rik=4SuLz5VX%2fPbJjg&riu=http%3a%2f%2fpgdvangiang.hungyen.edu.vn%2fupload%2f21193%2f20180525%2fIMG_0985.JPG&ehk=HUNbnjK7ZlwuzuOGIpanxIxJ03KRPB1ZT5S%2fxkU495o%3d&risl=&pid=ImgRaw&r=0",
    authorName: "Cường Văn",
    verifierName: "Cường Văn",
    createdAt: "18-07-2025 00:00:00",
    lastUpdatedAt: "18-07-2025 00:00:00"
  },
  {
    blogId: 3,
    title: "Using Music to Teach Values in Primary Education",
    content: "Group singing and arts activities help children develop language skills, confidence, and teamwork. Music is also a powerful tool to teach values such as empathy, kindness, and respect in a fun and engaging way.",
    imageUrl: "https://static.wixstatic.com/media/1b7319_7befcaee9a474e5e8845d1e7ef8c7006~mv2_d_4320_3240_s_4_2.jpg/v1/fill/w_640,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/1b7319_7befcaee9a474e5e8845d1e7ef8c7006~mv2_d_4320_3240_s_4_2.jpg",
    authorName: "Cường Văn",
    verifierName: "Cường Văn",
    createdAt: "18-07-2025 00:00:00",
    lastUpdatedAt: "18-07-2025 00:00:00"
  },
  {
    blogId: 4,
    title: "Routine Health Checkups: Preventing Illness in Schoolchildren",
    content: "Regular health checkups at school play a crucial role in early detection of physical and mental issues in students. Parents should partner with schools to ensure children stay healthy and are able to focus on learning and personal growth.",
    imageUrl: "https://th.bing.com/th/id/R.d69eec5075e1d0670fae45494956c455?rik=uddIL6KE4kgh0w&pid=ImgRaw&r=0",
    authorName: "Cường Văn",
    verifierName: "Cường Văn",
    createdAt: "18-07-2025 00:00:00",
    lastUpdatedAt: "18-07-2025 00:00:00"
  },
  {
    blogId: 5,
    title: "Happy Classrooms: Nurturing Dreams from an Early Age",
    content: "A friendly and creative classroom space encourages children to enjoy learning. Teachers should foster a pressure-free environment that supports interaction, curiosity, and self-expression among primary school students.",
    imageUrl: "https://i.ytimg.com/vi/cPfX_nYTvGs/maxresdefault.jpg",
    authorName: "Cường Văn",
    verifierName: "Cường Văn",
    createdAt: "18-07-2025 00:00:00",
    lastUpdatedAt: "18-07-2025 00:00:00"
  }
]


const categories = [
  { name: "Our school", color: "#56a8ed" },
  { name: "Mother & Baby", color: "#56a8ed" },
  { name: "Disease Prevention", color: "#56a8ed" },
  { name: "Health News", color: "#56a8ed" },
]

export default function BlogContent() {
  const featuredPost = blogPosts[0]
  const sidebarPosts = blogPosts.slice(1)

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
                image={featuredPost.imageUrl}
                alt={featuredPost.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h4"
                  component="h3"
                  gutterBottom
                  sx={{ color: "#333", fontWeight: "bold", lineHeight: 1.3 }}
                >
                  {featuredPost.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: "16px", lineHeight: 1.6 }}>
                  {featuredPost.content}
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#56a8ed" }}>
                      <Person fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      {featuredPost.authorName}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Verified fontSize="small" sx={{ color: "#56a8ed" }} />
                    <Typography variant="body2" color="text.secondary">
                      Verified by {featuredPost.verifierName}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTime fontSize="small" sx={{ color: "#56a8ed" }} />
                    <Typography variant="body2" color="text.secondary">
                      {featuredPost.createdAt}
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Recent Articles Grid */}
          <Box>
            <Typography variant="h5" component="h2" gutterBottom sx={{ color: "#56a8ed", fontWeight: "bold", mb: 3 }}>
              Recent Articles
            </Typography>
            <Grid container spacing={3}>
              {sidebarPosts.slice(0, 4).map((post) => (
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
        </Grid>

        {/* Sidebar - Right Section */}
        <Grid item size={{xs: 12, md: 4}}>
          <Box sx={{ position: "sticky", top: 20 }}>
            {/* Categories */}
            {categories.map((category, index) => (
              <Card key={category.name} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    bgcolor: category.color,
                    color: "white",
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" component="h3" sx={{ fontWeight: "bold" }}>
                    {category.name}
                  </Typography>
                </Box>
                <CardContent sx={{ p: 2 }}>
                  {sidebarPosts.slice(index, index + 2).map((post) => (
                    <Box
                      key={post.blogId}
                      sx={{
                        display: "flex",
                        mb: 2,
                        cursor: "pointer",
                        "&:hover": { bgcolor: "#f5f5f5" },
                        p: 1,
                        borderRadius: 1,
                        "&:last-child": { mb: 0 },
                      }}
                    >
                      <Box
                        component="img"
                        src={post.imageUrl}
                        alt={post.title}
                        sx={{
                          width: 80,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 1,
                          mr: 2,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body2"
                          component="h4"
                          sx={{
                            fontWeight: "bold",
                            lineHeight: 1.3,
                            mb: 0.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {post.createdAt.split(" ")[0]}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* Newsletter Signup */}
            <Card sx={{ bgcolor: "#f8f9fa" }}>
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: "#56a8ed", fontWeight: "bold" }}>
                  Stay Updated
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Stay informed with the latest school health insights and educational wellness tips.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}