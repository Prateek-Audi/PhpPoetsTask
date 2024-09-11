import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, TextField, Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setToken } from "../auth/authSlice";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  const validateForm = () => {
    if (!data.email || !data.password) {
      toast.error("All fields are required");
      setErrors({
        email: !data.email,
        password: !data.password,
      });
      return false;
    }

    const email = /\S+@\S+\.\S+/;
    if (!email.test(data.email)) {
      toast.error("Please enter a valid email address");
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: true,
      }));
      return false;
    }
    if (data.password.length < 4) {
      toast.error("Password must be at least 4 characters long");
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: true,
      }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const url = "http://localhost:5000/api/auth/login";
      const payload = {
        email: data.email,
        password: data.password,
      };
      const response = await axios.post(url, payload);

      const { jwtToken } = response.data;

      localStorage.setItem("token", jwtToken);

      dispatch(setToken(jwtToken));
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "An error occurred during login";
      toast.error(errMsg);
      console.error("Login failed", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            name="email"
            value={data.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={errors.email}
            helperText={errors.email && "Please enter a valid email"}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={data.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={errors.password}
            helperText={errors.password && "Password must be at least 4 characters"}         
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>

          <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
            <Grid item>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" component="span">
                  Don't have an account?&nbsp;
                </Typography>
                <Button variant="text" onClick={() => navigate("/signup")} sx={{ padding: 0 }}>
                  Sign Up
                </Button>
              </Box>
            </Grid>
          </Grid>

        </form>

      </Container>
    </Box>
  );
};

export default Login;
