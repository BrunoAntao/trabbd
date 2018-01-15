
let About = {

  template: '<p>This is About</p>'
}

let Home = {

  template: '<p>This is Home</p>'
}

let Profile = {

  template: '<p>This is Profile</p>',

  methods: {


  }
}

let Playlists = {

  props: {

    playlists: [],

    showMusics: Boolean

  },

  mounted: function () {

    this.$http.get('/playlists', { params: { email: localStorage.getItem('email') } }).then(response => {

      let playlist = [];

      response.body.map(el => {

        this.$http.get('/musics', { params: { name: el, email: localStorage.getItem('email') } }).then(response => {

          playlist.push(response.body);
          
          playlist.forEach(function (list, i) {

            list.id = i;

          })

        });

      });

      this.showMusics = -1;
      this.playlists = playlist;

    }).catch((err) => { console.log(err); });

  },

  template: `<div id="playlist_display">
                <h2>Your Playlists</h2>
                <ul>
                  <li v-for="playlist in playlists">
                    <div>
                      <span v-on:click.prevent="remove($event)">{{playlist.name}}</span>
                      <input v-on:click="if(showMusics != playlist.id) {showMusics = playlist.id} else {showMusics = -1}" class="musicButton" type="submit" value="Show Musics!">
                    </div>
                    <template v-if="showMusics == playlist.id">
                    <ul>
                      <li class="music" v-for="music in playlist.musics">
                        <ul>
                          <li class="music-info" v-on:click="removeMusic($event)">{{music.name}}</li>
                          <li class="music-info">Author: {{music.author}}</li>
                          <li class="music-info">Style: {{music.style}}</li>
                        </ul>
                      </li>
                    </ul>
                    </template>
                  </li>
                </ul>
                <input type="text" id="playlistName" placeholder="Your playlist name!">
                <input v-on:click="add()" id="playlistButton" type="submit" value="Add Playlists!">
                <div class="music-form">
                  <input type="text" id="plName" placeholder="Playlist name">
                  <input type="text" id="musicName" placeholder="Music name">
                  <input type="text" id="authorName" placeholder="Author name">
                  <input type="text" id="styleName" placeholder="Style">
                  <input v-on:click="addMusic($event)" class="add-music" type="submit" value="Add Musics!">
                </div>
             </div>`,

  methods: {

    add: function () {

      if (playlistName.value.trim() == "") return;

      this.$http.post('/playlists', { name: playlistName.value.trim(), email: localStorage.getItem('email') }).then(response => {

        console.log(response.body);

        this.playlists.push({ name: playlistName.value.trim(), musics: [] });

      }).catch((err) => { console.log(err); });

    },

    remove: function (element) {

      let plName = element.target.innerText.trim();

      this.$http.delete('/playlists', { params: { name: plName, email: localStorage.getItem('email') } }).then(response => {

        this.playlists = this.playlists.filter(el => el.name !== plName)

      }).catch((err) => { console.log(err); });

    },

    addMusic: function (element) {

      if (musicName.value.trim() == "" || plName.value.trim() == "") return;

      let body = { name: musicName.value.trim(), author: authorName.value, style: styleName.value, plName: plName.value.trim(), email: localStorage.getItem('email') }

      this.$http.post('/musics', body).then(response => {

      }).catch((err) => { console.log(err); });

    },

    removeMusic: function (element) {

      let music = element.target.innerText;

      let plName = element.path[4].firstChild.innerText.trim();

      this.$http.delete('/musics', { params: { name: music, plName: plName, email: localStorage.getItem('email') } }).then(response => {


      }).catch((err) => { console.log(err); });

    }
  }
}

let Navbar = {

  props: ['logged'],

  template: `
            <div class="navbar">
                <img src="../assets/logo.png"/>
                <ul>
                  <li><router-link to="/home">Home</router-link></li>
                  <li v-if="!logged"><router-link to="/login">Login</router-link></li>
                  <li v-if="!logged"><router-link to="/register">Register</router-link></li>
                  <li><router-link to="/about">About Us</router-link></li>
                  <li v-if="logged" v-on:click="getProfile()"><router-link to="/profile">Profile</router-link></li>
                  <li v-if="logged"><router-link to="/playlists">Playlists</router-link></li>
                  <li v-if="logged" v-on:click="logOut()"><router-link to="/home">Log Out</router-link></li>
                </ul>
                <div id="footer">
                  <i class="fab fa-facebook-square social"></i>
                  <i class="fab fa-twitter-square social"></i>
                  <i class="fab fa-google-plus-square social"></i>
                </div>
             </div>`,

  methods: {

    logOut: function () {

      this.$emit('login', false)

    },

    getProfile: function () {

      this.$http.get('/profile', { params: { email: localStorage.getItem('email') } }).then(response => {

        console.log(response.body);

      }).catch((err) => { console.log(err); });

    }
  }
}

let Register = {

  props: ['email', 'password', 'username', 'premium'],

  template: `
              <form>
                <img src="../assets/mini-logo.png"/>
                <input v-model="username" type="text" id="username" placeholder="Username">
                <i class="fas fa-user"></i>
                <input v-model="email" type="text" id="email" placeholder="Email">
                <i class="fas fa-envelope"></i>
                <input v-model="password" type="password" id="password" placeholder="Password">
                <i class="fas fa-lock"></i>
                <p>Premium</p>
                <label class="switch">
                  <input v-model="premium" id="premium" type="checkbox">
                  <span class="slider round"></span>
                </label>
                <input v-on:click.prevent="submit()" id="submit" type="submit" value="Sign Up">
              </form>
            `,

  methods: {

    submit: function () {

      let body = { email: this.email, password: this.password, username: this.username, premium: this.premium };

      this.$http.post('/register', body).then(response => {

        if (response.body.success) { router.push('login') }

      }).catch((err) => { console.log(err); });
    }
  }
}

let LoginForm = {

  props: ['email', 'password', 'logged'],

  template: `
                <form>
                  <img src="../assets/mini-logo.png"/>
                  <input v-model="email" type="text" id="email" placeholder="Email">
                  <i id="envelope" class="fas fa-envelope"></i>
                  <input v-model="password" type="password" id="password" placeholder="Password">
                  <i id="lock" class="fas fa-lock"></i>
                  <span><router-link to="/register">Not a member yet? Join in!</router-link></span>
                  <input v-on:click.prevent="submit()" id="submit" type="submit" value="Sign In">
                </form>
              `,
  methods: {

    submit: function () {

      let body = { email: this.email, password: this.password }

      this.$http.post('/login', body).then(response => {

        if (response.body.success) {

          localStorage.setItem('email', this.email);

        }

        this.$emit('login', response.body.success)

      }).catch((err) => { console.log(err); });

    }
  }
}

let MainContent = {

  props: ['logged'],

  template: `<div  class="main-content">
                <router-view v-on:login="login($event)"></router-view>
              </div>
              `,

  methods: {

    login: function (logged) {

      this.$emit('login', logged)

    }
  }
}

const routes = [

  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/login', component: LoginForm },
  { path: '/about', component: About },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile },
  { path: '/playlists', component: Playlists }

]

const router = new VueRouter({

  routes

})

let app = new Vue({

  el: '.wrapper',

  router: router,

  data: {

    logged: false,

    email: '',

    password: '',

    username: '',

    premium: false,

    playlists: [],

    showMusics: false

  },

  components: {

    'navigation': Navbar,
    'main-content': MainContent,
    'login-form': LoginForm,
    'register': Register,
    'home': Home,
    'profile': Profile,
    'playlists': Playlists
  },

  methods: {

    login: function (logged) {

      if (logged) {

        router.push('home');

        this.logged = logged;

      } else {

        router.push('login');

        this.logged = false;

        localStorage.setItem('email', null);

      }

    }
  }

})
