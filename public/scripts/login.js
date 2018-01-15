
let About = {

  template: `<div id="about">
                <h2>About Us</h2>
                <article>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem dolor sed viverra ipsum nunc. Posuere lorem ipsum dolor sit. At tellus at urna condimentum mattis. Rhoncus aenean vel elit scelerisque mauris pellentesque. Mi eget mauris pharetra et ultrices neque. Faucibus purus in massa tempor nec feugiat nisl pretium fusce. Tincidunt praesent semper feugiat nibh sed pulvinar proin gravida hendrerit. Odio facilisis mauris sit amet. Venenatis lectus magna fringilla urna porttitor rhoncus dolor. Nec dui nunc mattis enim ut tellus elementum sagittis vitae. Amet risus nullam eget felis eget. Ultrices vitae auctor eu augue ut lectus arcu bibendum. Non enim praesent elementum facilisis leo vel fringilla est ullamcorper. Ridiculus mus mauris vitae ultricies leo. Nullam eget felis eget nunc lobortis. Id consectetur purus ut faucibus.

                Adipiscing elit pellentesque habitant morbi tristique senectus et netus. At consectetur lorem donec massa sapien faucibus. Amet purus gravida quis blandit turpis cursus. Mauris rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque. Tempus egestas sed sed risus pretium quam vulputate. Enim nec dui nunc mattis enim ut tellus elementum. Pulvinar mattis nunc sed blandit libero volutpat sed. Urna duis convallis convallis tellus id interdum velit laoreet. Senectus et netus et malesuada fames ac turpis egestas. At auctor urna nunc id cursus metus aliquam. Facilisi etiam dignissim diam quis enim lobortis.

                Quam pellentesque nec nam aliquam sem et tortor consequat id. Ultrices in iaculis nunc sed augue lacus viverra vitae. Ut diam quam nulla porttitor massa id neque aliquam vestibulum. Et egestas quis ipsum suspendisse. Duis tristique sollicitudin nibh sit amet commodo nulla. Nulla at volutpat diam ut. Est velit egestas dui id ornare arcu odio. Porta nibh venenatis cras sed felis eget velit. Tellus orci ac auctor augue. Magna fringilla urna porttitor rhoncus dolor purus non enim praesent. Faucibus pulvinar elementum integer enim neque. Ipsum a arcu cursus vitae congue mauris rhoncus aenean vel. Faucibus in ornare quam viverra orci sagittis eu volutpat odio. Lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt.
                </article>
             </div>`
}

let Home = {

  template: `<div id="home">
                  <h1>Welcome to No Beat!</h1>
             </div>`
}

let Profile = {

  props: ['email', 'username', 'monthly', 'number'],

  template: `<div id="profile">
                <h2>Profile</h2>
                <ul>
                  <li>Email: {{email}}</li>
                  <li>Username: {{username}}</li>
                  <li>Monthly Payment: {{monthly}} €</li>
                  <li>Number of Playlists: {{number}}</li>
                </ul>
            </div>`,

  mounted: function() {

    this.$http.get('/profile', {params: {email: localStorage.getItem('email')}}).then( response => {

        let body = response.body.data;

        this.username = body.username;
        this.email = body.email;
        this.monthly = body.monthly_payment;
        this.number = body.playlist_number;

    })
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
                  <li v-if="logged"><router-link to="/profile">Profile</router-link></li>
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

    number: 0,

    monthly: 0,

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
