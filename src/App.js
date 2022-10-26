import React,{useEffect, useState, useCallback} from "react";


import { useInitFbSDK } from "./hooks/fb-hooks";

// You can find your Page ID
// in the "About" section of your page on Facebook.

const API_BASE_URL = "https://graph.facebook.com";
const API_VERSION = "v15.0";
function App() {
  // Initializes the Facebook SDK
  const isFbSDKInitialized = useInitFbSDK();

  // App state
  const [fbUserAccessToken, setFbUserAccessToken] = useState();
  const [fbPageAccessToken, setFbPageAccessToken] = useState();

  console.log("fbUserAccessToken", fbUserAccessToken);
  console.log("fbPageAccessToken", fbPageAccessToken);
  const [fbPageAccounts, setFbPageAccounts] = useState();
  const [PAGE_ID, setPAGE_ID] = useState("");
  const [fblikes, setFblikes] = useState([])
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

      window.FB.api(
        `/me/accounts?access_token=${fbUserAccessToken}`,
        'GET',
        {},
        function(response) {
          setFbPageAccounts(response)
        }
      );
    }
  }, [fbUserAccessToken]);

  useEffect(() => { 
    if (PAGE_ID) {
  
    fetch( `${API_BASE_URL}/${API_VERSION}/${PAGE_ID}/insights/page_fans?access_token=${fbPageAccessToken}`)
    .then((response) => response.json())
    .then((data) => { 
      setFblikes(data); // ⬅️ Guardar datos
    });
  }
  }, [PAGE_ID]);



      let likesPage = fblikes.data?.[0].values?.[0].value;


      function handleAddClick(PAGE_ID, PAGE_TOKEN) {
        setPAGE_ID(PAGE_ID)
        setFbPageAccessToken(PAGE_TOKEN)
      }

  // UI with custom styling from ./styles.css`
  return (
    <div id="app">
      <header id="app-header">
        <p id="logo-text">FB Page API</p>
        {fbUserAccessToken ? (
        <div>
          <button onClick={logOutOfFB} className="btn confirm-btn">
            Log out
          </button>

          <p> Likes: {likesPage}</p>
          
        </div>
        
        ) : (
          <button onClick={logInToFB} className="btn confirm-btn">
            Login with Facebook
          </button>
        )}

        {
                fbPageAccounts?.data?.map((page) => {
                  
                  return(
                    <button key={page.id} onClick={ () => handleAddClick(page.id, page.access_token)}>
                           <p>{page.name}</p>
                           <p>{page.id}</p>
                    </button>
                  )

            
                })
                
        }

      </header>
    </div>
  );
}

export default App;