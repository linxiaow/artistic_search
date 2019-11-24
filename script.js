var KEYS = {
  enter: 13
}
var resultView = new Vue({
  el: '#app',
  data: {
    totalFound: 0,
    infos: [],
    selected_info: [],
    no_info: "No information provided",
    no_artist: "Sorry, there is no information for this artist!",
    //tab_exp: "None",
    tab: [], //Description, information
    load_success: [],
    wiki_info: [],
    genres: [],
    selected_genre: [],
    show_result: false, //if show the genre
    artist1: './img/1.jpg',
    artist2: './img/2.jpg',
  },
  methods: {
    search: function(event) {
      // on keys up, specified previously

      //first, break name join by +
      this.genres = []; //clear it to empty
      this.selected_genre = []; //clear it to empty

      let keywords = event.target.value;
      let terms = keywords.split(' ').join('+')
      //alert(keywords_add)

      //then, call axios
      axios
        .get('https://itunes.apple.com/search?term='+terms+'&&origin=*')
        .then(response => {
          console.log(response.data.results);
          this.infos = response.data.results;
          this.selected_info = this.infos.slice();

          this.totalFound = response.data.resultCount;
          if (this.totalFound == 0){
            alert("No artist is found with keywords " + keywords)
          }
          for (let i in this.infos){
            let genre = this.infos[i].primaryGenreName;
            //console.log(genre);
            if(!this.genres.includes(genre)){
              this.genres.push(genre);
            }
          }
          //console.log(this.genres);
          this.load_success = new Array(this.infos.length).fill(false);
          this.tab = new Array(this.infos.length).fill('Description');
          this.wiki_info = new Array(this.infos.length).fill("");
          //this.tab_exp = "Description";
          this.show_result = true;
        })
        .catch(error => console.log(error))
    },

    displayContent: function(index, type, loaded){
      //type = Description or Information
      if(this.tab[index] === type){
        if(type === 'Description'){
          //console.log("Description");
          return true;
        }
        else if(type === 'Information'){
          //console.log("Information");
          return loaded === this.load_success[index];
        }
      }
      return false;
    },

    togle_status(index, change_to){
      //change_to = Description or information
      if(change_to === this.tab[index]){
        //no need to change again
        return;
      }
      this.tab.splice(index, 1, change_to);
      if(change_to === 'Description'){
        //not loaded
        this.load_success.splice(index, 1, false);
      }
      else if(change_to === 'Information'){
        this.load_wiki(index);
      }
    },

    load_wiki: function(index){
      // load information from Wiki API
      // console.log(this.tab[index])
      //if(!this.load_before[index]){
        // not loaded before, need an api call
      let artist = this.infos[index].artistName
      axios
      .get('https://en.wikipedia.org/w/api.php?action=opensearch&search='+artist+'&origin=*')
      .then(response => {
        //console.log(this.load_success)
        this.load_success.splice(index, 1, true);
        //console.log(this.load_success)
        console.log(response.data);
        let artist_info = response.data[2][0];
        if(artist_info){
          this.wiki_info[index] = artist_info;
        }else{
          this.wiki_info[index] = this.no_artist;
        }
      })
      .catch(error => {
        console.log(error);
      })
      //}
    },

    togle_btn(index){
      //console.log(this.selected_genre);
      //console.log("???")
      let genre = this.genres[index];
      let selected_idx = this.selected_genre.indexOf(genre);
      if(selected_idx === -1){
        // not in it
        this.selected_genre.push(genre);
        //console.log(this.selected_genre);
      }else{
        this.selected_genre.splice(selected_idx, 1);
      }
      this.selected_info = [];

      if(this.selected_genre.length === 0){
        //all been unselected
        this.selected_info = this.infos.slice();
      }
      else{
        for(let i in this.infos){
          //console.log(i);
          let cur_genre = this.infos[i].primaryGenreName;
          if(this.selected_genre.includes(cur_genre)){
            this.selected_info.push(this.infos[i]);
          }
        }
      }
      

    },

    check_btn(index){
      let genre = this.genres[index];
      if(this.selected_genre.includes(genre)){
        //selected before
        //this.selected_genre.splice(index, 1);
        //console.log(this.selected_genre);
        return "btn btn-primary";
      }else{
        //not selected before
        //this.selected_genre.push(genre);
        //console.log(this.selected_genre);
        return "btn btn-light";
      }
    },
  }
})
