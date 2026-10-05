// ===== HIRAGANA : une ligne = une série. Format "kana+romaji" séparés par un espace.
// Pour ajouter des dakuten / combinaisons : ajoute simplement une ligne (ex. "がga ぎgi ぐgu げge ごgo" ou "きゃkya きゅkyu きょkyo").
const HIRAGANA = [
  "あa いi うu えe おo",
  "かka きki くku けke こko",
  "さsa しshi すsu せse そso",
  "たta ちchi つtsu てte とto",
  "なna にni ぬnu ねne のno",
  "はha ひhi ふfu へhe ほho",
  "まma みmi むmu めme もmo",
  "やya ゆyu よyo",
  "らra りri るru れre ろro",
  "わwa をwo",
  "んn"
];

// ===== COURS : ajoute un nouvel objet à la fin de la liste.
// sections : { t:"titre", v:[[japonais, romaji, français], ...] }  (vocabulaire / expressions)
//            { t:"titre", h:"<p>HTML libre</p>" }                   (grammaire, règles, remarques)
// q (optionnel) : questions de quiz [question, BONNE réponse, faux 1, faux 2, faux 3]
// Le quiz du cours est aussi généré automatiquement à partir du vocabulaire.
const COURSES = [
{ n:1, title:"Se présenter", sections:[
  { t:"Se présenter (Jikoshoukai)", v:[
    ["はじめまして","Hajimemashite","Enchanté(e)"],
    ["○○といいます","○○ to iimasu","Je m'appelle ○○ (naturel)"],
    ["○○ともうします","○○ to moshimasu","Je m'appelle ○○ (formel, écrit)"],
    ["○○です","○○ desu","Je suis ○○"],
    ["フランスじんです","Furansujin desu","Je suis français(e)"],
    ["しゅみはおんがくです","Shumi wa ongaku desu","Mon hobby est la musique"],
    ["よろしくおねがいします","Yoroshiku onegaishimasu","Ravi(e) de faire votre connaissance"]]},
  { t:"Nationalités (pays + じん)", v:[
    ["フランスじん","Furansujin","Français(e)"],["イギリスじん","Igirisujin","Anglais(e)"],
    ["アメリカじん","Amerikajin","Américain(e)"],["ベルギーじん","Berugijin","Belge"],
    ["スイスじん","Suisujin","Suisse"],["にほんじん","Nihonjin","Japonais(e)"]]},
  { t:"Hobbies (しゅみ)", v:[
    ["おんがく","Ongaku","Musique"],["りょうり","Ryouri","Cuisine"],["スポーツ","Supotsu","Sport"],
    ["たび","Tabi","Voyage"],["まんが","Manga","Manga"]]},
  { t:"Politesse", v:[
    ["はい","Hai","Oui"],["いいえ","Iie","Non"],["ありがとう","Arigatou","Merci"],
    ["すみません","Sumimasen","Excusez-moi"],["おはよう","Ohayou","Bonjour (matin)"],
    ["こんにちは","Konnichiwa","Bonjour (journée)"],["こんばんは","Konbanwa","Bonsoir"],
    ["さようなら","Sayounara","Au revoir"],["おねがいします","Onegaishimasu","S'il vous plaît"]]},
  { t:"Vocabulaire de base", v:[
    ["わたし","Watashi","Moi / je"],["あなた","Anata","Toi / vous"],["ともだち","Tomodachi","Ami(e)"],
    ["せんせい","Sensei","Professeur"],["がっこう","Gakkou","École"],["みず","Mizu","Eau"],
    ["ねこ","Neko","Chat"],["いぬ","Inu","Chien"],["ほん","Hon","Livre"],
    ["たべる","Taberu","Manger"],["のむ","Nomu","Boire"],["おいしい","Oishii","Délicieux"],["かわいい","Kawaii","Mignon"]]},
  { t:"La particule は (wa)", h:`<p>Écrit <b>は</b> (ha), prononcé <b>WA</b> : elle marque le thème de la phrase (« en ce qui concerne… »).</p>
    <div class="box"><b>Sujet は … verbe/です</b><br>Luffy wa kaizoku desu = Luffy est un pirate<br>Watashi wa furansujin desu = Je suis français</div>
    <p>Forme interrogative : <i>Furansujin desu, Sato san wa ?</i> = Je suis français, et toi Sato ?</p>`},
  { t:"Les 4 règles de base", h:`<div class="box"><b>1.</b> Le verbe est (presque) toujours à la fin de la phrase.<br>
    <b>2.</b> Pas de pluriel : <i>neko</i> = un chat / des chats.<br>
    <b>3.</b> On ne conjugue pas selon le sujet : <i>tabemasu</i> = je mange, tu manges, nous mangeons…<br>
    <b>4.</b> On omet souvent « je » (watashi wa) quand c'est évident.</div>`}
 ],
 q:[["Comment se prononce は quand c'est une particule ?","wa","ha","ba","fa"],
    ["Où se place le verbe en japonais ?","À la fin de la phrase","Au début","Juste après le sujet","Au milieu"],
    ["Comment dit-on « des chats » ?","Neko (pas de pluriel)","Nekos","Nekoes","Les neko"]]
}
];
