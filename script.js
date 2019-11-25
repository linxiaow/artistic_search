var KEYS = {
  enter: 13
}
var resultView = new Vue({
  el: '#app',
  data: {
    totalFound: 0,
    infos: [],
    infos_backup:[],
    selected_info: [],
    no_info: "No information provided",
    no_artist: "Sorry, there is no information for this artist!",
    //tab_exp: "None",
    tab: [], //Description, information
    //selected_tab:[],
    selected_idx: [], //store selected index
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
          this.infos_backup = this.infos.slice();

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
            this.selected_idx.push(i); //at the begining, all
          }
          //console.log(this.genres);
          this.load_success = new Array(this.infos.length).fill(false);
          this.tab = new Array(this.infos.length).fill('Description');
          //this.selected_tab = this.tab.slice();
          this.wiki_info = new Array(this.infos.length).fill("");
          //this.tab_exp = "Description";
          this.show_result = true;
        })
        .catch(error => console.log(error))
    },

    displayContent: function(index, type, loaded){
      //type = Description or Information
      //console.log("In display content and index = "+ index.toString());
      let idx = this.trans_idx(index);
      //console.log("Translate to "+idx.toString());
      if(this.tab[idx] === type){
        if(type === 'Description'){
          //console.log("Description");
          return true;
        }
        else if(type === 'Information'){
          //console.log("Information");
          return loaded === this.load_success[idx];
        }
      }
      return false;
    },

    togle_status(index, change_to){
      //change_to = Description or information
      //console.log("In togle status and index = "+ index.toString());
      //console.log("togle status, the index is")
      //console.log(index);
      let idx = this.trans_idx(index);
      console.log("translate to index ");
      //console.log(idx);
      //console.log("Translate to "+idx.toString());
      if(change_to === this.tab[idx]){
        //no need to change again
        return;
      }
      this.tab.splice(idx, 1, change_to);
      if(change_to === 'Description'){
        //not loaded
        this.load_success.splice(idx, 1, false);
      }
      else if(change_to === 'Information'){
        this.load_wiki(idx); // this index will be normal index
      }
    },

    load_wiki: function(index){
      // load information from Wiki API
      // console.log(this.tab[index])
      //if(!this.load_before[index]){
        // not loaded before, need an api call
      let artist_row = this.infos[index].artistName;
      let artist_list = artist_row.split(',');
      if(artist_list.length === 1){
        artist_list = artist_list[0].split('&');
      }
      let artist = artist_list[0];
      console.log(artist);
      axios
      .get('https://en.wikipedia.org/w/api.php?action=opensearch&search='+artist+'&origin=*')
      .then(response => {
        //console.log(this.load_success)
        this.load_success.splice(index, 1, true);
        //console.log(this.load_success)
        console.log(response.data);
        let artist_info = response.data[2][0];
        //console.log(artist_info);
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
      //console.log("togle buttom index " + index.toString())

      //first, change all value of tab to description
      //this.tab = new Array(this.infos.length).fill("Description");
      
      this.tab = [];
      for(let i in this.infos){
        this.tab.push("Description");
      }
      let genre = this.genres[index];
      let s_idx = this.selected_genre.indexOf(genre);
      if(s_idx === -1){
        // not in it
        this.selected_genre.push(genre);
        //console.log(this.selected_genre);
      }else{
        this.selected_genre.splice(s_idx, 1);
      }

      //this.selected_tab = [];
      this.get_selected();
      
    },

    get_selected(){
      this.selected_info = [];
      this.selected_idx = [];
      if(this.selected_genre.length === 0){
        //all been unselected
        this.selected_info = this.infos.slice();
        for(let i in this.infos){
          this.selected_idx.push(i);
        }
      }
      else{
        for(let i in this.infos){
          //console.log(i);
          let cur_genre = this.infos[i].primaryGenreName;
          //let cur_tab = this.tab[i];
          if(this.selected_genre.includes(cur_genre)){
            this.selected_info.push(this.infos[i]);
            this.selected_idx.push(i);
            
           //this.selected_tab.push(cur_tab);
          }
          //console.log("In genre selection")
          //console.log(this.selected_idx);
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

    clear_filter(){
      if(this.selected_genre.length !== 0){
        //console.log("clear filter");
        this.selected_genre = [];
        this.selected_info = this.infos.slice();
        this.selected_idx = [];
        for(let i in this.infos){
          this.selected_idx.push(i);
        }
        //this.selected_tab = this.tab.slice();
      }
    },

    trans_idx(index){
      return this.selected_idx[index];
    },

    show_wiki(index){
      let idx = this.trans_idx(index);
      return this.wiki_info[idx];
    },

    result_sort(where){
      //where = price, collection, type, unsort
      if(where === 'unsort'){
        this.infos = this.infos_backup.slice();
        this.get_selected();
      }else if(where === 'price'){
        //sort by price
        this.infos.sort((a, b) =>(
          a.collectionPrice > b.collectionPrice? 1 : -1
        ));
        this.get_selected();
      }else if(where === 'collection'){
        //sort by price
        this.infos.sort((a, b) =>(
          a.collectionName > b.collectionName? 1 : -1
        ));
        this.get_selected();
      }else if(where === 'type'){
        //sort by price
        this.infos.sort((a, b) =>(
          a.kind > b.kind? 1 : -1
        ));
        this.get_selected();
      }
    },

    get_filtered_num(){
      return this.selected_info.length;
    }
  }
})
