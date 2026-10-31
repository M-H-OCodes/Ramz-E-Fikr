import { Article, ResourceItem, Motion, GlossaryTerm, Comment, ArticleSubmission } from '../types';
import { DEBATE_COMPILATION_RESOURCES } from './debateCompilationResources';
import { EXPANDED_ARTICLES } from './expandedArticles';
import { RESOURCE_DOSSIERS } from './resourceDossiers';

export const SEED_ARTICLES: Article[] = EXPANDED_ARTICLES;

const RAW_ADDITIONAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-1',
    slug: 'wsdc-official-manual',
    title: 'WSDC Official Adjudication & Debating Manual',
    description: 'The authoritative global standard guide covering speech times, reply protocols, adjudication mark sheets, and the 60-80 speaker scale.',
    resource_type: 'PDF',
    format: 'World Schools',
    skill_area: 'Adjudication',
    difficulty: 'Intermediate',
    topic: 'Rules & Adjudication Standards',
    author: 'WSDC Tournament Committee',
    source: 'World Schools Debating Championships Governance Board',
    file_url: 'https://wsdcdebating.com/resources',
    master_pdf_url: '/assets/aistudio/Debate_Resources_Compilation_731a0f5c.pdf',
    cover_image_url: '/assets/images/resource_cover_handbook_1791949945052.jpg',
    file_size: '2.8 MB',
    publication_year: 2025,
    downloads_count: 3410,
    featured: true,
    tags: ['WSDC', 'Adjudication', 'Speaker Scale', 'Rules', 'Global Standard'],
    sample_preview_text: `SECTION 3: THE MARKING STANDARD
Speakers in World Schools debates are evaluated on three distinct criteria:
1. Content (40 Marks): The substance of the arguments, factual accuracy, and logic.
2. Style (40 Marks): The delivery, pacing, engagement, and rhetorical persuasive power.
3. Strategy (20 Marks): The allocation of time, fulfillment of role, and clash navigation.

The standard average speech is calibrated strictly at 70 marks (Content 28, Style 28, Strategy 14).`
  },
  {
    id: 'res-2',
    slug: 'bp-prep-workflow-sheet',
    title: 'British Parliamentary 15-Minute Prep Workflow Sheet',
    description: 'A structured, minute-by-minute protocol for pairs to construct coherent Opening and Closing cases without panic or dead air.',
    resource_type: 'Template',
    format: 'British Parliamentary',
    skill_area: 'Case Building',
    difficulty: 'Beginner',
    topic: 'Preparation Strategy',
    author: 'Ramz-e-Fikr Editorial Collective',
    source: 'Cambridge & Oxford Debating Societies',
    file_url: '/assets/aistudio/Winning_the_House_by_Shahraiz_Chishti_and_Natasha_Faisal_48a8f141.pdf',
    master_pdf_url: '/assets/aistudio/Winning_the_House_by_Shahraiz_Chishti_and_Natasha_Faisal_48a8f141.pdf',
    cover_image_url: '/assets/images/motion_chamber_sparring_1791952563900.jpg',
    file_size: '480 KB',
    publication_year: 2026,
    downloads_count: 5120,
    featured: true,
    tags: ['BP Format', '15-Min Prep', 'Workflow', 'Partner Coordination', 'Case Canvas'],
    sample_preview_text: `MINUTES 00:00 - 02:00: Silent Reading & Clarification
- Identify the Spirit of the Motion: What is the real-world friction?
- Define the Model (if OG) or the Countermodel / Counter-stance (if OO).

MINUTES 02:00 - 07:00: Case Architecture & Mechanization
- Brainstorm 2-3 substantive points.
- Draft the primary stakeholder vulnerability.`
  },
  {
    id: 'res-3',
    slug: 'macroeconomic-clash-matrix',
    title: 'The Macroeconomic Clash Matrix for Parliamentary Debate',
    description: 'A comprehensive reference sheet outlining core economic paradigms: monetary easing, fiscal stimulus, sovereign debt, currency pegs, and inflation dynamics.',
    resource_type: 'Cheatsheet',
    format: 'General',
    skill_area: 'Research',
    difficulty: 'Advanced',
    topic: 'Economics & Public Finance',
    author: 'Tariq Mansoor, M.Phil Economics',
    source: 'London School of Economics Debate Society',
    file_url: 'https://drive.google.com/file/d/1dXjcPTffGLBXEM23IAN8-ofQ5W5ekIUq/view',
    master_pdf_url: '/assets/aistudio/First_Principles_Guide_241116_092658_663cad86.pdf',
    cover_image_url: '/assets/images/article_weighing_cover_1791952564020.jpg',
    file_size: '1.2 MB',
    publication_year: 2026,
    downloads_count: 4230,
    featured: true,
    tags: ['Economics', 'Macroeconomics', 'Inflation', 'Fiscal Policy', 'Cheatsheet'],
    sample_preview_text: `TENSION: AUSTERITY VS COUNTER-CYCLICAL STIMULUS
Government Stance: During recessions, aggregate demand contracts. State intervention through infrastructure borrowing injects liquidity into real-economy wages.
Opposition Stance: High sovereign debt ratios trigger sovereign credit rating downgrades, spike borrowing costs across the private sector, and crowd out private investment.`
  },
  {
    id: 'res-4',
    slug: 'extension-formulation-grid',
    title: 'Extension Formulation Grid: Metric vs Mechanism vs Stakeholder',
    description: 'A practical worksheet for Member speakers to dissect top-half material and generate clean, un-knifed extensions under extreme time constraints.',
    resource_type: 'Worksheet',
    format: 'British Parliamentary',
    skill_area: 'Extensions',
    difficulty: 'Intermediate',
    topic: 'Closing Half Tactics',
    author: 'Zainab Al-Husseini',
    source: 'Oxford Union Debate Training Dossier',
    file_url: '/assets/aistudio/Winning_the_House_by_Shahraiz_Chishti_and_Natasha_Faisal_48a8f141.pdf',
    master_pdf_url: '/assets/aistudio/Winning_the_House_by_Shahraiz_Chishti_and_Natasha_Faisal_48a8f141.pdf',
    cover_image_url: '/assets/images/article_weighing_cover_1791952564020.jpg',
    file_size: '340 KB',
    publication_year: 2025,
    downloads_count: 2890,
    featured: false,
    tags: ['Extensions', 'BP Format', 'Closing Government', 'Closing Opposition', 'Worksheet']
  },
  {
    id: 'res-5',
    slug: 'tabmaster-adjudication-scale-guide',
    title: 'Tabmaster & Adjudication Scale Guide: 50 to 100 Range Calibration',
    description: 'The standardized criteria rubric used by WUDC and EUDC chief adjudicators to benchmark speaker scores from novice (65-69) to legendary (83+).',
    resource_type: 'PDF',
    format: 'British Parliamentary',
    skill_area: 'Adjudication',
    difficulty: 'Advanced',
    topic: 'Judging & Tournament Administration',
    author: 'EUDC Adjudication Core',
    source: 'European Universities Debating Council',
    file_url: 'https://drive.google.com/file/d/1bUlNpNPOjmXibDKUwRuDk_qmbT8oLa45/view',
    master_pdf_url: '/assets/aistudio/Debate_Resources_Compilation_731a0f5c.pdf',
    cover_image_url: '/assets/images/resource_cover_handbook_1791949945052.jpg',
    file_size: '950 KB',
    publication_year: 2025,
    downloads_count: 1980,
    featured: false,
    tags: ['Adjudication', 'Speaker Scale', 'Scoring', 'WUDC', 'EUDC']
  },
  {
    id: 'res-6',
    slug: 'bioethics-debate-dossier',
    title: 'Bioethics Debate Dossier: Bodily Autonomy, Commodification & Genetic Intervention',
    description: 'Theoretical foundations and legal precedents for debating organ sales, mandatory vaccination, CRISPR gene editing, and surrogate markets.',
    resource_type: 'Guide',
    format: 'General',
    skill_area: 'Case Building',
    difficulty: 'Advanced',
    topic: 'Bioethics & Philosophy',
    author: 'Dr. Aris Thorne',
    source: 'Bioethics & Forensic Society',
    file_url: '/assets/aistudio/Michael_Sandel-_Justice-_What_s_the_Right_Thing_to_240929_180530_2aecdf3c.pdf',
    master_pdf_url: '/assets/aistudio/Theories_of_Ethics_250623_131301_ebaf7f6e.pdf',
    cover_image_url: '/assets/images/article_cover_philosophy_1791949946006.jpg',
    file_size: '1.9 MB',
    publication_year: 2026,
    downloads_count: 2470,
    featured: true,
    tags: ['Bioethics', 'Philosophy', 'Bodily Autonomy', 'CRISPR', 'Moral Philosophy']
  },
  {
    id: 'res-7',
    slug: 'icc-jurisdictional-framework',
    title: 'International Criminal Court Jurisdictional Framework & Rome Statute Guide',
    description: 'Essential primer on universal jurisdiction, sovereign immunity exceptions, complementarily principles, and state accession hurdles.',
    resource_type: 'Guide',
    format: 'General',
    skill_area: 'Research',
    difficulty: 'Intermediate',
    topic: 'International Law',
    author: 'Kareem Mansoor',
    source: 'Georgetown Law Debate Society',
    file_url: 'https://www.icc-cpi.int/sites/default/files/RS-Eng.pdf',
    master_pdf_url: 'https://www.icc-cpi.int/sites/default/files/RS-Eng.pdf',
    cover_image_url: '/assets/images/hero_debate_chamber_1791952563761.jpg',
    file_size: '820 KB',
    publication_year: 2024,
    downloads_count: 1650,
    featured: false,
    tags: ['International Law', 'ICC', 'War Crimes', 'Sovereignty', 'Legal Debate']
  },
  {
    id: 'res-8',
    slug: 'rebuttal-decision-tree-cheatsheet',
    title: 'Rebuttal Decision Tree: Mitigation, Defense, Turn, Outweigh',
    description: 'A visual decision flowchart guiding debaters on how to classify incoming opponent attacks and choose the most decisive refutation counter-move.',
    resource_type: 'Cheatsheet',
    format: 'General',
    skill_area: 'Rebuttal',
    difficulty: 'Beginner',
    topic: 'Refutation Tactics',
    author: 'Elena Rostova',
    source: 'Ramz-e-Fikr Editorial Board',
    file_url: '/assets/aistudio/Debate_Notes_79256538.pdf',
    master_pdf_url: '/assets/aistudio/Debate_Notes_79256538.pdf',
    cover_image_url: '/assets/images/motion_chamber_sparring_1791952563900.jpg',
    file_size: '620 KB',
    publication_year: 2026,
    downloads_count: 3890,
    featured: false,
    tags: ['Rebuttal', 'Cheatsheet', 'Tactics', 'Turn', 'Mitigation']
  },
  {
    id: 'res-9',
    slug: 'environmental-economics-brief',
    title: 'Environmental Economics: Carbon Tax vs Cap-and-Trade Policy Brief',
    description: 'Detailed policy comparison analyzing price elasticity, border carbon adjustments, green technology subsidies, and developing world transition equity.',
    resource_type: 'Paper',
    format: 'General',
    skill_area: 'Research',
    difficulty: 'Advanced',
    topic: 'Environment & Climate',
    author: 'Institute for Climate Policy & Debate',
    source: 'Oxford Energy Studies',
    file_url: '/assets/aistudio/First_Principles_Guide_241116_092658_663cad86.pdf',
    master_pdf_url: '/assets/aistudio/First_Principles_Guide_241116_092658_663cad86.pdf',
    cover_image_url: '/assets/images/ramz_hero_library_1791949944526.jpg',
    file_size: '2.1 MB',
    publication_year: 2025,
    downloads_count: 2150,
    featured: false,
    tags: ['Environment', 'Carbon Tax', 'Climate Change', 'Economics', 'Policy']
  },
  {
    id: 'res-10',
    slug: 'art-of-poi-masterclass-notes',
    title: 'The Art of the POI: Video Masterclass Lecture Notes',
    description: 'Transcript and tactical diagrams from Marcus Thorne’s masterclass on interrupting momentum, setting semantic traps, and answering under pressure.',
    resource_type: 'Guide',
    format: 'British Parliamentary',
    skill_area: 'POIs',
    difficulty: 'Intermediate',
    topic: 'Delivery & Interruption Craft',
    author: 'Marcus Thorne',
    source: 'World Debating Academy',
    file_url: '/assets/aistudio/Debate_Notes_79256538.pdf',
    master_pdf_url: '/assets/aistudio/Winning_the_House_by_Shahraiz_Chishti_and_Natasha_Faisal_48a8f141.pdf',
    cover_image_url: '/assets/images/motion_chamber_sparring_1791952563900.jpg',
    file_size: '540 KB',
    publication_year: 2026,
    downloads_count: 3100,
    featured: false,
    tags: ['POIs', 'Delivery', 'Public Speaking', 'Traps', 'Masterclass']
  },
  {
    id: 'res-11',
    slug: 'motion-analysis-rubric-template',
    title: 'Motions Analysis Rubric: Spirit of Motion & Problem-Solution Fit',
    description: 'Step-by-step diagnostic worksheet to dissect any motion wording, identify implied burdens, and eliminate unintended squirrels.',
    resource_type: 'Template',
    format: 'General',
    skill_area: 'Motion Analysis',
    difficulty: 'Beginner',
    topic: 'Motion Strategy',
    author: 'Ramz-e-Fikr Editorial Collective',
    source: 'Lahore University Debate Guild',
    file_url: '/assets/aistudio/Winning_the_House_by_Shahraiz_Chishti_and_Natasha_Faisal_48a8f141.pdf',
    master_pdf_url: '/assets/aistudio/Winning_the_House_by_Shahraiz_Chishti_and_Natasha_Faisal_48a8f141.pdf',
    cover_image_url: '/assets/images/motion_chamber_sparring_1791952563900.jpg',
    file_size: '410 KB',
    publication_year: 2025,
    downloads_count: 2780,
    featured: false,
    tags: ['Motion Analysis', 'Template', 'Burdens', 'Framing', 'Preparation']
  },
  {
    id: 'res-12',
    slug: 'australs-format-technical-handbook',
    title: 'Australs Format Technical Rules & Adjudication Standard',
    description: 'Complete guide for 3-on-3 Asian and Australasian parliamentary style: Prime Minister, Deputy, Whip, and reply speech obligations.',
    resource_type: 'PDF',
    format: 'Australs',
    skill_area: 'Adjudication',
    difficulty: 'Intermediate',
    topic: 'Format Rules',
    author: 'Australasian Debating Council',
    source: 'Australs Council',
    file_url: 'https://docs.google.com/document/d/1aPCBfozPh13wAIO0xvoPbcgOt-3qKzjLXWjtV_UcxY4/edit',
    master_pdf_url: '/assets/aistudio/Debate_Resources_Compilation_731a0f5c.pdf',
    cover_image_url: '/assets/images/resource_cover_handbook_1791949945052.jpg',
    file_size: '1.4 MB',
    publication_year: 2024,
    downloads_count: 1450,
    featured: false,
    tags: ['Australs', '3-on-3', 'Reply Speech', 'Whip', 'Rules']
  }
];

export const SEED_RESOURCES: ResourceItem[] = [
  ...DEBATE_COMPILATION_RESOURCES,
  ...RAW_ADDITIONAL_RESOURCES
].map((item) => ({
  ...item,
  sample_preview_text: item.sample_preview_text || RESOURCE_DOSSIERS[item.slug] || RESOURCE_DOSSIERS[item.id] || ''
}));

export const SEED_MOTIONS: Motion[] = [
  {
    id: 'mot-1',
    slug: 'thw-ban-all-private-healthcare',
    wording: 'This House would ban all private healthcare providers and mandate a single, publicly owned national health service.',
    info_slide: 'For the purposes of this debate, private healthcare providers include both for-profit hospital networks and private health insurance schemes. All healthcare practitioners would be integrated into the state service.',
    format: 'BP',
    motion_type: 'Policy (THW)',
    topic: 'Healthcare & Welfare',
    subtopic: 'Public Infrastructure',
    difficulty: 'Intermediate',
    tournament: 'World Universities Debating Championship (WUDC)',
    year: 2025,
    region: 'International',
    round: 'Round 4',
    preparation_notes: 'OG must address brain-drain of medical talent and capital investment transition. OO should weigh the loss of innovation and patient sovereignty against universal equity.',
    featured: true,
    tags: ['Healthcare', 'Public Policy', 'Inequality', 'State Monopoly', 'BP'],
    views_count: 4210,
    related_article_slugs: ['mechanics-of-weighing-comparative-calculus', 'rebuttal-by-absorption-turning-opponent-premises'],
    related_resource_slugs: ['macroeconomic-clash-matrix']
  },
  {
    id: 'mot-2',
    slug: 'thbt-developing-nations-should-prioritize-economic-growth-over-democratic-reforms',
    wording: 'This House believes that developing nations should prioritize rapid industrial economic growth over democratic political reforms.',
    info_slide: 'Rapid industrial growth refers to state-directed infrastructure programs, foreign direct investment incentives, and strategic capital allocation, even where they restrict competitive multi-party elections or trade union rights.',
    format: 'WSDC',
    motion_type: 'Value (THBT)',
    topic: 'Development & Governance',
    subtopic: 'State Capacity',
    difficulty: 'Advanced',
    tournament: 'World Schools Debating Championship (WSDC)',
    year: 2024,
    region: 'International',
    round: 'Grand Final',
    preparation_notes: 'Government must defend developmental state models (e.g., East Asian Tigers) without conceding kleptocracy. Opposition must establish democracy as an intrinsic good and anti-corruption mechanism.',
    featured: true,
    tags: ['Development', 'Democracy', 'WSDC', 'Political Theory', 'Global South'],
    views_count: 5320,
    related_article_slugs: ['first-principles-political-economy-framing-state', 'world-schools-strategy-reply-speech-as-closing-adjudication'],
    related_resource_slugs: ['wsdc-official-manual']
  },
  {
    id: 'mot-3',
    slug: 'thw-nationalize-energy-grids',
    wording: 'This House would nationalize all critical energy generation, transmission, and distribution infrastructure.',
    info_slide: 'Critical energy infrastructure includes electricity grids, natural gas pipelines, and nuclear generation facilities currently operated by private equity or shareholder-owned utilities.',
    format: 'BP',
    motion_type: 'Policy (THW)',
    topic: 'Economics & Energy',
    subtopic: 'Public Utilities',
    difficulty: 'Intermediate',
    tournament: 'Oxford Intervarsity (Oxford IV)',
    year: 2025,
    region: 'Europe',
    round: 'Round 2',
    preparation_notes: 'Clash centers on green transition financing: does state ownership eliminate profit motives that slow decarbonization, or does bureaucracy stifle clean energy innovation?',
    featured: true,
    tags: ['Energy', 'Nationalization', 'Climate', 'Infrastructure', 'Economics'],
    views_count: 3100,
    related_article_slugs: ['first-principles-political-economy-framing-state'],
    related_resource_slugs: ['environmental-economics-brief']
  },
  {
    id: 'mot-4',
    slug: 'thw-condition-foreign-aid-on-lgbtq-rights',
    wording: 'This House, as Western liberal democracies, would condition developmental and humanitarian foreign aid on recipient states decriminalizing homosexuality and protecting LGBTQ+ rights.',
    info_slide: 'This policy applies to bilateral economic assistance, development grants, and concessionary infrastructure loans, but excludes emergency famine and medical relief.',
    format: 'BP',
    motion_type: 'Actor (TH, as...)',
    topic: 'International Relations',
    subtopic: 'Human Rights Diplomacy',
    difficulty: 'Advanced',
    tournament: 'European Universities Debating Championship (EUDC)',
    year: 2025,
    region: 'Europe',
    round: 'Quarter Final',
    preparation_notes: 'Examine post-colonial sovereignty, leverage effectiveness, and the risk of recipient states pivoting toward Chinese or Russian unconditional finance alternatives.',
    featured: true,
    tags: ['IR', 'Human Rights', 'LGBTQ+', 'Foreign Aid', 'Imperialism'],
    views_count: 3840,
    related_article_slugs: ['deconstructing-international-relations-motions', 'extension-trap-constructing-novel-ground-closing-half'],
    related_resource_slugs: ['icc-jurisdictional-framework']
  },
  {
    id: 'mot-5',
    slug: 'thw-ban-private-education',
    wording: 'This House would abolish all private primary and secondary schools, requiring all children to attend state-funded public institutions.',
    info_slide: 'No private tuition or private school enrollment would be permitted. Wealthy families would not be allowed to purchase segregated schooling.',
    format: 'WSDC',
    motion_type: 'Policy (THW)',
    topic: 'Education & Social Equity',
    subtopic: 'Egalitarianism',
    difficulty: 'Beginner',
    tournament: 'Singapore National Schools Debating Championship',
    year: 2025,
    region: 'Asia',
    round: 'Semi Final',
    preparation_notes: 'Government key mechanism: when wealthy and politically influential parents have children in public schools, they ensure public schools receive world-class funding and oversight.',
    featured: false,
    tags: ['Education', 'Equality', 'Class Mobility', 'WSDC', 'Policy'],
    views_count: 4520,
    related_article_slugs: ['rebuttal-by-absorption-turning-opponent-premises'],
    related_resource_slugs: ['wsdc-official-manual']
  },
  {
    id: 'mot-6',
    slug: 'thbt-free-speech-protections-should-not-extend-to-religious-defamation',
    wording: 'This House believes that constitutional free speech protections should not extend to the intentional public desecration of religious texts and sacred symbols.',
    info_slide: 'This debate addresses cases such as the public burning of the Quran, Torah, or Bible in public plazas near worship places with the intent of humiliating minority communities.',
    format: 'BP',
    motion_type: 'Value (THBT)',
    topic: 'Law & Civil Liberties',
    subtopic: 'Freedom of Expression',
    difficulty: 'Advanced',
    tournament: 'Cambridge Intervarsity (Cambridge IV)',
    year: 2024,
    region: 'Europe',
    round: 'Open Octo-Final',
    preparation_notes: 'Weighing individual autonomy and critique of dogma versus state duty to protect vulnerable religious minorities from existential threat and civil incitement.',
    featured: false,
    tags: ['Free Speech', 'Religion', 'Constitutional Law', 'Civil Liberties', 'BP'],
    views_count: 2950,
    related_article_slugs: ['mechanics-of-weighing-comparative-calculus']
  },
  {
    id: 'mot-7',
    slug: 'thw-impose-a-100-percent-inheritance-tax',
    wording: 'This House would impose a 100% inheritance tax on all wealth, estates, and capital assets exceeding $2 million upon death.',
    info_slide: 'All revenues generated from this tax would be ring-fenced into a universal capital dividend distributed equally to all citizens upon turning 18 years old.',
    format: 'BP',
    motion_type: 'Policy (THW)',
    topic: 'Economics & Taxation',
    subtopic: 'Wealth Redistribution',
    difficulty: 'Intermediate',
    tournament: 'Harvard National Forensics Tournament',
    year: 2025,
    region: 'North America',
    round: 'Round 5',
    preparation_notes: 'Focus on meritocratic legitimacy: does intergenerational wealth create an entrenched aristocracy, or does this tax destroy family enterprise continuity and incentivize capital flight?',
    featured: false,
    tags: ['Inheritance Tax', 'Wealth Inequality', 'Meritocracy', 'Economics', 'Taxation'],
    views_count: 3670,
    related_article_slugs: ['first-principles-political-economy-framing-state'],
    related_resource_slugs: ['macroeconomic-clash-matrix']
  },
  {
    id: 'mot-8',
    slug: 'thw-assassinate-dictators-of-rogue-states',
    wording: 'This House would permit the targeted military assassination of autocratic heads of state engaged in crimes against humanity.',
    info_slide: 'Crimes against humanity are defined in accordance with Article 7 of the Rome Statute of the International Criminal Court.',
    format: 'Australs',
    motion_type: 'Policy (THW)',
    topic: 'International Security',
    subtopic: 'Targeted Strikes',
    difficulty: 'Advanced',
    tournament: 'Australasian Intervarsity Debating Championship (Australs)',
    year: 2024,
    region: 'Australasia',
    round: 'Round 6',
    preparation_notes: 'Analyze decapitation strike utility: does removing the leader paralyze the regime, or does it trigger sectarian chaos, power vacuums, and uncontrolled nuclear proliferation?',
    featured: false,
    tags: ['Assassination', 'Security', 'Autocracy', 'War', 'Australs'],
    views_count: 2890,
    related_article_slugs: ['judging-beyond-tabula-rasa-plausibility-vs-internal-links'],
    related_resource_slugs: ['icc-jurisdictional-framework']
  },
  {
    id: 'mot-9',
    slug: 'thw-allow-states-to-pay-other-states-to-accept-refugees',
    wording: 'This House would allow sovereign states to fulfill their international asylum quotas by paying other states to permanently resettle refugees.',
    info_slide: 'Under this scheme, receiving states must guarantee full legal citizenship, housing, and labor market rights equivalent to standard international conventions.',
    format: 'BP',
    motion_type: 'Policy (THW)',
    topic: 'Migration & Human Rights',
    subtopic: 'Refugee Conventions',
    difficulty: 'Advanced',
    tournament: 'Asian British Parliamentary Championship (ABP)',
    year: 2025,
    region: 'Asia',
    round: 'Main Semi Final',
    preparation_notes: 'Debaters must clash on moral commodification vs utilitarian resettlement efficiency: does this lead to offshore detention outsourcing or superior total intake capacity?',
    featured: false,
    tags: ['Refugees', 'Asylum', 'Human Rights', 'Commodification', 'Migration'],
    views_count: 3410,
    related_article_slugs: ['deconstructing-international-relations-motions']
  },
  {
    id: 'mot-10',
    slug: 'thp-a-world-where-humanity-never-developed-the-concept-of-the-nation-state',
    wording: 'This House prefers a world where human civilization organized politically around local municipal city-leagues and bioregional watersheds rather than sovereign nation-states.',
    info_slide: 'The Westphalian model of sovereign territorial nation-states emerged in 1648. This motion envisions an alternative historical trajectory prioritizing decentralized confederacies.',
    format: 'BP',
    motion_type: 'Preference (THP)',
    topic: 'Political Theory & Philosophy',
    subtopic: 'Historical Counterfactuals',
    difficulty: 'Advanced',
    tournament: 'Yale Intervarsity',
    year: 2025,
    region: 'North America',
    round: 'Round 3',
    preparation_notes: 'Compare state capacity: does the nation-state enable large-scale redistributive welfare and technological mobilization, or does it inevitably produce interstate warfare and jingoism?',
    featured: true,
    tags: ['Nation-State', 'Political Philosophy', 'Anarchism', 'Counterfactual', 'BP'],
    views_count: 2650
  },
  {
    id: 'mot-11',
    slug: 'thw-abolish-intellectual-property-for-pharmaceuticals',
    wording: 'This House would completely abolish patent protections and intellectual property rights for life-saving pharmaceutical drugs and vaccines.',
    info_slide: 'In place of drug patent monopolies, the state would finance a multi-billion dollar open-access prize fund rewarded directly to clinical discoveries.',
    format: 'WSDC',
    motion_type: 'Policy (THW)',
    topic: 'Public Health & Innovation',
    subtopic: 'Patents & TRIPS',
    difficulty: 'Intermediate',
    tournament: 'World Schools Debating Championship (WSDC)',
    year: 2025,
    region: 'International',
    round: 'Octo-Final',
    preparation_notes: 'Government argues pricing access and eradicating TRIPS artificial scarcity. Opposition must prove that without 20-year exclusivity, high-risk venture capital abandons drug discovery.',
    featured: false,
    tags: ['Pharmaceuticals', 'Patents', 'Healthcare', 'WSDC', 'Innovation'],
    views_count: 3120,
    related_resource_slugs: ['bioethics-debate-dossier']
  },
  {
    id: 'mot-12',
    slug: 'thw-allow-workers-to-sell-their-right-to-strike',
    wording: 'This House would permit trade unions and individual workers to legally contract away their right to strike in exchange for guaranteed higher wage premiums.',
    info_slide: 'Such contracts would be binding for the duration of the multi-year collective bargaining agreement, with statutory financial penalties for unauthorized walkouts.',
    format: 'BP',
    motion_type: 'Policy (THW)',
    topic: 'Labor & Economics',
    subtopic: 'Collective Bargaining',
    difficulty: 'Advanced',
    tournament: 'London School of Economics (LSE) Open',
    year: 2025,
    region: 'Europe',
    round: 'Round 5',
    preparation_notes: 'Examine freedom of contract versus structural inalienability: can workers genuinely consent when facing wage stagnation, and what happens when working conditions degrade mid-contract?',
    featured: false,
    tags: ['Labor', 'Strikes', 'Unions', 'Contracts', 'Economics'],
    views_count: 1890
  },
  {
    id: 'mot-13',
    slug: 'thbt-environmental-movements-should-commit-ecotage',
    wording: 'This House, as mainstream environmental movements, would endorse and engage in targeted property destruction ("ecotage") against fossil fuel infrastructure.',
    info_slide: 'Targeted property destruction includes pipeline sabotage, decommissioning construction machinery, and disabling coal terminal conveyor belts, strictly avoiding injury to personnel.',
    format: 'BP',
    motion_type: 'Actor (TH, as...)',
    topic: 'Environment & Activism',
    subtopic: 'Civil Disobedience',
    difficulty: 'Advanced',
    tournament: 'Sydney Mini Debating Championship',
    year: 2025,
    region: 'Australasia',
    round: 'Grand Final',
    preparation_notes: 'Clash over radical flank effects: does ecotage make moderate climate policies appear pragmatic, or does it alienate suburban voting blocs and invite state surveillance crackdowns?',
    featured: false,
    tags: ['Climate Activism', 'Ecotage', 'Radical Flank', 'Civil Disobedience', 'BP'],
    views_count: 3750,
    related_resource_slugs: ['environmental-economics-brief']
  },
  {
    id: 'mot-14',
    slug: 'thw-require-all-ai-models-to-be-open-source',
    wording: 'This House would legally mandate that all frontier artificial intelligence models, weights, and training datasets be open-source and publicly accessible.',
    info_slide: 'Frontier AI models are defined as systems trained with compute exceeding 10^25 FLOPs. Closed commercial API monopolies would be prohibited by regulatory agencies.',
    format: 'BP',
    motion_type: 'Policy (THW)',
    topic: 'Technology & Ethics',
    subtopic: 'Artificial Intelligence',
    difficulty: 'Intermediate',
    tournament: 'Stanford National Invitational',
    year: 2026,
    region: 'North America',
    round: 'Round 4',
    preparation_notes: 'Tension between catastrophic proliferation (bioweapon synthesis, cyber exploits) and anti-oligopoly democratization against big-tech surveillance cartels.',
    featured: false,
    tags: ['AI', 'Open Source', 'Technology', 'Compute', 'Regulation'],
    views_count: 4120
  },
  {
    id: 'mot-15',
    slug: 'thbt-feminist-movements-in-patriarchal-societies-should-prioritize-legal-reform-over-cultural-narratives',
    wording: 'This House believes that feminist movements in deeply patriarchal societies should prioritize aggressive legislative reform over cultural and religious storytelling shifts.',
    info_slide: 'Legislative reform includes criminal justice quotas, inheritance statutes, and marital abuse protections. Cultural shifts focus on grassroots literature, cinema, and religious reinterpretation.',
    format: 'AP',
    motion_type: 'Value (THBT)',
    topic: 'Gender & Social Justice',
    subtopic: 'Strategic Advocacy',
    difficulty: 'Intermediate',
    tournament: 'All-Asian Intervarsity Debating Championship (UADC)',
    year: 2024,
    region: 'Asia',
    round: 'Round 5',
    preparation_notes: 'Evaluate state enforcement apparatus in conservative provinces: does law precede culture, or does an unenforced law trigger severe reactionary backlash and violence?',
    featured: false,
    tags: ['Feminism', 'Law', 'Culture', 'Social Movements', 'Asian Parliamentary'],
    views_count: 2450
  },
  {
    id: 'mot-16',
    slug: 'thw-ban-private-political-campaign-donations',
    wording: 'This House would completely prohibit all private political donations and mandate equal state funding for certified political parties.',
    info_slide: 'All political advertising, town halls, and campaign staff would be financed exclusively through a public fund apportioned by vote share in the previous general election.',
    format: 'BP',
    motion_type: 'Policy (THW)',
    topic: 'Democracy & Electoral Systems',
    subtopic: 'Campaign Finance',
    difficulty: 'Beginner',
    tournament: 'Edinburgh Cup',
    year: 2025,
    region: 'Europe',
    round: 'Round 1',
    preparation_notes: 'Analyze plutocratic capture vs freedom of political assembly: does state funding protect corrupt incumbent parties from insurgent grassroots movements?',
    featured: false,
    tags: ['Democracy', 'Elections', 'Corruption', 'Free Speech', 'BP'],
    views_count: 2980
  }
];

export const SEED_GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'glo-1',
    slug: 'weighing',
    term: 'Weighing',
    short_definition: 'The comparative analysis that explains to an adjudicator why one proven impact matters more than an opponent\'s proven impact.',
    detailed_explanation: 'Weighing is the differentiator between intermediate and elite debaters. When both Government and Opposition establish valid arguments, adjudicators cannot arbitrarily pick a side without violating neutrality. Weighing provides criteria such as magnitude, reversibility, vulnerability, probability, and preconditionality.',
    category: 'Argumentation Theory',
    examples: [
      'Scope: Banning coal protects 40 million respiratory patients vs short-term job retraining for 8,000 miners.',
      'Reversibility: Economic deficits can be re-balanced; coral reef extinction is permanent.',
      'Precondition: Civil rights are meaningless if starvation destroys physical existence.'
    ],
    related_article_slugs: ['mechanics-of-weighing-comparative-calculus'],
    related_resource_slugs: ['macroeconomic-clash-matrix'],
    related_motion_slugs: ['thw-ban-all-private-healthcare']
  },
  {
    id: 'glo-2',
    slug: 'burden-of-proof',
    term: 'Burden of Proof',
    short_definition: 'The mandatory standard of demonstration that a team must establish to win a given motion or claim.',
    detailed_explanation: 'In debate, the burden of proof is determined by the motion type. In a policy motion (THW), the Government must prove both that a problem exists and that their model resolves it without creating equal or greater harms. In an actor motion (TH, as X), the burden is strictly framed around the subjective interests, survival, and moral obligations of actor X.',
    category: 'Debate Mechanics',
    examples: [
      'In "THW invade country Y", Government bears the burden of establishing operational success and post-invasion stability.',
      'In "TH, as the Vatican, would...", teams cannot argue secular utilitarianism; they must operate within Catholic canon and institutional preservation.'
    ],
    related_article_slugs: ['deconstructing-international-relations-motions']
  },
  {
    id: 'glo-3',
    slug: 'clash',
    term: 'Clash',
    short_definition: 'The direct point of theoretical or empirical disagreement where opposing cases collide.',
    detailed_explanation: 'A debate without clash consists of two ships passing in the night. True clash requires teams to engage with the strongest possible version of the opposing argument (steelmanning), rather than dismantling superficial caricatures.',
    category: 'Debate Mechanics',
    examples: [
      'Clash on Healthcare: Does market competition generate superior medical technology, or does it leave the bottom 30% without basic survival coverage?'
    ]
  },
  {
    id: 'glo-4',
    slug: 'extension',
    term: 'Extension',
    short_definition: 'New substantive material, analysis, mechanisms, or weighing introduced by Closing Half teams in British Parliamentary debate.',
    detailed_explanation: 'An extension cannot simply rephrase Opening Half ideas. It must either provide a novel argument, substantiate an asserted link with mechanistic depth (vertical extension), or shift the entire axis of the round through novel weighing.',
    category: 'BP Strategy',
    examples: [
      'Vertical Extension: Opening Government said sanctions isolate the dictator; Closing Government explains the elite security calculus that drives military defection.'
    ],
    related_article_slugs: ['extension-trap-constructing-novel-ground-closing-half'],
    related_resource_slugs: ['extension-formulation-grid']
  },
  {
    id: 'glo-5',
    slug: 'fiat',
    term: 'Fiat',
    short_definition: 'The theoretical assumption in debate that the policy outlined in the motion will actually be enacted by the designated actor.',
    detailed_explanation: 'Debaters on Opposition cannot win simply by saying "Congress would never pass this bill" or "The President lacks political capital to vote for this." Fiat grants the premise that the policy is enacted; the debate focuses strictly on what happens once it is implemented.',
    category: 'Debate Mechanics',
    examples: [
      'In "THW nationalize rail grids", Opposition cannot argue that the legislature will block the vote; they must argue what happens when the state takes control.'
    ]
  },
  {
    id: 'glo-6',
    slug: 'countermodel',
    term: 'Countermodel',
    short_definition: 'An alternative policy proposal presented by the Opposition bench to solve the problem without the Government\'s harms.',
    detailed_explanation: 'When Opposition presents a countermodel, they accept a competitive burden: the countermodel must be mutually exclusive with the Government\'s model, or functionally superior to the status quo.',
    category: 'Case Building',
    examples: [
      'Motion: "THW ban all fossil fuels within 5 years." Opposition Countermodel: "A progressive carbon tax with nuclear subsidies over 20 years."'
    ]
  },
  {
    id: 'glo-7',
    slug: 'poi',
    term: 'Point of Information (POI)',
    short_definition: 'A formal interruption where a speaker on the opposing bench is granted up to 15 seconds to ask a question or make a statement.',
    detailed_explanation: 'Offered during unprotected time (between minute 1 and minute 6 in a 7-minute speech). Used to extract concessions, plant dilemmas, or test the opponent’s adherence to their model.',
    category: 'Debate Mechanics',
    examples: [
      'Standing and declaring "On that exact point, sir."'
    ],
    related_article_slugs: ['mastering-point-of-information-rhetoric-traps'],
    related_resource_slugs: ['art-of-poi-masterclass-notes']
  },
  {
    id: 'glo-8',
    slug: 'knife',
    term: 'Knife (Contradiction)',
    short_definition: 'A fatal strategic error in BP debate where a Closing Half team directly contradicts an opening bench argument.',
    detailed_explanation: 'Under British Parliamentary rules, Closing Government and Closing Opposition are conceptually part of the same bench as their respective Opening teams. While they can differentiate themselves, they are forbidden from explicitly rejecting or dismantling the foundational model of their Opening.',
    category: 'BP Strategy',
    examples: [
      'Opening Government proposes a flat tax model; Closing Government cannot state "Flat taxes are regressive and evil; we propose a progressive luxury tax instead."'
    ]
  },
  {
    id: 'glo-9',
    slug: 'characterization',
    term: 'Characterization',
    short_definition: 'The descriptive framing of a stakeholder, institution, or environment that establishes why they behave in a specific way.',
    detailed_explanation: 'Characterization answers the psychological and institutional questions: What are the incentives of an authoritarian leader? How does an impoverished student calculate university risk? Strong characterization makes subsequent causal links feel inevitable.',
    category: 'Argumentation Theory',
    examples: [
      'Characterizing multinational pharmaceutical firms not as evil villains, but as risk-averse fiduciaries bound by legal obligations to maximize 5-year shareholder return.'
    ]
  },
  {
    id: 'glo-10',
    slug: 'tabula-rasa',
    term: 'Tabula Rasa',
    short_definition: 'The adjudication philosophy that the judge enters the debate chamber as a blank slate without personal political bias.',
    detailed_explanation: 'Adjudicators must evaluate only what is argued in the room. Even if an adjudicator is a professor of macroeconomics, they cannot penalize a novice debater for an economic oversight unless the opposing team points it out.',
    category: 'Adjudication Standards',
    examples: [
      'A judge who personally supports private education awarding a debate to the team advocating its abolition because their argumentation was analytically superior.'
    ],
    related_article_slugs: ['judging-beyond-tabula-rasa-plausibility-vs-internal-links']
  },
  {
    id: 'glo-11',
    slug: 'turn',
    term: 'Turn (Offensive Rebuttal)',
    short_definition: 'A refutation technique where you take an opponent’s premise and prove it actually benefits your side of the debate.',
    detailed_explanation: 'Turns can be impact turns (proving the outcome they fear is actually a positive good) or link turns (proving their proposed policy directly produces the opposite outcome).',
    category: 'Rebuttal',
    examples: [
      'Opponent: "Sanctions will impoverish the populace." Turn: "That widespread economic paralysis removes the elite’s tax base, forcing them to negotiate."'
    ],
    related_article_slugs: ['rebuttal-by-absorption-turning-opponent-premises']
  },
  {
    id: 'glo-12',
    slug: 'whip',
    term: 'Whip Speech',
    short_definition: 'The final speech for Closing Government or Closing Opposition in BP, tasked with summarizing and winning the debate without new arguments.',
    detailed_explanation: 'The Whip cannot bring new constructive lines of argument, but has full latitude to offer new refutation, new weighing metrics, and deeper illustration of their Member speaker’s extension.',
    category: 'BP Strategy',
    examples: [
      'Government Whip (GW) and Opposition Whip (OW) resolving the debate into thematic clashes.'
    ]
  }
];

export const SEED_COMMENTS: Comment[] = [
  {
    id: 'com-1',
    content_type: 'article',
    content_slug: 'mechanics-of-weighing-comparative-calculus',
    user_id: 'usr-2',
    user_name: 'Bilal Qureshi',
    user_role: 'debater',
    user_institution: 'Lahore University of Management Sciences',
    comment_text: 'The section on preconditionality is vital. In modern BP circuits, Opening halves are so proficient at mechanics that debates invariably collapse into who owns the structural foundation of the world.',
    created_at: '2026-09-15T14:22:00Z',
    status: 'approved',
    upvotes: 14
  },
  {
    id: 'com-2',
    content_type: 'article',
    content_slug: 'mechanics-of-weighing-comparative-calculus',
    parent_id: 'com-1',
    user_id: 'usr-1',
    user_name: 'Zainab Al-Husseini',
    user_role: 'admin',
    user_institution: 'Oxford Union',
    comment_text: 'Spot on, Bilal. In fact, if an Opening half fails to defend why their impact is a prerequisite, Closing can often sweep the top half simply by conceding their impact and explaining why it is completely dependent on Closing’s stakeholder.',
    created_at: '2026-09-15T16:45:00Z',
    status: 'approved',
    upvotes: 9
  },
  {
    id: 'com-3',
    content_type: 'motion',
    content_slug: 'thw-ban-all-private-healthcare',
    user_id: 'usr-3',
    user_name: 'Hannah Davies',
    user_role: 'debater',
    user_institution: 'Cambridge Union',
    comment_text: 'When we ran this in sparring, Opening Opposition tried to defend a two-tier hybrid system. But in policy debates, OG can easily argue that the hybrid system siphons the best surgeons into cosmetic and elective clinics.',
    created_at: '2026-09-20T11:15:00Z',
    status: 'approved',
    upvotes: 6
  },
  {
    id: 'com-4',
    content_type: 'resource',
    content_slug: 'bp-prep-workflow-sheet',
    user_id: 'usr-4',
    user_name: 'Ali Raza',
    user_role: 'debater',
    user_institution: 'IBA Karachi',
    comment_text: 'We laminated this 15-minute breakdown for our rookie squad. The 2-minute silent phase prevents partners from shouting disjointed ideas at each other in the opening panic.',
    created_at: '2026-09-28T09:30:00Z',
    status: 'approved',
    upvotes: 11
  }
];

export const SEED_SUBMISSIONS: ArticleSubmission[] = [
  {
    id: 'sub-1',
    title: 'The Epistemic Crisis of Tabula Rasa: Why Adjudicators Must Challenge Plausibility',
    subtitle: 'An inquiry into how hyper-specialized debaters exploit the blank-slate myth to pass blatant falsehoods.',
    category: 'Adjudication',
    format: 'British Parliamentary',
    difficulty: 'Advanced',
    excerpt: 'When a debater claims that raising minimum wage will trigger a military coup, does an adjudicator have an intellectual duty to reject the link absent a credible mechanism?',
    body: `
# The Limits of Neutrality

Under the orthodox doctrine of tabula rasa, a judge cannot inject outside knowledge into the adjudication room. If Team A asserts that the sky is green and Team B fails to refute it, the adjudicator is supposedly obligated to accept green skies as a factual consensus of the round.

While this principle protects teams against rogue judges wielding personal prejudices, it has metastasized into a game-theoretic distortion. Debaters routinely manufacture preposterous link chains knowing their opponents have only seven minutes to respond.

## The Standard of the Ordinary Intelligent Voter

Every international debating constitution pairs tabula rasa with a counterbalancing standard: the **Average Reasonable Citizen**. 

An ordinary citizen is neither an economist nor a gullible blank slate. They understand basic cause and effect. If an assertion defies universal human experience, it possesses zero probative weight, even if unrefuted.
    `,
    author_name: 'Suleman Khattak',
    author_email: 'suleman.k@debate.pk',
    author_institution: 'King\'s College London',
    cover_image_url: '/assets/images/article_weighing_cover_1791952564020.jpg',
    submitted_at: '2026-10-12T18:40:00Z',
    status: 'pending_review',
    editorial_notes: 'Promising epistemological inquiry. Needs secondary citations on cognitive bias literature.'
  }
];
