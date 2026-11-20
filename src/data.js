export const profile = {
  name: 'Sanjay S.',
  roles: ['Cybersecurity researcher', 'Security engineer'],
  location: 'Kerala, India',
  email: 'sankicju@gmail.com',
  intro: 'I work across offensive research and defensive engineering. I test assumptions, capture evidence, and make security findings clear enough to act on.',
  about: 'I am a cybersecurity undergraduate and hands-on security learner based in Kerala, India. My practice moves between system behavior, attack surfaces, evidence, and the craft of explaining technical work clearly.',
  education: 'B.Tech, Computer Science and Engineering · Cyber Security',
  institution: 'University College of Engineering, Thodupuzha · APJ Abdul Kalam Technological University',
  links: [
    { label: 'GitHub', url: 'https://github.com/samurai-io' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/rootsanjai' },
    { label: 'HackerOne', url: 'https://hackerone.com/sanjay-s' },
    { label: 'Hack The Box', url: 'https://app.hackthebox.com/profile/WHITEDECVIL' }
  ]
};

export const capabilities = [
  {
    number: '01',
    title: 'Offensive security',
    description: 'Structured, authorized testing and hands-on vulnerability research in lab environments.',
    focus: ['Penetration testing', 'Vulnerability assessment', 'Burp Suite', 'Nmap', 'Bug bounty research']
  },
  {
    number: '02',
    title: 'Defensive research',
    description: 'Investigating events through network traffic, endpoint evidence, and repeatable observations.',
    focus: ['Network defense', 'Wireshark', 'Digital forensics', 'Sysmon telemetry', 'Evidence handling']
  },
  {
    number: '03',
    title: 'Security engineering',
    description: 'Practical work across operating systems, identity, networking, and small useful tools.',
    focus: ['Linux', 'Active Directory labs', 'Python', 'Bash', 'WireGuard']
  },
  {
    number: '04',
    title: 'AI and security research',
    description: 'Exploring security automation that is scoped, testable, and supported by clear evidence.',
    focus: ['ARES concept', 'XBOW concept', 'Validation workflows', 'Automation', 'Research notes']
  }
];

export const studies = [
  {
    number: '01',
    id: 'ares',
    title: 'ARES',
    category: 'AI security · Red team · Blue team',
    status: 'Research concept · In development',
    image: '/assets/study-01-ares.webp',
    alt: 'Machined graphite validation instrument surrounding a smoked-glass evidence channel with a coral signal.',
    summary: 'An academic concept exploring how security findings can be supported by evidence and how defensive controls can be independently tested.',
    notes: 'ARES brings offensive testing and defensive validation into one controlled workflow. The current research direction explores policy-aware tool orchestration, evidence capture, risk scoring, independent verification, and defensive telemetry.',
    sequence: 'Detect · Reason · Validate · Prove · Defend · Retest',
    statusNote: 'Architecture and workflow concept in development. No production deployment or measured commercial detection results are claimed.',
    stack: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'Nmap', 'Suricata', 'Zeek']
  },
  {
    number: '02',
    id: 'xbow',
    title: 'XBOW',
    category: 'Security automation · Web application testing',
    status: 'Public repository · Prototype',
    image: '/assets/study-02-xbow.webp',
    alt: 'Angular 3D graphite mesh structure with a coral path crossing layered surfaces.',
    summary: 'A Python security-assessment project organized around modular scanning, vulnerability checks, and report generation.',
    notes: 'The public repository documents a command-line workflow, scanner modules, configurable vulnerability patterns, and report formats for structured web and network assessment.',
    sequence: 'Map · Inspect · Verify · Report',
    statusNote: 'Presented as a public research prototype. The portfolio does not claim production deployment or independently measured results.',
    verification: {
      command: 'python -m xbow --help',
      note: 'The repository README lists this as an installation check. The command has not been run for this portfolio.',
      readmeUrl: 'https://github.com/samurai-io/XBOW#installation',
      testsUrl: 'https://github.com/samurai-io/XBOW/tree/main/tests'
    },
    stack: ['Python', 'Click', 'Nmap', 'Scapy', 'Jinja2', 'pytest'],
    repoUrl: 'https://github.com/samurai-io/XBOW'
  },
  {
    number: '03',
    id: 'communityos',
    title: 'CommunityOS',
    category: 'Civic technology · Hackathon concept',
    status: 'Hackathon concept',
    image: '/assets/study-03-communityos.webp',
    alt: 'Miniature civic district connected by service paths around a coral location marker.',
    summary: 'A map-led platform concept connecting community needs with local problem solving, resource allocation, and volunteer coordination.',
    notes: 'Built for an AI for Smarter Communities hackathon, the prototype brings civic incident reporting and community resources into a shared location-aware interface.',
    sequence: 'Report · Locate · Coordinate · Resolve',
    statusNote: 'Proof of concept developed during a hackathon. The displayed 3D artwork is an illustration, not a screenshot of a deployed product.',
    stack: ['React', 'Vite', 'Node.js', 'Express', 'JWT', 'React Leaflet']
  },
  {
    number: '04',
    id: 'labnotes',
    title: 'Security research',
    category: 'Practice archive · Lab casework',
    status: 'Ongoing practice',
    image: '/assets/study-04-lab-notes.webp',
    alt: 'Open graphite field journal with raised research traces and a coral evidence tab.',
    summary: 'A documented archive of practical exercises across Active Directory, web application vulnerabilities, privilege escalation, and network defense.',
    notes: 'The lab practice spans Hack The Box, TryHackMe, and custom virtual machines. Notes focus on reproducible methodology, observed evidence, root cause, and defensive follow-up.',
    sequence: 'Enumerate · Verify · Record · Review telemetry',
    statusNote: 'Continuous hands-on learning. The archive is practice work, not a claim of client engagements.',
    stack: ['Hack The Box', 'TryHackMe', 'Burp Suite', 'BloodHound', 'Metasploit', 'Wireshark']
  },
  {
    number: '05',
    id: 'sentinel-x',
    title: 'Sentinel-X',
    category: 'Network defense · C17 firewall prototype',
    status: 'Public repository · Prototype',
    image: '/assets/study-05-sentinel-x.webp',
    alt: 'Machined graphite packet-inspection gate with a smoked-glass channel and a fine coral signal line.',
    summary: 'A C17 network-defense prototype exploring stateful filtering, packet inspection, rate limiting, and layered response.',
    notes: 'The repository describes a multi-layer firewall architecture spanning packet filtering, traffic inspection, web filtering, intrusion detection, and trust scoring.',
    sequence: 'Filter · Inspect · Score · Respond · Record',
    statusNote: 'Research prototype from a public repository. Its behavior is not independently validated here and is not presented as production-tested infrastructure.',
    stack: ['C17', 'CMake', 'POSIX threads', 'Docker', 'Packet filtering', 'IDS / IPS'],
    repoUrl: 'https://github.com/samurai-io/sentinel-x'
  },
  {
    number: '06',
    id: 'rogot',
    title: 'ROGOT',
    category: 'AI security · Prompt injection',
    status: 'Public repository · Prototype',
    image: '/assets/study-06-rogot.webp',
    alt: 'A machined graphite gateway shielding a glass AI core from incoming coral signal strands.',
    summary: 'An AI security prototype for screening prompt injection, jailbreak patterns, exposed secrets, and sensitive data before requests reach a model.',
    notes: 'The repository outlines a mobile and backend workflow combining local input checks, threat analysis, live monitoring, and audit events. This card describes the published project scope rather than claiming production deployment.',
    sequence: 'Inspect · Classify · Protect · Record',
    statusNote: 'Public GitHub prototype. Features and architecture are described in the repository; independent validation is not claimed here.',
    stack: ['TypeScript', 'Express', 'WebSockets', 'React Native', 'SQLite'],
    repoUrl: 'https://github.com/samurai-io/ROGOT'
  },
  {
    number: '07',
    id: 'saas',
    title: 'SaaS Cyber Sentinel',
    category: 'Endpoint defense · Network telemetry',
    status: 'Public repository · Prototype',
    image: '/assets/study-07-saas-cyber-sentinel.webp',
    alt: 'A graphite security instrument joining endpoint, network, and event-recording modules with coral conduits.',
    summary: 'A self-hosted security platform concept combining endpoint telemetry, file-integrity monitoring, network inspection, encrypted audit records, and a dashboard.',
    notes: 'The repository describes a C23 daemon with packet capture and audit storage, paired with a Flutter interface. It is presented as a public prototype, without production or performance claims.',
    sequence: 'Collect · Inspect · Correlate · Report',
    statusNote: 'Public repository. Implementation and performance have not been independently validated for this portfolio.',
    stack: ['C23', 'libpcap', 'SQLite', 'OpenSSL', 'Flutter'],
    repoUrl: 'https://github.com/samurai-io/SaaS'
  },
  {
    number: '08',
    id: 'self-vpn',
    title: 'Self-VPN',
    category: 'WireGuard · Private networking',
    status: 'Public repository · Setup script',
    image: '/assets/study-08-self-vpn.webp',
    alt: 'A private graphite server and client linked by a transparent, sculpted network tunnel.',
    summary: 'A shell-based setup project for deploying a self-hosted WireGuard server and generating ready-to-use client configurations.',
    notes: 'The repository describes server setup, forwarding rules, systemd integration, and client configuration generation. The card presents this as a setup-script project rather than a deployed VPN service.',
    sequence: 'Provision · Configure · Connect · Verify',
    statusNote: 'Public setup-script project. No live server or production deployment is claimed.',
    stack: ['Shell', 'WireGuard', 'systemd', 'Linux networking'],
    repoUrl: 'https://github.com/samurai-io/wireduard'
  },
  {
    number: '09',
    id: 'skoobie',
    title: 'Skoobie Pro',
    category: 'Wireless security · Authorized auditing',
    status: 'Public repository · Prototype',
    image: '/assets/study-09-skoobie.webp',
    alt: 'A graphite wireless field scanner mapping concentric signal planes around an access point.',
    summary: 'A Python Wi-Fi audit tool for passive discovery and security-posture checks across encryption and WPS, with structured report output.',
    notes: 'The repository describes interface discovery, monitor-mode controls, passive scanning, and JSON or HTML reporting. It requires explicit authorization and is designed without password-cracking or exploitation features.',
    sequence: 'Discover · Assess · Document · Report',
    statusNote: 'Use only on networks you own or have written permission to assess.',
    stack: ['Python', 'Aircrack-ng', 'Rich', 'Jinja2'],
    repoUrl: 'https://github.com/samurai-io/Skoobie'
  }
];

export const experience = [
  { date: '2025', role: 'Cybersecurity Intern', organization: 'Kerala Police Cyber Cell' },
  { date: '2026', role: 'Cybersecurity Intern', organization: 'CC Cyber Campus' }
];

export const principles = [
  { number: '01', title: 'Think like an attacker.', body: 'Understand how a system can fail before deciding what evidence matters.' },
  { number: '02', title: 'Build like an engineer.', body: 'Turn research into careful workflows, useful tools, and repeatable findings.' },
  { number: '03', title: 'Defend with evidence.', body: 'Test assumptions and controls with results that can be inspected and explained.' }
];

export const toolkit = [
  { label: 'Research methods', items: ['Penetration testing', 'Vulnerability assessment', 'Active Directory', 'Digital forensics', 'Network defense'] },
  { label: 'Security tools', items: ['Kali Linux', 'Burp Suite', 'Nmap', 'Wireshark', 'BloodHound', 'Impacket', 'Metasploit'] },
  { label: 'Engineering', items: ['Python', 'JavaScript', 'React', 'Node.js', 'Bash', 'Git', 'WireGuard'] }
];
