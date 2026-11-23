// Every value you may need to change lives here.
export const site = {
  name: 'Myth Mayhem',
  version: '0.3.0',
  pitch: 'A 1v1 card battler from Philippine mythology. Summon the Aswang, call on the old gods, and give something up to win.',
  downloads: {
    android: {
      label: 'Download for Android',
      url: 'https://github.com/Roj-xx/myth-mayhem-android-download/releases/download/v0.3.0/MythMayhem.apk',
      size: '312 MB',
      file: 'APK',
      available: true,
    },
    windows: {
      label: 'Download for Windows',
      url: 'https://github.com/Roj-xx/myth-mayhem-website/releases/latest/download/MythMayhem-Windows.zip',
      size: 'TBC', // fill in once MythMayhem-Windows.zip is published
      file: 'ZIP',
      available: false, // set to true once the release has MythMayhem-Windows.zip attached
    },
  },
  // The hero trailer plays inside the capiz window. Drop the real trailer into public/media/
  // and set this to its path, e.g. '/media/trailer.mp4'. Empty = show the key art only.
  // (The current trailer.mp4 is the splash logo sting, which doubled the logo over the art.)
  trailer: '',
  poster: '/media/hero-1600',
  credits: ['ELEMENTO', 'Marinduque State University — College of Information and Computing Sciences'],
};
