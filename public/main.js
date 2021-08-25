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

    function secs2dhms(secs) {
      var day = 86400;
      var hour = 3600;
      var minute = 60;
      var daysout = Math.floor(secs / day);
      var hoursout = Math.floor((secs - daysout * day)/hour);
      var minutesout = Math.floor((secs - daysout * day - hoursout * hour)/minute);
      var secondsout = secs - daysout * day - hoursout * hour - minutesout * minute;
      return [daysout, hoursout, minutesout, secondsout];
    }

    setInterval(() => {
      Array.prototype.forEach.call(document.getElementsByClassName('countdown'), (elem) => {
        var parts = /(\d+)h (\d+)m (\d+)s/.exec(elem.innerHTML);
        var newsecs = parts[1]*3600 + parts[2]*60 + parts[3]*1 - 1; // *1 to convert to int
        var timer = secs2dhms(newsecs);
        elem.innerHTML = `Starts in<br>${timer[1]}h ${timer[2]}m ${timer[3]}s`;
      });
    }, 1000);
    
    const talksRef = firebase.database().ref('talks');
    talksRef.get().then((snapshot) => {
      if (snapshot.exists()) {
        talks = [];
        snapshot.forEach((talk) => {
          talk = talk.val();

          // Is current time coinciding with talk time?
          var talkclass = '';
          var meetmsg = 'Join Meeting';
          var now = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}) // eg. '9/4/2021, 10:33:26 AM'
          now = new Date(now);
          var when = talk.datetime;
          when = when.replace(/(.*),\s+\w+\s+@\s+(\d+)\s*(am|pm).*/, '$1 '+now.getFullYear()+', $2:00 $3');
          when = new Date(when);
          var diffsecs = (when - now) / 1000;
          if (diffsecs < -3600) {  // assuming talks run for about an hour
            meetmsg = 'Completed';
            talkclass = 'completed';
          }
          else if (diffsecs<0) {
            meetmsg = '<span class="live">&#9673;</span> Join Meeting<br>&#9656; Now Live';
          }
          else {
            var timer = secs2dhms(diffsecs);
            if (timer[0]>1) meetmsg = `Join Meeting<br>&#9656; Starts in<br>${timer[0]} days`;
            else if (timer[0]==1) meetmsg = 'Join Meeting<br>&#9656; Starts in<br>1 day';
            else {
              meetmsg = `Join Meeting<br>&#9656; <span class='countdown'>Starts in<br>${timer[1]}h ${timer[2]}m ${timer[3]}s</span>`
            }
          }

          // Venue and meetmsg are made public if venue is configured
          var venue = 'venue' in talk && talk.venue
                      ? `<a class="meet" href="${talk.venue}" target="_blank">${meetmsg}</a>`
                      : '';

          // Mostly single speaker but some talks have multiple speakers
          speakers = [];
          talk.speakers.forEach((speaker) => {
            var name = 'link' in speaker && speaker.link
                        ? `<a href="${speaker.link}">${speaker.name}</a>`
                        : speaker.name;
            speakers.push(`${name}, ${speaker.intro}`);
          });
          
          talks.push(`
            <tr class=${talkclass}>
                <td>
                    <img src="${talk.teaser}" alt="" />
                    ${venue}
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
            <tr class=${talkclass}>
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
