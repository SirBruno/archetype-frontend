import React from 'react'
import axios from 'axios'
import styles from './Login.module.css'

export default function (props) {

  const URI = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ?
    "http://localhost:4000" :
    "https://archetypeofficial.herokuapp.com"

  const inputUsername = React.createRef();
  const inputPassword = React.createRef();

  if (props.user == null) {
    axios.get(`${URI}/user`, { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
  }

  const userAuth = async () => {
    const tryLoggin = await axios.get(`${URI}/login?username=${inputUsername.current.value}&password=${inputPassword.current.value}`, { withCredentials: true });

    if (props.user == null) {
      axios.get(`${URI}/user`, { withCredentials: true }).then(res => res.data.user ? props.setUser(res.data.user) : null);
    }

    if (tryLoggin.data === "Incorrect username and password combination!") {
      document.getElementById("errorMessage").innerHTML = `<p class="loginErrorMessage">${tryLoggin.data}</p>`;
    }

    return tryLoggin;
  }

  return (
    <> { props.user == null ? <>
      <div className={styles.main}>
        <div className={styles.contentArea}>
          <input className={styles.input} ref={inputUsername} placeholder="Username"></input>
          <input type="password" className={styles.input} ref={inputPassword} placeholder="Password"></input>
          <button className={styles.btn} onClick={() => userAuth()}>Login</button>
          <div id="errorMessage">
          </div>
        </div>
      </div>
    </> : <div className={styles.main}>
        <div className={styles.contentArea}>
          <span>Logged in as <b><i>{props.user.nickname.charAt(0).toUpperCase() + props.user.nickname.slice(1)}</i></b>.</span>
        </div>
      </div>}
    </>
  )
}