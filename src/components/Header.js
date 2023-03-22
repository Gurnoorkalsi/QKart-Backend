import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import {useHistory} from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const username = localStorage.getItem("username");
  const history = useHistory();
  //const searchField = Children.only(children);
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      <Box sx={{width: 1/3}}>
          {children}
      </Box>
      {hasHiddenAuthButtons === true ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          BACK TO EXPLORE
        </Button>
      ) : username != null ? (
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<Avatar src="../../public/avatar.png" alt="crio.do" />}
            variant="string"
            onClick={() => {}}
          >
            {username}
          </Button>
          <Button
            className="explore-button"
            variant="text"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            LOGOUT
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          <Button
            className="explore-button"
            variant="text"
            onClick={() => {
              history.push("/login");
            }}
          >
            LOGIN
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              history.push("/register");
            }}
          >
            REGISTER
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;


  /*<Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={()=>{}}
*/

