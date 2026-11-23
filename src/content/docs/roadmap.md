---
title: "Myth Mayhem — Development Roadmap"
---

*A 1v1 card battler built on Philippine mythology*

| | |
|---|---|
| Version | 2.0 |
| Updated | 2026-11-23 |
| Game version | **v0.3.0** (Android and Windows) |
| Engine | Unity 6 (URP) |
| Related documents | [GDD.md](/docs/gdd) (full rules) · [UserManual.md](/docs/manual) (how to play) · [Releases.md](/docs/releases) (what changed in each version) |

---

## 1. The short version

**Myth Mayhem** is a 1v1 card game. Two Inheritors summon creatures from
Philippine mythology (Aswang, Tikbalang, Bakunawa and more) and fight across
three lanes on the Boundary between the human world and the spirit world.

What makes it different is **Alay** (offering). You can give up your own
cards or creatures to get more power right now. Every turn asks: *what am I
willing to give up?*

Today, v0.3.0 is a complete, playable match on Android and Windows: a
tutorial, matches against the AI, and online play with a friend. This roadmap
says what comes next, in three phases: **Now**, **Next** and **Later**. It
also covers how we grow the game into a fair, competitive game that people
can play in tournaments.

---

## 2. Why this game

| The opportunity | How Myth Mayhem answers it |
|---|---|
| Philippine mythology is rich, but few games use it | The whole game is built on it: 44 cards, plus 11 gods from five regional pantheons, each checked against folklore sources |
| Many card games feel the same | Alay adds a "give something up" choice to every turn. Domains add a fight over the battlefield itself |
| Players worry that paying beats skill | Every card has one fixed set of stats, and anything can be crafted. Money can't buy stronger cards |
| People play on the go | A match takes 6–10 minutes, with 30-second turns |
| People switch devices | Play on a phone or a PC, and play each other online |

---

## 3. The game in one minute

- **Win** by bringing your rival from **100 HP to 0**.
- **The board** has 3 lanes. Each lane holds one creature and one Building per side. One Domain sits in the shared middle slot.
- **Each turn** you get summon points (SP), draw a card, play cards, and maybe make an **Alay**. When you end your turn, your creatures attack on their own.
- **Card types:** Creatures, Rituals, Domains, Buildings, and your **patron God**, who helps from above.
- **Kara y Krus**, a coin toss, decides who goes first.
- **The Boundary Collapse:** from round 7, both players lose HP every round, so matches always end.

Full rules are in the [GDD](/docs/gdd). The player's guide is the [User Manual](/docs/manual).

---

## 4. Where we are now (v0.3.0)

**Done and playable:**

- The full rules engine: every rule is tested in code (over 880 automated tests).
- **Tutorial:** one guided match that teaches every mechanic.
- **Vs AI** on three difficulties: Baguhan, Mandirigma, Bagani.
- **Online play with a friend** using a room code, across phone and PC, with automatic reconnect.
- Kara y Krus, the starting hand swap, card details, the Domain clash animation, and attack effects for every creature.
- Builds for **Android** and **Windows**.

**Not done yet:**

- Quick Match against strangers, Ranked, and Story mode (they show as "coming soon" in the game).
- Accounts that save your progress across devices.
- Store releases (today you install the APK or ZIP from our download page).

See [Releases.md](/docs/releases) for what changed in each version.

---

## 5. The plan: Now, Next, Later

We plan in phases instead of fixed dates, so the plan stays true as the team's schedule changes.

### Now: polish for the competition and first players
| Goal | What it means |
|---|---|
| A smooth first match | Play-test the tutorial with new players and fix anything that confuses them |
| Rock-solid online play | Test 100 online matches in a row between two devices, with no out-of-sync games |
| Fair balance | Run thousands of AI-vs-AI matches and fix any card or god that wins too often |
| Better art and feel | Replace placeholder models, add the Alay effects, finish the sound |

### Next: grow the player base
| Goal | What it means |
|---|---|
| **Google Play release** | Publish on the Google Play Store, so players install with one tap and get updates automatically |
| **Accounts** | Sign in once, and keep your cards and progress on phone and PC |
| **Collection** | The deck builder, card collection, crafting and the Tawag (card summons), with the odds always shown |
| **Quick Match** | Get matched against a player of similar skill, no room code needed |
| **Story, Chapter 1** | The first chapter for both paths, Separation and Control |

### Later: competitive play and more stories
| Goal | What it means |
|---|---|
| **Ranked seasons** | Climb from Baguhan to Maalamat, with a fresh season every few months |
| **Apple App Store** | Bring the game to iPhone and iPad |
| **More story chapters** | Each chapter hints at more of the world's mysteries, without solving them all |
| **New card sets** | New creatures from folklore, such as Sigbin, Amomongo, Busaw, Mambabarang and Engkanto |
| **Tournaments and esports** | See section 6 |

---

## 6. The competitive path (esports)

Myth Mayhem's core already fits competitive play. Matches are short, both
players start equal, the coin toss is fair, and skill comes from choices
(where to play, when to make an Alay), not from luck or spending. To meet the
standards players expect from competitive card games, we plan to add:

| Area | What we will add | Why it matters |
|---|---|---|
| **Fairness** | Equal card access in Ranked and tournaments, published balance targets, and regular balance updates | Wins come from skill, not from a bigger collection |
| **Matchmaking** | Skill rating, ranked seasons, and protection for new players | Fair, close matches at every level |
| **Security** | A game server that checks every move, and checks that both players see the same match | No cheating, no "my game showed something else" |
| **Tournament tools** | Private lobbies with set rules, best-of-3 matches, and a tournament deck list check | Schools, clubs and organisers can run events easily |
| **Watching** | Spectator mode, match replays, and a clear match history | Players learn from good matches, and events can be streamed |
| **Deeper strategy** | More cards per set, deck-building limits that reward planning, and a fair way to choose patron gods in tournaments (for example, each player bans one god) | More ways to outplay an opponent |
| **Community** | Student and campus leagues first, then regional online cups | Grow a scene from the Philippines outward |

We will only call a feature "competitive-ready" when it passes the success targets in section 7.

---

## 7. How we measure success

| Area | Target |
|---|---|
| Match length | 6–10 minutes on average |
| Fairness | Whoever goes first wins between 48% and 52% of the time |
| Card health | No card in more than 40% of decks; every card wins within ±5% of the average |
| Alay | Players make 2–5 offerings per match |
| Learning | At least 80% of new players finish the tutorial |
| Online stability | 100 online matches in a row with no out-of-sync games |

---

## 8. Risks and how we handle them

| Risk | How we handle it |
|---|---|
| Some cards or gods are too strong | Thousands of AI-vs-AI test matches, and every number can be tuned |
| Cheating or out-of-sync online games | One shared rules engine, and a server that checks every move |
| "Pay to win" worries | Fixed card stats, everything craftable, gods can't be bought directly |
| Rules for card summons (gacha) in different countries | Show the odds, guarantee a god within a set number of pulls, add an age check and spending limits, and review the rules country by country before launch |
| Server costs | Start small with casual play; add Ranked servers only when players are there |
| Art quality | Gameplay first, then a dedicated art and animation phase |
| Getting the folklore wrong | Every card is checked against sources, and doubtful figures were replaced |
| Doing too much at once | Each phase has a short list, and new ideas wait for the next phase |

---

## 9. Beyond launch

- **Story expansions:** each one shows a little more of the world's five big mysteries (the Relic, the Awakening, why only two Inheritors exist, the original separation, and what the factions really want) without solving them.
- **Live events:** seasonal Ranked, featured god banners, and a season pass.
- **Working with experts:** folklorists and teachers help keep the lore accurate and could help bring the game to classrooms.
