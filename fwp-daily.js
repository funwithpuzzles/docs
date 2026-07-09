<script>
/* ============================================================
   FWP DAILY CHALLENGE — Self-contained embed widget v1.0
   Host this file at: https://www.funwithpuzzles.com/fwp-daily.js
   Any site embeds with:
     <div id="fwp-daily-widget"></div>
     <script src="https://www.funwithpuzzles.com/fwp-daily.js"></script>
   ============================================================ */
(function(){
'use strict';

/* ── Config ── */
var BASE='https://www.funwithpuzzles.com';
var WIDGET_ID='fwp-daily-widget';
var CSS_ID='fwp-daily-css';
var SK='fwp_dc_s',TK='fwp_dc_t';

/* ── Inject CSS once ── */
if(!document.getElementById(CSS_ID)){
  var style=document.createElement('style');
  style.id=CSS_ID;
  style.textContent=[
    '.fwp-dc{width:100%;font-family:Roboto,Arial,sans-serif;font-size:14px;box-sizing:border-box;}',
    '.fwp-dc *{box-sizing:border-box;}',
    '.fwp-card{background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 4px 20px rgba(0,0,0,.09);}',
    '.fwp-head{background:#0A0AFF;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:8px;}',
    '.fwp-head-l{display:flex;align-items:center;gap:10px;min-width:0;flex:1;}',
    '.fwp-ico{font-size:26px;line-height:1;flex-shrink:0;}',
    '.fwp-brand{font-size:9px;color:rgba(255,255,255,.85);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:2px;font-weight:600;}',
    '.fwp-title{font-size:15px;font-weight:700;color:#fff;white-space:nowrap;}',
    '.fwp-streak{display:flex;align-items:center;gap:4px;background:rgba(255,255,255,.18);border:1.5px solid rgba(255,255,255,.35);border-radius:30px;padding:4px 10px;color:#fff;font-size:11px;font-weight:700;flex-shrink:0;}',
    '.fwp-streak-n{font-size:13px;font-weight:800;}',
    '.fwp-bar{background:#13253a;padding:6px 16px;display:flex;align-items:center;justify-content:space-between;gap:6px;}',
    '.fwp-bar-date{font-size:11px;color:rgba(255,255,255,.9);font-weight:600;}',
    '.fwp-bar-tag{font-size:10px;color:rgba(255,255,255,.65);font-weight:500;}',
    '.fwp-prog{height:3px;background:#e5e7eb;}',
    '.fwp-prog-fill{height:3px;background:#0A0AFF;width:0%;transition:width .4s ease;}',
    /* Tabs — scrollable pills, no text cutoff */
    '.fwp-tabs{display:flex;padding:10px 12px 0;background:#f5f6ff;border-bottom:2px solid #e5e7eb;gap:5px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}',
    '.fwp-tabs::-webkit-scrollbar{display:none;}',
    '.fwp-tab{flex:0 0 auto;padding:7px 14px;font-size:11px;font-weight:700;color:#6b7280;background:#fff;border:1.5px solid #e5e7eb;border-bottom:2px solid #e5e7eb;border-radius:8px 8px 0 0;cursor:pointer;text-align:center;white-space:nowrap;font-family:inherit;letter-spacing:.2px;transition:all .15s;margin-bottom:-2px;position:relative;}',
    '.fwp-tab.on{color:#0A0AFF;border-color:#0A0AFF;border-bottom-color:#f5f6ff;background:#f5f6ff;z-index:1;}',
    '.fwp-tab:hover:not(.on){color:#374151;background:#eef1ff;border-color:#c7d2fe;}',
    '.fwp-body{padding:16px;}',
    '.fwp-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}',
    '.fwp-ctr{font-size:12px;color:#9ca3af;font-weight:500;}',
    '.fwp-navs{display:flex;gap:6px;}',
    '.fwp-nav{width:30px;height:30px;border-radius:50%;border:1.5px solid #e5e7eb;background:#fff;color:#9ca3af;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;transition:all .15s;font-family:inherit;}',
    '.fwp-nav:hover{background:#eef1ff;color:#0A0AFF;border-color:#0A0AFF;}',
    '.fwp-grid{display:grid;grid-template-columns:1fr;gap:14px;}',
    '@media(min-width:500px){.fwp-grid{grid-template-columns:1fr 1fr;align-items:start;}}',
    '.fwp-bdg{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;padding:4px 11px;border-radius:30px;margin-bottom:11px;}',
    '.fwp-bdg.easy{background:#EAF3DE;color:#27500A;}',
    '.fwp-bdg.medium{background:#FAEEDA;color:#633806;}',
    '.fwp-bdg.hard{background:#FCEBEB;color:#791F1F;}',
    '.fwp-q{font-size:14px;line-height:1.8;color:#111827;white-space:pre-line;min-height:50px;}',
    '.fwp-hint-wrap{margin-top:12px;}',
    '.fwp-hint-btn{background:none;border:none;cursor:pointer;font-size:12px;color:#0A0AFF;display:inline-flex;align-items:center;gap:4px;padding:0;font-family:inherit;font-weight:600;}',
    '.fwp-hint-btn:hover{text-decoration:underline;}',
    '.fwp-hbox{background:#eef2ff;border-left:3px solid #0A0AFF;border-radius:0 8px 8px 0;padding:9px 13px;font-size:13px;color:#1e1b4b;line-height:1.6;margin-top:7px;display:none;}',
    '.fwp-right{display:flex;flex-direction:column;gap:8px;}',
    '.fwp-inp-row{display:flex;gap:6px;}',
    '.fwp-inp{flex:1;min-width:0;height:42px;border:1.5px solid #e5e7eb;border-radius:9px;padding:0 12px;font-size:14px;color:#111827;background:#fff;outline:none;font-family:inherit;transition:border-color .15s,box-shadow .15s;}',
    '.fwp-inp:focus{border-color:#0A0AFF;box-shadow:0 0 0 3px rgba(10,10,255,.1);}',
    '.fwp-inp:disabled{background:#f9fafb;color:#6b7280;}',
    '.fwp-chk{height:42px;padding:0 16px;background:#0A0AFF;color:#fff;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;transition:background .15s;flex-shrink:0;}',
    '.fwp-chk:hover{background:#2222ff;}',
    '.fwp-res{font-size:13px;padding:9px 13px;border-radius:9px;line-height:1.5;display:none;}',
    '.fwp-res.ok{background:#EAF3DE;color:#166534;display:block;}',
    '.fwp-res.no{background:#FCEBEB;color:#991b1b;display:block;}',
    '.fwp-reveal{background:#fff;border:1.5px solid #e5e7eb;border-radius:9px;padding:8px 13px;font-size:12px;color:#6b7280;cursor:pointer;font-family:inherit;display:none;width:100%;text-align:left;transition:background .15s;}',
    '.fwp-reveal:hover{background:#f9fafb;}',
    '.fwp-dots{display:flex;gap:7px;justify-content:center;margin-top:16px;}',
    '.fwp-dot{width:9px;height:9px;border-radius:50%;background:#e5e7eb;cursor:pointer;border:none;transition:all .2s;flex-shrink:0;}',
    '.fwp-dot:hover{transform:scale(1.3);}',
    '.fwp-dot.on{background:#0A0AFF;transform:scale(1.2);}',
    '.fwp-dot.done{background:#16a34a;}',
    '.fwp-dot.wrong{background:#dc2626;}',
    '.fwp-foot{border-top:1px solid #f3f4f6;padding:11px 16px;display:flex;align-items:center;justify-content:space-between;background:#fafafa;gap:8px;flex-wrap:wrap;}',
    '.fwp-foot-l{display:flex;gap:12px;align-items:center;flex-wrap:wrap;}',
    '.fwp-more{font-size:12px;font-weight:700;color:#0A0AFF;text-decoration:none;white-space:nowrap;}',
    '.fwp-more:hover{text-decoration:underline;}',
    '.fwp-allcat{font-size:11px;color:#9ca3af;text-decoration:none;white-space:nowrap;}',
    '.fwp-allcat:hover{color:#374151;}',
    '.fwp-share{display:flex;align-items:center;gap:4px;background:#fff;border:1.5px solid #e5e7eb;border-radius:9px;padding:6px 12px;font-size:12px;color:#6b7280;cursor:pointer;font-family:inherit;font-weight:600;white-space:nowrap;transition:all .15s;flex-shrink:0;}',
    '.fwp-share:hover{background:#eef2ff;color:#0A0AFF;border-color:#0A0AFF;}',
    '.fwp-attr{font-size:10px;color:#c0c4cc;text-align:center;padding:5px 0 8px;letter-spacing:.3px;}',
    '.fwp-attr a{color:#9ca3af;text-decoration:none;}',
    '.fwp-attr a:hover{color:#0A0AFF;}'
  ].join('');
  document.head.appendChild(style);
}

/* ── Puzzle Data: 26 categories, 15+ puzzles each ── */
var CATS=[
{t:"Riddles",s:"riddles",p:[
{d:"easy",q:"I speak without a mouth and hear without ears. I have no body but come alive with wind. What am I?",h:"Think of sounds bouncing back in a valley.",a:"echo"},
{d:"easy",q:"The more you take, the more you leave behind. What am I?",h:"Think about walking on a sandy beach.",a:"footsteps"},
{d:"easy",q:"I am tall when young and short when old. What am I?",h:"Think about what burns down over time.",a:"candle"},
{d:"easy",q:"What has one eye but cannot see?",h:"Think about sewing.",a:"needle"},
{d:"easy",q:"What has hands but cannot clap?",h:"You look at it to know the time.",a:"clock"},
{d:"easy",q:"What is full of holes but still holds water?",h:"You use it in the shower.",a:"sponge"},
{d:"easy",q:"What has a head and a tail but no body?",h:"Think coins.",a:"coin"},
{d:"easy",q:"I have no wings but I fly, no eyes but I cry. What am I?",h:"Think about weather.",a:"cloud"},
{d:"easy",q:"What has legs but cannot walk?",h:"You sit on it.",a:"table"},
{d:"medium",q:"I have cities but no houses, mountains but no trees, water but no fish. What am I?",h:"You can fold me and put me in your pocket.",a:"map"},
{d:"medium",q:"I am always in front of you but can never be seen. What am I?",h:"Think about what lies ahead in time.",a:"future"},
{d:"medium",q:"The more you remove from me, the bigger I get. What am I?",h:"Think about digging in the ground.",a:"hole"},
{d:"medium",q:"I have a thousand needles but I do not sew. What am I?",h:"Think about a prickly plant.",a:"cactus"},
{d:"medium",q:"I go up but never come down. What am I?",h:"Think about getting older.",a:"age"},
{d:"hard",q:"I can be cracked, made, told and played. What am I?",h:"Comedians do this every night on stage.",a:"joke"},
{d:"hard",q:"What has a bottom at the top?",h:"Think about clothing worn on your legs.",a:"legs"},
{d:"hard",q:"I bind it and it walks. I loose it and it stops. What am I?",h:"Think about a sandal.",a:"sandal"},
{d:"hard",q:"What can travel around the world while staying in a corner?",h:"Think about postage.",a:"stamp"}
]},
{t:"Tricky",s:"tricky-riddles",p:[
{d:"easy",q:"What goes up but never comes down?",h:"Think about getting older.",a:"age"},
{d:"easy",q:"A rooster laid an egg on the roof. Which side did it roll down?",h:"Roosters do not lay eggs.",a:"neither"},
{d:"easy",q:"How many months have 28 days?",h:"Do not just say one.",a:"all of them"},
{d:"easy",q:"What can you catch but not throw?",h:"You might get this when someone near you is sick.",a:"cold"},
{d:"easy",q:"What gets wetter as it dries?",h:"You use it after a shower.",a:"towel"},
{d:"easy",q:"What has many keys but cannot open a single lock?",h:"You use it to type text.",a:"keyboard"},
{d:"easy",q:"You see me once in a minute, twice in a moment, but not in a thousand years. What am I?",h:"Look at the letters.",a:"letter m"},
{d:"easy",q:"What question can you never answer yes to?",h:"Think about being awake.",a:"are you asleep"},
{d:"medium",q:"Before Mt Everest was discovered, what was the tallest mountain on Earth?",h:"Discovery does not change geography.",a:"everest"},
{d:"medium",q:"I am not alive but I grow. I need air but have no lungs. Water kills me. What am I?",h:"You see me in a fireplace.",a:"fire"},
{d:"medium",q:"A man shaves many times a day yet still has a beard. How?",h:"Think about who shaves other people for a living.",a:"barber"},
{d:"medium",q:"A woman had two sons at the same hour on the same day in the same year. Yet they were not twins. How?",h:"Think bigger than two.",a:"triplets"},
{d:"hard",q:"What word in English is always spelled incorrectly?",h:"Read the question very literally.",a:"incorrectly"},
{d:"hard",q:"A woman shoots her husband then holds him underwater. They go to dinner an hour later. How?",h:"What profession shoots people harmlessly?",a:"photographer"},
{d:"hard",q:"What has a head and a tail but no body? It is not alive but you find it in your pocket.",h:"You flip it to make a decision.",a:"coin"},
{d:"hard",q:"A man who was outside in the rain without an umbrella or hat did not get a single hair wet. How?",h:"Think about hair.",a:"he was bald"}
]},
{t:"What Am I",s:"what-am-i-riddles",p:[
{d:"easy",q:"I have keys but no locks, space but no room. You can enter but not go inside. What am I?",h:"You use me to type.",a:"keyboard"},
{d:"easy",q:"I run but have no legs. What am I?",h:"Think about flowing water.",a:"river"},
{d:"easy",q:"I have a neck but no head. What am I?",h:"You pour drinks from me.",a:"bottle"},
{d:"easy",q:"I fly without wings. What am I?",h:"Think about what passes every second.",a:"time"},
{d:"easy",q:"I have teeth but cannot bite. What am I?",h:"You use me to tidy your hair.",a:"comb"},
{d:"easy",q:"I have hands but cannot clap. I have a face but no eyes. What am I?",h:"You look at it to know the time.",a:"clock"},
{d:"easy",q:"I have a spine but no bones. What am I?",h:"You read me.",a:"book"},
{d:"easy",q:"I have a tongue but cannot talk. What am I?",h:"Think about footwear.",a:"shoe"},
{d:"medium",q:"I can travel around the world without moving from my place. What am I?",h:"Think about sending letters.",a:"stamp"},
{d:"medium",q:"I have branches but no fruit, trunk or leaves. What am I?",h:"You go here to borrow books or save money.",a:"bank"},
{d:"medium",q:"I am taken from a mine and shut in a wooden case. Used by everyone but never touched. What am I?",h:"Think about writing tools.",a:"pencil lead"},
{d:"medium",q:"I get shorter as I get older. What am I?",h:"Think about what burns down over time.",a:"candle"},
{d:"medium",q:"I have an eye but cannot see. I have a body but no legs. What am I?",h:"Think about severe weather.",a:"needle or hurricane"},
{d:"hard",q:"The person who makes me does not need me. The buyer does not use me. The user does not know. What am I?",h:"Think about a final resting place.",a:"coffin"},
{d:"hard",q:"You see me once in June, twice in November, not at all in May. What am I?",h:"Look at the letters of each month name.",a:"letter n"},
{d:"hard",q:"I am always hungry and must always be fed. The finger I touch will soon turn red. What am I?",h:"Think about heat.",a:"fire"}
]},
{t:"Funny",s:"funny-riddles",p:[
{d:"easy",q:"Why do bicycles fall over?",h:"Think about how many wheels it has.",a:"two tired"},
{d:"easy",q:"What do you call a fish without eyes?",h:"Say it out loud and remove the letter i.",a:"fsh"},
{d:"easy",q:"Why can a leopard never hide?",h:"Think about its coat pattern.",a:"always spotted"},
{d:"easy",q:"What do you call a sleeping dinosaur?",h:"It makes a loud rumbling sound.",a:"dino-snore"},
{d:"easy",q:"What do you call cheese that is not yours?",h:"It belongs to someone else.",a:"nacho cheese"},
{d:"easy",q:"Why did the scarecrow win an award?",h:"Think about what makes a field special.",a:"outstanding in his field"},
{d:"easy",q:"What do you call a fake noodle?",h:"It is an impasta!",a:"impasta"},
{d:"easy",q:"Why did the math book look so sad?",h:"Think about what is inside it.",a:"too many problems"},
{d:"medium",q:"What did the ocean say to the beach?",h:"Think of a wavy greeting.",a:"nothing it just waved"},
{d:"medium",q:"Why do scientists not trust atoms?",h:"They are guilty of something.",a:"they make up everything"},
{d:"medium",q:"What did one wall say to the other?",h:"Think about a corner.",a:"i will meet you at the corner"},
{d:"medium",q:"Why did the bicycle not win the race?",h:"Think about what it was.",a:"two tired"},
{d:"medium",q:"What is a vampire's favourite fruit?",h:"Think about the neck.",a:"a blood orange"},
{d:"hard",q:"I have 4 legs in the morning, 2 at noon, and 3 in the evening. What am I?",h:"This is the riddle of the Sphinx.",a:"human"},
{d:"hard",q:"What word becomes shorter when you add two letters to it?",h:"Think of the word meaning not long.",a:"short"},
{d:"hard",q:"What runs but never walks, has a mouth but never talks, has a head but never weeps?",h:"Think about flowing water.",a:"river"}
]},
{t:"Mystery",s:"mystery-riddles",p:[
{d:"easy",q:"How far can a dog run into the woods?",h:"Think about the halfway point.",a:"halfway"},
{d:"easy",q:"What is always coming but never arrives?",h:"Think about time.",a:"tomorrow"},
{d:"easy",q:"If you drop me I will crack, but smile at me and I will smile back. What am I?",h:"You look at this every morning.",a:"mirror"},
{d:"easy",q:"A father has 5 sons, each son has one sister. How many children are there?",h:"They all share the same sister.",a:"6"},
{d:"easy",q:"A man is 20 years old but has only had 5 birthdays. How?",h:"Think about when his birthday falls.",a:"born on february 29"},
{d:"easy",q:"What has 13 hearts but no other organs?",h:"You use it to play card games.",a:"deck of cards"},
{d:"easy",q:"What is always the last thing to make you smile?",h:"Think about a photo.",a:"your cheeks"},
{d:"easy",q:"A rooster lays an egg on top of a barn. Which way does it roll?",h:"Think about whether a rooster can lay eggs.",a:"roosters dont lay eggs"},
{d:"medium",q:"A man pushes his car to a hotel and declares bankruptcy. Why?",h:"Think about a popular board game.",a:"monopoly"},
{d:"medium",q:"A man is found dead by a cassette. Police press play, hear a gunshot and know it is murder. Why?",h:"Think about what the recording reveals.",a:"someone rewound it"},
{d:"medium",q:"A woman lives on the 20th floor. On sunny days she takes the lift to the 10th and walks up. On rainy days all the way. Why?",h:"Think about what she carries on rainy days.",a:"umbrella"},
{d:"medium",q:"How can a man go 25 days without sleep?",h:"He does not need to sleep during the day.",a:"he sleeps at night"},
{d:"hard",q:"A man found dead in a field next to an unopened package. No marks, no one around. How did he die?",h:"Think about what the package was supposed to do.",a:"parachute failed to open"},
{d:"hard",q:"A woman asks a hardware store for a number. Clerk says 75 paise per digit. She pays Rs 1.50. What did she buy?",h:"Think about house numbers.",a:"house number with 2 digits"},
{d:"hard",q:"3 doors: freedom behind one, lions behind others. Which do you pick?",h:"Think about lions unfed for 3 years.",a:"any they would be dead"},
{d:"hard",q:"A man walks into a bar and asks the bartender for a glass of water. The bartender pulls out a gun. The man says thank you and leaves. Why?",h:"Think about what cures hiccups.",a:"hiccups"}
]},
{t:"Maths",s:"maths-puzzles",p:[
{d:"easy",q:"A farmer has 17 sheep. All but 9 run away. How many are left?",h:"Read all but 9 very carefully.",a:"9"},
{d:"easy",q:"What is half of 2 plus 2?",h:"Follow the correct order of operations.",a:"3"},
{d:"easy",q:"If you have 3 apples and take away 2, how many apples do YOU have?",h:"Focus on the word YOU.",a:"2"},
{d:"easy",q:"How many times can you subtract 10 from 100?",h:"After the first time the number is no longer 100.",a:"once"},
{d:"easy",q:"What comes next: 1, 2, 4, 8, 16, __?",h:"Each number is doubled.",a:"32"},
{d:"easy",q:"If you throw a red stone into the blue sea, what does it become?",h:"Think about what happens physically.",a:"wet"},
{d:"easy",q:"How many sides does a circle have?",h:"Think carefully — it is not zero.",a:"one curved side"},
{d:"easy",q:"What is 1000 plus 20 plus 1000 plus 30 plus 1000 plus 1040?",h:"Add carefully step by step.",a:"4090"},
{d:"medium",q:"I am an odd number. Take away one letter and I become even. What number am I?",h:"Think about the word not the digit.",a:"seven"},
{d:"medium",q:"A bat and ball cost Rs 110 together. The bat costs Rs 100 more than the ball. What is the cost of the ball?",h:"Do not say Rs 10. Set up a proper equation.",a:"5"},
{d:"medium",q:"Two ropes each burn in 60 minutes unevenly. How do you measure exactly 45 minutes?",h:"Light both ends of one rope and one end of the other.",a:"45 minutes"},
{d:"medium",q:"If there are 3 apples and you take away 2, how many apples do you have?",h:"YOU took 2.",a:"2"},
{d:"hard",q:"A clock loses 3 minutes every hour. Set at noon, when will it next show the correct time?",h:"It must lose exactly 12 hours.",a:"240 days"},
{d:"hard",q:"8 identical balls, one slightly heavier. Using a balance only twice, find the heavy one.",h:"Divide into groups of 3, 3, and 2.",a:"two weighings"},
{d:"hard",q:"What 3 positive numbers give the same result when multiplied and when added?",h:"Try simple numbers like 1, 2, 3.",a:"1 2 3"},
{d:"hard",q:"You have two hourglasses — a 4-minute and a 7-minute. How do you measure exactly 9 minutes?",h:"Start both, flip the 4 when done, then flip again.",a:"flip strategically"}
]},
{t:"Missing #",s:"missing-number-puzzles",p:[
{d:"easy",q:"2, 4, 6, 8, __ — What comes next?",h:"Each number increases by the same amount.",a:"10"},
{d:"easy",q:"1, 1, 2, 3, 5, 8, __ — What comes next?",h:"Each number is the sum of the two before it.",a:"13"},
{d:"easy",q:"10, 20, 30, 40, __ — What comes next?",h:"Count in tens.",a:"50"},
{d:"easy",q:"5, 10, 20, 40, __ — What comes next?",h:"Each number is doubled.",a:"80"},
{d:"easy",q:"100, 90, 80, 70, __ — What comes next?",h:"Counting backwards by tens.",a:"60"},
{d:"easy",q:"1, 4, 9, 16, 25, __ — What comes next?",h:"Think about perfect squares.",a:"36"},
{d:"easy",q:"3, 9, 27, 81, __ — What comes next?",h:"Each number is multiplied by 3.",a:"243"},
{d:"easy",q:"2, 4, 8, 16, __ — What comes next?",h:"Each number doubles.",a:"32"},
{d:"medium",q:"3, 6, 12, 24, __ — What comes next?",h:"Each number is multiplied by the same value.",a:"48"},
{d:"medium",q:"Grid:\n2  4  8\n3  9  27\n4  16  ?\nWhat replaces the ?",h:"Look at the pattern across each row.",a:"64"},
{d:"medium",q:"7, 14, 21, 28, __ — What comes next?",h:"Multiples of 7.",a:"35"},
{d:"medium",q:"1, 3, 6, 10, 15, __ — What comes next?",h:"These are triangle numbers.",a:"21"},
{d:"hard",q:"1, 2, 6, 24, 120, __ — What comes next?",h:"Each term equals previous term multiplied by its position.",a:"720"},
{d:"hard",q:"Find the missing number:\n6  13  25\n11 23  45\n16 33  __",h:"Look at the relationship across each row.",a:"65"},
{d:"hard",q:"What is the sum of the first 100 natural numbers?",h:"Use the formula n x (n+1) divided by 2.",a:"5050"},
{d:"hard",q:"What comes next: 0, 1, 1, 2, 3, 5, 8, 13, 21, __?",h:"Each number is the sum of the two before it.",a:"34"}
]},
{t:"Series",s:"maths-reasoning-number-series-puzzles",p:[
{d:"easy",q:"2, 6, 18, 54, __ — What comes next?",h:"Each number is multiplied by 3.",a:"162"},
{d:"easy",q:"3, 6, 9, 12, 15, __ — What comes next?",h:"Multiples of 3.",a:"18"},
{d:"easy",q:"1, 3, 5, 7, 9, __ — What comes next?",h:"These are odd numbers in order.",a:"11"},
{d:"easy",q:"2, 3, 5, 7, 11, 13, __ — What comes next?",h:"These are all prime numbers.",a:"17"},
{d:"easy",q:"4, 8, 12, 16, __ — What comes next?",h:"Multiples of 4.",a:"20"},
{d:"easy",q:"100, 95, 85, 70, 50, __ — What comes next?",h:"Look at how much is subtracted each time.",a:"25"},
{d:"easy",q:"1, 2, 4, 8, 16, __ — What comes next?",h:"Powers of 2.",a:"32"},
{d:"easy",q:"5, 10, 15, 20, 25, __ — What comes next?",h:"Multiples of 5.",a:"30"},
{d:"medium",q:"1, 2, 4, 7, 11, 16, __ — What comes next?",h:"The difference between terms increases by 1 each time.",a:"22"},
{d:"medium",q:"1, 8, 27, 64, 125, __ — What comes next?",h:"Think about perfect cubes.",a:"216"},
{d:"medium",q:"2, 5, 10, 17, 26, __ — What comes next?",h:"Look at the differences: 3, 5, 7, 9 ...",a:"37"},
{d:"medium",q:"0, 1, 4, 9, 16, __ — What comes next?",h:"These are perfect squares starting from 0.",a:"25"},
{d:"hard",q:"3, 5, 11, 29, 83, __ — What comes next?",h:"Each term equals previous term x 3 minus 4.",a:"245"},
{d:"hard",q:"What is the next number: 1, 11, 21, 1211, 111221, __?",h:"Read each number aloud to describe the previous one.",a:"312211"},
{d:"hard",q:"What is the next prime number after 89?",h:"Check 97: is it divisible by 2, 3, 5, 7?",a:"97"},
{d:"hard",q:"2, 12, 36, 80, 150, __? What comes next?",h:"Try n squared times (n+1).",a:"252"}
]},
{t:"Logic",s:"logical-equations-puzzles",p:[
{d:"easy",q:"If Apple=5, Banana=6, Cherry=6, then Mango=?",h:"Count the letters in each word.",a:"5"},
{d:"easy",q:"If Cat=3, Dog=3, Elephant=8, then Ant=?",h:"Count the letters in each word.",a:"3"},
{d:"easy",q:"Circle + Circle = 10. Circle x Circle = ?",h:"Find the value of Circle first.",a:"25"},
{d:"easy",q:"1+4=5, 2+5=12, 3+6=21. Then 5+8=?",h:"Result = first x (first + second).",a:"65"},
{d:"easy",q:"If 2+2=8, 3+3=18, 4+4=32, then 5+5=?",h:"Look at the pattern carefully.",a:"50"},
{d:"easy",q:"If MILK=3, WATER=4, JUICE=4, then TEA=?",h:"Count the vowels in each word.",a:"2"},
{d:"easy",q:"If 1=5, 2=10, 3=15, 4=20, then 5=?",h:"Look at what 1=5 tells you about 5.",a:"1"},
{d:"easy",q:"Sun=3, Moon=4, Star=4. Earth=?",h:"Count the letters.",a:"5"},
{d:"medium",q:"Cat + Cat = 10, Cat + Dog = 12, Dog - Cat = ?",h:"Find the value of each animal first.",a:"2"},
{d:"medium",q:"If RED=27, BLUE=40, then GREEN=?",h:"A=1, B=2 ... add all letter values.",a:"49"},
{d:"medium",q:"5 people shake hands with each other exactly once. How many handshakes total?",h:"n x (n-1) divided by 2.",a:"10"},
{d:"medium",q:"If A+B=10, B+C=15, A+C=13, what is A+B+C?",h:"Add all three equations then halve.",a:"19"},
{d:"hard",q:"All Bloops are Razzles. All Razzles are Lazzles. Are all Bloops definitely Lazzles?",h:"If A implies B and B implies C ...",a:"yes"},
{d:"hard",q:"If the day before yesterday was Thursday, what day is the day after tomorrow?",h:"Map out the days carefully.",a:"monday"},
{d:"hard",q:"In a group of 23 people, roughly what is the chance two share a birthday?",h:"This is the famous birthday problem.",a:"about 50 percent"},
{d:"hard",q:"Three friends split a Rs 300 bill. They each pay Rs 100. The waiter returns Rs 50. They each get Rs 10 back. Where did the missing Rs 10 go?",h:"There is no missing Rs 10. Recount carefully.",a:"there is no missing rupee"}
]},
{t:"Crack Code",s:"crack-code-puzzles",p:[
{d:"easy",q:"If A=1, B=2, C=3 ... what word does 8-5-12-12-15 spell?",h:"Convert each number to its letter.",a:"hello"},
{d:"easy",q:"ROT13: What does CHMMYR decode to?",h:"Each letter shifts 13 places forward.",a:"puzzle"},
{d:"easy",q:"If 1=A, 2=B, 3=C ... what does 6-21-14 spell?",h:"F=6, U=21, N=14.",a:"fun"},
{d:"easy",q:"What letter is the mirror of E in the alphabet A-Z?",h:"A=Z, B=Y, C=X ...",a:"v"},
{d:"easy",q:"In the code BSBOC each letter is one ahead of the real letter. What word does it spell?",h:"Shift each letter one place back in the alphabet.",a:"brain"},
{d:"easy",q:"What number comes next: 2, 4, 6, 8, __?",h:"Even numbers in sequence.",a:"10"},
{d:"easy",q:"Decode: 20-5-19-20. A=1, B=2 ...",h:"Convert each number to a letter.",a:"test"},
{d:"easy",q:"If ZAP = 26-1-16, what does CAT equal?",h:"A=1, B=2, C=3 ...",a:"3-1-20"},
{d:"medium",q:"682: one digit right place. 614: one digit wrong place. 206: two digits wrong places. What is the code?",h:"Start with 682 to find which position is correct.",a:"042"},
{d:"medium",q:"In a 4-digit lock using digits 1-4 with no repeats, how many codes are possible?",h:"4 x 3 x 2 x 1.",a:"24"},
{d:"medium",q:"Caesar cipher shift 3: decode SXCCOH",h:"Shift each letter back 3 places.",a:"puzzle"},
{d:"medium",q:"What pattern: 1, 11, 121, 1331, 14641?",h:"Think about Pascal triangle.",a:"powers of 11"},
{d:"hard",q:"A says B is lying. B says C is lying. C says A and B are both lying. Who tells the truth?",h:"Test each possibility. Only one is consistent.",a:"c"},
{d:"hard",q:"What is the next number: 1, 11, 21, 1211, 111221, __?",h:"Read each number aloud to describe the previous.",a:"312211"},
{d:"hard",q:"Using digits 1, 2, 3, 4 each exactly once with + - x, make 10.",h:"Try 1+2+3+4.",a:"1+2+3+4"},
{d:"hard",q:"A book has 500 pages. How many times does the digit 1 appear?",h:"Count pages: 1, 10-19, 100-199 ...",a:"200"}
]},
{t:"Chess",s:"fun-chess-puzzles",p:[
{d:"easy",q:"Which chess piece can jump over other pieces?",h:"It moves in an L-shape.",a:"knight"},
{d:"easy",q:"What is it called when a king is under attack and cannot escape?",h:"Check + ___.",a:"checkmate"},
{d:"easy",q:"How many squares are on a standard chessboard?",h:"8 x 8.",a:"64"},
{d:"easy",q:"Which chess piece can only move diagonally?",h:"Associated with a religious leader.",a:"bishop"},
{d:"easy",q:"What is the most powerful piece in chess?",h:"Can move in any direction any number of squares.",a:"queen"},
{d:"easy",q:"How many pawns does each player start with?",h:"They fill the entire second row.",a:"8"},
{d:"easy",q:"What colour square does the white queen start on?",h:"The queen always starts on her own colour.",a:"white"},
{d:"easy",q:"How many pieces does each player start with?",h:"Count all pieces on one side.",a:"16"},
{d:"medium",q:"A pawn reaches the last rank. Which piece can it NOT promote to?",h:"One piece is excluded from promotion.",a:"king"},
{d:"medium",q:"Which special move allows the king and rook to switch sides?",h:"Only move where two pieces move at once.",a:"castling"},
{d:"medium",q:"A player has no legal moves but their king is NOT in check. What is this called?",h:"The game ends immediately as a draw.",a:"stalemate"},
{d:"medium",q:"Which chess piece is worth roughly 3 pawns?",h:"It moves in an L-shape or along diagonals.",a:"knight or bishop"},
{d:"hard",q:"What opening starts: 1.e4 e5 2.Nf3 Nc6 3.Bc4?",h:"Named after a city in Italy.",a:"italian game"},
{d:"hard",q:"What is en passant?",h:"A pawn captures another that just moved two squares.",a:"special pawn capture"},
{d:"hard",q:"How many possible games exist after each player makes 2 moves?",h:"Each side has 20 first moves and 20 second moves.",a:"400"},
{d:"hard",q:"How many possible first moves does white have in chess?",h:"Pawns and knights can move.",a:"20"}
]},
{t:"Sudoku",s:"fun-with-sudoku",p:[
{d:"easy",q:"How many 3x3 boxes are in a standard 9x9 Sudoku?",h:"Rows of boxes multiplied by columns of boxes.",a:"9"},
{d:"easy",q:"In Sudoku, which digit can appear more than once in the same row?",h:"Trick question. Re-read the core rule.",a:"none"},
{d:"easy",q:"How many cells are in a standard Sudoku grid?",h:"9 x 9.",a:"81"},
{d:"easy",q:"Digits 1-9 must appear exactly once in each what?",h:"Three things: row, column, and ...",a:"row column and box"},
{d:"easy",q:"What is the most common Mini Sudoku grid size?",h:"Think half of 9, rounded.",a:"6x6"},
{d:"easy",q:"What does it mean for a Sudoku to have a unique solution?",h:"There is only one correct way to fill the grid.",a:"only one solution exists"},
{d:"easy",q:"In a 9x9 Sudoku, how many rows are there?",h:"Count them.",a:"9"},
{d:"easy",q:"How many numbers appear in each row of a completed Sudoku?",h:"Each digit 1 through 9 appears once.",a:"9"},
{d:"medium",q:"In Consecutive Sudoku, what extra rule applies between adjacent cells?",h:"It involves the difference between neighbouring values.",a:"must be consecutive"},
{d:"medium",q:"In Killer Sudoku, digits in a cage must sum to a target AND follow which rule?",h:"Same rule as every row and column.",a:"no repeat"},
{d:"medium",q:"What is a Thermo Sudoku?",h:"Think about temperature increasing along a path.",a:"digits increase along thermometer shape"},
{d:"medium",q:"What is the Naked Single technique in Sudoku?",h:"Only one digit can go in a cell.",a:"only one possible digit for a cell"},
{d:"hard",q:"What is the minimum number of clues a valid Sudoku needs for a unique solution?",h:"Research by McGuire et al. 2012.",a:"17"},
{d:"hard",q:"How many valid completed Sudoku grids exist approximately?",h:"The answer is in the billions of billions.",a:"6.7 sextillion"},
{d:"hard",q:"In a Diagonal Sudoku, how many extra constraints are added?",h:"Count the two main diagonals.",a:"2"},
{d:"hard",q:"What technique uses the fact that a digit must appear in one row or column of a box?",h:"It eliminates that digit from the rest of the row or column.",a:"pointing pairs"}
]},
{t:"Lateral",s:"lateral-thinking-puzzles",p:[
{d:"easy",q:"A man lives on the 10th floor. He takes the lift down each morning but walks up from the 6th floor. Why?",h:"Think about a physical limitation.",a:"he is too short to reach floor 10 button"},
{d:"easy",q:"How can a man go 8 days without sleep?",h:"He does not need to.",a:"he sleeps at night"},
{d:"easy",q:"An electric train heads north. Which way does the smoke blow?",h:"Electric trains produce no smoke.",a:"no smoke"},
{d:"easy",q:"A woman had two sons born same time same day. Not twins. How?",h:"Think about more than two.",a:"they are triplets"},
{d:"easy",q:"A man walks into a bar and asks for water. The bartender pulls a gun. The man says thanks and leaves. Why?",h:"Why would someone urgently need water?",a:"hiccups"},
{d:"easy",q:"A rooster laid an egg on a roof peak. Which way does it roll?",h:"Roosters do not lay eggs.",a:"roosters dont lay eggs"},
{d:"easy",q:"How do you make the number 7 even?",h:"Think about removing a letter.",a:"remove the s"},
{d:"easy",q:"A girl fell off a 20-foot ladder but was not hurt. How?",h:"Think about which rung she was on.",a:"she fell from the first rung"},
{d:"medium",q:"A woman shoots her husband then holds him underwater. They go to dinner an hour later. How?",h:"What profession shoots people harmlessly?",a:"photographer"},
{d:"medium",q:"A man dead in a field, unopened package beside him, no marks, no one around. How?",h:"What was the package supposed to do?",a:"parachute failed"},
{d:"medium",q:"You are in a boat on a lake. You drop an anchor overboard. Does the lake level rise or fall?",h:"Think about weight displacement.",a:"falls"},
{d:"medium",q:"A man is pushing his car. He stops at a hotel and says he is broke. What is he doing?",h:"Think about a board game.",a:"playing monopoly"},
{d:"hard",q:"3 switches outside control 3 bulbs in a windowless room. Enter only once. How do you identify each?",h:"Switches do more than light bulbs. Think heat.",a:"turn one on wait turn off turn another on then enter"},
{d:"hard",q:"5 pirates divide 100 coins by majority vote. What does the most senior propose?",h:"Work backwards from 2 pirates.",a:"96 0 1 0 3"},
{d:"hard",q:"A house has 4 sides all facing south. A bear walks by. What colour is the bear?",h:"Think about where all 4 sides can face south.",a:"white"},
{d:"hard",q:"How can you throw a ball so it goes a short distance, comes to a complete stop, and returns to you without bouncing or hitting anything?",h:"Think about throwing direction.",a:"throw it straight up"}
]},
{t:"Matchstick",s:"matchstick-maths-puzzles",p:[
{d:"easy",q:"How many matchsticks does it take to build a single square?",h:"Count the sides.",a:"4"},
{d:"easy",q:"5 + 5 + 5 = 550 is wrong. Add ONE straight line to make it correct.",h:"You can draw on any digit or symbol.",a:"545+5=550"},
{d:"easy",q:"How many matchsticks does it take to write number 8 on a digital display?",h:"Count all the segments.",a:"7"},
{d:"easy",q:"Move 1 matchstick in 5+5=6 to make it correct.",h:"You can change any digit or the operator.",a:"5+1=6"},
{d:"easy",q:"Using exactly 4 matchsticks, what is the maximum number of squares you can make?",h:"Think about sharing sides between shapes.",a:"2"},
{d:"easy",q:"How many matchsticks make the number 1 on a digital display?",h:"Count the segments in a digital 1.",a:"2"},
{d:"easy",q:"How many triangles can you make with 3 matchsticks?",h:"Each matchstick is one side.",a:"1"},
{d:"easy",q:"How many matchsticks does it take to make the number 0 on a digital display?",h:"Count all segments of a digital zero.",a:"6"},
{d:"medium",q:"How many triangles can you make with 6 equal matchsticks without breaking any?",h:"Think in three dimensions.",a:"4"},
{d:"medium",q:"Move ONE matchstick in VI - IV = IX to make it correct.",h:"Roman numerals. One stick changes a numeral.",a:"VI + IV = X"},
{d:"medium",q:"How many squares of ANY size are in a 3x3 matchstick grid?",h:"Count 1x1, 2x2, and 3x3 squares separately.",a:"14"},
{d:"medium",q:"Remove 2 matchsticks from a 2x2 grid of squares to leave exactly 2 squares.",h:"Think about shared sides.",a:"remove two adjacent sides"},
{d:"hard",q:"Remove 2 matchsticks from a 3x3 grid of squares to leave exactly 3 squares.",h:"Removing a shared side destroys two squares at once.",a:"remove two shared sides"},
{d:"hard",q:"How many squares of all sizes are in a 4x4 matchstick grid?",h:"Count 1x1=16, 2x2=9, 3x3=4, 4x4=1.",a:"30"},
{d:"hard",q:"Move 2 matchsticks in 8-4=11 to make it correct.",h:"You can change any part of the equation.",a:"8-4=4"},
{d:"hard",q:"How many matchsticks are needed to spell CAT in capital block letters?",h:"Count each letter carefully using straight lines.",a:"9"}
]},
{t:"Rebus",s:"rebus-riddles",p:[
{d:"easy",q:"What phrase does HE + ART represent?",h:"Read the letters and their position.",a:"heart"},
{d:"easy",q:"HIJKLMNO — What one word does this represent?",h:"These letters span H to O.",a:"water"},
{d:"easy",q:"What does BAN + ANA represent?",h:"Put the sounds together.",a:"banana"},
{d:"easy",q:"What does EZ represent?",h:"Say the letters aloud.",a:"easy"},
{d:"easy",q:"What phrase does HEAD over HEELS represent?",h:"One word is above another.",a:"head over heels"},
{d:"easy",q:"What word is hidden inside: PRAISECTION?",h:"Look for a smaller word inside.",a:"raise"},
{d:"easy",q:"What does GR + 8 represent?",h:"Say each part aloud.",a:"great"},
{d:"easy",q:"What does B4 represent?",h:"Say it aloud as a number and letter.",a:"before"},
{d:"medium",q:"What does this represent?\nSTAND\nI I I I",h:"What are the I's doing relative to STAND?",a:"i understand"},
{d:"medium",q:"ONCE\n----\nTIME\nWhat does this represent?",h:"Think about position.",a:"once upon a time"},
{d:"medium",q:"What phrase is shown by TIMING TIM ING?",h:"One word is inside another.",a:"perfect timing"},
{d:"medium",q:"What does this mean: DEATH LIFE?",h:"Think about what comes between the two words.",a:"life after death"},
{d:"hard",q:"What does MAN / BOARD represent?",h:"Think about position.",a:"man overboard"},
{d:"hard",q:"What does NE14 10S mean?",h:"Say each part aloud.",a:"anyone for tennis"},
{d:"hard",q:"TIMING TIM ING — what is the hidden phrase?",h:"The word TIM is inside TIMING.",a:"split second timing"},
{d:"hard",q:"What does ROADS represent?",h:"Think about crossroads.",a:"crossroads"}
]},
{t:"GK",s:"general-knowledge-quizzes-and-riddles",p:[
{d:"easy",q:"Which planet has the most moons?",h:"The largest planet in our solar system.",a:"jupiter"},
{d:"easy",q:"What is the only country that is also a continent?",h:"Southern Hemisphere, has kangaroos.",a:"australia"},
{d:"easy",q:"Which element has the chemical symbol Fe?",h:"A common metal used in construction.",a:"iron"},
{d:"easy",q:"What is the capital of Japan?",h:"One of the most populated cities in the world.",a:"tokyo"},
{d:"easy",q:"How many sides does a hexagon have?",h:"Think about the prefix hex.",a:"6"},
{d:"easy",q:"What is the largest ocean on Earth?",h:"It covers more than one third of Earth.",a:"pacific"},
{d:"easy",q:"What is the boiling point of water in Celsius?",h:"Think about cooking pasta.",a:"100"},
{d:"easy",q:"How many continents are there on Earth?",h:"Think: Africa, Asia, Europe, Americas, etc.",a:"7"},
{d:"medium",q:"What is the shortest war in history, lasting only 38-45 minutes?",h:"Between Britain and a Sultanate in East Africa, 1896.",a:"zanzibar"},
{d:"medium",q:"Which element has the highest melting point of all elements?",h:"Used in light bulb filaments.",a:"tungsten"},
{d:"medium",q:"What is the speed of light in a vacuum, approximately?",h:"About 300 million metres per second.",a:"300000 km per second"},
{d:"medium",q:"What is the largest desert in the world?",h:"It is not the Sahara.",a:"antarctica"},
{d:"hard",q:"I am a country, language and nationality all sharing one name. Capital is Amsterdam. What am I?",h:"Famous for tulips, windmills, and cycling.",a:"netherlands"},
{d:"hard",q:"What is the only number in English with the same number of letters as its value?",h:"Count the letters in the word.",a:"four"},
{d:"hard",q:"Which country has the most natural lakes?",h:"It has over 60 percent of the world total.",a:"canada"},
{d:"hard",q:"What is the only planet that rotates clockwise when viewed from above?",h:"It spins backwards compared to most planets.",a:"venus"}
]},
{t:"Odd One",s:"odd-one-out-picture-puzzles",p:[
{d:"easy",q:"Odd one out:\nApple, Banana, Carrot, Mango",h:"Three are fruits. One is not.",a:"carrot"},
{d:"easy",q:"Odd one out:\nRed, Blue, Green, Yellow, Circle",h:"Four are colours. One is a shape.",a:"circle"},
{d:"easy",q:"Odd one out:\nDog, Cat, Eagle, Rabbit",h:"Three are mammals. One is a bird.",a:"eagle"},
{d:"easy",q:"Odd one out:\nSpain, France, India, Italy",h:"Three are European. One is not.",a:"india"},
{d:"easy",q:"Odd one out:\nSwimming, Running, Tennis, Cycling",h:"Three do not need a partner. One does.",a:"tennis"},
{d:"easy",q:"Odd one out:\nSon, Moon, Star, Earth",h:"Three are in space. One is a family member.",a:"son"},
{d:"easy",q:"Odd one out:\nRose, Lotus, Tulip, Oak",h:"Three are flowers. One is not.",a:"oak"},
{d:"easy",q:"Odd one out:\nCow, Horse, Hen, Tiger",h:"Three are domestic. One is wild.",a:"tiger"},
{d:"medium",q:"Odd one out:\nPiano, Guitar, Violin, Trumpet, Flute",h:"Four need air or strings. One is different.",a:"piano"},
{d:"medium",q:"Odd one out:\n3, 5, 7, 9, 11",h:"All are odd but look at which are prime.",a:"9"},
{d:"medium",q:"Odd one out:\nNile, Amazon, Thames, Sahara",h:"Three are rivers. One is not.",a:"sahara"},
{d:"medium",q:"Odd one out:\n2, 3, 5, 7, 9, 11",h:"One is not prime.",a:"9"},
{d:"hard",q:"Odd one out:\nMercury, Venus, Earth, Pluto, Mars",h:"Think about their official planetary status.",a:"pluto"},
{d:"hard",q:"Odd one out:\n121, 144, 169, 196, 225, 250",h:"Five are perfect squares. One is not.",a:"250"},
{d:"hard",q:"Odd one out:\nNovember, April, June, September, February",h:"Think about the number of days in each month.",a:"february"},
{d:"hard",q:"Odd one out:\nCow, Buffalo, Camel, Horse, Calf",h:"Think about the stage of life.",a:"calf"}
]},
{t:"Mistake",s:"find-mistake-puzzles",p:[
{d:"easy",q:"Spot the mistake:\n1, 2, 3, 4, 5, 6, 8, 9, 10",h:"Count the numbers carefully.",a:"7 is missing"},
{d:"easy",q:"Spot the mistake:\nMonday, Tuesday, Wednesday, Thursday, Friday, Sunday",h:"Check all the days of the week.",a:"saturday is missing"},
{d:"easy",q:"What is wrong with: She have three cats.",h:"Subject-verb agreement.",a:"have should be has"},
{d:"easy",q:"Spot the mistake:\nJanuary, February, March, April, May, July",h:"Check all the months.",a:"june is missing"},
{d:"easy",q:"Which sentence has a mistake?\nA. The cat sat on the mat.\nB. She go to school every day.\nC. I am happy.",h:"Look at the verb agreement.",a:"B"},
{d:"easy",q:"Spot the error:\n2, 4, 6, 8, 10, 12, 15, 16",h:"Even numbers increase by 2 each time.",a:"15 should be 14"},
{d:"easy",q:"Spot the mistake:\nA, B, C, D, E, F, H, I",h:"Check the alphabet carefully.",a:"G is missing"},
{d:"easy",q:"What is wrong: The earth revolve around the sun.",h:"Subject-verb agreement with a singular subject.",a:"revolve should be revolves"},
{d:"medium",q:"Find the deliberate mistake:\n2, 4, 8, 16, 36, 64",h:"Each number should double.",a:"36 should be 32"},
{d:"medium",q:"Which is wrong?\nWater boils at 100C.\nIce melts at 0C.\nSun rises in East.\nMoon is a planet.",h:"The moon is NOT a planet.",a:"moon is not a planet"},
{d:"medium",q:"Find the error: There our three mistakes in this sentance.",h:"There are actually 3 errors.",a:"our should be are sentance should be sentence"},
{d:"medium",q:"What is wrong: A triangle has 4 sides.",h:"Basic geometry.",a:"a triangle has 3 sides not 4"},
{d:"hard",q:"Spot the mistake:\n6x8=48\n7x8=54\n8x8=64\n9x8=72",h:"Check each multiplication.",a:"7x8 should be 56 not 54"},
{d:"hard",q:"What is wrong with a triangle of sides 3, 4, and 8?",h:"Triangle inequality: sum of two sides must exceed third.",a:"not a valid triangle"},
{d:"hard",q:"Find the mistake: All prime numbers are odd. Therefore 2 is not prime.",h:"2 is the only even prime number.",a:"2 is prime"},
{d:"hard",q:"Spot the mistake:\n5! = 120\n4! = 24\n3! = 6\n2! = 1",h:"Check factorial of 2.",a:"2! should be 2 not 1"}
]},
{t:"English",s:"english-word-riddles",p:[
{d:"easy",q:"Which word in the dictionary is always spelled incorrectly?",h:"Read the question very literally.",a:"incorrectly"},
{d:"easy",q:"What 5-letter word becomes shorter when you add 2 letters?",h:"Think of the word meaning not long.",a:"short"},
{d:"easy",q:"What starts with E, ends with E, but only has one letter?",h:"It carries letters.",a:"envelope"},
{d:"easy",q:"Find the hidden animal in: I visited my friend in SPARTA.",h:"Look inside the word SPARTA.",a:"rat"},
{d:"easy",q:"What word has three consecutive double letters?",h:"Think about keeping books.",a:"bookkeeper"},
{d:"easy",q:"What is a word that reads the same forwards and backwards?",h:"These are called palindromes.",a:"racecar"},
{d:"easy",q:"What comes once in a minute, twice in a moment, but never in a thousand years?",h:"Think about the letter not the concept.",a:"letter m"},
{d:"easy",q:"Rearrange SILENT to make another common English word.",h:"It uses the same 6 letters.",a:"listen"},
{d:"medium",q:"What 8-letter word contains only one vowel?",h:"Think about building material.",a:"strength"},
{d:"medium",q:"Which word contains all 5 vowels in order: a, e, i, o, u?",h:"A word meaning moderate in habits.",a:"abstemious"},
{d:"medium",q:"What is the longest common English word typed using only the top keyboard row?",h:"QWERTY row: Q W E R T Y U I O P.",a:"typewriter"},
{d:"medium",q:"What 7-letter word has hundreds of letters in it?",h:"Think about what holds many letters.",a:"mailbox or postbox"},
{d:"hard",q:"What is the next letter: O, T, T, F, F, S, S, E, __?",h:"First letters of numbers: one, two, three ...",a:"n"},
{d:"hard",q:"What English word can have 4 of its 5 letters removed and still sound the same?",h:"Think about the word queue.",a:"queue"},
{d:"hard",q:"What word contains the letters of CINEMA in order but not consecutively?",h:"C-I-N-E-M-A spread through a longer word.",a:"ceremonial"},
{d:"hard",q:"What is the only word in English that ends in -mt?",h:"Think about something that was not allowed to happen.",a:"dreamt"}
]},
{t:"Quick",s:"quick-puzzles-brain-teasers-and-riddles",p:[
{d:"easy",q:"David's mother has 4 children: April, May, June, and who?",h:"Re-read the question. Who is mentioned first?",a:"david"},
{d:"easy",q:"What has 13 hearts but no other organs?",h:"You use it to play card games.",a:"deck of cards"},
{d:"easy",q:"If you throw a red stone into the blue sea, what does it become?",h:"Think about what happens physically.",a:"wet"},
{d:"easy",q:"What can you hold in your right hand but not in your left?",h:"Think about which hand is which.",a:"your left hand"},
{d:"easy",q:"What goes up when rain comes down?",h:"Think about what you use in the rain.",a:"umbrella"},
{d:"easy",q:"I have a tail and a head but no body. What am I?",h:"You flip me to make a decision.",a:"coin"},
{d:"easy",q:"How many seconds are in a year?",h:"Think literally about the word second.",a:"12 the 2nd of each month"},
{d:"easy",q:"A rooster lays an egg at the very top of a slanted roof. Which side does it roll off?",h:"Can a rooster lay eggs?",a:"roosters dont lay eggs"},
{d:"medium",q:"A man drives from A to B at 60 km/h and returns at 40 km/h. What is his average speed?",h:"Do not just average the speeds. Use total distance over total time.",a:"48 km/h"},
{d:"medium",q:"A snail is at the bottom of a 10m well. Each day it climbs 3m but slides back 2m at night. How many days to escape?",h:"On the last day it reaches the top before sliding.",a:"8 days"},
{d:"medium",q:"100 people in a room. 99 percent have blue eyes. How many must leave so 98 percent have blue eyes?",h:"This is a tricky percentage puzzle.",a:"50"},
{d:"medium",q:"If a doctor gives you 3 pills and tells you to take one every 30 minutes, how long until they are all gone?",h:"Count carefully from when you take the first.",a:"1 hour"},
{d:"hard",q:"You have a candle, a match, and a gas lamp. Which do you light first?",h:"You need one thing before you can light anything.",a:"the match"},
{d:"hard",q:"If 5 cats catch 5 mice in 5 minutes, how many cats catch 100 mice in 100 minutes?",h:"Work out the rate per cat.",a:"5"},
{d:"hard",q:"What is the next number: 1, 11, 21, 1211, 111221, __?",h:"Read each number aloud to describe the previous one.",a:"312211"},
{d:"hard",q:"A clock shows 3:15. What is the exact angle between the hour and minute hands?",h:"The hour hand moves too. It is not at exactly 3.",a:"7.5 degrees"}
]},
{t:"Kids",s:"easy-puzzles",p:[
{d:"easy",q:"What has a face and two hands but no arms or legs?",h:"You look at it to know the time.",a:"clock"},
{d:"easy",q:"What is black when you buy it, red when you use it, grey when you throw it away?",h:"You use it to write on a board.",a:"charcoal"},
{d:"easy",q:"What animal has a trunk but never packs for a holiday?",h:"The largest land animal.",a:"elephant"},
{d:"easy",q:"What gets bigger the more you take away from it?",h:"Think about digging.",a:"hole"},
{d:"easy",q:"I have a tail and a head but no body. What am I?",h:"You flip me to make a decision.",a:"coin"},
{d:"easy",q:"What stays in a corner but travels all over the world?",h:"You put me on an envelope.",a:"stamp"},
{d:"easy",q:"What has 4 legs in the morning and 4 legs all day?",h:"A simple one — not the Sphinx riddle.",a:"table"},
{d:"easy",q:"What has a lot of keys but cannot open any door?",h:"You use it to play music.",a:"piano"},
{d:"medium",q:"How many months have 28 days?",h:"Do not just say one.",a:"all of them"},
{d:"medium",q:"What goes up when rain comes down?",h:"Think about what you use in the rain.",a:"umbrella"},
{d:"medium",q:"A man has 10 horses and 9 stables. One horse in each stable — possible?",h:"Re-read: does it say one horse PER stable?",a:"no 10 horses only 9 stables"},
{d:"medium",q:"What can you keep after giving it to someone?",h:"Think about something intangible.",a:"your word"},
{d:"hard",q:"The word CANDY can be spelled using just 2 letters. How?",h:"C and Y — CandY.",a:"C and Y"},
{d:"hard",q:"What is the next letter: O, T, T, F, F, S, S, E, __?",h:"First letters of: one, two, three ...",a:"N"},
{d:"hard",q:"A farmer has 5 haystacks in one field and 4 in another. He combines them. How many haystacks?",h:"What happens when you combine haystacks?",a:"1"},
{d:"hard",q:"What is special about the number 8,549,176,320?",h:"Think about what it contains.",a:"contains all digits 0-9 each once"}
]},
{t:"Pyramid",s:"pyramid-maths-puzzles",p:[
{d:"easy",q:"In a number pyramid each block = sum of two blocks below.\nWhat goes on top?\n?\n3  4",h:"Add the two bottom numbers.",a:"7"},
{d:"easy",q:"Fill the pyramid:\n?\n5  6",h:"Add the two bottom blocks.",a:"11"},
{d:"easy",q:"In a pyramid:\n10\n?  3\nWhat is the missing number?",h:"Top = sum of two below.",a:"7"},
{d:"easy",q:"Pyramid: top is 15, one base is 7. What is the other base?",h:"Top = sum of two below.",a:"8"},
{d:"easy",q:"Bottom row of pyramid: 2, 3. What is the top?",h:"Add the two bottom numbers.",a:"5"},
{d:"easy",q:"Bottom row: 1, 4. Top = ?",h:"Add the two bottom numbers.",a:"5"},
{d:"easy",q:"Top = 20. Bottom left = 8. Bottom right = ?",h:"Top = sum of two below.",a:"12"},
{d:"easy",q:"3-row pyramid. Bottom: 4, 5. Middle: 9, ?. Top: ?",h:"Build upwards.",a:"middle right would need more info — check puzzle"},
{d:"medium",q:"Complete the pyramid:\n?\n?  ?\n1  2  3",h:"Build layer by layer from the bottom.",a:"9"},
{d:"medium",q:"Bottom row: 5, 3, 8. Each block = difference of two below. What is the top?",h:"Middle row first, then top.",a:"3"},
{d:"medium",q:"A 4-row pyramid bottom row: 1, 2, 3, 4. Each block = sum of two below. What is the top?",h:"Build row by row: 3,5,7 then 8,12 then 20.",a:"20"},
{d:"medium",q:"Pyramid top=18. Middle row: 7, ?. Bottom row: 3, 4, ?",h:"Work downwards and upwards.",a:"11 and 7"},
{d:"hard",q:"Pyramid top=50. Second row: 20 and ?. Third row: 8, 12, ?. Find missing values.",h:"Work both up and down.",a:"30 and 18"},
{d:"hard",q:"5-row pyramid, bottom row all 1s. What is the top?",h:"Use Pascal triangle pattern.",a:"16"},
{d:"hard",q:"Bottom row: a, b, c. Top = a+2b+c. If top=20, a=3, c=5, find b.",h:"Top = a + 2b + c.",a:"6"},
{d:"hard",q:"In a multiplication pyramid each block = product of two below. Bottom: 2, 3, 4. Top = ?",h:"Middle row: 6, 12. Then top = 72.",a:"72"}
]},
{t:"Shapes",s:"count-shapes-puzzles",p:[
{d:"easy",q:"How many triangles are in a large triangle divided into 4 smaller equal triangles?",h:"Count the small ones and the large one.",a:"5"},
{d:"easy",q:"How many squares are in a 2x2 grid of squares?",h:"Count 1x1 and 2x2 squares.",a:"5"},
{d:"easy",q:"How many lines make a triangle?",h:"A triangle has 3 sides.",a:"3"},
{d:"easy",q:"How many triangles are in a Star of David?",h:"Count all sizes including overlapping ones.",a:"8"},
{d:"easy",q:"How many rectangles are in a 1x3 grid of squares?",h:"Count all rectangles including the squares themselves.",a:"6"},
{d:"easy",q:"How many sides does a hexagon have?",h:"Think about the prefix hex.",a:"6"},
{d:"easy",q:"How many sides does an octagon have?",h:"Think about the prefix oct.",a:"8"},
{d:"easy",q:"How many diagonals does a square have?",h:"Draw it and count.",a:"2"},
{d:"medium",q:"How many squares of ALL sizes are in a 3x3 grid?",h:"Count 1x1, 2x2, and 3x3 separately.",a:"14"},
{d:"medium",q:"How many rectangles are in a 3x2 grid?",h:"Use: (r+1)r/2 x (c+1)c/2.",a:"18"},
{d:"medium",q:"How many triangles in a hexagon divided into 6 triangles from centre?",h:"Count all sizes: 1, 2, 3, 4, 5, 6 unit triangles.",a:"18"},
{d:"medium",q:"How many triangles are in a regular pentagram (5-pointed star)?",h:"Count all sizes carefully.",a:"10"},
{d:"hard",q:"How many squares of ALL sizes are in a 4x4 grid?",h:"1x1=16, 2x2=9, 3x3=4, 4x4=1.",a:"30"},
{d:"hard",q:"How many rectangles are in a 4x4 grid?",h:"Use formula: C(5,2) x C(5,2).",a:"100"},
{d:"hard",q:"How many triangles are in an equilateral triangle divided into 16 smaller equal triangles?",h:"Count all sizes systematically.",a:"35"},
{d:"hard",q:"How many squares of all sizes are in a 5x5 grid?",h:"1x1=25, 2x2=16, 3x3=9, 4x4=4, 5x5=1.",a:"55"}
]},
{t:"Spatial",s:"spatial-reasoning-puzzles",p:[
{d:"easy",q:"How many faces does a cube have?",h:"Think about a dice.",a:"6"},
{d:"easy",q:"If you unfold a cube, how many squares do you see?",h:"Net of a cube.",a:"6"},
{d:"easy",q:"How many edges does a cube have?",h:"Count the lines where two faces meet.",a:"12"},
{d:"easy",q:"What 3D shape has a circular base and comes to a point?",h:"Think about a party hat.",a:"cone"},
{d:"easy",q:"How many vertices does a cube have?",h:"Count the corners.",a:"8"},
{d:"easy",q:"A shape has 4 equal sides and 4 right angles. What is it?",h:"All sides equal, all angles right angles.",a:"square"},
{d:"easy",q:"How many faces does a triangular prism have?",h:"Two triangles and three rectangles.",a:"5"},
{d:"easy",q:"What is the shape of a football panel?",h:"Two types of polygon are used.",a:"pentagon and hexagon"},
{d:"medium",q:"A cube painted red on all faces is cut into 27 small cubes. How many have exactly 2 red faces?",h:"Think about edge cubes not corner cubes.",a:"12"},
{d:"medium",q:"A cylinder has how many faces, edges, and vertices?",h:"Think carefully about curved surfaces.",a:"3 faces 2 edges 0 vertices"},
{d:"medium",q:"If a cube is cut into 64 small cubes, how many have NO painted faces?",h:"Think about the inner cubes.",a:"8"},
{d:"medium",q:"How many small cubes have exactly 3 painted faces when a cube is cut into 27?",h:"Think about corner cubes.",a:"8"},
{d:"hard",q:"How many different nets does a cube have?",h:"A net is an unfolded version.",a:"11"},
{d:"hard",q:"A solid has 6 faces, 12 edges, and 8 vertices. What solid is this?",h:"Use Euler formula: F + V - E = 2.",a:"cube"},
{d:"hard",q:"How many cubes in a 3x3x3 cube have at least one face painted on the outside?",h:"Total cubes minus inner cubes.",a:"26"},
{d:"hard",q:"A cube has its corner cut off. How many faces does the new solid have?",h:"The cut adds a new triangular face.",a:"7"}
]},
{t:"Interview",s:"interview-questions",p:[
{d:"easy",q:"Why are manholes round and not square?",h:"Think about what happens if you drop a square cover.",a:"cannot fall in"},
{d:"easy",q:"How many golf balls can fit in a school bus?",h:"Estimate volume of both then divide.",a:"about 500000"},
{d:"easy",q:"How do you weigh an elephant without a scale?",h:"Think about water displacement.",a:"use a boat and mark the waterline"},
{d:"easy",q:"A 4x4x4 cube painted outside is cut into 1x1x1 cubes. How many have no paint?",h:"Think about the inner cubes.",a:"8"},
{d:"easy",q:"You have 3L and 5L jugs. How do you measure exactly 4L?",h:"Fill 5, pour into 3, dump, repeat.",a:"fill 5 pour into 3 leaving 2 fill 3 from 5 gives 4"},
{d:"easy",q:"How many times do the hands of a clock overlap in 12 hours?",h:"They overlap approximately every 65.45 minutes.",a:"11"},
{d:"easy",q:"How many windows are in your city?",h:"Estimate population then multiply by windows per person.",a:"estimate based on population"},
{d:"easy",q:"How would you move Mount Fuji?",h:"Think creatively — this is a judgement test.",a:"move the reference point or tunnel through it"},
{d:"medium",q:"8 identical balls, one slightly heavier. Using a balance only twice, find the heavy one.",h:"Divide into groups of 3, 3, and 2.",a:"two weighings"},
{d:"medium",q:"How many piano tuners are in a city of 1 million people?",h:"Estimate pianos per person and tunings per year.",a:"about 200"},
{d:"medium",q:"3 switches control 3 bulbs in a windowless room. Enter only once. How identify each?",h:"Think about heat from a bulb.",a:"leave one on wait turn off turn another on then enter check heat"},
{d:"medium",q:"You have 100 lockers all open. You toggle every 2nd, then every 3rd, etc. Which are open at the end?",h:"Only lockers with an odd number of factors stay open.",a:"perfect square numbered lockers"},
{d:"hard",q:"How many times do the hands of a clock overlap in 24 hours?",h:"They overlap approximately every 65.45 minutes.",a:"22"},
{d:"hard",q:"5 pirates divide 100 coins by majority vote. What does the most senior propose?",h:"Work backwards from 2 pirates.",a:"96 0 1 0 3"},
{d:"hard",q:"If 5 cats catch 5 mice in 5 minutes, how many cats catch 100 mice in 100 minutes?",h:"Work out the rate per cat.",a:"5"},
{d:"hard",q:"You are shrunk to penny-height and put in a blender. What do you do?",h:"Think about the physics and your tiny weight.",a:"jump out as blades spin slowly at first"}
]}
];

/* ── Helpers ── */
function today(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function shuffle(arr,seed){
  var a=arr.slice(),s=(seed||1)&0x7fffffff,i,j,t;
  for(i=a.length-1;i>0;i--){s=(s*1664525+1013904223)&0x7fffffff;j=s%(i+1);t=a[i];a[i]=a[j];a[j]=t;}
  return a;
}
function daySeed(){var d=new Date();return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();}
function pick(cat,seed){
  var e=shuffle(cat.p.filter(function(x){return x.d==='easy';}),seed);
  var m=shuffle(cat.p.filter(function(x){return x.d==='medium';}),seed+7);
  var h=shuffle(cat.p.filter(function(x){return x.d==='hard';}),seed+13);
  return [e[0],e[1],e[2],m[0],h[0]];
}
function norm(s){return s.trim().toLowerCase().replace(/[^a-z0-9\s]/g,'').replace(/\s+/g,' ');}
function fuzzy(raw,ans){
  var r=norm(raw),c=norm(ans);
  if(r===c)return true;
  var cw=c.split(' '),rw=r.split(' ');
  var hits=cw.filter(function(w){return w.length>3&&rw.indexOf(w)!==-1;});
  return hits.length>=Math.max(1,Math.floor(cw.length*0.6));
}
function el(id){return document.getElementById(id);}

/* ── State ── */
var ds=daySeed(),td=today();
var activeCats=shuffle(CATS,ds).slice(0,4);
var state;
try{var raw=JSON.parse(localStorage.getItem(SK)||'null');state=raw&&raw.date===td?raw:null;}catch(e){state=null;}
if(!state)state={date:td,tab:0,puzz:0,ans:{},rev:{}};

/* ── Streak ── */
var streak=1;
try{
  var sk=JSON.parse(localStorage.getItem(TK)||'null');
  var yd=new Date();yd.setDate(yd.getDate()-1);
  var yds=yd.getFullYear()+'-'+(yd.getMonth()+1)+'-'+yd.getDate();
  if(sk){
    if(sk.last===td)streak=sk.count;
    else if(sk.last===yds){streak=sk.count+1;localStorage.setItem(TK,JSON.stringify({last:td,count:streak}));}
    else{streak=1;localStorage.setItem(TK,JSON.stringify({last:td,count:1}));}
  }else{localStorage.setItem(TK,JSON.stringify({last:td,count:1}));}
}catch(e){}

function save(){try{localStorage.setItem(SK,JSON.stringify(state));}catch(e){}}
function key(t,p){return t+'_'+p;}
var curPuzzles=[],hintOpen=false;

/* ── Build HTML ── */
var target=document.getElementById(WIDGET_ID);
if(!target){console.warn('FWP Widget: no element with id="'+WIDGET_ID+'" found.');return;}
target.innerHTML=[
  '<div class="fwp-dc"><div class="fwp-card">',
  '<div class="fwp-head">',
    '<div class="fwp-head-l">',
      '<span class="fwp-ico">&#x1F9E0;</span>',
      '<div><div class="fwp-brand">Fun With Puzzles</div>',
      '<div class="fwp-title">Today\'s Challenge</div></div>',
    '</div>',
    '<div class="fwp-streak">&#x1F525; <span class="fwp-streak-n" id="fwpsk">1</span> <span>day streak</span></div>',
  '</div>',
  '<div class="fwp-bar"><span class="fwp-bar-date" id="fwpdate"></span><span class="fwp-bar-tag">&#x2728; New puzzles every day</span></div>',
  '<div class="fwp-prog"><div class="fwp-prog-fill" id="fwpprog"></div></div>',
  '<div class="fwp-tabs" id="fwptabs" role="tablist"></div>',
  '<div class="fwp-body">',
    '<div class="fwp-top"><span class="fwp-ctr" id="fwpctr"></span>',
      '<div class="fwp-navs">',
        '<button class="fwp-nav" id="fwpprev">&#8249;</button>',
        '<button class="fwp-nav" id="fwpnext">&#8250;</button>',
      '</div>',
    '</div>',
    '<div class="fwp-grid">',
      '<div><div class="fwp-bdg easy" id="fwpdiff"></div>',
        '<p class="fwp-q" id="fwpq"></p>',
        '<div class="fwp-hint-wrap">',
          '<button class="fwp-hint-btn" id="fwphbtn">&#x1F4A1; Show hint</button>',
          '<div class="fwp-hbox" id="fwphbox"></div>',
        '</div>',
      '</div>',
      '<div class="fwp-right">',
        '<div class="fwp-inp-row">',
          '<input class="fwp-inp" id="fwpinp" type="text" placeholder="Your answer..."/>',
          '<button class="fwp-chk" id="fwpchk">Check</button>',
        '</div>',
        '<div class="fwp-res" id="fwpres"></div>',
        '<button class="fwp-reveal" id="fwprev">&#x1F441; Show answer</button>',
      '</div>',
    '</div>',
    '<div class="fwp-dots" id="fwpdots"></div>',
  '</div>',
  '<div class="fwp-foot">',
    '<div class="fwp-foot-l">',
      '<a class="fwp-more" id="fwpmore" href="'+BASE+'/p/index.html" target="_blank" rel="noopener">More puzzles</a>',
      '<a class="fwp-allcat" href="'+BASE+'/p/index.html" target="_blank" rel="noopener">All categories</a>',
    '</div>',
    '<button class="fwp-share" id="fwpshare">&#x2191; Share</button>',
  '</div>',
  '<div class="fwp-attr">Powered by <a href="'+BASE+'" target="_blank" rel="noopener">Fun With Puzzles</a></div>',
  '</div></div>'
].join('');

/* ── Render ── */
function render(){
  var p=curPuzzles[state.puzz],k=key(state.tab,state.puzz);
  var answered=state.ans[k],revealed=state.rev[k];
  el('fwpq').textContent=p.q;
  el('fwphbox').textContent=p.h;
  el('fwphbox').style.display='none';
  el('fwphbtn').textContent='\uD83D\uDCA1 Show hint';
  hintOpen=false;
  var diff=el('fwpdiff');
  diff.className='fwp-bdg '+p.d;
  diff.textContent=p.d==='easy'?'\uD83D\uDFE2 Easy':p.d==='medium'?'\uD83D\uDFE1 Medium':'\uD83D\uDD34 Hard';
  el('fwpctr').textContent='Puzzle '+(state.puzz+1)+' of '+curPuzzles.length;
  var more=el('fwpmore');
  more.href=BASE+'/p/'+activeCats[state.tab].s+'.html';
  more.textContent='More '+activeCats[state.tab].t+' puzzles';
  var inp=el('fwpinp'),res=el('fwpres'),rev=el('fwprev');
  if(answered!==undefined){
    inp.value=answered;inp.disabled=true;
    var ok=fuzzy(answered,p.a);
    if(ok){res.className='fwp-res ok';res.textContent='\u2713 Correct! Well done.';rev.style.display='none';}
    else{res.className='fwp-res no';res.textContent='\u2717 Not quite. Try again or reveal the answer.';rev.style.display='block';rev.textContent=revealed?'Answer: '+p.a:'\uD83D\uDC41 Show answer';}
  }else if(revealed){
    inp.value='';inp.disabled=false;
    res.className='fwp-res no';res.textContent='Answer: '+p.a;
    rev.style.display='none';
  }else{
    inp.value='';inp.disabled=false;
    res.className='fwp-res';res.textContent='';
    rev.style.display='none';
  }
  rebuildDots();updateProgress();
}

function rebuildDots(){
  var dotsEl=el('fwpdots');dotsEl.innerHTML='';
  curPuzzles.forEach(function(_,i){
    var d=document.createElement('button');d.className='fwp-dot';
    var k=key(state.tab,i),ans=state.ans[k];
    if(i===state.puzz)d.className+=' on';
    else if(ans!==undefined)d.className+=fuzzy(ans,curPuzzles[i].a)?' done':' wrong';
    else if(state.rev[k])d.className+=' wrong';
    d.setAttribute('aria-label','Puzzle '+(i+1));
    (function(n){d.onclick=function(){state.puzz=n;save();render();};}(i));
    dotsEl.appendChild(d);
  });
}

function updateProgress(){
  var total=curPuzzles.length*4,done=0;
  for(var t=0;t<4;t++){
    var ps=pick(activeCats[t],ds*31+t);
    for(var pi=0;pi<ps.length;pi++){var k=key(t,pi);if(state.ans[k]!==undefined||state.rev[k])done++;}
  }
  el('fwpprog').style.width=Math.round((done/total)*100)+'%';
}

function switchTab(n){
  state.tab=n;state.puzz=0;save();
  curPuzzles=pick(activeCats[n],ds*31+n);
  document.querySelectorAll('#fwptabs .fwp-tab').forEach(function(b,i){b.className='fwp-tab'+(i===n?' on':'');});
  render();
}

function doCheck(){
  var raw=el('fwpinp').value;
  if(!raw.trim())return;
  var k=key(state.tab,state.puzz);
  if(state.ans[k]!==undefined)return;
  state.ans[k]=raw;save();render();
}

/* ── Wire up ── */
el('fwpdate').textContent=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
el('fwpsk').textContent=streak;

var tabsEl=el('fwptabs');
activeCats.forEach(function(cat,i){
  var btn=document.createElement('button');
  btn.className='fwp-tab'+(i===0?' on':'');
  btn.textContent=cat.t;
  btn.setAttribute('role','tab');
  (function(n){btn.onclick=function(){switchTab(n);};}(i));
  tabsEl.appendChild(btn);
});

el('fwpprev').onclick=function(){state.puzz=(state.puzz-1+curPuzzles.length)%curPuzzles.length;save();render();};
el('fwpnext').onclick=function(){state.puzz=(state.puzz+1)%curPuzzles.length;save();render();};
el('fwphbtn').onclick=function(){
  hintOpen=!hintOpen;
  el('fwphbox').style.display=hintOpen?'block':'none';
  this.textContent=hintOpen?'\uD83D\uDE48 Hide hint':'\uD83D\uDCA1 Show hint';
};
el('fwpchk').onclick=doCheck;
el('fwpinp').onkeydown=function(e){if(e.key==='Enter')doCheck();};
el('fwprev').onclick=function(){
  var k=key(state.tab,state.puzz),p=curPuzzles[state.puzz];
  if(state.rev[k]){
    delete state.ans[k];delete state.rev[k];save();
    el('fwpinp').disabled=false;el('fwpinp').value='';
    el('fwpres').className='fwp-res';el('fwpres').textContent='';
    this.style.display='none';
  }else{
    state.rev[k]=true;save();
    el('fwpres').className='fwp-res no';el('fwpres').textContent='Answer: '+p.a;
    this.style.display='none';rebuildDots();updateProgress();
  }
};
el('fwpshare').onclick=function(){
  var p=curPuzzles[state.puzz];
  var text='Can you solve this puzzle?\n\n'+p.q+'\n\nMore at '+BASE;
  var url=BASE+'/p/daily-challenge.html';
  if(navigator.share){navigator.share({title:'Fun With Puzzles \u2014 Daily Challenge',text:text,url:url}).catch(function(){});}
  else{window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(text+'\n'+url),'_blank');}
};

curPuzzles=pick(activeCats[0],ds*31);
render();

})(); /* end embed IIFE */
</script>
