// lets start javascript code
let currSong = new Audio();
let songs, songslink;
let currFolder;

// return song name and artist to show
function getSongDetails(ele) {
  const songinfo = ele.querySelectorAll(".details div");
  return songinfo[0].innerHTML;
}

// format seonds into minutes:second
function formatSeconds(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = parseInt(seconds % 60);
  var formattedTime =
    minutes.toString().padStart(2, "0") +
    ":" +
    remainingSeconds.toString().padStart(2, "0");
  return formattedTime;
}

// upadate and play the  new song
const playSong = (track, songName, pause = false) => {
  currSong.src = track;
  let duration;
  currSong.addEventListener("loadedmetadata", function () {
    duration = currSong.duration;
  });
  document.querySelector("#song-name").innerHTML = songName.slice(0, 30);
  document.querySelector("#song-duration").innerHTML = `00:00/${formatSeconds(
    duration
  )}`;
  if (!pause) {
    currSong.play();
    play.src = "./site-content/pause.svg";
  }else{
    document.querySelector(".song-ctrl").style.left = "0";
    play.src = "./site-content/play.svg";
  }
};

async function getSongs(folder) {
  currFolder = folder;
  const responce = await fetch(`http://127.0.0.1:5500/${folder}/`);
  const data = await responce.text();
  let div = document.createElement("div");
  div.innerHTML = data;
  const allas = div.querySelectorAll("ul li a");
  songs = [];
  songslink = [];
  for (const a of allas) {
    if (a.href.endsWith(".mp3")) {
      let sName = Array.from(a.href.split("/"))
        .slice(-1)[0]
        .replaceAll("%20", " ");
      songslink.push(a.href);
      songs.push(sName);
    }
  }
  // in starting we want ot set a song in our play bar
  playSong(songslink[0], songs[0], (pause = true));

  // adding list of songs inside the librry
  let playlist = document.querySelector(".my-playlist ul");
  playlist.innerHTML = "";
  for (let index = 0; index < songs.length; ++index) {
    let sTitle = Array.from(songs[index].split(" ")).slice(0, 5).join(" ");

    playlist.innerHTML =
      playlist.innerHTML +
      `<li class="song-card">
        <img class = "invert-img" src="./site-content/music.svg" alt="">
        <div class="details">
            <div class = "sliding-text">${sTitle}</div>
        </div>
        <div class = "link"><a style="text-decoration: none; color: white" href="${songslink[index]}"></a>Play Now</div>
        <img class = "invert-img" src="site-content/play-1.svg" alt="">

    </li>`;
  }

  // add a eventListener when we want to play a song from play list
  Array.from(
    document.querySelector(".my-playlist").getElementsByTagName("li")
  ).forEach((ele) => {
    ele.addEventListener("click", (e) => {
      let songName = getSongDetails(ele);
      playSong(ele.querySelector(".link a").href, songName);
    });
  });
}


async function displayAlbums(){
  const responce = await fetch(`http://127.0.0.1:5500/songs`);
  const data = await responce.text();
  let div = document.createElement("div");
  div.innerHTML = data
  let anchors = div.querySelectorAll("li a")
  let array =  Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")){
      folder = e.href.split("/").slice(-1)[0]
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
      let info = await a.json()
      // console.log(info.title, info.description)
      document.querySelector(".card-container").innerHTML +=`<div data-folder="${info.title}" class="card">
                        <div class="play transform">
                            <img src="./site-content/play.svg" alt="">
                        </div>    
                        <img src="./songs/${folder}/cover.jpg" alt="Error">
                        <h2>${info.title}</h2>
                        <p>${info.description} </p>
                    </div>`
    }
  
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      console.log(item.currentTarget.dataset.folder, "click")
      await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}
}


async function main() {
  await displayAlbums()
  // await getSongs("songs/Romantic-song");

  // add event listner to pause/ play song-control
  play.addEventListener("click", (e) => {
    if (currSong.paused) {
      play.src = "./site-content/pause.svg";
      currSong.play();
    } else {
      play.src = "./site-content/play.svg";
      currSong.pause();
    }
  });

  // add a event listner to timeupdate
  currSong.addEventListener("timeupdate", (e) => {
    document.querySelector("#song-duration").innerHTML = `${formatSeconds(
      currSong.currentTime
    )}/${formatSeconds(currSong.duration)}`;
    document.querySelector(".song-ctrl").style.left =
      (currSong.currentTime / currSong.duration) * 100 + "%";
  });

  // add a  event listener to the seek bar
  document.querySelector(".song-bar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".song-ctrl").style.left = percent + "%";
    currSong.currentTime = (currSong.duration * percent) / 100;
  });

  // add event listener to menu
  document.querySelector(".menu").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "0";
  });

  // add event listener to close icon
  document.querySelector(".close").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "-120%";
  });

  // add evet listener to prev icon
  prev.addEventListener("click", (e) => {
    const index = songslink.indexOf(currSong.src);
    if (index > 0) {
      playSong(songslink[index - 1], songs[index - 1]);
    }
  });

  // add evet listener to prev icon
  next.addEventListener("click", (e) => {
    const index = songslink.indexOf(currSong.src);
    // console.log(index, songslink.length);
    if (index < songslink.length - 1) {
      playSong(songslink[index + 1], songs[index + 1]);
    }
  });

  // add eventListner to volume
  document
    .querySelector(".volume-container")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currSong.volume = e.target.value / 100;
    });

  // add eventlistner to load cards
  
}
main();
