import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    setIsLoading(true);
    if(validateInput(formData)){
      axios.post(`${config.endpoint}/auth/login`,{
        username: formData.username,
        password: formData.password
      }).then((response)=>{
        const serverData = response.data;
        if(serverData.success === true){
          enqueueSnackbar("Logged in successfully", { autoHideDuration: 3000, variant: "success" });
          persistLogin(serverData.token,serverData.username,serverData.balance);
          history.push("/",{from: "login"});
        }
        //console.log(response);
      }).catch((error)=>{
        enqueueSnackbar(error.response.data.message, { autoHideDuration: 3000, variant: "error" });
        console.log(error.response);
      }); 
    } 
    setIsLoading(false);
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    console.log(data);
      if(data.username === ""){
        enqueueSnackbar("Username is a required field", { autoHideDuration: 3000, variant: "warning" });
        return false;
      }
      else if(data.password === ""){
        enqueueSnackbar("Password is a required field", { autoHideDuration: 3000, variant: "warning" });
        return false;
      }
      else
        return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons /> 
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField id="username"label="Username"  variant="outlined" value={username} onChange={(event)=>{setUsername(event.target.value)}}/>
          <TextField id="password" label="Password" name="password"
            type="password" variant="outlined" value={password} onChange={(event)=>{setPassword(event.target.value)}}/>
          {isLoading ? <CircularProgress color="inherit"/> : <Button variant="contained" className="button secondary-action" onClick={() => {login({username: username, password: password})}}>LOGIN TO QKART</Button> }
          {/* TODO: Add link using router*/}
        <p>Don't have an account? <Link to="/register" className="link">Register now</Link></p>
        </Stack> 
      </Box>
      <Footer/>
    </Box>
  );
};

export default Login;
