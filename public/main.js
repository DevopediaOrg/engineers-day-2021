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

    const talksRef = firebase.database().ref('talks');
    talksRef.get().then((snapshot) => {
      if (snapshot.exists()) {
        talks = [];
        snapshot.forEach((talk) => {
          talk = talk.val();

          speakers = [];
          talk.speakers.forEach((speaker) => {
            var name = 'link' in speaker && speaker.link
                        ? `<a href="${speaker.link}">${speaker.name}</a>`
                        : speaker.name;
            speakers.push(`${name}, ${speaker.intro}`);
          });

          talks.push(`
            <tr>
                <td>
                    <img src="${talk.teaser}" alt="" />
                </td>
                <td>
                    <div class="title">
                        ${talk.datetime}<br>
                        ${talk.title}
                    </div>
                    <div class="author">
                        ${speakers.join('<br>')}
                    </div>
                    ${talk.synopsis}
                </td>
            </tr>
            <tr>
                <td colspan=2><br><br></td>
            </tr>
          `);
        });
        document.getElementById('talks').innerHTML = `${talks.join('\n')}`;
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
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
