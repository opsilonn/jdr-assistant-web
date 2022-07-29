// Imports
import { Howl } from "howler";
const INDEX_OF_CATEGORY_NAME = 2;

const state = () => ({
  audioCategories: [
    {
      title: "Ambiance",
      icon: "mdi-city-variant-outline",
      audio: {},
      howl: undefined,
      play: false,
      loop: false,
      error: false,
      volume: 1,
    },
    {
      title: "Musique",
      icon: "mdi-music-note",
      audio: {},
      howl: undefined,
      play: false,
      loop: false,
      error: false,
      volume: 1,
    },
    {
      title: "SFX",
      icon: "mdi-ear-hearing",
      audio: {},
      howl: undefined,
      play: false,
      loop: false,
      error: false,
      volume: 1,
    },
  ],
});

const getters = {};

const mutations = {
  /** */
  setAudio(state, audio) {
    // We get the category's index
    const category = state.audioCategories.find((tab) => audio.path.split("/")[INDEX_OF_CATEGORY_NAME].includes(tab.title));

    // If not found : ERROR
    if (!category) {
      alert("Music not found !");
      return;
    }

    // If an audio was already loaded : stop it
    if (!!category.howl) {
      category.howl.pause();
    }

    // We set some values
    category.audio = audio;
    category.play = true;
    category.howl = new Howl({
      src: [audio.path],
      loop: category.loop,
      volume: category.volume,
    });

    // We play the audio file
    category.howl.play();
    category.error = false;

    // When it ends, and if loop is disabled : disable the play flag
    category.howl.on("end", () => {
      if (!category.loop) {
        category.play = false;
      }
    });

    // If it fails to load
    category.howl.on("loaderror", () => {
      category.play = false;
      category.howl = null;
      category.error = true;
      alert(`Piste audio non trouvée\n - nom : ${audio.name}\n - chemin : ${audio.path}`);
    });
  },

  /**
   * Sets the volume of a specific track
   * @param {String} title Title of the track to update
   */
  setVolume(state, title) {
    // We get the category
    const category = state.audioCategories.find((_) => _.title === title);

    // If a file, is loaded, we set the volume accordingly
    if (!!category.howl) {
      category.howl.volume(category.volume);
    }
  },

  /**
   * Either plays or pauses a specific track
   * @param {String} title Title of the track to update
   */
  setPlayOrPause(state, title) {
    // We get the category
    const category = state.audioCategories.find((_) => _.title === title);

    // If a file, is loaded, we play or pause it accordingly
    if (!!category.howl) {
      category.play = !category.play;
      if (category.play) {
        category.howl.play();
      } else {
        category.howl.pause();
      }
    }
  },

  /**
   * Either enables or disables the loop a specific track
   * @param {String} title Title of the track to update
   */
  setLoop(state, title) {
    // We get the category
    const category = state.audioCategories.find((_) => _.title === title);

    // If a file, is loaded, we (dis)enable the loop it accordingly
    if (!!category.howl) {
      category.loop = !category.loop;
      category.howl.loop(category.loop);
    }
  },

  /** Stops all tracks that are being played */
  stopAllAudioTracks(state) {
    state.audioCategories.forEach((tab) => {
      if (!!tab.howl) {
        tab.howl.pause();
      }
    });
  },
};

const actions = {};

export default {
  state,
  getters,
  mutations,
  actions,
};
