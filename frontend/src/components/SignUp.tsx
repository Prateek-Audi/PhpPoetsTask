import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp: React.FC = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
  });

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
    if (!data.name || !data.email || !data.password) {
      toast.error("All fields are required");
      setErrors({
        name: !data.name,
        email: !data.email,
        password: !data.password,
      });
      return false;
    }
    if (data.name.length < 3) {
      toast.error("Name must be at least 3 characters long");
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: true,
      }));
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
      const url = "http://localhost:5000/api/auth/signup";
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      await axios.post(url, payload);
      toast.success("Signup successful!");
      navigate("/login");
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || "An error occurred during signup";
      toast.error(errMsg);
      console.error("Signup failed", error);
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
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Name"
            name="name"
            value={data.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={errors.name}
            helperText={errors.name && "Name must be at least 3 characters long"}
          />
          <TextField
            label="Email"
            name="email"
            value={data.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={errors.email}
            helperText={errors.email && "Please enter a valid email address"}
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
            helperText={errors.password && "Password must be at least 4 characters long"}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>

          <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
            <Grid item>
              <Box display="flex" alignItems="center">
                <Typography variant="body2" component="span">
                  Already have an account?&nbsp;
                </Typography>
                <Button variant="text" onClick={() => navigate("/login")} sx={{ padding: 0 }}>
                  Login
                </Button>
              </Box>
            </Grid>
          </Grid>

        </form>
      </Container>
    </Box>
  );
};

export default SignUp;
