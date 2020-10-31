// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(feathers.socketio(socket));
// Use localStorage to store our login token
client.configure(feathers.authentication());

// Login screen
const loginHTML = `<main class="login container">
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet text-center heading">
      <h1 class="font-100">Log in or signup</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
      <form class="form">
        <fieldset>
          <input class="block" type="email" name="email" placeholder="email">
        </fieldset>

        <fieldset>
          <input class="block" type="password" name="password" placeholder="password">
        </fieldset>

        <button type="button" id="login" class="button button-primary block signup">
          Log in
        </button>

        <button type="button" id="signup" class="button button-primary block signup">
          Sign up and log in
        </button>

        <a class="button button-primary block" href="/oauth/github">
          Login with GitHub
        </a>
      </form>
    </div>
  </div>
</main>`;

// Helper to safely escape HTML
const escape = str => str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Add a new user to the list
const addUser = user => {
  const userList = document.querySelector('.user-list');

  if(userList) {
    // Add the user to the list
    userList.innerHTML += `<li>
      <a class="block relative" href="#">
        <img src="${user.avatar}" alt="" class="avatar">
        <span class="absolute username">${escape(user.name || user.email)}</span>
      </a>
    </li>`;

    // Update the number of users
    const userCount = document.querySelectorAll('.user-list li').length;
    
    document.querySelector('.online-count').innerHTML = userCount;
  }
};


// Show the login page
const showLogin = (error) => {
  if(document.querySelectorAll('.login').length && error) {
    document.querySelector('.heading').insertAdjacentHTML('beforeend', `<p>There was an error: ${error.message}</p>`);
  } else {
    document.getElementById('app').innerHTML = loginHTML;
  }
};


// Retrieve email/password object from the login/signup page
const getCredentials = () => {
  const user = {
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value
  };

  return user;
};

// Log in either using the given email/password or the token from storage
const login = async credentials => {
  try {
    if(!credentials) {
      // Try to authenticate using an existing token
      await client.reAuthenticate();
    } else {
      // Otherwise log in with the `local` strategy using the credentials we got
      await client.authenticate({
        strategy: 'local',
        ...credentials
      });
    }

    // If successful, show something
    console.log("successful")
    
  } catch(error) {
    // If we got an error, show the login page
    showLogin(error);
  }
};


const addEventListener = (selector, event, handler) => {
  document.addEventListener(event, async ev => {
    if (ev.target.closest(selector)) {
      handler(ev);
    }
  });
};

// "Signup and login" button click handler
addEventListener('#signup', 'click', async () => {
  // For signup, create a new user and then log them in
  const credentials = getCredentials();
    
  // First create the user
  await client.service('users').create(credentials);
  // If successful log them in
  await login(credentials);
});

// "Login" button click handler
addEventListener('#login', 'click', async () => {
  const user = getCredentials();

  await login(user);
});

// "Logout" button click handler
addEventListener('#logout', 'click', async () => {
  await client.logout();
    
  document.getElementById('app').innerHTML = loginHTML;
});

// We will also see when new users get created in real-time
client.service('users').on('created', addUser);

// Call login right away so we can show the chat window
// If the user can already be authenticated
login();