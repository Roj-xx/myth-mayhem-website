---
title: "Myth Mayhem — Game Design Document (Rework)"
---

| | |
|---|---|
| Version | **2.1, final** (concept, rules, card set, balance passes 1–3, accounts; 2.1 adds the rules clarifications in §3.13) |
| Date | 2026-11-16 |
| Engine | Unity 6 (6000.3), URP |
| Platforms | Mobile (Android/iOS) and PC (Windows) — equal priority |
| Genre | Turn-based 1v1 collectible card battler |
| Match length | 6–10 minutes |
| Status | **Final.** Rules and content are locked; numbers marked **[tune]** are starting values to confirm through simulation and playtests |

### Document set
| Document | For | Contents |
|---|---|---|
| **GDD.md** (this file) | Developers | Full rules, systems, tech and scope |
| Cards.md | Developers, co-devs | The Set v1 card list, starter decks, gacha and crafting numbers, lore sources, balance changelog |
| [Roadmap.md](/docs/roadmap) | Judges, partners, team | White paper: vision, milestones, competition scope, risks |
| [UserManual.md](/docs/manual) | Players | A simple walkthrough of how to play |
| [Releases.md](/docs/releases) | Everyone | What changed in each version, in plain words |
| ImplementationPlan.md | Developers | Audit of v0.2.0, target architecture, build order and work packages |
| UIGuide.md | Developers, artists | Screens that need reference pictures, the prefab list and the art each needs, prefab editing rules |

If a number differs between documents, **Cards.md wins for card numbers**,
**GDD.md wins for rules**, and **ImplementationPlan.md wins for how and in
what order things are built**. Change the winning document first, then the others.

---

## 1. Vision

### 1.1 Pitch
Two Inheritors with the forgotten power to summon the beings of Philippine
mythology clash on the Boundary between the human and supernatural worlds.
Summon Aswang, Diwata and Bakunawa, invoke ancient forces, raise sacred
structures — and when the battle demands it, give something up. **Alay**, the
act of offering, turns your own cards and creatures into power, at a price.

### 1.2 Design pillars
1. **Lore first.** Every mechanic, ability and name comes from Philippine
   folklore or the Myth Mayhem canon. If a rule can't be explained through the
   lore, it doesn't ship.
2. **Simple to read, deep to master.** Three lanes, one resource, automatic
   combat. Depth comes from *where* and *when*, and *what you're willing to
   sacrifice* — not from rule volume.
3. **Every sacrifice is a choice.** Alay is optional but always tempting.
   A good turn often means giving up a card you'd like to keep.
4. **Fair duels.** Collection grows through play and gacha, but rarity adds
   complexity and identity, not raw power. Ranked must be winnable with
   craftable decks.

### 1.3 Unique selling points
- Alay: an optional sacrifice layer on top of a familiar resource, with
  cards that have a second life when offered.
- Filipino mythology as a full setting (not reskinned fantasy), with Tagalog
  naming throughout.
- A canon built around open mysteries, designed for long-running story expansions.

### 1.4 Target audience
- Mobile and PC card-game players (13+; see §7.5 for monetization age gates).
- Filipino players and the diaspora; mythology and folklore fans globally.

---

## 2. World & Narrative

### 2.1 Canon summary
- **The Forgotten World.** The human world and a supernatural realm once
  existed side by side. Conflict and fear drove them apart; humanity forgot,
  and the supernatural faded into legend.
- **The Awakening.** A forgotten source of power stirs, awakening mythical
  beings and reigniting ancient rivalries. Its cause is unknown.
- **The Two Inheritors.** Only two Inheritors can exist at a time. Neither knew
  their heritage; both can summon mythical beings and channel supernatural
  forces. They are not destined enemies — their choices oppose them.
  - **Path of Separation:** seal the worlds apart forever to protect humanity.
  - **Path of Control:** rule both worlds under one will to end disorder.
  - Neither is unquestionably right.
- **The Relic.** An unidentified ancient relic believed to alter the boundary
  between worlds. Both Inheritors seek it. Its cost is unknown.
- **Factions.** Mythical beings belong to independent factions with their own
  motives, leaders and rivalries — not a single army, not good vs. evil.
- **The Battles.** Matches are manifestations of the larger conflict over the
  future of both worlds, fought on a bounded battlefield.

**Central question:** Is peace worth the loss of connection, and can order
justify the loss of freedom?

### 2.2 Protected mysteries
These must **not** be answered in any shipped content, card text, or tutorial.
Hints are allowed; resolutions are reserved for future expansions.
1. The relic's true identity and origin.
2. The deeper cause of the Awakening.
3. Why exactly two Inheritors can exist.
4. What really happened at the original separation.
5. The true motives and histories of the factions.

### 2.3 How lore shows up in gameplay
| Lore element | In gameplay |
|---|---|
| Inheritors | The player's hero; 100 HP; a patron God (Passive + Active) |
| Paths (Separation / Control) | **Story only** — campaign chapters, cosmetics, voice lines. No rule differences. |
| Summoning beings | Creature cards |
| Supernatural forces | Ritual cards |
| Manifested structures | Building cards |
| Sacred and cursed places | Domain cards (shared battlefield effect) |
| The old gods | Patron Gods (one per deck, never on the board) |
| The Boundary | The battlefield itself (3 lanes) |
| Offerings to the spirits | Alay |
| Factions | Card art, flavor text, collection grouping, story. **No gameplay rules.** |

---

## 3. Core Gameplay

### 3.1 Match overview
1. Both players bring a 20-card deck and choose one patron God.
2. **Kara y Krus**, a coin toss, decides who goes first (§3.1a).
3. Players take turns. On your turn you gain summon points, draw, play cards,
   optionally perform Alay, and your creatures strike at end of turn.
4. Reduce the enemy Inheritor from 100 HP to 0 to win.

### 3.1a Kara y Krus (who goes first)
*Kara y Krus* is the traditional Filipino coin toss: *kara* means "face" and
*krus* means "cross." In Myth Mayhem the coin is an **agimat**, with a
carved face on the Kara side and a cross-like sigil on the Krus side.

*(Reworked 2026-11-23, user decision: players no longer call. Two players
calling the same side and the coin landing on it read as "we both won".)*

1. **Sides are fixed by seat.** Player 1 (seat 0: the host, or you against
   the AI) is always **Kara**; Player 2 (seat 1: the joiner, or the AI) is
   always **Krus**. Nobody chooses.
2. **Both sides signal ready.** Each client sends its ready signal as soon as
   the battle opens (the existing `CallCoin` action; its face value is
   ignored, the seat decides the side). A seat that isn't ready within
   **5 s [tune]** is readied by the server.
3. **The server flips the agimat** once both are ready. The result is
   generated and broadcast by the server, never by a client, and is recorded
   in the match log for ranked disputes. **The side it lands on goes first.**
   It is exactly 50/50.
4. **Presentation (S10):** the two Inheritor personas are revealed on
   opposite sides with their names and their side (KARA / KRUS); after 3 s
   the agimat flips by itself in the centre (about 2 s), the winner's persona
   flares, and "Ikaw ang mauuna!" ("You go first!") or "<Rival> goes first"
   shows.
5. **Vs AI and Story:** the same toss happens. Scripted story battles and the
   tutorial can fix who goes first; the coin then lands on that seat's side.

### 3.2 Win, lose, draw
- **Win:** enemy Inheritor reaches 0 HP.
- **Draw:** both reach 0 in the same resolution.
- **Concede:** counts as a loss (existing `ConcedeServerRpc`).
- **Disconnect:** 60 s reconnect window, then loss **[tune]** (§3.13 R13).
- **Turn limit:** see Boundary Collapse (§3.9).

### 3.3 Board
```
              OPPONENT INHERITOR (100)
   ┌──────────┬──────────┬──────────┐
   │ Building │ Building │ Building │   opponent row
   │ Creature │ Creature │ Creature │
   ├──────────┼──── ◆ ───┼──────────┤ ← the Boundary  (◆ = shared Domain slot)
   │ Creature │ Creature │ Creature │
   │ Building │ Building │ Building │   player row
   └──────────┴──────────┴──────────┘
     Lane 1      Lane 2      Lane 3
               PLAYER INHERITOR (100)
```
- 3 lanes per side (keeps `BoardManager.LaneCount = 3`).
- Each lane slot holds **1 creature** and **1 Building** per side; the whole battlefield shares **1 Domain slot**.
- A creature can only be played into an empty creature slot. To replace one,
  offer it via Alay first (this makes Alay a board-management tool too).
- Lanes are **adjacent** left–right (1↔2, 2↔3); some abilities use adjacency.

### 3.4 Summon points
Summon points (SP) remain the primary resource.

| Rule | Value |
|---|---|
| Starting SP — first player | 3 **[tune]** |
| Starting SP — second player | 4 **[tune]** (first-turn compensation) |
| Income per turn (from your 2nd turn) | +2 **[tune]** |
| Unspent SP | Carries over |
| SP cap | 10 **[tune]** — excess is lost |

Change from current build: starting SP 5 → 3/4 and a cap of 10 to stop
turn-1 high-cost plays and runaway banking.

### 3.5 Alay (Offering)
The signature mechanic. During your main phase you may offer:

| Offering | SP gained | Notes |
|---|---|---|
| A card from your hand | **+1 SP** | Card goes to your discard pile |
| A creature on your board | **+⌈cost ÷ 2⌉ SP** (min 1) | Creature is removed (does *not* count as dying) |
| A token on your board (Malakas, Maganda) | **+0 SP** | It frees the lane and still counts as "offering a creature" (Sidapa, Sarimanok, the God Charge) |

Rules:
- **Max 2 Alay per turn [tune].**
- Alay SP is added immediately and **may exceed the SP cap this turn only**
  (excess above cap is lost at end of turn) — so Alay can enable a big
  play but not long-term banking.
- **Alay SP cap: at most +3 SP from Alay per turn [tune]**, bonuses included.
  This stops early ramp into 6-cost cards.
- **Bonus SP doesn't stack:** each Alay applies at most **one** bonus
  (Duwende, Kapre, Dambana or Agueo). If several apply, the highest one counts.
- If the offered card has an **Alay effect**, it triggers (see §3.6).
- Bonuses still apply to a token, so a token can give +1 SP with Agueo or Dambana.
- Your **first Alay each turn** gives **+1 God Charge** (§3.8); a second Alay
  that turn gives no Charge.
- A card you can't play right now (such as a Domain that loses the affinity
  matchup, §3.8a) can still be offered from hand.
- Buildings can't be offered, neither a Building card in hand nor a Building
  on the board. Rituals and Domains can be offered from hand.
- Legendary creatures **cannot be offered from the board** (they may still be
  offered from hand).
- Alay is never mandatory; no card cost requires it.

Design intent: Alay trades card advantage for tempo. Players ask each turn:
*Do I offer a weak card to land a big summon now? Do I sacrifice a damaged
creature before it dies, to free its lane and power my next play?*

### 3.6 Alay effects
Only some cards have an Alay effect (target: ~35–40% of the card pool).
It is printed on the card as a separate line:

> **Alay:** Restore 9 HP to your Inheritor.

- Triggers only when the card is offered — not when it dies, is discarded,
  or is played.
- If the Alay effect needs a target and one exists, you must choose it.
- Alay effects are usually modest; they reward offering the *right* card.
- Cards with strong play effects usually have weak or no Alay effects, and
  vice versa — this creates "play it or offer it?" decisions.

### 3.7 Card types
| Type | Description | On board? |
|---|---|---|
| **Creature** | Summoned mythical being with ATK/HP, keywords, optional ability and Alay effect | Creature slot |
| **Ritual** | Supernatural effect: instant or timed (1–3 turns) | No (resolves) |
| **Domain** | Battlefield-wide effect lasting N turns; owned by whoever played it | Shared Domain slot |
| **Building** | Manifested building; has HP, no ATK; passive effect; **lasts a limited number of turns** (§3.7a) | Building slot |
| **Patron God** | Not a deck card; chosen pre-match; Passive + charged Active | Hero UI |

"For N turns" (Rituals, Domains and Buildings) means N of the owner's turns,
counting the turn it is played.

### 3.7a Buildings are temporary
A manifestation can't hold forever on the Boundary, so every Building has a
**Duration** as well as HP.
- A Building is removed at the end of its owner's last turn, or earlier if
  its HP reaches 0 (from strikes into an empty lane, Bakunawa's Eclipse or
  Lalahon's Pagsabog).
- Your Building card shows a countdown pip for each turn it has left.
- You can play a new Building over your own in the same lane, and the old one
  is removed. An enemy Building can't be replaced.
- Why: Buildings no longer depend on a lane being empty to be removed, and a
  strong aura like Torogan has a built-in end.

### 3.8 Patron Gods
Patron Gods replace the Inheritor Power. The full list is in
Cards.md §7.
- Choose **1** patron God per deck. They are the rarest collectibles (Divine ✦).
- **Passive:** always on.
- **Charges:** +1 at the start of each of your turns, +1 from your first Alay
  each turn. Max 3.
- **Active:** costs **3 Charges** and 0 SP. Once per turn.
- 3 starter Gods (Adlaw, Aman Sinaya, Bulan); the rest come from the Tawag
  banner, are crafted with Abo, or (optionally) come from a story milestone.
  Gods are never sold directly.
- Path cosmetics (Separation/Control) change only VFX and voice lines.

### 3.8a Domain clash (affinity triangle)
There is one shared Domain slot. Each Domain has an affinity:
**Nature** beats **Human**, Human beats **Spirit**, and Spirit beats Nature.
Cards show the English names. The Filipino words *Kalikasan* (Nature), *Bayan*
(Human) and *Kaluluwa* (Spirit) appear only as flavor, such as the affinity
icon tooltip and card lore text.
- You can always replace your own active Domain.
- Against an active enemy Domain: if yours **beats** it, yours replaces it.
  With the **same** affinity, it replaces it for +1 SP. If yours **loses**,
  you can't play it until theirs ends, but you can still offer it with Alay.
- A replaced or expired Domain's effects end immediately.
- Turns alternate, so two Domains are never played at the same moment.

### 3.9 Turn structure
```
START PHASE
  1. Gain income SP (not on your first turn), apply cap
  2. +1 God Charge (every turn, including your first)
  3. Draw 1 card (every turn, including your first; hand max 10;
     overdraw is discarded)
  4. Start-of-turn triggers (yours, then the opponent's effects that trigger
     "at the start of the opponent's turn")
MAIN PHASE (any order, any number of times)
  • Play cards (pay SP)
  • Alay (max 2)
  • Use patron God Active (once)
  • End Turn
STRIKE PHASE (automatic, lanes 1 → 3, ~0.45 s each)
  For each lane, your creature strikes (from round 2; a creature strikes the turn it is
  summoned too: there is no summoning sickness):
    – enemy Bantayog in lane  → Bantayog takes ATK (it intercepts all strikes,
                                Flight included; nobody retaliates)
    – else enemy creature     → it takes ATK; it hits back only if it has Guard
    – else enemy Building     → Building takes ATK (Flight skips this step)
    – else                    → enemy Inheritor takes ATK
END PHASE
  1. End-of-turn triggers
  2. "This turn" effects end; your timed effects count down, and any that
     reach 0 are removed (§3.13 R1)
  3. Excess SP above the cap is lost; pass the turn
```

**Change from current build:** combat moves from "end of the opponent's turn,
both sides clash" to "end of *your* turn, *your* creatures strike." Each
player's turn now ends with their own payoff, and only Guard creatures
hit back (R4), so a Guard in a lane is how you defend it.

**Boundary Collapse (turn limit):** from round 7 **[tune]**, at the start
of each round (before the first player's turn), **both Inheritors take
damage at the same time**, equal to 4 × (round − 6). If both reach 0, the
match is a draw. Hitting both at once means the first player is no longer
always hit first. With the
turn timer, this keeps matches bounded (30 s × 2 players × 7 rounds = 7 min
before the Collapse begins).

**First-player fairness:** with no strikes in round 1, free strikes and no
summoning sickness, the first player's first strike (round 2) lands before the
second player can answer it, which won 62–70% of simulated matches at equal
SP. The compensation is a small SP edge and **one extra opening card for the
second player** (3 SP and 5 cards against 4 SP and 6 cards; design change
2026-11-19). Simulation: first player wins about 49–51% of matches. If either
side wins more than 52%, the levers are the extra card and the SP gap **[tune]**.

**Round 1 (no strikes):** during round 1 (both players' first turns) **no
creature strikes**. A turn in round 1 is for placing creatures, Alay, using
the God Active or skipping. Even when both players summon creatures in round 1,
no attack happens. From round 2 the strike phase runs normally every turn, and
a creature strikes the turn it is summoned, too **[tune: StrikelessRounds]**.

**No responses during a turn:** only the active player acts. There are no
counter-spells or interrupts, which keeps turns fast and mobile-friendly.

**Turn timer (PvP):** 30 s per turn + 20 s one-time reserve per match **[tune]**.
The reserve is one pool per player for the whole match; whatever a turn uses of
it is gone for later turns. A turn times out the instant its 30 s and the
remaining reserve are both used up. The reserve starts draining when a turn's
30 s run out. On timeout the turn
ends (strike still resolves). Three consecutive timeouts = loss. The timer
stops once End Turn is pressed, so the strike phase is never cut short.
**Vs AI (changed 2026-11-20):** your turn has the same clock (30 s + reserve,
timeout, three in a row = loss). It drains only while nothing is animating. The
AI's turn has no clock. The tutorial and story battles have **no turn timer**;
Boundary Collapse still bounds the match.

### 3.9a The opponent's turn (what the waiting player sees)
While waiting, you watch the opponent's turn live. The server broadcasts the
board after every action.

| Visible to you | Hidden from you |
|---|---|
| Each card they play, shown face-up center-screen for ~1 s before it resolves | The cards in their hand |
| Each Alay: the offered card is revealed, along with its SP gain and Alay effect | Cards they drag, hover over or consider but don't play |
| God Active use, Domain changes, and the strike animations | Their deck order |
| Their hand size, deck count, SP, Charges and discard pile | — |
| Their turn timer | — |

**What you can do while waiting:**
- Inspect any card (your hand, the board, either discard pile).
- Plan your next move.
- Send an emote: one every 3 s, at most 20 per match, from a fixed list of 8;
  muted emotes are not shown.
- You can't play, offer, or use your God.

Not showing their hesitation is deliberate: it stops players from reading
each other's indecision and keeps the waiting player's screen calm. The
host sends each player a redacted state plus an event stream after every
action, and the events drive the reveal animation (§8.1).

### 3.10 Deck rules
| Rule | Value |
|---|---|
| Deck size | 20 cards **[tune]** |
| Copies per card | Max 2 (Legendary: max 1) |
| Opening hand | 5 cards, **6 for the second player** **[tune: SecondPlayerExtraCards]**; one free mulligan (replace any number once) |
| Hand max | 10 |
| Draw per turn | 1 |
| Empty deck | **Hollow draw:** each draw from an empty deck deals 3, then 6, then 9… damage to your Inheritor |
| Discard pile | Visible; some abilities interact with it |

### 3.11 Keywords
Kept small. Keywords appear on any rarity; unique abilities are Rare+.

| Keyword | Rule |
|---|---|
| **Swift** | Not hit back by a Guard when it strikes (a Guard would normally retaliate, §3.13 R4). Every creature strikes the turn it is summoned, so Swift no longer means that. Adlaw's Passive still gives Swift creatures +3 ATK on the turn they arrive |
| **Shield N** | A pool that absorbs the next N damage across any number of hits, then is removed. Creatures only. Doesn't stack: a new Shield replaces the current pool only if it's higher. |
| **Drain** | Damage it deals heals your Inheritor by the same amount, up to max HP (no overheal). Works on strikes **and** a Guard's retaliation (§3.13 R4). Only damage dealt to creatures and Inheritors heals; damage to Buildings does not. |
| **Pierce** | When it strikes, excess damage over a **creature's** remaining HP carries on: into the enemy Building in that lane if there is one, otherwise into the Inheritor. It never carries past a Building. Strikes only, not retaliation. |
| **Flight** | If its lane has no enemy creature, it skips the enemy Building and hits the Inheritor. It can't skip Bantayog, and it still fights an enemy creature normally. Cap: at most 4 Flight cards in the set. |
| **Elusive** | Can't be chosen as a target by any enemy effect: Rituals, God Actives and Passives, Alay effects and creature abilities. Untargeted effects (Domains, "all enemy creatures", strikes) still affect it. |
| **Guard** | Adjacent friendly creatures (not the Guard creature itself) take 3 less damage. A Guard also **hits back** when an enemy creature strikes it (§3.13 R4); creatures without Guard do not. |

**Damage-reduction cap:** "take N less damage" effects (Guard, Intramuros)
don't stack beyond **−3 per hit**. Shield is separate: it absorbs damage
after the reduction.

### 3.12 Ability triggers (for the ability system)
`OnSummon`, `OnStrike`, `OnDamaged`, `OnDeath`, `OnAlay`, `OnTurnStart`,
`OnTurnEnd`, `Passive` (continuous while on board).
`OnDamaged` and `OnTurnEnd` are reserved for future cards. Set v1 uses OnPlay,
OnSummon, OnStrike, OnDeath, OnTurnStart, OnOpponentTurnStart, OnFirstAlay and
Passive (Core: Aura). A card's Alay effects are listed apart from its triggers.
Targeting: `Self`, `LaneEnemy`, `AdjacentFriendly`, `AnyFriendly`,
`AnyEnemy`, `AllEnemies`, `Inheritor`, `EnemyInheritor`.

### 3.13 Rules clarifications
These close the edge cases found while planning the implementation. They are
rules, not suggestions: the rules core and its tests follow them exactly.

**R1 — Durations**
- "For N turns" means N of the **caster's** turns, counting the turn it's
  played. The countdown drops by 1 at the end of each of the caster's turns,
  and the effect is removed when it reaches 0. So it stays active through
  the opponent's turns in between. This applies to Rituals, Domains,
  Buildings and God effects, and to effects placed on enemy creatures
  (Barang cast on your turn lasts through the enemy's next turn).
- "This turn" ends at the end of the current turn, whoever's it is.
- "On its owner's next turn" / "on its next turn" (Nightmare, Lambat) means
  the next turn of the affected creature's owner.

**R2 — Resolution order and outcome checks**
- Each action (a play, an Alay, a God Active) resolves completely, including
  every trigger it causes, before the next action.
- When one event causes several triggers, the active player's resolve first,
  then the opponent's; within a side, board lanes 1 → 3, then Domain, then God.
- The match outcome is checked after every action, after each lane in the
  strike phase, after each hollow draw and after each Collapse tick. If both
  Inheritors are at 0 at that check, the match is a draw.

**R3 — Damage**
- ATK = base ATK + all modifiers, never below 0.
- Damage to a creature resolves in this order: (1) reductions ("take N less
  damage": Guard, Intramuros), −3 per hit at most, never below 0; (2) Shield
  absorbs what it can; (3) the rest is HP loss.
- "Damage dealt" (for Drain) is the amount after reductions, including what
  Shield absorbed and any overkill.
- Pierce excess = damage after reductions − (Shield + remaining HP).
- Strike damage means all combat damage in the strike phase, retaliation
  included (Intramuros applies to both).
- Inheritors have no damage reduction and no Shield.

**R4 — Retaliation (design change, user decision 2026-11-19)**
- When a striking creature hits an enemy creature, the defender hits back
  with its ATK at the same moment **only if the defender has Guard**. A
  creature without Guard takes the strike and deals nothing back.
- Retaliation is **not a strike**: OnStrike abilities (Siren Song, Nightmare)
  and Pierce don't fire. **Drain does** (it's damage dealt).
- "Can't strike" effects (Nightmare, Lambat) do not stop
  a Guard from retaliating. A 0-ATK Guard retaliates for 0.
- Bantayog intercepts before any of this: no creature in that lane takes or
  deals damage (§3.9).
- Amanikable's Passive is separate: it hits the striker whether or not the
  defender has Guard.

**R5 — Deaths**
- Damage within a lane lands simultaneously; deaths are checked afterwards.
- When several creatures die together, OnDeath triggers resolve with the
  active player's first, then the opponent's, in lane order.
- "The creature that killed it" (Nuno sa Punso) is the creature whose damage
  was lethal. If a Ritual, God or Domain killed it, or the killer also died,
  the Curse fizzles.
- A creature dies when its HP reaches 0, from damage or from max-HP loss.
  Being offered with Alay, being replaced or being swapped is **not** dying,
  so OnDeath doesn't trigger.

**R6 — Discard pile and tokens**
- Every card that leaves your hand or the board goes to its owner's discard
  pile: played Rituals, offered cards, dead creatures, removed Buildings,
  ended Domains and overdrawn cards.
- Tokens (Malakas, Maganda) are not cards. They never go to a
  hand or discard pile; they vanish when they leave the board.

**R7 — Targeting**
- "An enemy/friendly creature" means the acting player chooses the target as
  the effect resolves. This includes Passives (Sidapa) and Alay effects (the
  target is picked as part of the Alay drop).
- A **Ritual or God Active** that needs a target can't be used without a valid
  one. An **OnSummon, Alay or Passive** effect with no valid target simply
  fizzles; the card is still played or offered.
- Elusive (§3.11) removes enemy creatures from every targeting choice the
  opponent makes.

**R8 — Stacking**
- Effects from different cards stack (Pangayaw + Torogan + Moonlit Forest).
- Exceptions: Shield (higher pool wins), Alay bonus SP (one per Alay, highest
  wins, §3.5), damage reduction (−3 cap), and **auras from copies of the same
  card don't stack**: two Torogans give +3 ATK, not +6, and a creature between
  two Kataw gets +3.

**R9 — Costs**
- Cost reductions stack and apply when the card is played; a cost never goes
  below 0. The +1 SP for a same-affinity Domain is added after reductions.
- Agueo's Active applies to the next card you play this turn and ends at the
  end of the turn if unused. Bulong's discount applies only to the card it drew,
  this turn only.

**R10 — Healing and max HP**
- Healing never goes above max HP, for creatures or Inheritors.
- A max-HP change from an aura (Biringan +3, Sementeryo −3) moves **current HP
  by the same amount** when it starts to apply: when the Domain is played, and
  when a creature enters or returns (Undying) while it's active. At 0 HP the
  creature dies, so Sementeryo kills any enemy at 3 HP or less, including a
  revived Amalanhig (Cards.md §5.2).
- When the aura ends, max HP returns to normal but current HP doesn't move back.
  After a gain ends, current HP is capped at the new max (this can't kill).
- Akasi's Passive adds +3 to every separate restore (each Drain hit, each
  Enchanted Balete tick, each Hilom).
- Sagradong Ilog suspends enemy ATK reductions on your creatures while it's
  active; they resume afterwards with their remaining duration. Their
  countdown keeps running while suspended.

**R11 — Card rulings**
| Card | Ruling |
|---|---|
| Tikbalang (Mislead), Anitun Tabu (Active) | Choose two lanes on one side, at least one holding a creature, and swap their creatures; a creature can move into an empty lane. Buildings don't move. Swapped creatures keep HP, modifiers, Shield and summoning status. Tikbalang fizzles if the enemy has no creatures. |
| Amalanhig (Undying) | Once per time it enters the board. It returns to the same lane with 3 HP, base ATK and no modifiers or Shield. Returning isn't a summon (no OnSummon, no Bathala), and it may strike on its owner's next turn as normal. |
| Garuda (Splitting the Bamboo) | Places up to two tokens in your empty creature slots, lanes 1 → 3; with no empty slot, the rest fizzle. |
| Sementeryo | Creatures that die from its max-HP loss really die (OnDeath and Undying trigger). |
| Berberoka (Drink the River) | Destroys whichever Domain is active, including your own. |
| Bathala (Passive) | Counts only creatures played from hand, not tokens or returning creatures. |
| Sidapa (Passive) | Triggers on every creature offered from the board, tokens included. |
| Amanikable (Passive) | A separate 3-damage trigger after the strike's damage, if the striker survived. Guard reduces it; Intramuros doesn't (it isn't strike damage). |
| Batibat (Nightmare), Sirena (Siren Song) | Affect only an enemy creature it strikes, never a Building, Bantayog or Inheritor. |
| Kapre (Smoke) | Continuously affects whichever enemy creature is in its lane. |
| Lalahon (Pagsabog) | You choose an enemy **lane**, not a creature, so Elusive doesn't stop it. It hits the creature and the Building in that lane; it needs at least one of them. |
| Amanikable (Pangangaso) | Deals 3 damage to the chosen enemy creature; there is no draw. |
| Bulan (Passive) | Checked in start-of-turn step 4, after that turn's normal draw, so it fires only on an empty deck. |
| Sidapa (Passive) | Its target is picked as part of the Alay drop, separately from the offered card's own Alay effect target. |

**R12 — Deck, hand and mulligan**
- Order before turn 1: Kara y Krus → the first player gets 5 cards and the second player 6 → both mulligan
  at the same time (15 s **[tune]**) → the first player's turn 1.
- Mulligan: the chosen cards are shuffled back into the deck, then the same
  number is drawn (you can redraw a card you returned).
- **Swap and Confirm are separate.** A player may swap **once**, and that swap is
  **one card** (**1 [tune]**, `RulesConfig.MulliganMaxCards`; user decision 2026-11-23: "you can
  swap once" must mean one card); the replacement is drawn immediately. Swapping does **not**
  end the player's mulligan: it ends only when they press **Confirm** or their
  15 s run out (a timeout keeps the hand). A player who already swapped can
  still press Confirm but cannot swap again. Turn 1 starts as soon as both
  players' mulligans have ended. The 15 s start when the starting-hand panel is
  shown, after the coin result.
- Hollow draw damage is counted per player and never resets.

**R13 — Rounds, concede and disconnects**
- A round is the first player's turn plus the second player's turn. Boundary
  Collapse hits at the start of round 7 and later, before the first player's
  start phase.
- A player may concede at any time, including during the opponent's turn.
- While a player is disconnected, their turn timer keeps running (timeouts
  count). If they don't return within 60 s **[tune]**, they lose.
- The disconnected player's game rejoins by itself (same lobby code, same
  seat, proven by the secret rejoin token) for as long as the window is open,
  including after the app was in the background. A rejoin resumes the running
  match from a full redacted state; it never restarts the match. If the rejoin
  arrives before the host noticed the old connection drop, the proven rejoin
  replaces the old connection. Once the match is over there is nothing to rejoin.

---

## 4. Card Content

**The full card list is in Cards.md**: 44 deck cards and
11 patron Gods, with starter decks and how each card is obtained. This
section holds only the rules for that content.

### 4.1 Rarity
**Fixed stats per card:** a card has exactly one rarity and one stat line.
Rarity sets pull odds, not power.

| Rarity | Symbol | Design role | Applies to |
|---|---|---|---|
| Common | ★3 | Vanilla stats + ≤1 keyword (an Alay effect is allowed) | Deck cards |
| Rare | ★4 | Keyword(s) and/or simple ability | Deck cards |
| Legendary | ★5 | Unique folklore ability, build-around | Deck cards |
| **Divine** | ✦ | Patron Gods only, the rarest tier | Gods |

Rarity scales **complexity and identity, not stat efficiency**. A Common at
cost N should be stat-competitive with a Legendary at cost N.

### 4.2 Stat scale
**Inheritor 100 HP.** Every combat number (ATK, HP, damage, healing, Shield,
ATK changes) is a multiple of 3; SP, costs, Charges and draw stay small.
Budget guide **[tune]**: ATK + HP ≈ 6 × cost + 6; a keyword ≈ 3 points; abilities ≈ 3–6 points.

### 4.3 Launch set
- **Set v1 (Cards.md):** 24 Creatures, 8 Rituals, 9 Domains, 3 Buildings
  (44 deck cards) and 11 patron Gods.
- Expansion candidates: Sigbin, Amomongo, Busaw, Mambabarang, Engkanto,
  Mangkukulam, Bal-Bal, and Hukluban (as a creature, Cards.md §7).
- Every card gets folklore research notes (origin region, myth summary) in the
  card data so abilities stay faithful (Pillar 1).
- Factions are a collection/art grouping only.

### 4.4 Tokens
Tokens are creatures created by card effects. They aren't collectible, have
no rarity or cost, never enter a hand or discard pile (§3.13 R6), and give
0 SP when offered (§3.5).

| Token | Created by | ATK/HP | Notes |
|---|---|---|---|
| Malakas | Garuda (Splitting the Bamboo) | 3/3 | — |
| Maganda | Garuda (Splitting the Bamboo) | 3/3 | — |

### 4.5 Card data model (ScriptableObject, extends current definitions)
The fields below describe a card. In the implementation, the rules fields
(type, cost, stats, keywords, abilities, Alay effect) live in the rules core's
card catalog, and the ScriptableObject keeps the presentation fields, linked by
ID (ImplementationPlan M1.9).
```
CardDefinition (base)
  id (stable string, e.g. "MM-CORE-001")   ← required for net/gacha/save
  displayName, flavorText, folkloreNotes, artwork, prefab
  type: Creature | Ritual | Domain | Building
  rarity: Common | Rare | Legendary
  faction (cosmetic), set
  cost
  abilities: List<AbilityDefinition>        ← trigger + target + effect + magnitude
  alayEffect: AbilityDefinition (nullable)
  canOfferFromBoard: bool
CreatureDefinition : CardDefinition  → attack, health, keywords (flags),
                                       isToken (tokens: no cost, rarity or set)
BuildingDefinition : CardDefinition → health, duration, effect
RitualDefinition : CardDefinition → duration
DomainDefinition : CardDefinition → affinity (Nature|Human|Spirit), duration, effects
PatronGodDefinition → id, rarity = Divine, passive, active (chargeCost = 3),
                      craftCost, vfxBySeparation/Control
```

---

## 5. Game Modes

### 5.1 Vs AI
- Skirmish against the AI with preset or player decks.
- Difficulty: **Baguhan** (Easy), **Mandirigma** (Normal), **Bagani** (Hard).
- AI must evaluate Alay (offer when it enables a stronger play or saves a
  dying creature's value). Hard AI uses a 1-ply lookahead on the strike phase.
- Rewards: reduced vs. PvP; daily caps to prevent farming.

### 5.2 PvP Casual
- **Quick Match:** matchmaking on hidden MMR, no rank shown.
- **Lobby:** create/join a private match with a 6-character code (current
  Relay flow), invite friends, rematch button. Accessible from the main menu
  in one tap.
- No rank change; normal rewards.
- Host-authoritative: the host player's client holds the full match state
  (see §8.1); accepted for casual play, a dedicated server is future work.
- **New-player protection:** for an account's first 10 casual matches, Quick
  Match pairs it only with other new accounts, or with an AI opponent labeled
  as "Practice" if no match is found within 20 s **[tune]**. Lobby matches
  with friends are unaffected.

### 5.3 PvP Ranked
- Season length: 6 weeks **[tune]**.
- Tiers: **Baguhan → Mandirigma → Bagani → Datu → Maalamat**, each with
  3 divisions except Maalamat (leaderboard by rating).
- Rating: Glicko-2 hidden MMR; visible tier progresses with stars.
- No demotion out of a tier floor in the first two tiers.
- End-of-season rewards: card back, frame, Mutya.
- Requires: account auth, server-validated match results (see §8.3).
- **Unlocks at account level 5 [tune]**, so players reach ranked with at
  least one tuned deck and know the rules.
- **Testing without players:** Unity Multiplayer Play Mode (local multi-client),
  queue bots flagged `isBot`, seeded fake MMR pools, and a dev panel to
  force pairings and simulate rating updates.

### 5.4 Story Campaign
- Structure: alternating chapters following each Inheritor's path.
  Chapter 1 per Path at launch (5–6 battles each).
- Battles are scripted AI matches with **special rules** (e.g., pre-placed
  Buildings, a creature that starts on the board, a lane sealed for 3 turns).
- Story told through 2D illustrated panels + dialogue (reuse the tutorial
  slideshow system).
- Rewards: starter cards, Mutya, cosmetics; completion unlocks a Path-themed
  Inheritor skin.
- **Writing rule:** respect §2.2 — hints only, no resolutions.

### 5.5 Tutorial
- Rework the existing slideshow into an **interactive first match** (scripted
  AI).
- **One match covers every mechanic** (revised 2026-11-23, user decision, so
  judges understand the whole game from one tutorial): Kara y Krus →
  mulligan → SP → summon and lanes → turn timer → strike and the win
  condition → Swift and Guard → Ritual → God Charges and Active → Building →
  Alay → Domain and the affinity triangle → Boundary Collapse → card details
  and the other keywords. Script: Docs/TutorialScript.md.
- **Short info cards** explain a concept just before the step that uses it;
  each step's instruction stays one short line.
- The tutorial's Boundary Collapse starts at **round 5** (instead of 7) so it
  is seen live; everything else uses the normal rules.

---

## 6. Progression

> **Competition build:** this whole section (accounts, XP, levels) is
> **post-competition** scope (M4). The competition build uses a local profile
> only (§11.1).

### 6.1 Account creation ("play first, sign in later")
1. **First launch:** a guest account is created silently. The player enters
   a display name and birth date, then goes straight into Kara y Krus and the
   tutorial match.
2. **Prompt to link:** after the tutorial or at level 3. Linking is required
   before the first purchase and before ranked.
3. **Sign-in options:**

| Platform | Sign-in |
|---|---|
| Android | Google Play Games |
| iOS | Sign in with Apple, Game Center |
| PC | Steam |
| Any platform | Myth Mayhem account by email (Unity Player Accounts) |

- **Cross-progression:** link two sign-ins and it's the same account on phone
  and PC: same cards, Gods, level and currencies (check each store's policy on
  sharing purchased currency).
- **No passwords stored by us:** the platform handles login. A lost device
  just means signing in again.
- **Guest risk:** an unlinked guest account is lost on uninstall, so the game
  must show a clear warning.
- **Display name:** not unique; a tag is added (`Dalisay#4821`). Names pass a
  profanity filter. The first rename is free, later ones cost Ginto.

### 6.2 Account level and XP
| Source | XP |
|---|---|
| PvP win / draw / loss | 100 / 75 / 50 |
| Vs AI match | Half of PvP; XP from AI is capped at 10 matches a day |
| First win of the day | +200 |
| Daily quest | 100–300 each (3 per day) |
| Story chapter cleared | 500 (first time only) |

- **Anti-farming:** a match conceded before round 3 gives no XP to either
  player.
- **Curve:** level *n* needs 400 + 100 × *n* XP **[tune]**. Launch cap:
  **level 50**. After that, each further level-up gives Ginto and Abo instead
  of a new level.

| Level | Unlocks |
|---|---|
| 1 | Both starter decks and the 3 starter Gods |
| 2 | Deck builder |
| 3 | Ginto shop and daily quests, plus the prompt to link a sign-in |
| 4 | Crafting with Abo |
| 5 | **Ranked** and a free 10-pull |
| 10, 20, 30… | Extra deck slots, from 3 up to 9 |
| Every level | Ginto; some levels also give Abo, Mutya or cosmetics (frames, card backs, titles) |

### 6.3 Profile
- **Look:** an Inheritor portrait with Separation or Control themed skins, a
  title, a card back and a frame.
- **Stats:** level, ranked tier, win rate, favorite God, the last 20 matches,
  and collection completion %.
- **Friends:** add by name tag, and invite into lobby codes.

### 6.4 Safety and compliance
- **Age gate:** the birth date decides spending limits for minors and gacha
  eligibility by region (check before launch).
- **Parental controls:** a monthly spending cap, and an option to hide chat
  and emotes.
- **Account deletion:** an in-app request (Apple and Google require one),
  with a 30-day grace period before server data is wiped.
- **Privacy:** follows the Philippine Data Privacy Act (2012) and GDPR, with
  a data download option.
- **Reports and bans:** post-match reporting, backed by server match logs
  (including the Kara y Krus result).

### 6.5 Tech
- Unity Authentication (already in the project) handles guest accounts, Apple,
  Google, Steam and account linking.
- Level, XP, collection and currencies live on the server (Cloud Save or a
  custom backend). Cloud Code grants XP and rewards, and the client is never
  trusted.

### 6.6 Other progression
- **Daily quests:** 3 per day (e.g., "Perform 5 Alay," "Win with Diwata in deck").
- **Starter collection:** two themed 20-card decks (Night Hunters and Forest
  Guardians) and 3 patron Gods (Adlaw, Aman Sinaya, Bulan), enough to play
  ranked. See Cards.md §8.
- **Collection screen:** filter by type, rarity, cost, faction; card detail
  shows folklore notes.
- **Deck builder:** 20-card validation, mana-curve view, patron God pick,
  up to 9 deck slots.

---

## 7. Economy & Monetization (F2P + IAP, gacha)

### 7.1 Currencies
| Currency | Name | Source | Use |
|---|---|---|---|
| Soft | **Ginto** (gold) | Matches, quests, levels | Standard packs, crafting top-up |
| Premium | **Mutya** (charm-pearl) | IAP, seasons, story, events | Banner pulls, cosmetics, pass |
| Crafting | **Abo** (ash) | Duplicate cards beyond the deck max | Craft any card or God |

### 7.2 Gacha — "Tawag" (The Calling)
The full rates and pity tables are in Cards.md §9.
- **A banner, not packs:** each pull gives one item (a card or a God). Ginto
  card packs (§7.2a) are a separate, cheaper way to get cards.
- **Featured banner:** rotates about every 3 weeks and headlines one God at
  boosted odds. **Standard banner:** permanent, with all cards and released Gods.
- **Base rates [tune]:** God ✦ 0.6%, ★5 3.4%, ★4 16%, ★3 80%.
- **Pity [tune]:**
  - Every 10 pulls guarantees ★4 or better.
  - Every 30 pulls guarantees ★5 or better.
  - God soft pity starts at pull 70, and pull 90 is a guaranteed God.
  - If the God you get isn't the featured one, the next God is guaranteed featured.
- Pity counters carry over between banners of the same type.
- **Cosmetic variants:** a 5% chance per card pull for alternate or animated
  art. Stats are identical.
- **Duplicate protection:** copies beyond a card's deck max convert to Abo.

### 7.2a Card packs (Ginto) **[tune]**
Prices and slot odds are in Cards.md §9.3.
- Bought with **Ginto** only, never Mutya or money.
- **5 cards per pack**, at least one Rare or better, **never a God** (Gods stay
  banner, craft or story only) and never a token.
- Each pack is named after a Domain and favours a group of cards:
  **Intramuros** (Human cards), **Baybayin** (Rituals) and **Sulad** (Spirit cards).
- No pity; duplicates convert to Abo as in §7.2.

### 7.2b Demo build note
In the competition build the collection, Tawag, card packs, crafting and the
deck builder are shown as a **local demo simulation** (MetaDemoPlan.md):
balances, pulls and decks are saved on the device, the odds and pity are the
real ones above, but no purchase is possible and **nothing reaches a match**
(matches still use the preset decks of Cards.md §8).

### 7.3 Other ways to get cards
- Craft with Abo: every card and every God (Gods at a high cost).
- Ginto shop: a daily rotation of Commons and Rares, plus a weekly Legendary slot.
- Story and quest rewards: specific cards.
- Direct buy with Mutya: any card. **Gods can't be bought directly**, which
  keeps them the rarest tier.

### 7.3a Ranked fairness
- Fixed stats: a pulled card is never stronger than a crafted one.
- Every card and God can be crafted, so nothing is permanently paywalled.
- Rarity does not mean higher stat efficiency (§4.1).

### 7.4 Other monetization
- **Season pass "Landas"** (Path): free + premium tracks, cosmetics and currency.
- **Cosmetics:** Inheritor skins (Separation/Control themes), card frames,
  animated card art, board skins, emotes.
- **Starter bundle:** one-time, low price.

### 7.5 Compliance requirements (not legal advice — verify before launch)
- Publish pull odds in-game (Apple App Store and Google Play require it).
- Keep and show pity counters and pull history.
- Regional restrictions: paid loot boxes are restricted in Belgium (and may need
  changes in other regions); check region-by-region before release.
- Age rating, minor spending limits, and parental-control support per store
  and region.
- All purchases and pulls resolved server-side.

---

## 8. Technical Design

### 8.1 Architecture direction
- **Extract a pure C# rules core** (no MonoBehaviours): `GameState`,
  `TurnRules`, `AlayRules`, `CombatResolver`, `AbilitySystem`. It must be
  deterministic and unit-testable, and shared by local play, AI and the
  networked server.
- Unity layer (MonoBehaviours) only renders state and sends player intents.
- Keeps the intent pattern (`IMatchIntentSink`, `MatchSession` ServerRpcs),
  but intents become rules-core actions: `PlayCard`, `OfferFromHand`,
  `OfferFromBoard`, `UseGodActive`, `Mulligan`, `CallCoin`, `EndTurn`,
  `Concede`, `Timeout`.
- The replicated state covers Buildings, the Domain slot (owner, card, turns
  left), keywords/status, Charges, Alay count, discard piles and the turn
  timer. Each player receives a redacted view (their own hand; the opponent's
  hand as a count), plus an event stream with a "last action" for the reveal
  animation (§3.9a).
- Cards are identified by stable ID everywhere (network, saves, gacha), never
  by display name.
- **PvP trust:** PvP is host-authoritative; the host player's client holds the
  full state. This is accepted for casual PvP in the competition build and
  disclosed to players; a dedicated server is future work.

### 8.2 Mapping current code to the rework
Summary only; the file-by-file plan is in
ImplementationPlan.md §B7.

| Current | Rework action |
|---|---|
| `TurnManager`, `CombatController`, `SummonController`, `OpponentController`, `CardPlayController` | Replaced by the rules core (`TurnRules`, `AlayRules`, `CombatResolver`, `AbilitySystem`, …) plus a view layer that only animates events. One play path for player, AI and network. |
| `DeckController`, `MatchRules` | Folded into the rules core (`DeckRules`: mulligan, hollow draw; `OutcomeRules`: collapse, concede, timeout) |
| `CreatureDefinition` etc. | Migrate to the §4.5 data model with stable IDs |
| `MatchSession` / `RelayLobbyConnector` | Lobby connector kept; `MatchSession` rewritten to carry rules-core actions; matchmaking added later |
| `TutorialSceneController` | Reuse for story panels; new interactive tutorial |
| — (new) | Patron God system, Domain slot, keyword/ability system, AI agents, simulation harness; later Collection/Gacha/Economy services |

### 8.3 Online services
| Need | Proposed service |
|---|---|
| Auth | Unity Authentication (existing) + platform sign-in |
| Casual lobby | Unity Lobby + Relay (Relay existing) |
| Matchmaking | Unity Matchmaker |
| Ranked integrity | Authoritative server (Unity Multiplay Hosting or equivalent). **Player-hosted matches are not acceptable for ranked** — the host could cheat. |
| Collection, currencies, gacha | Server-side (Unity Cloud Save + Cloud Code, or a custom backend). Never resolve pulls on the client. |
| IAP | Unity IAP with server receipt validation |
| Analytics | Unity Analytics (match length, Alay usage, card win rates, funnel) |

### 8.4 Platform & UX
- **Landscape only**, on both mobile and PC. There's no portrait mode: the
  3-lane board needs the width. The UI scales from ~5.5" phones to 27" monitors.
- Input: tap/drag on mobile, click/drag + hover tooltips on PC; full keyboard
  shortcut for End Turn.
- Alay UX: drag a card or creature onto an **Alay altar** zone; show the SP gain
  and Alay effect preview before release. Alay is final once dropped (no undo),
  so the preview must be clear.
- Readability: large cost/ATK/HP numerals; keyword icons with long-press/hover text.

### 8.5 Testing
- EditMode tests on the rules core (replacing `MatchRulesTests` and
  `DeckControllerTests`): every keyword, every Alay rule, strike order,
  collapse, hollow draw, and every clarification in §3.13.
- Simulation harness: AI vs AI ×10,000 matches to report average match length,
  first-player win rate (target 48–52%), card win rates.
- Netcode: Multiplayer Play Mode for 2-client sessions; desync check by
  comparing snapshot hashes.

---

## 9. Art, Audio & Feel (rework scope)

Assets will be replaced later; this section sets direction only.
- **Style:** stylized, readable silhouettes rooted in Filipino art traditions
  (baybayin motifs, textile patterns, sacred-grove palettes).
- **Presentation (revised 2026-11-16):** the battle keeps the v0.2.0 **3D
  arena** (terrain, lanes, lighting, cinematic camera) with a **2D HUD** on top
  (see S06 in Docs/UIGuide.md). Creatures and Buildings appear as 3D models in
  their lane; a card without a model yet uses a placeholder figure. Every
  creature and Building carries a floating plate with name, ATK/HP and status
  (Building: HP and countdown pips). The shared Domain and the Alay altar are
  HUD panels, not arena objects.
- **Animation per creature:** the 3D model's summon, attack, hit and death
  animations, with the cinematic strike camera; Alay has its own
  dissolve-into-offering VFX — this moment must feel ritual and weighty.
- **Board:** the Boundary is visually split — human-world side vs.
  supernatural side — with lane markers.
- **VFX language (added 2026-11-20; full list in VFXPlan.md):**
  cinematic for God Actives, Legendary summons and the Boundary Collapse;
  quick and snappy for everything else, so turns stay fast. A creature is
  summoned through a **baybayin ritual ring** in its owner's colour (never a
  Western pentagram). Cards in hand carry a subtle **aura in their type colour**
  (rarity sets its strength). Rituals show their effect where it lands; every
  God Active has its own cut-in and effect; the Collapse makes the arena
  **breathe red**, faster each round. Effects are presentation only: they
  never change a rule, a number or the order of events, and both players see
  the same effects. A Settings option **Effects: Reduced** removes camera
  shake and shortens cut-ins.
- **Audio:** kulintang/gong-based motifs, per-creature summon cries, a distinct
  Alay sound.

---

## 10. Balance Targets

| Metric | Target |
|---|---|
| Average match length | 6–10 min (≈ 8–10 rounds) |
| First-player win rate | 48–52% |
| Alay used per match (per player) | 2–5 average; 0-Alay decks viable but weaker |
| Any single card's play rate in ranked | < 40% |
| Any card's win-rate delta vs. average | within ±5% |
| God Active usage | 3–4 times per match (Charge gain ≤ 2 per turn → about every 2 turns with Alay, every 3 without) |
| Starter Gods vs pulled Gods | Win rates within ±3% (Cards.md §7) |
| Tutorial completion | ≥ 80% of new players |
| Online stability | No desyncs across 100 consecutive matches |

---

## 11. Roadmap

| Phase | Scope | Exit criteria |
|---|---|---|
| **M1 — Rules core** | Pure C# rules, Alay, new strike, keywords, abilities; tests | All rules unit-tested; AI-vs-AI sim runs |
| **M2 — Playable vertical slice** | Both starter decks, the showcase deck, 3 starter Gods, Vs AI, new HUD/Alay UX, Kara y Krus, opponent-turn view, tutorial | 10-minute playable match on PC and Android; a new player finishes the tutorial without help |
| **M3 — Online casual** | Netcode on rules core, lobby + quick match, reconnects | 100 consecutive two-device matches without a desync |
| **M4 — Collection, economy & accounts** | Accounts (§6), deck builder, collection, currencies, gacha, crafting, IAP (sandbox) | Server-validated pulls; odds screen; a purchase on one device shows on the other |
| **M5 — Ranked & story** | Authoritative server, ranked seasons, new-player protection, story chapter 1 ×2 Paths | Bots-in-queue ranked test passes; both story chapters playable end to end |
| **M6 — Content & polish** | Full Set v1 (44 cards + 11 Gods), new assets/animations, audio | Balance targets met in sim + playtests |

Accounts, XP and levels (§6.1–6.5) belong to **M4**.

### 11.1 Competition build (presentation scope)
The competition build only needs to show the game's core identity. Judges
look at gameplay, theme and polish, not account systems.

| In | Out (post-competition) |
|---|---|
| M1 rules core, plus the M2 vertical slice (Vs AI, Alay, the new HUD, the tutorial) | Accounts, sign-in, XP and levels (§6) |
| Kara y Krus coin toss and the opponent-turn view | Gacha, currencies, IAP, crafting (§7) |
| Both starter decks, the 3 starter Gods, and the **showcase deck** with three Legendaries (Cards.md §8) | Ranked, matchmaking, new-player protection |
| PvP through the **existing lobby code** (Relay) | Story campaign (a short intro cinematic is enough) |
| A **local profile**: display name and settings saved on the device | Server-side saves and the authoritative server |

A local profile means a name and settings saved on the device: no login and no
server. It's enough for the lobby to show player names.

The collection, deck builder, currencies, Tawag and card packs are **shown as a
local demo** (§7.2b): they demonstrate the planned M4 features without
accounts, purchases or any effect on matches.

---

## 12. Out of Scope (for this rework)
- Path-based gameplay differences.
- Faction loyalty, defection or faction-synergy rules.
- Win conditions other than Inheritor HP.
- 2v2, draft or arena modes.
- Trading cards between players.

## 13. Open Questions
None of these block the competition build.
1. Exact SP numbers (start 3/4, +2, cap 10), to be confirmed by simulation.
2. Hosting provider and budget for the ranked authoritative server (M5).
3. Launch regions, which affect gacha compliance and the server region (M4).

## 14. Glossary
| Term | Meaning |
|---|---|
| Alay | Offering — sacrificing a hand card or board creature for SP (+ effect) |
| Inheritor | The player's hero |
| SP | Summon points |
| Charge | Patron God Active resource (max 3) |
| Strike | End-of-turn automatic attack by your creatures |
| Retaliation | A defending Guard creature's hit back at the creature striking it (not a strike, §3.13 R4). Only Guard retaliates |
| Round | The first player's turn plus the second player's turn |
| Token | A non-card creature created by an effect (§4.4) |
| Boundary | The battlefield; also the line between the two worlds |
| Boundary Collapse | Turn-limit damage from round 7: 4 × (round − 6) |
| Kara y Krus | The pre-match agimat coin toss that decides who goes first |
| Hollow draw | Damage from drawing on an empty deck |
| Tawag | The gacha ("The Calling") |
| Ginto / Mutya / Abo | Soft / premium / crafting currencies |
| Landas | Season pass |
