import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// Styled components
const CardContainer = styled(motion.div)`
  display: flex;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1050px;
  background-color: #fcd5ce;
  max-height: 300px;
`;

const ContentWrapper = styled.div`
  flex: 2;
  padding: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 15px;
`;

const Field = styled.div`
  padding: 10px;
  border-radius: 4px;
  color: #1f7a8c;
  font-size: 20px;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

const Button = styled.button`
  background-color: #003566;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    background-color: #1f7a8c;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;
`;

const ModalHeader = styled.h2`
  margin: 0;
  margin-bottom: 20px;
`;

const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const StyledSelect = styled(Select)`
  height: 56px;
  padding: 0 14px;
`;

const FileInput = styled.input`
  margin-top: 5px;
`;

const Message = styled.div`
  margin-top: 15px;
  font-size: 16px;
  color: ${({ success }) => (success ? "green" : "red")};
`;

// Fields array
export const fields = [
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "Age", key: "age" },
  { label: "Gender", key: "gender" },
  { label: "Language Known", key: "langKnown" },
  { label: "Religion", key: "religion" },
  { label: "Community", key: "community" },
  { label: "Date of Birth", key: "dob" },
  { label: "Residence", key: "residence" },
  { label: "Mobile No", key: "mobileNumber", isDisabled: true },
];

// Main Component
const PrimaryUserDetails = ({ response, refresAfterUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(response || {});
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const session = AuthHook();
  const { mobileNumber } = useParams();

  useEffect(() => {
    setUpdatedProfile(response);
  }, [response]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = () => {
    setLoading(true);

    const formData = new FormData();
    Object.keys(updatedProfile).forEach((key) => {
      formData.append(key, updatedProfile[key]);
    });
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    fetch("https://shaadi-be.fino-web-app.agency/api/v1/auth/update-profile", {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 200) {
          refresAfterUpdate && refresAfterUpdate(); // Refresh data
          Swal.fire("Success!", "Profile updated successfully!", "success").then(() => {
            setIsModalOpen(false); // Close modal here
          });
        } else {
          Swal.fire("Error!", "Failed to update profile. Please try again.", "error");
        }
      })
      .catch(() => {
        setLoading(false);
        Swal.fire("Error!", "Failed to update profile. Please try again.", "error");
      });
  };

  return (
    <>
      <CardContainer
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {mobileNumber === session?.userName && (
          <ButtonContainer>
            <Button onClick={toggleModal}>Update</Button>
          </ButtonContainer>
        )}

        <ContentWrapper>
          {fields.map((field, index) => (
            <Field key={index}>
              <strong>{field.label}:</strong>{" "}
              <span style={{ color: "#003566" }}>
                {response && response[field.key] !== undefined
                  ? Array.isArray(response[field.key])
                    ? response[field.key].join(", ")
                    : response[field.key]
                  : "N/A"}
              </span>
            </Field>
          ))}
        </ContentWrapper>
      </CardContainer>

      {/* Modal for editing fields */}
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Update Profile</ModalHeader>
            <FormWrapper>
              {fields.map((field, index) => (
                <InputField key={index}>
                  <Label>{field.label}</Label>
                  {field.key === "religion" || field.key === "community" ? (
                    <FormControl fullWidth>
                      <StyledSelect
                        value={updatedProfile[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300, // Optional: limit dropdown height
                            },
                          },
                        }}
                      >
                        {field.key === "religion" && (
                          <>
                            <MenuItem value="Hindu">Hindu</MenuItem>
                            <MenuItem value="Muslim">Muslim</MenuItem>
                            <MenuItem value="Christian">Christian</MenuItem>
                            <MenuItem value="Sikh">Sikh</MenuItem>
                            <MenuItem value="Parsi">Parsi</MenuItem>
                            <MenuItem value="Jain">Jain</MenuItem>
                            <MenuItem value="Buddhist">Buddhist</MenuItem>
                            <MenuItem value="Jewish">Jewish</MenuItem>
                            <MenuItem value="No Religion">No Religion</MenuItem>
                          </>
                        )}
                        {field.key === "community" && (
                          <>
                            <MenuItem value="English">English</MenuItem>
                            <MenuItem value="Hindu">Hindu</MenuItem>
                            <MenuItem value="Urdu">Urdu</MenuItem>
                            <MenuItem value="Telugu">Telugu</MenuItem>
                            <MenuItem value="Tamil">Tamil</MenuItem>
                          </>
                        )}
                      </StyledSelect>
                    </FormControl>
                  ) : (
                    <Input
                      type={field.key === "mobileNumber" ? "text" : "text"}
                      value={updatedProfile[field.key] || ""}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      disabled={field.isDisabled}
                    />
                  )}
                </InputField>
              ))}
            </FormWrapper>

            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                }}
              >
                <RingLoader color="#003566" size={60} />
              </div>
            ) : (
              <Message>{/* Optionally display messages here */}</Message>
            )}
            <br />
            <Button onClick={handleSubmit} disabled={loading}>
              Save Changes
            </Button>
            <Button onClick={toggleModal} style={{ marginLeft: "10px" }}>
              Cancel
            </Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default PrimaryUserDetails;
