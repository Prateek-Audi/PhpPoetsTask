import React from "react";
import { Box, Button, Typography, IconButton, LinearProgress } from "@mui/material";
import Logo from '../data/logo.svg';
import { Home, Search, Notifications, Settings, Info } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../auth/authSlice";
import { toast } from "react-toastify";

const Sidebar: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    toast.success("Logout successful!");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: "250px",
        height: "94.35vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px 12px 12px 12px",
        backgroundColor: "#060A5A",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "30rem", height: "auto", marginRight: "8px" }}
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{ backgroundColor: "#444DF2" }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
      
      {/* Icon Section */}
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            mb: 2,
            backgroundColor: "#0F168C",
            borderRadius: "0.25rem", 
          }}
        >
          <IconButton color="primary">
            <Home sx={{ color: "white", p: '2px', "&:hover": {
                backgroundColor: "#444DF2",
                borderRadius: "0.25rem",
              }, }} />
          </IconButton>
          <IconButton color="primary">
            <Search sx={{ color: "white", p: '2px', "&:hover": {
                backgroundColor: "#444DF2",
                borderRadius: "0.25rem",
              }, }} />
          </IconButton>
          <IconButton color="primary">
            <Notifications sx={{ color: "white", p: '2px', "&:hover": {
                backgroundColor: "#444DF2",
                borderRadius: "0.25rem",
              }, }} />
          </IconButton>
          <IconButton color="primary">
            <Settings sx={{ color: "white", p: '2px', "&:hover": {
                backgroundColor: "#444DF2",
                borderRadius: "0.25rem",
                 
              }, }} />
          </IconButton>
          <IconButton color="primary">
            <Info sx={{ color: "white", p: '2px', "&:hover": {
                backgroundColor: "#444DF2",
                borderRadius: "0.25rem", 
                               
              }, }} />
          </IconButton>
        </Box>
     

      {/* Progress Bar Section */}
        <LinearProgress
          variant="determinate"
          value={65}
          sx={{
            height: "6px",
            borderRadius: "5px",
            marginBottom: 1,
            backgroundColor: "#0F168C",
            '& .MuiLinearProgress-bar': {
              backgroundColor: "#444DF2",
            },
          }}
        />
        <Typography variant="h6" sx={{color:'#444DF2', fontWeight: "bold" , fontSize: "12px"}}>35 MB / 500.00 MB</Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
