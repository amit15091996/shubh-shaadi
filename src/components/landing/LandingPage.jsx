import React, { useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CardContainer = styled(motion.div)`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  background-color: #fff;
`;

const ContentWrapper = styled.div`
  flex: 2;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
`;

const FormFieldWrapper = styled.div`
  flex: 1;
  min-width: 150px;
`;

const LandingPage = () => {
  const [gender, setGender] = React.useState(null);
  const [ageFrom, setAgeFrom] = React.useState(null);
  const [ageTo, setAgeTo] = React.useState(null);
  const [religion, setReligion] = React.useState("");
  const [motherTongue, setMotherTongue] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleGenderChange = (event) => setGender(event.target.value);
  const handleAgeFromChange = (event) => setAgeFrom(event.target.value);
  const handleAgeToChange = (event) => setAgeTo(event.target.value);
  const handleReligionChange = (event) => setReligion(event.target.value);
  const handleMotherTongueChange = (event) =>
    setMotherTongue(event.target.value);

  const handleBeginClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  useEffect(() => {
    localStorage.removeItem("userInfo");
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "400px",
      }}
    >
      <Box sx={{ width: "80%" }}>
        <Grid container>
          <Grid item xs={12} md={12}>
            <Box sx={{ padding: 2, height: "100%" }}>
              <CardContainer
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ContentWrapper>
                  <FormFieldWrapper>
                    <FormControl fullWidth>
                      <InputLabel id="gender-label">
                        I'm looking for a
                      </InputLabel>
                      <Select
                        labelId="gender-label"
                        value={gender}
                        onChange={handleGenderChange}
                        label="I'm looking for a"
                      >
                        <MenuItem value="Female">Woman</MenuItem>
                        <MenuItem value="Male">Man</MenuItem>
                      </Select>
                    </FormControl>
                  </FormFieldWrapper>

                  <FormFieldWrapper>
                    <FormControl fullWidth>
                      <InputLabel id="age-from-label">Age From</InputLabel>
                      <Select
                        labelId="age-from-label"
                        value={ageFrom}
                        onChange={handleAgeFromChange}
                        label="Age From"
                      >
                        {[...Array(63)].map((_, i) => (
                          <MenuItem key={i + 18} value={i + 18}>
                            {i + 18}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </FormFieldWrapper>

                  <FormFieldWrapper>
                    <FormControl fullWidth>
                      <InputLabel id="age-to-label">Age To</InputLabel>
                      <Select
                        labelId="age-to-label"
                        value={ageTo}
                        onChange={handleAgeToChange}
                        label="Age To"
                      >
                        {[...Array(63)].map((_, i) => (
                          <MenuItem key={i + 18} value={i + 18}>
                            {i + 18}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </FormFieldWrapper>

                  <FormFieldWrapper>
                    <FormControl fullWidth>
                      <InputLabel id="religion-label">Religion</InputLabel>
                      <Select
                        labelId="religion-label"
                        value={religion}
                        onChange={handleReligionChange}
                        label="Religion"
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
                        <MenuItem value="Spiritual - not religious">
                          Spiritual
                        </MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </FormFieldWrapper>

                  <FormFieldWrapper>
                    <FormControl fullWidth>
                      <InputLabel id="mothertongue-label">
                        Mother Tongue
                      </InputLabel>
                      <Select
                        labelId="mothertongue-label"
                        value={motherTongue}
                        onChange={handleMotherTongueChange}
                        label="Mother Tongue"
                      >
                        <MenuItem value="Bengali">Bengali</MenuItem>
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Gujarati">Gujarati</MenuItem>
                        <MenuItem value="Hindi">Hindi</MenuItem>
                        <MenuItem value="Kannada">Kannada</MenuItem>
                        <MenuItem value="Marathi">Marathi</MenuItem>
                        <MenuItem value="Marwari">Marwari</MenuItem>
                        <MenuItem value="Odia">Odia</MenuItem>
                        <MenuItem value="Punjabi">Punjabi</MenuItem>
                        <MenuItem value="Tamil">Tamil</MenuItem>
                        <MenuItem value="Telugu">Telugu</MenuItem>
                        <MenuItem value="Urdu">Urdu</MenuItem>

                        <MenuItem value="Aka">Aka</MenuItem>
                        <MenuItem value="Arabic">Arabic</MenuItem>
                        <MenuItem value="Arunachali">Arunachali</MenuItem>
                        <MenuItem value="Assamese">Assamese</MenuItem>
                        <MenuItem value="Awadhi">Awadhi</MenuItem>
                        <MenuItem value="Baluchi">Baluchi</MenuItem>
                        <MenuItem value="Bhojpuri">Bhojpuri</MenuItem>
                        <MenuItem value="Bhutia">Bhutia</MenuItem>
                        <MenuItem value="Brahui">Brahui</MenuItem>
                        <MenuItem value="Brij">Brij</MenuItem>
                        <MenuItem value="Burmese">Burmese</MenuItem>
                        <MenuItem value="Chattisgarhi">Chattisgarhi</MenuItem>
                        <MenuItem value="Chinese">Chinese</MenuItem>
                        <MenuItem value="Coorgi">Coorgi</MenuItem>
                        <MenuItem value="Dogri">Dogri</MenuItem>
                        <MenuItem value="French">French</MenuItem>
                        <MenuItem value="Garhwali">Garhwali</MenuItem>
                        <MenuItem value="Garo">Garo</MenuItem>
                        <MenuItem value="Haryanavi">Haryanavi</MenuItem>
                        <MenuItem value="Himachali/Pahari">
                          Himachali/Pahari
                        </MenuItem>
                        <MenuItem value="Hindko">Hindko</MenuItem>
                        <MenuItem value="Kakbarak">Kakbarak</MenuItem>
                        <MenuItem value="Kanauji">Kanauji</MenuItem>
                        <MenuItem value="Kashmiri">Kashmiri</MenuItem>
                        <MenuItem value="Khandesi">Khandesi</MenuItem>
                        <MenuItem value="Khasi">Khasi</MenuItem>
                        <MenuItem value="Konkani">Konkani</MenuItem>
                        <MenuItem value="Koshali">Koshali</MenuItem>
                        <MenuItem value="Kumaoni">Kumaoni</MenuItem>
                        <MenuItem value="Kutchi">Kutchi</MenuItem>
                        <MenuItem value="Ladakhi">Ladakhi</MenuItem>
                        <MenuItem value="Lepcha">Lepcha</MenuItem>
                        <MenuItem value="Magahi">Magahi</MenuItem>
                        <MenuItem value="Maithili">Maithili</MenuItem>
                        <MenuItem value="Malay">Malay</MenuItem>
                        <MenuItem value="Malayalam">Malayalam</MenuItem>
                        <MenuItem value="Manipuri">Manipuri</MenuItem>
                        <MenuItem value="Miji">Miji</MenuItem>
                        <MenuItem value="Mizo">Mizo</MenuItem>
                        <MenuItem value="Monpa">Monpa</MenuItem>
                        <MenuItem value="Nepali">Nepali</MenuItem>
                        <MenuItem value="Pashto">Pashto</MenuItem>
                        <MenuItem value="Persian">Persian</MenuItem>
                        <MenuItem value="Rajasthani">Rajasthani</MenuItem>
                        <MenuItem value="Russian">Russian</MenuItem>
                        <MenuItem value="Sanskrit">Sanskrit</MenuItem>
                        <MenuItem value="Santhali">Santhali</MenuItem>
                        <MenuItem value="Seraiki">Seraiki</MenuItem>
                        <MenuItem value="Sindhi">Sindhi</MenuItem>
                        <MenuItem value="Sinhala">Sinhala</MenuItem>
                        <MenuItem value="Sourashtra">Sourashtra</MenuItem>
                        <MenuItem value="Spanish">Spanish</MenuItem>
                        <MenuItem value="Swedish">Swedish</MenuItem>
                        <MenuItem value="Tagalog">Tagalog</MenuItem>
                        <MenuItem value="Tulu">Tulu</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </FormFieldWrapper>

                  <FormFieldWrapper>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleBeginClick}
                      >
                        Let's Begin
                      </Button>
                    )}
                  </FormFieldWrapper>
                </ContentWrapper>
              </CardContainer>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LandingPage;
