import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import AuthHook from "../../../auth/AuthHook";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { RingLoader } from "react-spinners";

// Card styled components
const CardContainer = styled(motion.div)`
  display: flex;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  background-color: #fcd5ce;
  max-height: 350px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentWrapper = styled.div`
  flex: 2;
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;
  gap: 15px;
  max-height: 300px; /* Limit height to allow scrolling */
  overflow-y: auto; /* Enable vertical scrolling */

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Stack items on smaller screens */
    padding: 15px;
    max-height: 200px; /* Adjust max-height for mobile */
  }
`;

const Field = styled.div`
  padding: 10px;
  border-radius: 4px;
  color: #1f7a8c;
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 16px; /* Smaller font size on mobile */
  }
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    position: static; /* Remove absolute positioning on mobile */
    flex-direction: row; /* Ensure buttons are in a row */
    justify-content: space-between; /* Space out buttons */
    margin-top: 10px; /* Add some margin for spacing */
  }
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

  @media (max-width: 768px) {
    width: 100%; /* Full width on mobile */
    margin-bottom: 10px; /* Space between stacked buttons */
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
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%; /* Responsive width */
  max-width: 800px; /* Maximum width for larger screens */
  max-height: 80vh; /* Limit modal height */
  overflow-y: auto; /* Enable vertical scrolling for content */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative; /* Allow absolute positioning of buttons */
`;

const ModalHeader = styled.h2`
  margin: 0;
  margin-bottom: 20px;
`;

const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Single column on mobile */
  }
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

  @media (max-width: 768px) {
    font-size: 14px; /* Smaller font size on mobile */
  }
`;

// Personal Fields
export const personalFields = [
  { key: "userHeight", value: "Height: " },
  { key: "userWeight", value: "Weight: " },
  { key: "gotra", value: "Gotra: " },
  { key: "manglik", value: "Manglik: " },
  { key: "maritalStatus", value: "Marital Status: " },
  { key: "isPersonDisabled", value: "Is Disabled: " },
  { key: "userIncome", value: "Monthly Income" },
  { key: "isUserStayingAlone", value: "Is Staying Alone: " },
  { key: "hobbies", value: "Hobbies: " },
  { key: "birthPlace", value: "Birth Place: " },
  { key: "complexion", value: "Complexion: " },
  { key: "rashi", value: "Rashi: " },
  { key: "bloodGroup", value: "Blood Group: " },
  { key: "bodyType", value: "Body Type: " },
];

const UserPersonalDetails = ({
  response,
  refresAfterUpdate,
  setStatus,
  status,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState(response || {});
  const [loading, setLoading] = useState(false);
  const session = AuthHook();
  const { mobileNumber } = useParams();

  const handleFieldChange = (key, value) => {
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [key]: value,
    }));
  };

  useEffect(() => {
    setUpdatedProfile(response || {});
  }, [response]);

  // Handle modal open/close
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = () => {
    setLoading(true);
    const apiUrl = response
      ? `https://shaadi-be.fino-web-app.agency/api/v1/update-user-personal-details/${mobileNumber}`
      : `https://shaadi-be.fino-web-app.agency/api/v1/save-user-personal-details?mobileNumber=${mobileNumber}`;

    fetch(apiUrl, {
      method: response ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProfile),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.status === 200 || data.status === 201) {
          setStatus(!status);
          refresAfterUpdate && refresAfterUpdate(!status);
          Swal.fire("Success!", "User details updated successfully!", "success").then(() => {
            toggleModal(); // Close modal after success
          });
        } else {
          Swal.fire("Error", "Failed to update user details", "error");
        }
      })
      .catch(() => {
        setLoading(false);
        Swal.fire("Error", "An error occurred. Please try again.", "error");
      });
  };

  return (
    <>
      <CardContainer
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ButtonContainer>
          {mobileNumber === session?.userName && (
            <Button onClick={toggleModal}>
              {response ? "Update" : "Add"}
            </Button>
          )}
        </ButtonContainer>
        <ContentWrapper>
          {personalFields.map((field, index) => (
            <Field key={index}>
              {field.value}{" "}
              <span style={{ color: "#003566" }}>
                {response && response[field.key]
                  ? Array.isArray(response[field.key])
                    ? response[field.key].join(", ")
                    : response[field.key]
                  : "N/A"}
              </span>
            </Field>
          ))}
        </ContentWrapper>
      </CardContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              {response ? "Update Profile" : "Add Profile"}
            </ModalHeader>
            <ButtonContainer>
              <Button onClick={toggleModal}>Close</Button>
            </ButtonContainer>
            <FormWrapper>
              {personalFields.map((field, index) => (
                <InputField key={index}>
                  <Label>{field.value}</Label>
                  <Input
                    type="text"
                    value={updatedProfile[field.key] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (field.key === "userHeight") {
                        const regex = /^\d*'?\d*"?$/; // Updated regex to allow flexible input
                        if (regex.test(value) || value === "") {
                          handleFieldChange(field.key, value);
                        }
                      } else if (field.key === "userWeight" || field.key === "userIncome") {
                        if (/^\d*$/.test(value)) {
                          handleFieldChange(field.key, value);
                        }
                      } else {
                        handleFieldChange(field.key, value);
                      }
                    }}
                    placeholder={
                      field.key === "userHeight"
                        ? "e.g. 5'7\""
                        : field.key === "userWeight"
                        ? "In kg"
                        : field.key === "userIncome"
                        ? "e.g. 30000 (in thousands)"
                        : ""
                    }
                  />
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
            ) : null}

<ButtonContainer>
  <Button onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
    Save Changes
  </Button>
  <Button onClick={toggleModal} disabled={loading} style={{ flex: 1 }}>
    Cancel
  </Button>
</ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default UserPersonalDetails;
