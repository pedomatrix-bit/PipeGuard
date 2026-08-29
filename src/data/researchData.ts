import { ResearchTest, RoadmapStep } from '../types';

export const SYSTEM_INFO = {
  name: 'PIPEGUARD',
  tagline: 'Low-Cost External Water-Pipe Leak Detection & Localization System',
  program: 'INSPIRE-MANAK Innovation Project',
  heroSubtitle: 'Detect hidden water-pipe leaks before they become major losses.',
  heroDescription: 'PipeGuard is a proposed low-cost external monitoring system that studies changes in the vibration behaviour of pressurized water pipes to identify possible hidden leakage.',
  coreApproach: 'Listen to the pipe from the outside.',
};

export const PROBLEM_CARDS = [
  {
    number: '01',
    title: 'Hidden',
    subtitle: 'Concealed Infrastructure',
    description: 'Underground and within-wall leakage is completely invisible from the surface, evading visual inspections for weeks or months.',
    icon: 'EyeOff',
    impact: 'Up to 30-40% treated water lost before detection',
  },
  {
    number: '02',
    title: 'Continuous loss',
    subtitle: 'Silent Resource Depletion',
    description: 'A small hairline leak can continue 24/7 while remaining unnoticed, quietly wasting thousands of liters of clean water and eroding soil.',
    icon: 'Droplets',
    impact: 'Millions of liters wasted per pipeline network yearly',
  },
  {
    number: '03',
    title: 'Difficult inspection',
    subtitle: 'High Labor & Invasiveness',
    description: 'Finding the exact affected pipe section traditionally requires expensive acoustic probes, excessive labor, and destructive ground excavation.',
    icon: 'Shovel',
    impact: 'High municipal cost & lengthy service interruptions',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'PIPE',
    subtitle: 'Pressurized water medium',
    description: 'Pressurized water flowing through a closed conduit produces a characteristic laminar or baseline operating behaviour.',
    badge: 'Fluid Dynamics',
  },
  {
    step: '02',
    title: 'VIBRATION',
    subtitle: 'Acoustic signature alteration',
    description: 'When an orifice or leak develops, localized pressure drops and fluid turbulence generate distinct mechanical vibrations.',
    badge: 'Acoustic Emission',
  },
  {
    step: '03',
    title: 'MECHANICAL COLLECTOR',
    subtitle: 'Acoustic wave transfer',
    description: 'A custom external clamp and acoustic waveguide transfer high-frequency pipe-wall oscillations cleanly to the sensor module.',
    badge: 'Acoustic Coupling',
  },
  {
    step: '04',
    title: 'SENSOR',
    subtitle: 'Non-invasive transducer',
    description: 'The vibration signal is measured externally via high-sensitivity piezoelectric/accelerometer transducers without puncturing the pipe.',
    badge: 'Piezo Transduction',
  },
  {
    step: '05',
    title: 'SIGNAL ANALYSIS',
    subtitle: 'Dynamic baseline comparison',
    description: 'Microcontroller firmware extracts RMS amplitude, frequency peaks, and computes relative deviations against the pipe baseline.',
    badge: 'DSP & Filtering',
  },
  {
    step: '06',
    title: 'LEAK WARNING',
    subtitle: 'Persistent anomaly alert',
    description: 'A persistent abnormal vibration pattern triggers immediate visual warnings and pinpoints the probable leak zone between sensors.',
    badge: 'Localization Alert',
  },
];

export const INNOVATION_PILLARS = [
  {
    icon: 'Puzzle',
    title: 'External',
    subtitle: 'Non-Invasive Architecture',
    description: 'Designed to clamp directly onto existing pipes without cutting, drilling, shutting off municipal supply, or contacting water.',
    benefit: 'Zero installation downtime & zero water contamination risk.',
  },
  {
    icon: 'TrendingUp',
    title: 'Adaptive',
    subtitle: 'Dynamic Baseline Learning',
    description: "Compares current behaviour with the pipe's learned baseline instead of relying only on one fragile, fixed threshold that causes false alarms.",
    benefit: 'Resilient to natural variations in municipal pump cycles and water pressure.',
  },
  {
    icon: 'MapPin',
    title: 'Localizable',
    subtitle: 'Multi-Node Section Triangulation',
    description: 'Multiple PipeGuard units distributed along the pipeline correlate acoustic intensity and time-of-flight to narrow the exact suspected leakage section.',
    benefit: 'Pinpoints excavation target to within meters, drastically lowering repair costs.',
  },
];

export const RESEARCH_OVERVIEW = {
  question: 'Can a low-cost external sensing system detect persistent changes associated with water-pipe leakage?',
  hypothesis: 'A persistent leak will produce a measurable, identifiable change in the pipe\'s vibration signature that differs characteristically from steady-state laminar flow and transient external disturbances.',
  experimentSummary: 'Compare baseline normal flow, controlled micro-leaks, macro-leaks, and transient mechanical disturbances on a calibrated experimental pipeline loop.',
  currentStage: 'Prototype / Experimental Testing Phase',
};

export const RESEARCH_VARIABLES = {
  independent: [
    { name: 'Leak Condition & Size', description: 'No leak (closed), 1mm micro-orifice, 3mm standard orifice, 5mm macro-orifice' },
    { name: 'Flow & Pressure State', description: 'Static pressure (0.5 - 2.5 bar), continuous flow (5 - 30 L/min), pump cycling' },
  ],
  measured: [
    { name: 'Vibration Signal Intensity', description: 'Peak-to-peak amplitude (arbitrary signal units / mV from piezo)' },
    { name: 'RMS Acceleration / Energy', description: 'Root mean square amplitude over sliding 500ms time windows' },
    { name: 'Frequency Characteristics', description: 'Spectral peak distribution (100 Hz – 2.5 kHz range)' },
    { name: 'Time Persistence', description: 'Duration of elevated vibration (distinguishing transient bump vs continuous leak)' },
  ],
  controlled: [
    { name: 'Pipe Material & Diameter', description: 'Standard Schedule 40 PVC and Galvanized Iron (25mm / 1 inch internal diameter)' },
    { name: 'Pipe Length & Span', description: '4.0-meter linear test segment with fixed support clamping brackets' },
    { name: 'Sensor Position & Coupling', description: 'Fixed distance intervals (PG-01 at 0.5m, PG-02 at 1.5m, PG-03 at 2.5m, PG-04 at 3.5m) with calibrated silicone acoustic gel coupling' },
    { name: 'Ambient Temperature', description: 'Controlled indoor laboratory conditions (22°C ± 2°C)' },
  ],
};

export const RESEARCH_TESTS: ResearchTest[] = [
  {
    id: 'TEST-01',
    title: 'Test 01 — Normal Steady Flow',
    tag: 'Baseline Calibration',
    description: 'Measure the baseline vibration profile of uninterrupted water flow at regular operating pressure (1.5 bar) with no valve leakage.',
    expectedPattern: 'Low amplitude, stable Gaussian noise distribution centered at ~38–42 units.',
    flowRate: '15.0 L/min',
    leakSize: '0.0 mm (None)',
    testStatus: 'completed',
  },
  {
    id: 'TEST-02',
    title: 'Test 02 — Small Controlled Leak',
    tag: 'Micro-Leak Detection',
    description: 'Introduce a calibrated 1.0mm orifice leak between PG-02 and PG-03 to study early acoustic turbulence generation.',
    expectedPattern: 'Moderate continuous elevation in RMS vibration (+18 to +25 units) localized nearest to the orifice.',
    flowRate: '14.2 L/min',
    leakSize: '1.0 mm Orifice',
    testStatus: 'ongoing',
  },
  {
    id: 'TEST-03',
    title: 'Test 03 — Larger Controlled Leak',
    tag: 'Macro-Rupture Simulation',
    description: 'Open a 3.5mm bypass valve to evaluate sensor saturation limits, rapid pressure drop correlation, and multi-sensor gradient.',
    expectedPattern: 'High amplitude continuous acoustic emission (+40 to +65 units above baseline) with noticeable propagation across neighboring sensors.',
    flowRate: '11.8 L/min',
    leakSize: '3.5 mm Orifice',
    testStatus: 'ongoing',
  },
  {
    id: 'TEST-04',
    title: 'Test 04 — External Disturbance',
    tag: 'False Alarm Rejection',
    description: 'Apply temporary external mechanical taps, footsteps, and motor vibrations near the pipe exterior to test transient filtering.',
    expectedPattern: 'High amplitude spikes that decay within <800ms, successfully rejected by time-persistence filter algorithm.',
    flowRate: '15.0 L/min',
    leakSize: '0.0 mm (External Tap)',
    testStatus: 'completed',
  },
  {
    id: 'TEST-05',
    title: 'Test 05 — Variable Flow Conditions',
    tag: 'Pressure Dynamic Study',
    description: 'Vary flow velocity through step increments (5 to 25 L/min) to establish dynamic baseline tracking curves.',
    expectedPattern: 'Smooth monotonic baseline shift without triggering false positive leak warnings.',
    flowRate: 'Variable 5–25 L/min',
    leakSize: '0.0 mm / Controlled',
    testStatus: 'scheduled',
  },
];

export const ROADMAP_STEPS: RoadmapStep[] = [
  {
    step: '01',
    title: 'Prototype',
    summary: 'First-generation external unit',
    description: 'Build and bench-test the first functional PipeGuard single-node prototype with high-sensitivity piezoelectric contact sensor and analog filtering.',
    milestone: 'Functional physical prototype on test bench',
    status: 'current',
    iconName: 'Cpu',
  },
  {
    step: '02',
    title: 'Improve',
    summary: 'Acoustic mechanical collector optimization',
    description: 'Refine the mechanical clamping geometry and impedance-matching silicone acoustic coupler to maximize signal-to-noise ratio from PVC and metal pipe walls.',
    milestone: '3.2x enhancement in acoustic transmission efficiency',
    status: 'current',
    iconName: 'Wrench',
  },
  {
    step: '03',
    title: 'Validate',
    summary: 'Controlled leak & disturbance benchmark',
    description: 'Conduct comprehensive experimental matrix across multiple leak orifice diameters, water flow velocities, and ambient structural vibrations.',
    milestone: 'Statistical validation of false alarm rejection algorithm',
    status: 'next',
    iconName: 'CheckCircle2',
  },
  {
    step: '04',
    title: 'Localize',
    summary: 'Multi-node differential triangulation',
    description: 'Deploy a synchronous multi-node array (PG-01 to PG-04) to localize leak coordinates based on spatial signal attenuation and differential amplitude gradients.',
    milestone: 'Localization accuracy within ±0.5 meter in laboratory span',
    status: 'next',
    iconName: 'Crosshair',
  },
  {
    step: '05',
    title: 'Network',
    summary: 'Low-power wireless telemetry mesh',
    description: 'Integrate low-power LoRa / ESP-NOW wireless telemetry for battery-operated distributed sensors along long municipal segments.',
    milestone: 'Long-range low-power field communications mesh',
    status: 'future',
    iconName: 'Radio',
  },
  {
    step: '06',
    title: 'Field Study',
    summary: 'Real-world utility infrastructure deployment',
    description: 'Evaluate the PipeGuard system on buried municipal feeder lines and school water distribution piping under variable weather and usage conditions.',
    milestone: 'Pilot deployment in active utility infrastructure',
    status: 'future',
    iconName: 'Building2',
  },
];

export const TEAM_MEMBERS = [
  {
    name: 'Affan Adil',
    role: 'Student Researcher & Innovator',
    badge: 'Lead Innovator',
    program: 'INSPIRE-MANAK Project Lead',
    bio: 'Innovator focused on water conservation, low-cost sensing, embedded systems, and practical municipal infrastructure monitoring.',
    avatarInitials: 'AA',
    image: '/photo.jpg',
    focus: 'System design, sensor acoustic coupling, firmware algorithm, and experimental testing.',
  },
  {
    name: 'Project Guide & Mentor',
    role: 'Academic & Technical Mentor',
    badge: 'Faculty Guide',
    program: 'Science & Innovation Mentorship',
    bio: 'Guiding experimental methodology, verification protocols, fluid mechanics principles, and INSPIRE-MANAK documentation.',
    avatarInitials: 'PG',
    focus: 'Scientific review, safety verification, and laboratory loop setup.',
  },
  {
    name: 'Academic Institution',
    role: 'Research & Fabrication Host',
    badge: 'Partner Lab',
    program: 'INSPIRE-MANAK Innovation Center',
    bio: 'Providing laboratory facilities, instrumentation support, calibration test rig, and platform for student innovation.',
    avatarInitials: 'AI',
    focus: 'Experimental test rig infrastructure and prototype workshop.',
  },
];

export const PROJECT_MOTIVATION = {
  quote: 'Noticing that hidden infrastructure problems can waste massive vital resources even when the problem is completely invisible on the surface.',
  paragraphs: [
    'Clean water is one of our most precious shared resources. In urban distribution networks worldwide, an estimated 30% or more of treated drinking water is lost to underground leaks before it ever reaches a tap. Most leaks begin as hairline fissures that stay hidden beneath roads, sidewalks, and building foundations for months.',
    'Conventional utility inspection methods depend on cumbersome manual listening sticks, periodic correlation sweeps, or costly intrusive sensors that require pipeline shutdowns and pipe penetration.',
    'PipeGuard was conceived to provide a practical, non-destructive, and affordable alternative: an external clamp-on unit that learns the acoustic heartbeat of the pipe and alerts caretakers the moment an abnormal turbulent pattern appears.',
  ],
};
