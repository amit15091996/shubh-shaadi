import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";
import { FormControl, Select, MenuItem, TextField } from "@mui/material";

const CardContainer = styled(motion.div)`
  display: flex;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1050px;
  background-color: #fcd5ce;
  height: 300px;
`;

const ContentWrapper = styled.div`
  flex: 2;  
  padding: 35px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 20px; // Ensure this value is consistent
  align-items: start;
`;

const Field = styled.div`
  // padding: 15px;
  margin: 0;
  border-radius: 4px;
  color: #1f7a8c;
  font-size: 20px;
  // line-height: 1.5; // Ensure consistent line height
  overflow-y: auto;
  word-wrap: break-word;
  max-height: 60px;
`;

const ResidenceField = styled(Field)`
  max-height: 120px;
  overflow: auto;
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
  height: 41px;
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
const PrimaryUserDetails = ({
  response,
  refresAfterUpdate,
  setStatus,
  status,
}) => {
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
    // For age, ensure it's a number
    if (key === "age" && isNaN(value)) {
      return; // Prevent setting invalid age
    }
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
        if (data.status === 200 || data.status === 201) {
          setStatus(!status);
          refresAfterUpdate && refresAfterUpdate(!status);

          if (data.profileImage) {
            setUpdatedProfile((prevProfile) => ({
              ...prevProfile,
              profileImage: data.profileImage,
            }));
          }

          Swal.fire(
            "Success!",
            "Profile updated successfully!",
            "success"
          ).then(() => {
            setIsModalOpen(false);
            window.location.reload();
          });
        } else {
          Swal.fire(
            "Error!",
            "Failed to update profile. Please try again.",
            "error"
          );
        }
      })
      .catch(() => {
        setLoading(false);
        Swal.fire(
          "Error!",
          "Failed to update profile. Please try again.",
          "error"
        );
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
          {fields.map((field, index) =>
            field.key === "residence" ? (
              <ResidenceField key={index}>
                <strong>{field.label}:</strong>{" "}
                <span style={{ color: "#003566" }}>
                  {response && response[field.key] !== undefined
                    ? response[field.key]
                    : "N/A"}
                </span>
              </ResidenceField>
            ) : (
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
            )
          )}
        </ContentWrapper>
      </CardContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Update Profile</ModalHeader>
            <FormWrapper>
              {fields.map((field, index) => (
                <InputField key={index}>
                  <Label>{field.label}</Label>
                  {field.key === "dob" ? (
                    <TextField
                      size="small"
                      type="date"
                      value={updatedProfile[field.key] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  ) : field.key === "religion" || field.key === "community" ? (
                    <FormControl fullWidth size="small">
                      <StyledSelect
                        value={updatedProfile[field.key] || ""}
                        onChange={(e) =>
                          handleFieldChange(field.key, e.target.value)
                        }
                        size="small"
                      >
                        {field.key === "religion" && [
                          <MenuItem key="Hindu" value="Hindu">
                            Hindu
                          </MenuItem>,
                          <MenuItem key="Muslim" value="Muslim">
                            Muslim
                          </MenuItem>,
                          <MenuItem key="Christian" value="Christian">
                            Christian
                          </MenuItem>,
                          <MenuItem key="Sikh" value="Sikh">
                            Sikh
                          </MenuItem>,
                          <MenuItem key="Parsi" value="Parsi">
                            Parsi
                          </MenuItem>,
                          <MenuItem key="Jain" value="Jain">
                            Jain
                          </MenuItem>,
                          <MenuItem key="Buddhist" value="Buddhist">
                            Buddhist
                          </MenuItem>,
                          <MenuItem key="Jewish" value="Jewish">
                            Jewish
                          </MenuItem>,
                          <MenuItem key="No Religion" value="No Religion">
                            No Religion
                          </MenuItem>,
                        ]}
                        {field.key === "community" && [
                          <MenuItem key="English" value="English">
                            English
                          </MenuItem>,
                          <MenuItem key="Hindi" value="Hindi">
                            Hindi
                          </MenuItem>,
                          <MenuItem key="Urdu" value="Urdu">
                            Urdu
                          </MenuItem>,
                          <MenuItem key="Telugu" value="Telugu">
                            Telugu
                          </MenuItem>,
                          <MenuItem key="Tamil" value="Tamil">
                            Tamil
                          </MenuItem>,
                        ]}
                      </StyledSelect>
                    </FormControl>
                  ) : (
                    <Input
                      type={field.key === "age" ? "number" : "text"}
                      value={updatedProfile[field.key] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                      disabled={field.isDisabled}
                    />
                  )}
                </InputField>
              ))}
              {/* Image Upload Input */}
              <InputField>
                <Label>Profile Image:</Label>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </InputField>
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
