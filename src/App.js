import React,{useEffect, useState, useCallback} from "react";


import { useInitFbSDK } from "./hooks/fb-hooks";

// You can find your Page ID
// in the "About" section of your page on Facebook.
const PAGE_ID = "234077982166370";

function App() {
  // Initializes the Facebook SDK
  const isFbSDKInitialized = useInitFbSDK();

  // App state
  const [fbUserAccessToken, setFbUserAccessToken] = useState();
  const [fbPageAccessToken, setFbPageAccessToken] = useState();

  // Logs in a Facebook user
  const logInToFB = useCallback(() => {
    window.FB.login((response) => {
      setFbUserAccessToken(response.authResponse.accessToken);
    });
  }, []);

  // Logs out the current Facebook user
  const logOutOfFB = useCallback(() => {
    window.FB.logout(() => {
      setFbUserAccessToken(null);
      setFbPageAccessToken(null);
    });
  }, []);

  // Checks if the user is logged in to Facebook
  useEffect(() => {
    if (isFbSDKInitialized) {
      window.FB.getLoginStatus((response) => {
        setFbUserAccessToken(response.authResponse?.accessToken);
      });
    }
  }, [isFbSDKInitialized]);

  // Fetches an access token for the page
  useEffect(() => {
    if (fbUserAccessToken) {
      window.FB.api(
        `/${PAGE_ID}?fields=access_token&access_token=${fbUserAccessToken}`,
        ({ access_token }) => setFbPageAccessToken(access_token)
      );
    }
  }, [fbUserAccessToken]);

  useEffect(() => {
    if (fbUserAccessToken) {
      window.FB.api(
        `me/likes?&summary=total_count&access_token=${fbUserAccessToken}`,
        'GET',
        {},
        function(response) {
         console.log(response);
        }
      );
      

    }
  }, [fbUserAccessToken]);

 
  

  // UI with custom styling from ./styles.css`
  return (
    <div id="app">
      <header id="app-header">
        <p id="logo-text">FB Page API</p>
        {fbUserAccessToken ? (
          <button onClick={logOutOfFB} className="btn confirm-btn">
            Log out
          </button>
        ) : (
          <button onClick={logInToFB} className="btn confirm-btn">
            Login with Facebook
          </button>
        )}
      </header>
    </div>
  );
}

export default App;