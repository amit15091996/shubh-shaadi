import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  getAllProfiles,
  getProfileImage,
} from "../../services/userAllDetailsService";

const CardContainer = styled(motion.div)`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1100px;
  margin: 20px auto;
  background-color: #fcd5ce;
  position: relative;
  height: 320px;
`;

const ImageWrapper = styled.div`
  flex: 1;
  background: url(${(props) => props.src}) no-repeat center center;
  background-size: cover;
  height: 100%;
`;

const ContentWrapper = styled.div`
  flex: 2;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 10px;
  overflow-y: auto;
`;

const Title = styled.h2`
  grid-column: 1 / 2;
  margin: 0 0 10px;
`;

const MoreDetailsButton = styled.button`
  grid-column: 2 / 3;
  align-self: center;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  justify-self: end;

  &:hover {
    background-color: #0056b3;
  }
`;

const Field = styled.div`
  padding: 8px;
  border-radius: 4px;
  color: #1f7a8c;
  font-size: 17px;
`;

const Loader = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; /* Ensure the loader is above the card content */
`;

const LoaderAnimation = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 5px solid #007bff;
  border-top: 5px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const fields = [
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "Mobile Number", key: "mobileNumber" },
  { label: "Age", key: "age" },
  { label: "Gender", key: "gender" },
  { label: "Language Known", key: "langKnown" },
  { label: "Religion", key: "religion" },
  { label: "Community", key: "community" },
  { label: "Date of Birth", key: "dob" },
  { label: "Residence", key: "residence" },
];
const FramerCard = ({ title }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [profileImages, setProfileImages] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleMoreDetailsClick = (item) => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/all-details/${item?.mobileNumber}`);
      setLoading(false);
    }, 500);
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const details = await getAllProfiles();
      setUserDetails(details?.result || []);

      const images = {};
      const mobileNumbers = details?.result.map((user) => user.mobileNumber);

      await Promise.all(
        mobileNumbers.map(async (number) => {
          const imageUrl = await getProfileImage(number);
          images[number] = imageUrl;
        })
      );

      setProfileImages(images);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <>
      {loading ? (
        <Loader
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <LoaderAnimation />
        </Loader>
      ) : (
        <>
          {Array.isArray(userDetails) &&
            userDetails.map((item, index) => (
              <CardContainer
                key={`profile-card-${index}`}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ImageWrapper src={profileImages[item.mobileNumber]} />
                <ContentWrapper>
                  <Title>
                    {item.firstName} {item.lastName}
                  </Title>
                  <MoreDetailsButton
                    onClick={() => handleMoreDetailsClick(item)}
                  >
                    More Details
                  </MoreDetailsButton>
                  {fields.map((field, index) => (
                    <Field key={index}>
                      <strong>{field.label}:</strong>{" "}
                      {item[field.key] ? item[field.key] : "N/A"}
                    </Field>
                  ))}
                </ContentWrapper>
              </CardContainer>
            ))}
        </>
      )}
    </>
  );
};

export default FramerCard;
