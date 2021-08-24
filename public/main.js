document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registerForm').addEventListener('submit', submitForm);

    function submitForm(e){
      e.preventDefault();
      saveMessage(document.getElementById('email').value);
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    }

    function saveMessage(email) {
      var isValid = validateEmail(email);
      if (!isValid) return false;

      var regsRef = firebase.database().ref('regs');
      regsRef.push().set({
        email: email
      }, (error) => {
        if (error) {
          console.log(`Data saved FAILED! ${error}`);
        } else {
          console.log('Data saved successfully!');
        }
        handleSave(error);
      });
    }

    function handleSave(error) {
        if (!error) {
            document.getElementById('registerForm').reset();
            document.getElementById('registerForm').style.display = "none";

            document.getElementById('msg').innerHTML = 'You\'re registered!';
            document.getElementById('msg').style.display = "block";
        }
    }

    firebase.analytics();
    
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.firestore().doc('/foo/bar').get().then(() => { });
    // firebase.functions().httpsCallable('yourFunction')().then(() => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    // firebase.analytics(); // call to activate
    // firebase.analytics().logEvent('tutorial_completed');
    // firebase.performance(); // call to activate
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    try {
      let app = firebase.app();
      let features = [
        'auth', 
        'database', 
        'firestore',
        'functions',
        'messaging', 
        'storage', 
        'analytics', 
        'remoteConfig',
        'performance',
      ].filter(feature => typeof app[feature] === 'function');
      console.log(`Firebase SDK loaded with ${features.join(', ')}`);
    } catch (e) {
      console.error(e);
      console.log('Error loading the Firebase SDK, check the console.');
    }
});
