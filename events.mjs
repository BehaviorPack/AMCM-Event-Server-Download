// Every event on the site lives here. Add a new event to the top of the list,
// then run `node build.mjs` to regenerate the HTML pages and sitemap.
//
// Fields:
//   slug        page name, e.g. "MCC" -> MCC.html (served at /MCC)
//   name        event title
//   by          studio that built the server
//   date        optional, informational ("July 2026")
//   thumb       square icon for the index card
//   favicon     optional tab icon (defaults to thumb)
//   pageTitle   optional heading on the event page (defaults to name)
//   summary     optional paragraph under the studio name (HTML allowed)
//   keyart      banner image on the event page
//   notes       bullet lines under the title (HTML allowed)
//   pack        main resource pack download
//   links       extra buttons: { label, href, kind: "archive" | "wiki" }
//   worlds      download cards: { label, href, images: [src, ...], contain?: true to show the image uncropped }
//   issues      optional known bugs, one line each (HTML allowed)
//   missing     optional list of what the archive still lacks; if left out it is
//               worked out from pack/worlds ("the resource pack", "world captures")

const wiki = (page) => `https://minecraft.wiki/w/${page}`;
const release = (tag, file) =>
  `https://github.com/BehaviorPack/AMCM-Event-Server-Download/releases/download/${tag}/${file}`;

export const site = {
  title: "Event Server Archive",
  url: "https://archive.mceventrecreations.net",
  description:
    "Download Minecraft Bedrock live event servers: resource packs and world captures of Mojang's official event servers, archived so anyone can play them offline.",
  discord: "https://discord.gg/xMrjxHXuUm",
  credit: "Thanks to ThatJadon 26 for the domain.",
  bedrocktool: "https://github.com/bedrock-tool/bedrocktool",
};

export const events = [
  {
    slug: "MMVE",
    name: "Minecraft Movie Voting Event",
    by: "Noxcrew",
    date: "July 2026",
    thumb: "https://minecraft.wiki/images/AMCM_Voting_Icon.png?6de0d",
    keyart: "https://minecraft.wiki/images/AMMS_Voting_Event_Artwork.jpg?5eb9d",
    summary:
      "A movie theater event server where players voted for one of the Minecraft Movie Build Challenge finalists to appear in <em>A Minecraft Movie Squared</em>. Lightning Rod Lighthouse won the vote.",
    notes: [
      "Archived by KingSkribbz (Internet Archive)",
      "Captured July 6, 2026 with BedrockTool",
      "Resource and behavior packs are included in the world",
    ],
    links: [
      { label: "Internet Archive", href: "https://archive.org/details/minecraft-movie-voting-event-world", kind: "archive" },
      { label: "Wiki Page", href: wiki("Minecraft_Movie_Voting_Event"), kind: "wiki" },
    ],
    worlds: (() => {
      const zip = "https://archive.org/download/minecraft-movie-voting-event-world/Minecraft%20Movie%20Voting%20Event.zip";
      return [{ label: "Movie Theater", href: `${zip}/sapphire2.mcworld`, images: ["https://minecraft.wiki/images/thumb/MMVE_Builds.png/640px-MMVE_Builds.png?3b052"] }];
    })(),
    missing: [],
  },
  {
    slug: "CTF",
    name: "Capture the Flag",
    by: "Mojang Studios",
    thumb: "images/packs/CTF.png",
    favicon: "images/favicons/ctf.ico",
    keyart: "https://minecraft.wiki/images/Capture_The_Flag_Banner.png?97e03&format=original",
    notes: ["Archived by BehaviorPack", "Best used in 1.21.132"],
    pack: release("CTF", "Capture.The.Flag.mcpack"),
    links: [{ label: "Wiki Page", href: wiki("Capture_the_Flag_server"), kind: "wiki" }],
    worlds: [
      { label: "Castle", href: release("CTF", "Capture.The.Flag.Castle.mcworld"), images: ["images/ctf/castle.png"] },
      { label: "Arena", href: release("CTF", "Capture.the.flag.Arena.mcworld"), images: ["images/ctf/arena.png"] },
    ],
  },
  {
    slug: "AMCMLE",
    name: "A Minecraft Movie Live Event",
    by: "Spark Universe",
    thumb: "images/packs/AMMLE.png",
    keyart: "https://minecraft.wiki/images/A_Minecraft_Movie_Live_Event_key_art.jpg?a2c26&format=original",
    notes: [
      "Archived by BehaviorPack, KingSkribbz (Internet Archive) &amp; special thanks to Daluta",
      "Best used in 1.21.70.04",
    ],
    pack: "downloads/AMCMLE/A.Minecraft.Movie.Live.Event.Resource.Pack.mcpack",
    links: [
      { label: "Internet Archive", href: "https://archive.org/details/a-minecraft-movie-event-world-captures", kind: "archive" },
      { label: "Wiki Page", href: wiki("A_Minecraft_Movie_Live_Event"), kind: "wiki" },
    ],
    worlds: (() => {
      const shot = (n) =>
        `https://www.minecraft.net/content/dam/minecraftnet/community/events/cy2025/sandstorm/A%20Minecraft%20Movie%20Live%20Event%20Screenshot%20${n}.jpg`;
      return [
        { label: "Midport Village", href: "downloads/AMCMLE/Midport.Village.Fixed.Entities.mcworld", images: [shot(2)] },
        { label: "Wilderness", href: "downloads/AMCMLE/Wilderness.Update.mcworld", images: [shot(7)] },
        { label: "Mines", href: "downloads/AMCMLE/Mines.Update.mcworld", images: [shot(5)] },
        { label: "Outer Walls", href: "downloads/AMCMLE/Outer.Walls.Old.mcworld", images: [shot(6)] },
        { label: "Outer Walls 2", href: "downloads/AMCMLE/Outer.Walls.Update.mcworld", images: ["images/Outer.Walls.2.jpg"] },
        {
          label: "Marketplace Button",
          href: "downloads/AMCMLE/Movie.Button.mcpack",
          images: ["images/Movie_Button.gif", "images/Movie_Button_Hover.gif"],
        },
        { label: "Play Button", href: "downloads/AMCMLE/Movie.Event_0_0_6.mcpack", images: ["images/Movie_Badge.gif"] },
      ];
    })(),
  },
  {
    slug: "EMOP",
    name: "Eerie Mojang Office Party",
    by: "Blockworks",
    thumb: "images/packs/EMOP.png",
    favicon: "images/favicons/emop.ico",
    keyart: "https://minecraft.wiki/images/Eerie_event.png?8da01",
    notes: ["Archived by KingSkribbz (Internet Archive) &amp; special thanks to Daluta", "Best used in 1.21.50.10"],
    pack: "downloads/EMOP/Eerie.Mojang.Office.Party.mcpack",
    links: [
      { label: "Internet Archive", href: "https://archive.org/details/eerie-mojang-office-party-minecraft-event-chinese-worlds", kind: "archive" },
      { label: "Wiki Page", href: wiki("Eerie_Mojang_Office_Party"), kind: "wiki" },
    ],
    worlds: [
      { label: "Lobby", href: "downloads/EMOP/Lobby.Eerie.Mojang.Office.Party.mcworld", images: ["https://minecraft.wiki/images/Lobby_%28Eerie_Mojang_Office_Party%29.png?a5e2b&format=original"] },
      { label: "QA Department", href: "downloads/EMOP/QA.Eerie.Mojang.Office.Party.mcworld", images: ["https://minecraft.wiki/images/QA_Department_%28Eerie_Mojang_Office_Party%29.png?ec622&format=original"] },
      { label: "Mob Factory", href: "downloads/EMOP/MobFactory.Eerie.Mojang.Office.Party.mcworld", images: ["https://minecraft.wiki/images/Mob_Factory_%28Eerie_Mojang_Office_Party%29.png?b96df&format=original"] },
      { label: "Biome Labs", href: "downloads/EMOP/Biome.Labs.Eerie.Mojang.Office.Party.mcworld", images: ["https://minecraft.wiki/images/Biome_Labs_%28Eerie_Mojang_Office_Party%29.png?c4802&format=original"] },
      { label: "Idea Vault", href: "downloads/EMOP/Idea.Vault.Eerie.Mojang.Office.Party.mcworld", images: ["https://minecraft.wiki/images/Idea_Vault_%28Eerie_Mojang_Office_Party%29.png?93c22&format=original"] },
      { label: "Play Button", href: "downloads/EMOP/eerie.mojang.office.party.0.0.8.mcpack", images: ["images/Eerie_Badge.gif"] },
    ],
  },
  {
    slug: "MCC",
    name: "MCC x Minecraft 15th Anniversary Party",
    by: "Noxcrew",
    thumb: "images/packs/MCC.png",
    keyart: "https://minecraft.wiki/images/thumb/Minecraft_%26_MC_Championship_partner_together_for_MCC%21.jpeg/1000px-Minecraft_%26_MC_Championship_partner_together_for_MCC%21.jpeg?52957",
    notes: ["Archived by Potato Man", "Best used in 1.21.3.01"],
    pack: "downloads/MCC/MCC.x.Minecraft.15th.Anniversary.Party.Main.RP.mcpack",
    links: [
      { label: "Internet Archive", href: "https://archive.org/details/mcc-minecraft-event-chinese-worlds", kind: "archive" },
      { label: "Wiki Page", href: wiki("MCC_x_Minecraft_15th_Anniversary_Party"), kind: "wiki" },
    ],
    worlds: [
      { label: "Lobby", href: "downloads/MCC/MCC.Lobby.mcworld", images: ["https://minecraft.wiki/images/MCC_Screenshot_Hub_1.png?fa108"] },
      { label: "Ace Race", href: "downloads/MCC/MCC.Ace.Race.mcworld", images: ["https://minecraft.wiki/images/MCC_Screenshot_Hub_3.png?b4ca3"] },
      { label: "Grid Runners", href: "downloads/MCC/MCC.Grid.Runners.mcworld", images: ["https://minecraft.wiki/images/MCC_Screenshot_Hub_4.png?46d43"] },
      { label: "Sands of Time", href: "downloads/MCC/MCC.Sands.Of.Time.mcworld", images: ["https://minecraft.wiki/images/MCC_Screenshot_Hub_5.png?aaf4f"] },
      { label: "Meltdown", href: "downloads/MCC/MCC.Meltdown.mcworld", images: ["https://minecraft.wiki/images/MCC_Screenshot_Hub_6.png?c92db"] },
      { label: "Play Button", href: "downloads/MCC/MCC.Event_0_0_4.mcpack", images: ["images/MCC_Badge.gif"] },
    ],
  },
  {
    slug: "USE",
    name: "Universal Studios Event",
    by: "Hive Games",
    thumb: "images/packs/USE.png",
    favicon: "images/favicons/use.ico",
    keyart: "https://minecraft.wiki/images/Banner_universal_body.png?47139",
    notes: ["Resource pack only"],
    pack: "downloads/USE/Universal.Studios.Event.mcpack",
    links: [{ label: "Wiki Page", href: wiki("Universal_Studios_Event"), kind: "wiki" }],
    worlds: [],
  },
  {
    slug: "MV23",
    name: "Mob Vote 2023",
    by: "Gamemode One",
    thumb: "images/packs/MV23.png",
    favicon: "images/favicons/mv23.ico",
    keyart: "https://minecraft.wiki/images/2023_Mob_Vote_Server_Thumbnail.jpg?2e4d4",
    notes: ["Resource pack only"],
    pack: "downloads/MV23/Mob.Vote.2023.mcpack",
    links: [{ label: "Wiki Page", href: wiki("2023_Mob_Vote_Event"), kind: "wiki" }],
    worlds: [],
  },
  {
    slug: "TTE",
    name: "Trails & Tales Event",
    by: "Hive Games",
    thumb: "images/packs/T&TE.png",
    favicon: "images/favicons/tte.ico",
    keyart: "https://minecraft.wiki/images/Trails_%26_Tales_Event_banner.jpg?a8137",
    notes: ["Archived by The Hive Bedrock Archive", "Best used in 1.20.1.02"],
    pack: "downloads/TTE/Trails.Tales.Event.mcpack",
    links: [{ label: "Wiki Page", href: wiki("Trails_%26_Tales_Event"), kind: "wiki" }],
    worlds: [{ label: "Lobby", href: "downloads/TTE/Trails.Tales.Event.mcworld", images: [] }],
    issues: ["A single chunk is missing from the world."],
  },
  {
    slug: "MCLLE",
    name: "Minecraft Legends Live Event",
    by: "Gamemode One",
    thumb: "images/packs/MLLE.png",
    favicon: "images/favicons/mclle.ico",
    keyart: "https://minecraft.wiki/images/thumb/Bedrock_Live_Event_Thumbnail_MCL.png/1000px-Bedrock_Live_Event_Thumbnail_MCL.png?c04b9",
    notes: ["Archived by ThatJadon 26, check out the recreation below", "Best used in 1.19.81.01"],
    pack: "downloads/MCLLE/Minecraft.Legends.Live.Event.mcpack",
    links: [
      { label: "MC Event Recreations", href: "https://github.com/MC-Event-Recreations", kind: "archive" },
      { label: "Wiki Page", href: wiki("Minecraft_Legends_Live_Event"), kind: "wiki" },
    ],
    worlds: [{ label: "Lobby", href: "downloads/MCLLE/Minecraft.Legends.Live.Event.mcworld", images: ["https://minecraft.wiki/images/LegendsLiveEvent_Screenshot_9.png?1b77a"] }],
  },
  {
    slug: "MCL22",
    name: "Minecraft Live 2022",
    pageTitle: "Mob Vote 2022 Event",
    by: "Gamemode One",
    thumb: "images/packs/ML22.png",
    favicon: "images/favicons/mcl22.ico",
    keyart: "images/MV22.jpg",
    notes: ["Archived by Potato Man", "Best used in 1.19.31.01"],
    pack: "downloads/MCL22/Minecraft.Live.2022.mcpack",
    links: [{ label: "Wiki Page", href: wiki("2022_Mob_Vote_Event"), kind: "wiki" }],
    worlds: [{ label: "Lobby", href: "downloads/MCL22/Minecraft.Live.2022.Mob.Vote.Map.mcworld", images: ["https://minecraft.wiki/images/Minecraft_Live_2022_mob_vote_in-game-map.png?a38e5"] }],
  },
  {
    slug: "MCN22",
    name: "Minecraft Now 2022",
    pageTitle: "Minecraft Now Boss Vote Event",
    by: "Mojang Studios",
    thumb: "images/packs/MN22.png",
    favicon: "images/favicons/mcn22.ico",
    keyart: "https://minecraft.wiki/images/Boss_Vote_Server.webp?675e5",
    notes: ["Archived by Potato Man", "Best used in 1.19.30.22"],
    pack: "downloads/MCN22/Minecraft.Now.2022.mcpack",
    links: [{ label: "Wiki Page", href: wiki("2022_Boss_Vote_Event"), kind: "wiki" }],
    worlds: [{ label: "Lobby", href: "downloads/MCN22/Minecraft.Now.2022.mcworld", images: ["https://minecraft.wiki/images/Player_Spawn_Area_Boss_Vote_Server.jpg?aea18"] }],
  },
];
