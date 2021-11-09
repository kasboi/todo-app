//INITIALIZE MATERIALIZE CONTENTS
document.addEventListener('DOMContentLoaded', function() {
    const sideNav = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sideNav);

    const items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

    const modal = document.querySelectorAll('.modal');
    M.Modal.init(modal);

  });

//FIREBASE INITIALIZATION

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, getDoc, getDocs, addDoc, onSnapshot } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD5M60fmh2ZYWtSYz5qVyWCZRm6Tv-mU18",
  authDomain: "todo-app-706ee.firebaseapp.com",
  projectId: "todo-app-706ee",
  storageBucket: "todo-app-706ee.appspot.com",
  messagingSenderId: "944484512449",
  appId: "1:944484512449:web:950f5ba7a63c2d7bc7da40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

let currentUid
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    currentUid = user.uid;
    onSnapshot(collection(db, "users", currentUid, "task"), snap => {
      setupTask(snap.docs);
      console.log(snap.docs, currentUid);
      setupUI(user)
  })
    // ...
  } else {
    // User is signed out
    currentUid = ''
    setupUI()
    setupTask([])
  }
});

//SIGN UP USERS
const signupForm = document.querySelector('#signup-form')
signupForm.addEventListener('submit', event => {
  //prevent reloading of page after hitting submit
  event.preventDefault()

  // collect inputted email and password
  const email = signupForm['signup-email'].value
  const password = signupForm['signup-password'].value
  const nickname = signupForm['signup-nick'].value
  // signup user
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log(userCredential.user.uid);
    return setDoc(doc(db, "users", userCredential.user.uid), {
      nickname: signupForm['signup-nick'].value
  })
}).then(() => {
    //close modal
     // DOM manipulation on signup modal
     const modal = document.querySelector('#modal-signup')
     // Using materialize method to close the modal after successfully registering new user
     M.Modal.getInstance(modal).close()
     // reset form
     signupForm.reset()
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    // ..
  });
})

//user login
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', event => {
  event.preventDefault()

  const email = loginForm['login-email'].value
  const password = loginForm['login-password'].value

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log('successful');
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });

  //close modal
  const modal = document.querySelector('#modal-login')
  M.Modal.getInstance(modal).close()
  loginForm.reset()
})

//user logout
const logOut = document.querySelector('#logout')
const logoutMobi = document.querySelector('.logout')
let logger = (event) => {
  event.preventDefault()

  signOut(auth).then(() => {
    // Sign-out successful.
    console.log('logged out');
  }).catch((error) => {
    // An error happened.
  });
}
logOut.addEventListener('click', logger)
logoutMobi.addEventListener('click', logger)

// display guides and account information depending auth state
const loggedInLinks = document.querySelectorAll('.logged-in')
const loggedOutLinks = document.querySelectorAll('.logged-out')

const setupUI = (user) => {

    if (user) {
        loggedInLinks.forEach(element => element.style.display = 'block')
        loggedOutLinks.forEach(element => element.style.display = 'none')
    } else {
        loggedOutLinks.forEach(element => element.style.display = 'block')
        loggedInLinks.forEach(element => element.style.display = 'none')
    }
}

//Create Guide
const createForm = document.querySelector('#create-form')

createForm.addEventListener('submit', event => {
    event.preventDefault()

    addDoc(collection(db, "users",currentUid, "task"), {
        title: createForm["title"].value,
        content: createForm["content"].value
    }).then(() => {
        const modal = document.querySelector('#modal-create')
        // Using materialize method to close the modal after successfully logging in
        M.Modal.getInstance(modal).close()
        // reset form
        createForm.reset()
    }).catch(err => console.log(err.message))

})

//Get Data and display on page
const guideList = document.querySelector('.tasks')
const setupTask = (data) => {
    if (data.length) {
        let html = ''
        data.forEach(doc => {        
            const task = doc.data()
            const li =
            `<li>
            <div class="collapsible-header"><i class="material-icons">av_timer</i>${task.title}</div>
            <div class="collapsible-body"><span>${task.content}</span></div>
          </li>`
            html += li
            guideList.innerHTML = html
        });
    } else {
        guideList.innerHTML =  `<h5 class="center-align">Login to create and view Tasks</h5>`
    }
}
//REFERENCE COMMENTS
// const choo  = collection(db, "cities")
// getDocs(choo).then((snap) => {
//   let books = []
//   snap.docs.forEach((doc) => {
//     books.push({ ...doc.data(), id: doc.id })
//   })
//   console.log(books);
// })

// setDoc(doc(db, 'cities', 'NF', 'landmarks', "Even"), {
//     name: 'Golden Gate Bridge',
//     type: 'bridge'
// })

// getDoc(doc(db, 'cities', 'NF', 'landmarks', "Even")).then(snap => {
//   console.log(snap.data());
// })