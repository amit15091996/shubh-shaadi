import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2"; // Import SweetAlert
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Registration() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
    religion: "",
    community: "",
    dob: "",
    residence: "",
    profileImage: null,
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Confirm password visibility toggle
  const [passwordError, setPasswordError] = useState(false); // Password mismatch error state
  const [imagePreview, setImagePreview] = useState(null); // Image preview state
  const navigate = useNavigate(); // Navigation hook

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: type === "file" ? files[0] : value,
      };

      // Check if passwords match after updating
      if (updatedData.password !== updatedData.confirmPassword) {
        setPasswordError(true);
      } else {
        setPasswordError(false);
      }

      return updatedData;
    });

    // Set image preview if a file is uploaded
    if (type === "file") {
      const file = files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    const {
      mobileNumber,
      firstName,
      lastName,
      age,
      gender,
      password,
      confirmPassword,
      religion,
      community,
      dob,
      residence,
      profileImage,
    } = formData;

    if (
      !mobileNumber ||
      !firstName ||
      !lastName ||
      !age ||
      !gender ||
      !password ||
      !confirmPassword ||
      !religion ||
      !community ||
      !dob ||
      !residence ||
      !profileImage
    ) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all fields and upload a profile image.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Validate mobile number
    const mobileNumberPattern = /^[0-9]{10}$/;
    if (!mobileNumberPattern.test(mobileNumber)) {
      Swal.fire({
        title: "Error!",
        text: "Mobile number must be exactly 10 digits.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError(true);
      Swal.fire({
        title: "Error!",
        text: "Passwords do not match.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true); // Start loading
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      await axios.post(
        "https://shaadi-be.fino-web-app.agency/api/v1/auth/create-profile",
        formDataToSend
      );
      setLoading(false); // Stop loading

      // Display SweetAlert on success
      Swal.fire({
        title: "Success!",
        text: "Profile creation successful!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/login");
      });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: "There was an issue creating the profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fefae0",
        maxWidth: "600px",
        margin: "auto",
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        overflow: "auto",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        User Registration
      </Typography>

      {/* Profile Image Upload Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box
          component="img"
          src={imagePreview || "https://via.placeholder.com/80"} // Placeholder image if no preview
          alt="Profile Preview"
          sx={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            border: "1px solid #ccc",
            objectFit: "cover",
            mr: 2,
          }}
        />
        <label htmlFor="profile-image-upload">
          <input
            type="file"
            name="profileImage"
            accept="image/jpeg"
            onChange={handleChange}
            style={{ display: "none" }}
            id="profile-image-upload"
          />
          <Button variant="contained" component="span" size="small">
            Upload Profile Image
          </Button>
        </label>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              label="First Name"
              fullWidth
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastName"
              label="Last Name"
              fullWidth
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="mobileNumber"
              label="Mobile Number"
              fullWidth
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="dob"
              label="Date of Birth"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="age"
              label="Age"
              type="number"
              fullWidth
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="gender-select-label">Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                label={"Gender"}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="religion-select-label">Religion</InputLabel>
              <Select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                required
                label={"Religion"}
              >
                <MenuItem value="Hindu">Hindu</MenuItem>
                <MenuItem value="Muslim">Muslim</MenuItem>
                <MenuItem value="Christian">Christian</MenuItem>
                <MenuItem value="Sikh">Sikh</MenuItem>
                <MenuItem value="Parsi">Parsi</MenuItem>
                <MenuItem value="Jain">Jain</MenuItem>
                <MenuItem value="Buddhist">Buddhist</MenuItem>
                <MenuItem value="Jewish">Jewish</MenuItem>
                <MenuItem value="No Religion">No Religion</MenuItem>
                <MenuItem value="Spiritual - not religious">Spiritual</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="community-select-label">Community</InputLabel>
              <Select
                name="community"
                value={formData.community}
                onChange={handleChange}
                required
                label="Community"
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Hindu">Hindi</MenuItem>
                <MenuItem value="Urdu">Urdu</MenuItem>
                <MenuItem value="Telugu">Telugu</MenuItem>
                <MenuItem value="Tamil">Tamil</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="residence"
              label="Residence"
              fullWidth
              onChange={handleChange}
              required
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              onChange={handleChange}
              required
              size="small"
              InputProps={{
                endAdornment: (
                  <Button onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              onChange={handleChange}
              required
              error={passwordError}
              helperText={passwordError ? "Passwords do not match." : ""}
              size="small"
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Register"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default Registration;
