import { Question } from "../types";

export const psychologieFragen: Question[] = [
  {
    id: "ps-1",
    subject: "psychologie",
    topic: "Behaviorismus",
    question: "Was zeigte Iwan Pawlow mit seinem berühmten Hunde-Experiment?",
    options: [
      "Operante Konditionierung",
      "Klassische Konditionierung (Reiz-Reaktions-Kopplung)",
      "Kognitive Dissonanz",
      "Soziales Lernen am Modell",
    ],
    correctIndex: 1,
    explanation:
      "Pawlow koppelte einen neutralen Reiz (Glocke) mit einem unkonditionierten Reiz (Futter), sodass der neutrale Reiz allein die Reaktion (Speichelfluss) auslöste.",
    difficulty: "leicht",
  },
  {
    id: "ps-2",
    subject: "psychologie",
    topic: "Behaviorismus",
    question: "Worin unterscheidet sich die operante Konditionierung (Skinner) von der klassischen Konditionierung (Pawlow)?",
    options: [
      "Es gibt keinen Unterschied",
      "Operante Konditionierung erfolgt durch Konsequenzen (Verstärkung/Bestrafung) auf gezeigtes Verhalten",
      "Operante Konditionierung funktioniert nur bei Tieren, klassische nur bei Menschen",
      "Klassische Konditionierung nutzt ausschließlich negative Verstärkung",
    ],
    correctIndex: 1,
    explanation:
      "Bei der operanten Konditionierung wird Verhalten durch nachfolgende Konsequenzen (Belohnung/Bestrafung) verstärkt oder abgeschwächt.",
    difficulty: "mittel",
  },
  {
    id: "ps-3",
    subject: "psychologie",
    topic: "Gedächtnis",
    question:
      "Welche drei Speicher unterscheidet das Mehrspeichermodell von Atkinson & Shiffrin?",
    options: [
      "Sensorisches Gedächtnis, Kurzzeitgedächtnis, Langzeitgedächtnis",
      "Bewusstes, Vorbewusstes, Unbewusstes",
      "Es, Ich, Über-Ich",
      "Explizites, prozedurales, episodisches Gedächtnis",
    ],
    correctIndex: 0,
    explanation:
      "Informationen durchlaufen laut Modell sensorisches Gedächtnis → Kurzzeitgedächtnis → (durch Wiederholung) Langzeitgedächtnis.",
    difficulty: "mittel",
  },
  {
    id: "ps-4",
    subject: "psychologie",
    topic: "Gedächtnis",
    question: "Was zeigt die 'Ebbinghaus'sche Vergessenskurve'?",
    options: [
      "Dass Gelerntes ohne Wiederholung schnell, dann langsamer vergessen wird",
      "Dass Erwachsene schneller lernen als Kinder",
      "Dass Vergessen ausschließlich altersbedingt ist",
      "Dass Wiederholung das Vergessen beschleunigt",
    ],
    correctIndex: 0,
    explanation:
      "Hermann Ebbinghaus zeigte, dass der Wissensverlust anfangs steil, später flacher verläuft – regelmäßige Wiederholung wirkt dem entgegen.",
    difficulty: "leicht",
  },
  {
    id: "ps-5",
    subject: "psychologie",
    topic: "Entwicklungspsychologie",
    question: "Welche vier Stadien umfasst Piagets Theorie der kognitiven Entwicklung?",
    options: [
      "Oral, anal, phallisch, genital",
      "Sensomotorisch, präoperational, konkret-operational, formal-operational",
      "Urvertrauen, Autonomie, Initiative, Identität",
      "Sicher, unsicher-vermeidend, unsicher-ambivalent, desorganisiert",
    ],
    correctIndex: 1,
    explanation:
      "Piaget beschreibt die kognitive Entwicklung von Kindern in vier aufeinanderfolgenden Stadien bis zum abstrakten, logischen Denken.",
    difficulty: "mittel",
  },
  {
    id: "ps-6",
    subject: "psychologie",
    topic: "Psychoanalyse",
    question: "Wie nennt Sigmund Freud die drei Instanzen der Persönlichkeit?",
    options: ["Ich, Selbst, Über-Ich", "Es, Ich, Über-Ich", "Ego, Alter-Ego, Über-Ich", "Trieb, Ich, Gewissen"],
    correctIndex: 1,
    explanation:
      "Das 'Es' (Triebe), das 'Ich' (Realitätsprinzip) und das 'Über-Ich' (Gewissen/Normen) bilden Freuds Strukturmodell der Psyche.",
    difficulty: "leicht",
  },
  {
    id: "ps-7",
    subject: "psychologie",
    topic: "Psychoanalyse",
    question: "Was ist ein 'Abwehrmechanismus' im psychoanalytischen Sinn?",
    options: [
      "Eine bewusste Lügenstrategie",
      "Ein unbewusster psychischer Prozess zum Schutz des Ichs vor Angst oder inneren Konflikten (z.B. Verdrängung)",
      "Eine Form der körperlichen Selbstverteidigung",
      "Ein Medikament gegen Angststörungen",
    ],
    correctIndex: 1,
    explanation:
      "Abwehrmechanismen wie Verdrängung, Projektion oder Verleugnung schützen das Ich unbewusst vor belastenden Gefühlen.",
    difficulty: "mittel",
  },
  {
    id: "ps-8",
    subject: "psychologie",
    topic: "Bindungstheorie",
    question: "Welche Bindungsstile identifizierte Mary Ainsworth mit dem 'Fremde-Situation-Test'?",
    options: [
      "Introvertiert, extrovertiert, ambivalent",
      "Sicher, unsicher-vermeidend, unsicher-ambivalent (später ergänzt: desorganisiert)",
      "Optimistisch, pessimistisch, realistisch",
      "Autoritär, permissiv, autoritativ",
    ],
    correctIndex: 1,
    explanation:
      "Ainsworth beobachtete, wie Kleinkinder auf kurze Trennung von der Bezugsperson reagieren, und leitete daraus Bindungsmuster ab.",
    difficulty: "mittel",
  },
  {
    id: "ps-9",
    subject: "psychologie",
    topic: "Wahrnehmung",
    question: "Was besagt das Gestaltgesetz der 'Nähe' (Proximität)?",
    options: [
      "Elemente, die nah beieinanderliegen, werden als zusammengehörig wahrgenommen",
      "Nur große Objekte werden bewusst wahrgenommen",
      "Wahrnehmung ist unabhängig vom räumlichen Abstand",
      "Menschen erkennen nur Farben, keine Formen",
    ],
    correctIndex: 0,
    explanation:
      "Die Gestaltgesetze (u.a. Nähe, Ähnlichkeit, Geschlossenheit) beschreiben, wie das Gehirn Einzelreize zu sinnvollen Ganzheiten organisiert.",
    difficulty: "leicht",
  },
  {
    id: "ps-10",
    subject: "psychologie",
    topic: "Soziales Lernen",
    question: "Was zeigte Albert Banduras 'Bobo-Doll-Experiment'?",
    options: [
      "Dass Aggression rein genetisch bedingt ist",
      "Dass Kinder aggressives Verhalten durch Beobachtung eines Modells lernen können (Modelllernen)",
      "Dass Kinder unter 5 Jahren nicht lernfähig sind",
      "Dass klassische Konditionierung bei Kindern nicht funktioniert",
    ],
    correctIndex: 1,
    explanation:
      "Bandura zeigte, dass Kinder Verhalten (auch Aggression) durch Beobachtung und Nachahmung eines Modells erlernen – Grundlage der sozial-kognitiven Lerntheorie.",
    difficulty: "mittel",
  },
  {
    id: "ps-11",
    subject: "psychologie",
    topic: "Motivation",
    question: "Wie ist Maslows Bedürfnispyramide von unten nach oben grob aufgebaut?",
    options: [
      "Selbstverwirklichung, Sicherheit, physiologische Bedürfnisse, Wertschätzung, soziale Bedürfnisse",
      "Physiologische Bedürfnisse, Sicherheit, soziale Bedürfnisse, Wertschätzung, Selbstverwirklichung",
      "Sicherheit, physiologische Bedürfnisse, Selbstverwirklichung, Wertschätzung, soziale Bedürfnisse",
      "Soziale Bedürfnisse, Sicherheit, Wertschätzung, physiologische Bedürfnisse, Selbstverwirklichung",
    ],
    correctIndex: 1,
    explanation:
      "Maslow ordnet Bedürfnisse hierarchisch: von Grundbedürfnissen (Nahrung, Schlaf) bis zur Selbstverwirklichung an der Spitze.",
    difficulty: "leicht",
  },
  {
    id: "ps-12",
    subject: "psychologie",
    topic: "Persönlichkeitspsychologie",
    question: "Welche fünf Dimensionen umfasst das 'Big Five'-Modell (OCEAN) der Persönlichkeit?",
    options: [
      "Offenheit, Gewissenhaftigkeit, Extraversion, Verträglichkeit, Neurotizismus",
      "Optimismus, Charisma, Empathie, Anpassung, Neugier",
      "Intelligenz, Kreativität, Ehrgeiz, Geduld, Humor",
      "Introversion, Extraversion, Dominanz, Stabilität, Offenheit",
    ],
    correctIndex: 0,
    explanation:
      "Die Big Five (OCEAN) sind ein empirisch etabliertes Modell zur Beschreibung von Persönlichkeit anhand fünf zentraler Dimensionen.",
    difficulty: "mittel",
  },
  {
    id: "ps-13",
    subject: "psychologie",
    topic: "Sozialpsychologie",
    question: "Was untersuchte Stanley Milgram in seinem berühmten Gehorsams-Experiment?",
    options: [
      "Wie weit Menschen bereit sind, einer Autorität zu gehorchen, auch wenn sie anderen dabei schaden",
      "Wie Menschen in Gruppen Entscheidungen treffen",
      "Wie sich Erinnerungen im Alter verändern",
      "Wie Farben die Stimmung beeinflussen",
    ],
    correctIndex: 0,
    explanation:
      "Milgrams Experiment zeigte, dass ein hoher Anteil der Versuchspersonen einer Autoritätsperson (vermeintlich) schmerzhafte Elektroschocks verabreichte.",
    difficulty: "mittel",
  },
  {
    id: "ps-14",
    subject: "psychologie",
    topic: "Sozialpsychologie",
    question: "Was zeigte das Asch-Konformitätsexperiment?",
    options: [
      "Dass Menschen unter Gruppendruck offensichtlich falsche Urteile übernehmen, um sich anzupassen",
      "Dass Gruppenmeinungen keinen Einfluss auf Individuen haben",
      "Dass Konformität nur bei Kindern auftritt",
      "Dass visuelle Wahrnehmung objektiv und unbeeinflussbar ist",
    ],
    correctIndex: 0,
    explanation:
      "Versuchspersonen passten ihre (falschen) Antworten bei einer einfachen Linienvergleichsaufgabe oft der Mehrheitsmeinung der Gruppe an.",
    difficulty: "mittel",
  },
  {
    id: "ps-15",
    subject: "psychologie",
    topic: "Emotionspsychologie",
    question: "Was besagt die James-Lange-Theorie der Emotionen (vereinfacht)?",
    options: [
      "Emotionen entstehen zuerst im Kopf und lösen dann körperliche Reaktionen aus",
      "Körperliche Reaktionen entstehen zuerst, das Gefühl der Emotion ist die Wahrnehmung dieser Körperreaktion",
      "Emotionen und Körperreaktionen sind völlig unabhängig voneinander",
      "Emotionen werden ausschließlich sozial erlernt",
    ],
    correctIndex: 1,
    explanation:
      "Laut James-Lange nehmen wir zuerst eine körperliche Reaktion (z.B. Herzrasen) wahr und interpretieren diese dann als Emotion (z.B. Angst).",
    difficulty: "schwer",
  },
  {
    id: "ps-16",
    subject: "psychologie",
    topic: "Begründer der Psychologie",
    question: "Wer gilt als Begründer der experimentellen Psychologie und richtete 1879 das erste psychologische Labor ein?",
    options: ["Sigmund Freud", "Wilhelm Wundt", "B.F. Skinner", "Carl Rogers"],
    correctIndex: 1,
    explanation:
      "Wilhelm Wundt gründete 1879 in Leipzig das erste Labor für experimentelle Psychologie und gilt als Begründer dieser Disziplin.",
    difficulty: "leicht",
  },
  {
    id: "ps-17",
    subject: "psychologie",
    topic: "Intelligenz",
    question: "Was ist die Kernidee von Howard Gardners Theorie der 'multiplen Intelligenzen'?",
    options: [
      "Intelligenz ist eine einzige, rein genetisch fixierte Größe (IQ)",
      "Es gibt mehrere relativ unabhängige Intelligenzformen (z.B. sprachlich, logisch-mathematisch, musikalisch, körperlich-kinästhetisch)",
      "Intelligenz kann ausschließlich durch Schulnoten gemessen werden",
      "Nur mathematische Fähigkeiten zählen als 'echte' Intelligenz",
    ],
    correctIndex: 1,
    explanation:
      "Gardner kritisiert das klassische Ein-Faktor-Modell und postuliert mehrere eigenständige Intelligenzarten.",
    difficulty: "mittel",
  },
  {
    id: "ps-18",
    subject: "psychologie",
    topic: "Stresspsychologie",
    question: "Was besagt Lazarus' 'transaktionales Stressmodell'?",
    options: [
      "Stress entsteht rein objektiv aus der Situation, unabhängig von der Person",
      "Stress ergibt sich aus dem Wechselspiel zwischen einer Situation und ihrer subjektiven Bewertung (Primär- und Sekundärbewertung) durch die Person",
      "Stress kann nur durch Medikamente reduziert werden",
      "Stress tritt ausschließlich bei körperlicher Anstrengung auf",
    ],
    correctIndex: 1,
    explanation:
      "Lazarus betont, dass nicht die Situation allein, sondern deren kognitive Bewertung sowie die eingeschätzten eigenen Bewältigungsressourcen über Stresserleben entscheiden.",
    difficulty: "schwer",
  },
  {
    id: "ps-19",
    subject: "psychologie",
    topic: "Moralentwicklung",
    question: "Wer entwickelte ein bekanntes Stufenmodell der moralischen Entwicklung (präkonventionell, konventionell, postkonventionell)?",
    options: ["Jean Piaget", "Lawrence Kohlberg", "Erik Erikson", "John Bowlby"],
    correctIndex: 1,
    explanation:
      "Kohlberg beschreibt drei Hauptebenen mit je zwei Stufen, auf denen sich moralisches Urteilen im Laufe des Lebens entwickelt.",
    difficulty: "mittel",
  },
  {
    id: "ps-20",
    subject: "psychologie",
    topic: "Verstärkung",
    question: "Was bewirkt 'negative Verstärkung' im Sinne der operanten Konditionierung?",
    options: [
      "Sie bestraft ein Verhalten, sodass es seltener auftritt",
      "Sie erhöht die Auftretenswahrscheinlichkeit eines Verhaltens durch das Entfernen eines unangenehmen Reizes",
      "Sie ist identisch mit Bestrafung",
      "Sie hat keinerlei Effekt auf Verhalten",
    ],
    correctIndex: 1,
    explanation:
      "Negative Verstärkung verstärkt Verhalten, indem ein unangenehmer Reiz wegfällt (z.B. Kopfschmerztablette nehmen → Schmerz verschwindet → Verhalten wird häufiger gezeigt).",
    difficulty: "schwer",
  },
  {
    id: "ps-21",
    subject: "psychologie",
    topic: "Kognitive Dissonanz",
    question: "Was beschreibt Festingers Theorie der 'kognitiven Dissonanz'?",
    options: [
      "Ein angenehmer Zustand durch übereinstimmende Gedanken",
      "Ein unangenehmer Spannungszustand bei widersprüchlichen Kognitionen, den Menschen zu reduzieren versuchen",
      "Die Unfähigkeit, mehr als einen Gedanken gleichzeitig zu fassen",
      "Ein rein körperliches Phänomen ohne kognitive Beteiligung",
    ],
    correctIndex: 1,
    explanation:
      "Widersprechen sich Einstellung und Verhalten (z.B. Rauchen trotz Wissen um die Gefahr), entsteht Dissonanz, die z.B. durch Einstellungsänderung reduziert wird.",
    difficulty: "mittel",
  },
  {
    id: "ps-22",
    subject: "psychologie",
    topic: "Entwicklungspsychologie",
    question: "Was bezeichnet Erik Erikson mit der Krise 'Urvertrauen vs. Urmisstrauen'?",
    options: [
      "Die letzte Entwicklungsphase im hohen Alter",
      "Die erste psychosoziale Entwicklungsstufe im Säuglingsalter, in der Vertrauen zur Bezugsperson entsteht",
      "Eine Krise, die nur bei Jugendlichen auftritt",
      "Ein rein kognitives, nicht emotionales Konzept",
    ],
    correctIndex: 1,
    explanation:
      "In Eriksons erster Stufe (0-1 Jahr) entwickelt der Säugling je nach Fürsorgeerfahrung Urvertrauen oder Urmisstrauen gegenüber der Welt.",
    difficulty: "mittel",
  },
  {
    id: "ps-23",
    subject: "psychologie",
    topic: "Klinische Psychologie",
    question: "Worauf zielt die Kognitive Verhaltenstherapie (KVT) grundlegend ab?",
    options: [
      "Ausschließlich auf die Analyse frühkindlicher, unbewusster Konflikte",
      "Auf die Veränderung ungünstiger Gedankenmuster und Verhaltensweisen, die psychisches Leid aufrechterhalten",
      "Auf die medikamentöse Behandlung ohne Gesprächsanteil",
      "Auf reine Entspannungsübungen ohne kognitive Elemente",
    ],
    correctIndex: 1,
    explanation:
      "Die KVT verbindet kognitive Ansätze (Gedankenmuster erkennen/verändern) mit verhaltenstherapeutischen Techniken.",
    difficulty: "mittel",
  },
  {
    id: "ps-24",
    subject: "psychologie",
    topic: "Wahrnehmung",
    question: "Was ist 'selektive Aufmerksamkeit' (z.B. veranschaulicht durch den 'Cocktailparty-Effekt')?",
    options: [
      "Die Fähigkeit, alle Reize der Umgebung gleichzeitig gleich intensiv zu verarbeiten",
      "Die Fähigkeit, bestimmte Reize gezielt herauszufiltern und zu beachten, während andere ausgeblendet werden",
      "Ein Gedächtnisfehler beim Abrufen alter Erinnerungen",
      "Ein rein visuelles Phänomen ohne akustischen Bezug",
    ],
    correctIndex: 1,
    explanation:
      "Der Cocktailparty-Effekt zeigt, dass Menschen in lauter Umgebung gezielt einem Gespräch folgen können, während anderes ausgeblendet wird.",
    difficulty: "mittel",
  },
];
