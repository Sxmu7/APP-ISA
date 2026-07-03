import { Question } from "../types";

export const soziologieFragen: Question[] = [
  {
    id: "sz-1",
    subject: "soziologie",
    topic: "Max Weber",
    question: "Welche drei legitimen Herrschaftstypen unterscheidet Max Weber?",
    options: [
      "Traditionale, charismatische und legale Herrschaft",
      "Autoritäre, demokratische und anarchische Herrschaft",
      "Ökonomische, politische und religiöse Herrschaft",
      "Formelle, informelle und hybride Herrschaft",
    ],
    correctIndex: 0,
    explanation:
      "Weber unterscheidet traditionale (Herkommen), charismatische (Ausstrahlung einer Person) und legale Herrschaft (Regeln/Gesetze).",
    difficulty: "mittel",
  },
  {
    id: "sz-2",
    subject: "soziologie",
    topic: "Émile Durkheim",
    question: "Was versteht Durkheim unter 'Anomie'?",
    options: [
      "Einen Zustand normativer Regellosigkeit/Orientierungslosigkeit in der Gesellschaft",
      "Eine besonders starke soziale Kontrolle",
      "Die Arbeitsteilung in modernen Gesellschaften",
      "Eine Form der mechanischen Solidarität",
    ],
    correctIndex: 0,
    explanation:
      "Anomie bezeichnet bei Durkheim einen Zustand, in dem gesellschaftliche Normen ihre verbindliche Kraft verlieren.",
    difficulty: "mittel",
  },
  {
    id: "sz-3",
    subject: "soziologie",
    topic: "Émile Durkheim",
    question:
      "Welche Form der Solidarität ist laut Durkheim typisch für traditionale Gesellschaften mit geringer Arbeitsteilung?",
    options: [
      "Organische Solidarität",
      "Mechanische Solidarität",
      "Funktionale Solidarität",
      "Charismatische Solidarität",
    ],
    correctIndex: 1,
    explanation:
      "Mechanische Solidarität beruht auf Ähnlichkeit der Mitglieder; organische Solidarität entsteht erst durch Arbeitsteilung.",
    difficulty: "mittel",
  },
  {
    id: "sz-4",
    subject: "soziologie",
    topic: "Karl Marx",
    question: "Was bezeichnet Marx als 'Basis' einer Gesellschaft?",
    options: [
      "Das politische System",
      "Die Religion und Ideologie",
      "Die ökonomischen Produktionsverhältnisse",
      "Das Bildungssystem",
    ],
    correctIndex: 2,
    explanation:
      "Die ökonomische Basis (Produktionsverhältnisse) bestimmt laut Marx den ideologischen 'Überbau' (Recht, Politik, Kultur).",
    difficulty: "mittel",
  },
  {
    id: "sz-5",
    subject: "soziologie",
    topic: "Pierre Bourdieu",
    question: "Welche Kapitalarten unterscheidet Pierre Bourdieu NICHT?",
    options: ["Ökonomisches Kapital", "Kulturelles Kapital", "Soziales Kapital", "Digitales Kapital"],
    correctIndex: 3,
    explanation:
      "Bourdieu unterscheidet ökonomisches, kulturelles, soziales und symbolisches Kapital – 'digitales Kapital' ist kein Begriff von ihm.",
    difficulty: "mittel",
  },
  {
    id: "sz-6",
    subject: "soziologie",
    topic: "Pierre Bourdieu",
    question: "Was beschreibt der Begriff 'Habitus' bei Bourdieu?",
    options: [
      "Ein individuelles, bewusst gewähltes Konsumverhalten",
      "Verinnerlichte, klassentypische Denk-, Wahrnehmungs- und Handlungsmuster",
      "Die formale Struktur einer Organisation",
      "Ein gesetzlich verankertes Recht",
    ],
    correctIndex: 1,
    explanation:
      "Der Habitus umfasst dauerhafte, meist unbewusste Dispositionen, die durch die soziale Herkunft geprägt werden.",
    difficulty: "schwer",
  },
  {
    id: "sz-7",
    subject: "soziologie",
    topic: "Sozialisation",
    question: "Was versteht man unter 'primärer Sozialisation'?",
    options: [
      "Die Sozialisation am Arbeitsplatz",
      "Die früheste Sozialisation in Familie/engstem Umfeld eines Kindes",
      "Die Sozialisation durch Massenmedien",
      "Die Resozialisation nach einer Haftstrafe",
    ],
    correctIndex: 1,
    explanation:
      "Primäre Sozialisation findet in der frühen Kindheit, meist innerhalb der Familie, statt und prägt grundlegende Werte.",
    difficulty: "leicht",
  },
  {
    id: "sz-8",
    subject: "soziologie",
    topic: "Rolle & Status",
    question: "Was ist ein 'Rollenkonflikt'?",
    options: [
      "Eine Meinungsverschiedenheit zwischen zwei Personen",
      "Widersprüchliche Erwartungen, die an eine oder mehrere Rollen einer Person gestellt werden",
      "Der Verlust des sozialen Status",
      "Die Zuweisung eines neuen Status durch Geburt",
    ],
    correctIndex: 1,
    explanation:
      "Rollenkonflikte entstehen, wenn Erwartungen an eine Rolle (Intra-) oder mehrere Rollen (Inter-Rollenkonflikt) unvereinbar sind.",
    difficulty: "mittel",
  },
  {
    id: "sz-9",
    subject: "soziologie",
    topic: "Rolle & Status",
    question: "Was unterscheidet 'ascribed status' (zugeschriebenen Status) von 'achieved status' (erworbenem Status)?",
    options: [
      "Ascribed status wird erarbeitet, achieved status wird geboren",
      "Ascribed status ist unveränderlich, achieved status kann sich nie ändern",
      "Ascribed status wird durch Geburt/Zuschreibung erhalten, achieved status wird durch eigene Leistung erworben",
      "Es gibt keinen Unterschied",
    ],
    correctIndex: 2,
    explanation:
      "Zugeschriebener Status (z.B. Geschlecht, Herkunft) steht im Gegensatz zum erworbenen Status (z.B. Beruf, Bildungsabschluss).",
    difficulty: "mittel",
  },
  {
    id: "sz-10",
    subject: "soziologie",
    topic: "Ferdinand Tönnies",
    question: "Welches Begriffspaar geht auf Ferdinand Tönnies zurück?",
    options: [
      "Gemeinschaft und Gesellschaft",
      "Basis und Überbau",
      "Anomie und Solidarität",
      "Feld und Habitus",
    ],
    correctIndex: 0,
    explanation:
      "Tönnies unterschied 'Gemeinschaft' (persönliche, emotionale Bindungen) von 'Gesellschaft' (zweckrational, vertraglich).",
    difficulty: "leicht",
  },
  {
    id: "sz-11",
    subject: "soziologie",
    topic: "Erving Goffman",
    question: "Was meint Erving Goffman mit 'Impression Management'?",
    options: [
      "Die staatliche Kontrolle von Medien",
      "Die bewusste und unbewusste Selbstdarstellung von Personen in sozialen Situationen",
      "Die Verwaltung von Unternehmensimages durch PR-Agenturen",
      "Die Messung des Sozialprestiges",
    ],
    correctIndex: 1,
    explanation:
      "Goffman beschreibt soziale Interaktion als 'Theater', in dem Individuen einen bestimmten Eindruck von sich vermitteln (dramaturgischer Ansatz).",
    difficulty: "mittel",
  },
  {
    id: "sz-12",
    subject: "soziologie",
    topic: "Soziale Institutionen",
    question: "Was ist eine 'soziale Institution' im soziologischen Sinn?",
    options: [
      "Nur ein Gebäude wie eine Schule oder ein Gericht",
      "Ein auf Dauer angelegtes, normativ geregeltes Muster sozialen Handelns (z.B. Ehe, Schule)",
      "Eine spontane, einmalige Interaktion zwischen Fremden",
      "Ein rein biologisches Verhaltensmuster",
    ],
    correctIndex: 1,
    explanation:
      "Institutionen sind stabile, gesellschaftlich anerkannte Regelsysteme, die Verhalten in bestimmten Lebensbereichen ordnen.",
    difficulty: "leicht",
  },
  {
    id: "sz-13",
    subject: "soziologie",
    topic: "Norm & Wert",
    question: "Wie unterscheiden sich 'Normen' von 'Werten'?",
    options: [
      "Normen sind konkrete Verhaltensregeln, Werte sind allgemeine, abstrakte Vorstellungen des Wünschenswerten",
      "Werte sind gesetzlich fixiert, Normen nicht",
      "Normen gelten nur für Individuen, Werte nur für Institutionen",
      "Es gibt keinen Unterschied",
    ],
    correctIndex: 0,
    explanation:
      "Werte (z.B. 'Ehrlichkeit') sind übergeordnete Orientierungen, aus denen sich konkrete Normen ('nicht lügen') ableiten.",
    difficulty: "leicht",
  },
  {
    id: "sz-14",
    subject: "soziologie",
    topic: "Gruppen",
    question: "Was kennzeichnet eine 'Primärgruppe' laut Charles Cooley?",
    options: [
      "Große, anonyme Gruppen wie Nationen",
      "Kleine Gruppen mit engen, persönlichen und dauerhaften Beziehungen (z.B. Familie, enge Freunde)",
      "Zweckgebundene Zusammenschlüsse wie Vereine",
      "Zufällige Ansammlungen von Menschen im öffentlichen Raum",
    ],
    correctIndex: 1,
    explanation:
      "Primärgruppen sind durch face-to-face-Kontakt, emotionale Nähe und Dauerhaftigkeit geprägt – im Gegensatz zu Sekundärgruppen.",
    difficulty: "leicht",
  },
  {
    id: "sz-15",
    subject: "soziologie",
    topic: "Soziale Schichtung",
    question: "Was beschreibt der Begriff 'soziale Mobilität'?",
    options: [
      "Den Umzug einer Person in eine andere Stadt",
      "Den Wechsel der Position eines Individuums oder einer Gruppe innerhalb der sozialen Schichtung",
      "Die Geschwindigkeit gesellschaftlichen Wandels insgesamt",
      "Die physische Bewegungsfreiheit im Alltag",
    ],
    correctIndex: 1,
    explanation:
      "Soziale Mobilität kann vertikal (Auf-/Abstieg) oder horizontal (z.B. Berufswechsel gleichen Status) erfolgen.",
    difficulty: "leicht",
  },
  {
    id: "sz-16",
    subject: "soziologie",
    topic: "Talcott Parsons",
    question: "Wofür steht das AGIL-Schema von Talcott Parsons?",
    options: [
      "Adaptation, Goal Attainment, Integration, Latency (vier Funktionserfordernisse sozialer Systeme)",
      "Autorität, Gerechtigkeit, Individualität, Legitimität",
      "Anomie, Gemeinschaft, Institution, Legalität",
      "Aktion, Geschichte, Ideologie, Legitimation",
    ],
    correctIndex: 0,
    explanation:
      "Parsons' AGIL-Schema beschreibt vier Funktionen, die jedes soziale System erfüllen muss, um zu bestehen.",
    difficulty: "schwer",
  },
  {
    id: "sz-17",
    subject: "soziologie",
    topic: "Georg Simmel",
    question: "Womit beschäftigte sich Georg Simmel in seiner 'Formalen Soziologie' vor allem?",
    options: [
      "Mit ökonomischen Produktionsverhältnissen",
      "Mit den Formen sozialer Vergesellschaftung (z.B. Konflikt, Tausch, Mode) unabhängig vom Inhalt",
      "Mit dem Bildungssystem im Detail",
      "Ausschließlich mit Kriminalitätsstatistiken",
    ],
    correctIndex: 1,
    explanation:
      "Simmel interessierte sich für wiederkehrende Formen sozialer Wechselwirkung, unabhängig von deren konkretem Inhalt.",
    difficulty: "schwer",
  },
  {
    id: "sz-18",
    subject: "soziologie",
    topic: "Niklas Luhmann",
    question: "Was bedeutet 'Autopoiesis' in Luhmanns Systemtheorie?",
    options: [
      "Die Fähigkeit eines Systems, sich selbst aus eigenen Elementen zu erzeugen und zu erhalten",
      "Die automatische Steuerung durch den Staat",
      "Die Abschaffung sozialer Normen",
      "Die Verschmelzung mehrerer Teilsysteme zu einem",
    ],
    correctIndex: 0,
    explanation:
      "Autopoietische Systeme (z.B. das Rechtssystem) reproduzieren sich selbstreferenziell aus ihren eigenen Operationen.",
    difficulty: "schwer",
  },
  {
    id: "sz-19",
    subject: "soziologie",
    topic: "Soziale Kontrolle",
    question: "Was ist ein Beispiel für 'informelle soziale Kontrolle'?",
    options: [
      "Ein Gerichtsurteil",
      "Ein Bußgeldbescheid",
      "Missbilligende Blicke oder Klatsch in der Nachbarschaft",
      "Eine Gefängnisstrafe",
    ],
    correctIndex: 2,
    explanation:
      "Informelle Kontrolle erfolgt ohne kodifizierte Regeln, z.B. durch Missbilligung, Klatsch oder Ausgrenzung – im Gegensatz zu formeller Kontrolle durch Institutionen.",
    difficulty: "leicht",
  },
  {
    id: "sz-20",
    subject: "soziologie",
    topic: "Kultur",
    question: "Was bezeichnet man als 'Ethnozentrismus'?",
    options: [
      "Die neutrale, wertfreie Betrachtung fremder Kulturen",
      "Die Tendenz, die eigene Kultur als Maßstab zu nehmen und andere Kulturen danach zu bewerten",
      "Die vollständige Anpassung an eine fremde Kultur",
      "Ein Synonym für kulturelle Vielfalt",
    ],
    correctIndex: 1,
    explanation:
      "Ethnozentrismus bewertet fremde Kulturen aus der Perspektive und mit den Maßstäben der eigenen Kultur – Gegenbegriff: kultureller Relativismus.",
    difficulty: "mittel",
  },
  {
    id: "sz-21",
    subject: "soziologie",
    topic: "Sekundäre Sozialisation",
    question: "Welche Instanz zählt typischerweise zur 'sekundären Sozialisation'?",
    options: ["Die Herkunftsfamilie in den ersten Lebensjahren", "Schule, Peergroup und Arbeitsplatz", "Der genetische Bauplan", "Pränatale Einflüsse"],
    correctIndex: 1,
    explanation:
      "Sekundäre Sozialisation findet außerhalb der Familie statt, z.B. in Schule, Ausbildung, Beruf und Peergroups.",
    difficulty: "leicht",
  },
  {
    id: "sz-22",
    subject: "soziologie",
    topic: "Max Weber",
    question: "Was ist ein 'Idealtypus' nach Max Weber?",
    options: [
      "Ein in der Realität perfekt existierendes Vorbild",
      "Ein gedankliches, zugespitztes Analysewerkzeug zur Ordnung komplexer sozialer Wirklichkeit",
      "Eine statistische Durchschnittsperson",
      "Ein moralisches Ideal, dem man nacheifern soll",
    ],
    correctIndex: 1,
    explanation:
      "Der Idealtypus ist ein methodisches Konstrukt, das bestimmte Merkmale zugespitzt zusammenfasst, um soziale Phänomene vergleichbar zu machen.",
    difficulty: "schwer",
  },
  {
    id: "sz-23",
    subject: "soziologie",
    topic: "Devianz",
    question: "Was untersucht die Soziologie der Devianz?",
    options: [
      "Ausschließlich Straftaten im Strafgesetzbuch",
      "Abweichungen von gesellschaftlich geteilten Normen und deren soziale Bewertung",
      "Nur psychische Erkrankungen",
      "Die Struktur politischer Parteien",
    ],
    correctIndex: 1,
    explanation:
      "Devianz umfasst jedes Verhalten, das von den geltenden sozialen Normen einer Gruppe/Gesellschaft abweicht – nicht nur Kriminalität.",
    difficulty: "mittel",
  },
  {
    id: "sz-24",
    subject: "soziologie",
    topic: "Globalisierung",
    question: "Was beschreibt der Begriff 'Glokalisierung'?",
    options: [
      "Die vollständige Vereinheitlichung aller Kulturen weltweit",
      "Das gleichzeitige Wirken globaler und lokaler Einflüsse, wobei Globales lokal angepasst wird",
      "Den Rückzug von Staaten aus internationalen Beziehungen",
      "Eine rein ökonomische Kennzahl",
    ],
    correctIndex: 1,
    explanation:
      "Glokalisierung beschreibt, wie globale Trends und Produkte an lokale Gegebenheiten angepasst werden (z.B. lokale Speisekarten bei globalen Ketten).",
    difficulty: "mittel",
  },
];
