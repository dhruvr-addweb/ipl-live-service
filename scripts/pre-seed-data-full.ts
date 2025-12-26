// scripts/pre-seed-data-full.ts
// IPL 2025 – Full Pre-seed Data (Single Table Design)

/* =========================
   SEASON
========================= */
const now = () => new Date().toISOString();

export const seasonMetadata = {
  PK: 'SEASON#2025',
  SK: 'METADATA',
  type: 'SEASON',
  year: 2025,
  teamsCount: 10,
  matchesCount: 74,
  startDate: '2025-03-22',
  endDate: '2025-05-28',
  createdAt: now(),
};

/* =========================
   TEAMS
========================= */
export const teams = [
  { PK: 'SEASON#2025', SK: 'TEAM#MI', type: 'TEAM', id: 'MI', name: 'Mumbai Indians', shortName: 'MI', homeVenue: 'Wankhede Stadium', coach: 'Mark Boucher', captain: 'Hardik Pandya', createdAt: now() },
  { PK: 'SEASON#2025', SK: 'TEAM#CSK', type: 'TEAM', id: 'CSK', name: 'Chennai Super Kings', shortName: 'CSK', homeVenue: 'M. A. Chidambaram Stadium', coach: 'Stephen Fleming', captain: 'Ruturaj Gaikwad', createdAt: now() },
  { PK: 'SEASON#2025', SK: 'TEAM#RCB', type: 'TEAM', id: 'RCB', name: 'Royal Challengers Bangalore', shortName: 'RCB', homeVenue: 'M. Chinnaswamy Stadium', coach: 'Andy Flower', captain: 'Faf du Plessis', createdAt: now() },
  { PK: 'SEASON#2025', SK: 'TEAM#KKR', type: 'TEAM', id: 'KKR', name: 'Kolkata Knight Riders', shortName: 'KKR', homeVenue: 'Eden Gardens', coach: 'Chandrakant Pandit', captain: 'Shreyas Iyer', createdAt: now() },
  { PK: 'SEASON#2025', SK: 'TEAM#DC', type: 'TEAM', id: 'DC', name: 'Delhi Capitals', shortName: 'DC', homeVenue: 'Arun Jaitley Stadium', coach: 'Ricky Ponting', captain: 'Rishabh Pant', createdAt: now() },
  { PK: 'SEASON#2025', SK: 'TEAM#RR', type: 'TEAM', id: 'RR', name: 'Rajasthan Royals', shortName: 'RR', homeVenue: 'Sawai Mansingh Stadium', coach: 'Kumar Sangakkara', captain: 'Sanju Samson', createdAt: now() },
  { PK: 'SEASON#2025', SK: 'TEAM#PBKS', type: 'TEAM', id: 'PBKS', name: 'Punjab Kings', shortName: 'PBKS', homeVenue: 'IS Bindra Stadium', coach: 'Trevor Bayliss', captain: 'Shikhar Dhawan', createdAt: now() },
  { PK: 'SEASON#2025', SK: 'TEAM#SRH', type: 'TEAM', id: 'SRH', name: 'Sunrisers Hyderabad', shortName: 'SRH', homeVenue: 'Rajiv Gandhi International Stadium', coach: 'Brian Lara', captain: 'Pat Cummins', createdAt: now() },
  { PK: 'SEASON#2025', SK: 'TEAM#GT', type: 'TEAM', id: 'GT', name: 'Gujarat Titans', shortName: 'GT', homeVenue: 'Narendra Modi Stadium', coach: 'Ashish Nehra', captain: 'Shubman Gill', createdAt: now() },
  { PK: 'SEASON#2025', SK: 'TEAM#LSG', type: 'TEAM', id: 'LSG', name: 'Lucknow Super Giants', shortName: 'LSG', homeVenue: 'BRSABV Ekana Cricket Stadium', coach: 'Justin Langer', captain: 'KL Rahul', createdAt: now() },
];

/* =========================
   PLAYERS (10 PER TEAM)
========================= */
const P = (team: string, id: string, name: string, role: string) => ({
  PK: `TEAM#${team}`,
  SK: `PLAYER#${id}`,
  type: 'PLAYER',
  id,
  name,
  role,
  createdAt: now(),
});

export const players = [
  // MI
  P('MI','RohitSharma','Rohit Sharma','BATSMAN'),
  P('MI','HardikPandya','Hardik Pandya','ALLROUNDER'),
  P('MI','SuryakumarYadav','Suryakumar Yadav','BATSMAN'),
  P('MI','IshanKishan','Ishan Kishan','WICKETKEEPER'),
  P('MI','JaspritBumrah','Jasprit Bumrah','BOWLER'),
  P('MI','TilakVarma','Tilak Varma','BATSMAN'),
  P('MI','CameronGreen','Cameron Green','ALLROUNDER'),
  P('MI','PiyushChawla','Piyush Chawla','BOWLER'),
  P('MI','KumarKartikeya','Kumar Kartikeya','BOWLER'),
  P('MI','AkilDananjaya','Akil Dananjaya','BOWLER'),

  // CSK
  P('CSK','RuturajGaikwad','Ruturaj Gaikwad','BATSMAN'),
  P('CSK','MSDhoni','MS Dhoni','WICKETKEEPER'),
  P('CSK','RavindraJadeja','Ravindra Jadeja','ALLROUNDER'),
  P('CSK','ShivamDube','Shivam Dube','ALLROUNDER'),
  P('CSK','DeepakChahar','Deepak Chahar','BOWLER'),
  P('CSK','TusharDeshpande','Tushar Deshpande','BOWLER'),
  P('CSK','MaheeshTheekshana','Maheesh Theekshana','BOWLER'),
  P('CSK','AjinkyaRahane','Ajinkya Rahane','BATSMAN'),
  P('CSK','DarylMitchell','Daryl Mitchell','ALLROUNDER'),
  P('CSK','RajvardhanHangargekar','Rajvardhan Hangargekar','ALLROUNDER'),

  // RCB
  P('RCB','ViratKohli','Virat Kohli','BATSMAN'),
  P('RCB','FafDuPlessis','Faf du Plessis','BATSMAN'),
  P('RCB','GlennMaxwell','Glenn Maxwell','ALLROUNDER'),
  P('RCB','MohammedSiraj','Mohammed Siraj','BOWLER'),
  P('RCB','DineshKarthik','Dinesh Karthik','WICKETKEEPER'),
  P('RCB','RajatPatidar','Rajat Patidar','BATSMAN'),
  P('RCB','WaninduHasaranga','Wanindu Hasaranga','ALLROUNDER'),
  P('RCB','JoshHazlewood','Josh Hazlewood','BOWLER'),
  P('RCB','HarshalPatel','Harshal Patel','BOWLER'),
  P('RCB','AnujRawat','Anuj Rawat','WICKETKEEPER'),

  // KKR
  P('KKR','ShreyasIyer','Shreyas Iyer','BATSMAN'),
  P('KKR','AndreRussell','Andre Russell','ALLROUNDER'),
  P('KKR','SunilNarine','Sunil Narine','ALLROUNDER'),
  P('KKR','RinkuSingh','Rinku Singh','BATSMAN'),
  P('KKR','NitishRana','Nitish Rana','ALLROUNDER'),
  P('KKR','VarunChakravarthy','Varun Chakravarthy','BOWLER'),
  P('KKR','VenkateshIyer','Venkatesh Iyer','ALLROUNDER'),
  P('KKR','RahmanullahGurbaz','Rahmanullah Gurbaz','WICKETKEEPER'),
  P('KKR','UmeshYadav','Umesh Yadav','BOWLER'),
  P('KKR','HarshitRana','Harshit Rana','BOWLER'),

  // DC
  P('DC','RishabhPant','Rishabh Pant','WICKETKEEPER'),
  P('DC','DavidWarner','David Warner','BATSMAN'),
  P('DC','PrithviShaw','Prithvi Shaw','BATSMAN'),
  P('DC','AxarPatel','Axar Patel','ALLROUNDER'),
  P('DC','KuldeepYadav','Kuldeep Yadav','BOWLER'),
  P('DC','AnrichNortje','Anrich Nortje','BOWLER'),
  P('DC','MitchellMarsh','Mitchell Marsh','ALLROUNDER'),
  P('DC','KhalilAhmed','Khalil Ahmed','BOWLER'),
  P('DC','YashDhull','Yash Dhull','BATSMAN'),
  P('DC','LalitYadav','Lalit Yadav','ALLROUNDER'),

  // RR
  P('RR','SanjuSamson','Sanju Samson','WICKETKEEPER'),
  P('RR','JosButtler','Jos Buttler','BATSMAN'),
  P('RR','YashasviJaiswal','Yashasvi Jaiswal','BATSMAN'),
  P('RR','ShimronHetmyer','Shimron Hetmyer','BATSMAN'),
  P('RR','RavichandranAshwin','Ravichandran Ashwin','ALLROUNDER'),
  P('RR','TrentBoult','Trent Boult','BOWLER'),
  P('RR','YuzvendraChahal','Yuzvendra Chahal','BOWLER'),
  P('RR','PrasidhKrishna','Prasidh Krishna','BOWLER'),
  P('RR','RiyanParag','Riyan Parag','ALLROUNDER'),
  P('RR','DevduttPadikkal','Devdutt Padikkal','BATSMAN'),

  // PBKS
  P('PBKS','ShikharDhawan','Shikhar Dhawan','BATSMAN'),
  P('PBKS','JonnyBairstow','Jonny Bairstow','WICKETKEEPER'),
  P('PBKS','LiamLivingstone','Liam Livingstone','ALLROUNDER'),
  P('PBKS','KagisoRabada','Kagiso Rabada','BOWLER'),
  P('PBKS','ArshdeepSingh','Arshdeep Singh','BOWLER'),
  P('PBKS','JiteshSharma','Jitesh Sharma','WICKETKEEPER'),
  P('PBKS','SamCurran','Sam Curran','ALLROUNDER'),
  P('PBKS','RahulChahar','Rahul Chahar','BOWLER'),
  P('PBKS','PrabhsimranSingh','Prabhsimran Singh','BATSMAN'),
  P('PBKS','HarpreetBrar','Harpreet Brar','ALLROUNDER'),

  // SRH
  P('SRH','PatCummins','Pat Cummins','ALLROUNDER'),
  P('SRH','AbhishekSharma','Abhishek Sharma','ALLROUNDER'),
  P('SRH','TravisHead','Travis Head','BATSMAN'),
  P('SRH','HeinrichKlaasen','Heinrich Klaasen','WICKETKEEPER'),
  P('SRH','AidenMarkram','Aiden Markram','ALLROUNDER'),
  P('SRH','RahulTripathi','Rahul Tripathi','BATSMAN'),
  P('SRH','BhuvneshwarKumar','Bhuvneshwar Kumar','BOWLER'),
  P('SRH','TNatarajan','T Natarajan','BOWLER'),
  P('SRH','WashingtonSundar','Washington Sundar','ALLROUNDER'),
  P('SRH','MayankMarkande','Mayank Markande','BOWLER'),

  // GT
  P('GT','ShubmanGill','Shubman Gill','BATSMAN'),
  P('GT','RashidKhan','Rashid Khan','BOWLER'),
  P('GT','MohammedShami','Mohammed Shami','BOWLER'),
  P('GT','DavidMiller','David Miller','BATSMAN'),
  P('GT','WriddhimanSaha','Wriddhiman Saha','WICKETKEEPER'),
  P('GT','SaiSudharsan','Sai Sudharsan','BATSMAN'),
  P('GT','RahulTewatia','Rahul Tewatia','ALLROUNDER'),
  P('GT','NoorAhmad','Noor Ahmad','BOWLER'),
  P('GT','VijayShankar','Vijay Shankar','ALLROUNDER'),
  P('GT','UmeshYadav','Umesh Yadav','BOWLER'),

  // LSG
  P('LSG','KLRahul','KL Rahul','WICKETKEEPER'),
  P('LSG','NicholasPooran','Nicholas Pooran','BATSMAN'),
  P('LSG','MarcusStoinis','Marcus Stoinis','ALLROUNDER'),
  P('LSG','RaviBishnoi','Ravi Bishnoi','BOWLER'),
  P('LSG','MohsinKhan','Mohsin Khan','BOWLER'),
  P('LSG','QuintonDeKock','Quinton de Kock','WICKETKEEPER'),
  P('LSG','KrunalPandya','Krunal Pandya','ALLROUNDER'),
  P('LSG','DeepakHooda','Deepak Hooda','ALLROUNDER'),
  P('LSG','AveshKhan','Avesh Khan','BOWLER'),
  P('LSG','MayankYadav','Mayank Yadav','BOWLER'),
];

/* =========================
   MATCHES (74)
========================= */
function generateMatches() {
  const items: any[] = [];
  const teamIds = teams.map(t => t.id);
  let date = new Date('2025-03-22T14:00:00Z');
  let id = 1;

  // Double round-robin (home & away)
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {

      // First leg
      items.push({
        PK: 'SEASON#2025',
        SK: `MATCH#match-${id}`,
        type: 'MATCH',
        id: `match-${id}`,
        season: 2025,
        teamA: teamIds[i],
        teamB: teamIds[j],
        venue: teams[i].homeVenue,
        status: 'UPCOMING',
        startTime: date.toISOString(),
        score: { teamA: 0, teamB: 0, overs: 0 },
        createdAt: now(),
      });
      id++;
      date.setDate(date.getDate() + 1);

      // Second leg (reverse teams)
      items.push({
        PK: 'SEASON#2025',
        SK: `MATCH#match-${id}`,
        type: 'MATCH',
        id: `match-${id}`,
        season: 2025,
        teamA: teamIds[j],
        teamB: teamIds[i],
        venue: teams[j].homeVenue,
        status: 'UPCOMING',
        startTime: date.toISOString(),
        score: { teamA: 0, teamB: 0, overs: 0 },
        createdAt: now(),
      });
      id++;
      date.setDate(date.getDate() + 1);

      if (items.length >= 74) break;
    }
    if (items.length >= 74) break;
  }

  return items.slice(0, 74);
}


const matches = generateMatches();

/* =========================
   FINAL EXPORT
========================= */
export const seedItems = [
  seasonMetadata,
  ...teams,
  ...players,
  ...matches,
];
