const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.home = functions.https.onRequest((req, res) => {
    return admin.database().ref('talks/').once('value', (snapshot) => {
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

        res.send(`<!DOCTYPE html>
        <html>
        
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Devopedia Tech Talks / Engineer's Day 2021</title>
        
          <!-- update the version number as needed -->
          <script defer src="/__/firebase/8.9.1/firebase-app.js"></script>
          <!-- include only the Firebase features as you need -->
          <script defer src="/__/firebase/8.9.1/firebase-auth.js"></script>
          <script defer src="/__/firebase/8.9.1/firebase-database.js"></script>
          <script defer src="/__/firebase/8.9.1/firebase-firestore.js"></script>
          <script defer src="/__/firebase/8.9.1/firebase-functions.js"></script>
          <script defer src="/__/firebase/8.9.1/firebase-messaging.js"></script>
          <script defer src="/__/firebase/8.9.1/firebase-storage.js"></script>
          <script defer src="/__/firebase/8.9.1/firebase-analytics.js"></script>
          <script defer src="/__/firebase/8.9.1/firebase-remote-config.js"></script>
          <script defer src="/__/firebase/8.9.1/firebase-performance.js"></script>
          <!-- 
              initialize the SDK after all desired features are loaded, set useEmulator to false
              to avoid connecting the SDK to running emulators.
            -->
          <script defer src="/__/firebase/init.js?useEmulator=true"></script>
        
          <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Raleway" />
          <link rel="stylesheet" href="default.css" />
        </head>
        
        <body>
          <div id="container">
            <img class="banner" src="https://devopedia.org/images/banners/devo-calendar.jpg" alt="Devopedia logo">
            <h1>Tech Talks / Engineer's Day 2021</h1>
            <h2><em>Organized by <a href="https://devopedia.org">Devopedia</a></em></h2>
            <hr>
        
            <div>
              <p>In India, we celebrate 15th September as Engineer's Day, the day being the birthday of Sir Mokshagundam
                Visvesvaraya, who is more commonly known as Sir MV. This year Devopedia is celebrating Engineer's Day with a
                series of tech talks. All talks are free and open to public.</p>
              <p>From 1-15 September, we've scheduled tech talks that will interest developers. Each talk will be 45-60 minutes long with another 10-15 minutes for Q&A. Please register below for an email reminder plus an invite to the sessions.</p>
              <p>All talks will be online via Microsoft Teams. <a href="https://www.microsoft.com/en-in/microsoft-teams/download-app" target="_blank">Download Microsoft Teams</a>. Alternatively, you can join the sessions via Chrome or Microsoft Edge web browsers.</p>
              <p>Write to webadmin@devopedia.org for any queries.</p>
            </div>
        
            <h3>Register</h3>
            <div id=msg style="display: none;"></div>
            <form id=registerForm>
              <label for="email">Email</label>
              <input type=text id=email name=email placeholder="eg. jsmith@gmail.com" />
              <input type=submit id=register value=Register />
            </form>
        
            <h3>Schedule</h3>
            <table>
              <tbody>
              ${talks.join('\n')}
              </tbody>
            </table>
          </div>
        
          <script src="main.js"></script>
        </body>
        
        </html>`
        );
    });
});
