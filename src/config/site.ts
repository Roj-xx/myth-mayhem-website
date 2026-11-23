// Every value you may need to change lives here.
export const site = {
  name: 'Myth Mayhem',
  version: '0.3.0',
  pitch: 'A 1v1 card battler from Philippine mythology. Summon the Aswang, call on the old gods, and give something up to win.',
  downloads: {
    android: {
      label: 'Download for Android',
      url: 'https://github.com/Roj-xx/myth-mayhem-android-download/releases/latest/download/MythMayhem.apk',
      size: '312 MB',
      file: 'APK',
      available: true,
    },
    windows: {
      label: 'Download for Windows',
      url: 'https://github.com/Roj-xx/myth-mayhem-android-download/releases/latest/download/MythMayhem-Windows.zip',
      size: '366 MB',
      file: 'ZIP',
      available: true, // false shows "coming soon" instead of a link
    },
  },
  // Gameplay clip in the hero (recorded from the v0.3.0 Windows build). Swap in a real trailer
  // by dropping it into public/media/ and changing this path. Empty = hide the clip.
  trailer: '/media/gameplay.mp4',
  poster: '/media/hero-1600',
  contact: 'mythmayhem2026@gmail.com',
  credits: ['ELEMENTO', 'Marinduque State University — College of Information and Computing Sciences'],
};
