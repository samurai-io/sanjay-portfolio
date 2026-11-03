import React,{useEffect,useRef,useState,useMemo} from "react";
import{createRoot}from"react-dom/client";
import{BrowserRouter,Routes,Route,NavLink,Link,useParams,useLocation}from"react-router-dom";
import{motion,useInView,AnimatePresence}from"framer-motion";
import{Canvas,useFrame}from"@react-three/fiber";
import * as THREE from "three";
import{ArrowUpRight,ArrowDown,ArrowLeft,Shield,Terminal,Video,Github,Linkedin,Menu,X,Fingerprint,Code2,Mail,ExternalLink,Layers,Globe,Lock,Activity}from"lucide-react";
import"./styles.css";
const TOTAL=598,PRELOAD=5,CACHE_LIMIT=8,MAX_CANVAS_WIDTH=3840,MAX_CANVAS_HEIGHT=2160,src=n=>`/frames/frame-${String(n).padStart(3,"0")}.jpg`;
function Reveal({children,className="",delay=0}){const ref=useRef(null),show=useInView(ref,{once:true,margin:"-60px"});return <motion.div ref={ref} className={className} initial={{opacity:0,y:28,filter:"blur(6px)"}} animate={show?{opacity:1,y:0,filter:"blur(0px)"}:{}} transition={{duration:.75,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>}
function Sequence(){
 const section=useRef(null),canvas=useRef(null),cache=useRef(new Map()),frameRef=useRef(1),raf=useRef(0),loadedRef=useRef(0);
 const[frame,setFrame]=useState(1),[loaded,setLoaded]=useState(0);
 const draw=(n)=>{
  const c=canvas.current,img=cache.current.get(n);
  if(!c||!img||!img.complete||!img.naturalWidth)return;
  const w=c.clientWidth,h=c.clientHeight;
  if(!w||!h)return;
  const pixelScale=Math.min(MAX_CANVAS_WIDTH/w,MAX_CANVAS_HEIGHT/h);
  const cw=Math.max(1,Math.round(w*pixelScale)),ch=Math.max(1,Math.round(h*pixelScale));
  if(c.width!==cw||c.height!==ch){c.width=cw;c.height=ch}
  const ctx=c.getContext("2d",{alpha:false});
  ctx.fillStyle="#080b0a";ctx.fillRect(0,0,cw,ch);
  // Preserve each native 4K frame's aspect ratio when fitting it to the canvas.
  const scale=Math.min(cw/img.naturalWidth,ch/img.naturalHeight);
  const dw=img.naturalWidth*scale,dh=img.naturalHeight*scale;
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
  ctx.drawImage(img,(cw-dw)/2,(ch-dh)/2,dw,dh);
 };
 const ensure=(n)=>{
  if(n<1||n>TOTAL||cache.current.has(n))return;
  const img=new Image();img.decoding="async";cache.current.set(n,img);
  img.onload=()=>{loadedRef.current++;setLoaded(loadedRef.current);if(frameRef.current===n)draw(n);};
  img.onerror=()=>{cache.current.delete(n)};
  img.src=src(n);
 };
 const trim=(center)=>{
  if(cache.current.size<=CACHE_LIMIT)return;
  const keys=[...cache.current.keys()].sort((a,b)=>Math.abs(b-center)-Math.abs(a-center));
  while(cache.current.size>CACHE_LIMIT){const k=keys.shift();if(k===center)continue;const im=cache.current.get(k);cache.current.delete(k);if(im&&im.parentNode===null)im.src="";}
 };
 useEffect(()=>{
  for(let i=1;i<=PRELOAD;i++)ensure(i);
  return()=>{for(const im of cache.current.values())im.src="";cache.current.clear()};
 },[]);
 useEffect(()=>{
  const update=()=>{
   const el=section.current;if(!el)return;
   const r=el.getBoundingClientRect(),span=el.offsetHeight-window.innerHeight;
   const p=Math.max(0,Math.min(1,-r.top/Math.max(1,span)));
   const n=1+Math.round(p*(TOTAL-1));
   if(n!==frameRef.current){frameRef.current=n;setFrame(n)}
   ensure(n);
   // Keep the 4K decode window small to limit peak memory use.
   for(let i=1;i<PRELOAD;i++)ensure(n+i);
   for(let i=1;i<=2;i++)ensure(n-i);
   trim(n);draw(n);
  };
  const scroll=()=>{if(raf.current)return;raf.current=requestAnimationFrame(()=>{update();raf.current=0})};
  window.addEventListener("scroll",scroll,{passive:true});window.addEventListener("resize",update);update();
  return()=>{window.removeEventListener("scroll",scroll);window.removeEventListener("resize",update);cancelAnimationFrame(raf.current)};
 },[]);
 const progress=(frame-1)/(TOTAL-1);
 const phase=progress<40/299?0:progress<88/299?1:progress<160/299?2:progress<250/299?3:4;
 const copy=[
  ["CHAPTER 01 — THE OBSERVER","Every story starts with a point of view.","I learned to notice the details before making a move."],
  ["CHAPTER 02 — THE FIRST STEP","The next frame is a new direction.","Stand up. Step forward. Make the idea real."],
  ["CHAPTER 03 — THE CREATOR","I turn curiosity into experiences.","A camera, a gimbal and a willingness to keep creating."],
  ["CHAPTER 04 — BEHIND THE FRAME","There is a system behind every story.","I experiment, build and shape ideas into something people can use."],
  ["CHAPTER 05 — THE SECURITY MIND","Look closer. Think deeper. Defend smarter.","From creating what people see to understanding what they don't."]
 ][phase];
 return <section className="sequence" id="story" ref={section}>
  <div className="sticky">
   <canvas ref={canvas} className="film" aria-label="Scroll-controlled 598-frame 4K sequence: seated introduction, standing, walking with a gimbal, editing-screen scene and cybersecurity transformation"/>
   <div className="shade"/>
   <div className="film-top mono"><span>● STORY SEQUENCE / 598 NATIVE 4K FRAMES</span><span>SANJAY S — 2026</span></div>
   <div className="film-copy" key={phase}>
    <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="eyebrow">{copy[0]}</motion.p>
    <motion.h2 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.08}}>{copy[1]}</motion.h2>
    <motion.p className="film-sub" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.18}}>{copy[2]}</motion.p>
   </div>
   <div className="film-bottom mono"><span>SCROLL TO CONTROL THE STORY <ArrowDown size={13}/></span><span>{String(frame).padStart(3,"0")} / {TOTAL}</span></div>
   <div className="bar"><i style={{width:`${progress*100}%`}}/></div>
   {loaded<PRELOAD&&<div className="loading mono">PREPARING 4K FRAMES {loaded} / {PRELOAD}</div>}
  </div>
 </section>
}
const projects=[
 {n:"01",name:"XBow",tag:"AI-ASSISTED WEB PENTESTING",desc:"An AI-assisted web application penetration-testing tool designed to help developers examine application security.",chips:["Python","AI","Web security"],icon:Shield,tone:"mint"},
 {n:"02",name:"Skoobie Pro",tag:"WI-FI SECURITY AUDITING",desc:"A Python-based ethical Wi-Fi security auditing tool for controlled assessment and learning.",chips:["Python","Wi-Fi","Security auditing"],icon:Activity,tone:"violet"},
 {n:"03",name:"Wireduard",tag:"SELF-HOSTED VPN AUTOMATION",desc:"A one-script WireGuard VPN server setup with ready-to-use client configurations.",chips:["Shell","WireGuard","Automation"],icon:Lock,tone:"blue"},
 {n:"04",name:"ROGOT",tag:"SECURITY UTILITY",desc:"A security-focused utility project built with TypeScript.",chips:["TypeScript","Security tooling"],icon:Terminal,tone:"orange"},
 {n:"05",name:"ARES X",tag:"RED & BLUE VALIDATION",desc:"An AI-assisted security validation platform concept combining controlled testing, evidence and defensive verification.",chips:["Python","FastAPI","Security validation"],icon:Fingerprint,tone:"mint"},
 {n:"06",name:"Visual stories",tag:"DIGITAL CREATIVITY",desc:"Short-form video, visual pacing and social-first editing — shaping raw footage into clear, engaging stories.",chips:["CapCut","Video editing","Storytelling"],icon:Video,tone:"violet"}
];
function Card({p,i}){const I=p.icon,ref=useRef(null);const move=e=>{const r=ref.current.getBoundingClientRect();ref.current.style.setProperty("--rx",`${-((e.clientY-r.top)/r.height-.5)*6}deg`);ref.current.style.setProperty("--ry",`${((e.clientX-r.left)/r.width-.5)*8}deg`)};const reset=()=>{ref.current.style.setProperty("--rx","0deg");ref.current.style.setProperty("--ry","0deg")};return <Reveal delay={i*.07}><article ref={ref} className={`project ${p.tone}`} onMouseMove={move} onMouseLeave={reset}><div className="project-top"><span>{p.n} / {p.tag}</span><I/></div><div className="art"><div className="ring"/><div className="ring second"/><div className="glyph"><I size={42}/></div></div><small>{p.tag}</small><h3>{p.name}</h3><p>{p.desc}</p><div className="chips">{p.chips.map(x=><span key={x}>{x}</span>)}</div><div className="project-foot">SELECTED EXPLORATION <ArrowUpRight size={16}/></div></article></Reveal>}

const projectDetails = {
 "xbow":{name:"XBow",tag:"AI-ASSISTED WEB APPLICATION PENETRATION TESTING",type:"Security tooling",year:"Ongoing",summary:"An AI-assisted web application penetration-testing tool for developers, built in Python.",role:"Independent tool development",stack:["Python","Web security","AI-assisted testing"],sections:[["Purpose","Help developers examine web application security with an AI-assisted testing workflow."],["Focus","Security testing, developer-oriented workflows and practical tooling."],["Status","Independent project; detailed public demo and verified repository links can be added when available."]]},
 "skoobie-pro":{name:"Skoobie / Skoobie Pro",tag:"ETHICAL WI-FI SECURITY AUDITING",type:"Security tooling",year:"Ongoing",summary:"A Python-based ethical Wi-Fi security auditing tool for authorized assessment and learning.",role:"Independent tool development",stack:["Python","Wi-Fi","Security auditing"],sections:[["Purpose","Explore Wi-Fi security auditing in controlled, authorized environments."],["Focus","Practical wireless security assessment and repeatable tooling."],["Scope","Use only on networks you own or have explicit permission to assess."]]},
 "wireduard":{name:"Wireduard",tag:"SELF-HOSTED WIREGUARD VPN AUTOMATION",type:"Infrastructure utility",year:"Ongoing",summary:"A one-script setup for a self-hosted WireGuard VPN server with ready-to-use client configurations.",role:"Independent tool development",stack:["Shell","WireGuard","Linux","Automation"],sections:[["Purpose","Reduce friction when deploying a personal WireGuard VPN server."],["Approach","Automate server setup and prepare client configurations for easier onboarding."],["Focus","Linux automation, repeatability and secure remote connectivity."]]},
 "rogot":{name:"ROGOT",tag:"SECURITY-FOCUSED UTILITY",type:"Developer utility",year:"Ongoing",summary:"A security-focused utility project developed with TypeScript.",role:"Independent tool development",stack:["TypeScript","Security tooling"],sections:[["Purpose","Build a focused utility for security-related workflows."],["Approach","Keep the implementation practical, modular and easy to use."],["Status","Further technical details can be added when a public project description is available."]]},
 "ares-x":{name:"ARES X",tag:"AUTONOMOUS RED & BLUE SECURITY INTELLIGENCE",type:"Cybersecurity platform",year:"2026",summary:"An AI-assisted security validation platform designed to move beyond scanner output: validate findings safely, collect evidence, assess risk and verify defensive controls.",role:"Concept, architecture & platform design",stack:["Python","FastAPI","React","PostgreSQL","Redis","Suricata","Zeek","Nmap","OWASP ZAP"],sections:[["The challenge","A scanner can report a possible weakness, but teams still need to understand whether it is real, what evidence supports it and whether their defenses can detect or stop the behavior."],["The approach","ARES X is designed around a controlled workflow: Detect → Reason → Validate → Prove → Defend → Retest. A policy layer governs test scope, while evidence and risk components make results reviewable."],["What it explores","Red-team validation, blue-team telemetry, evidence capture, confidence scoring, risk prioritization and repeatable defensive verification."]]},
 "communityos":{name:"CommunityOS",tag:"AI FOR SMARTER COMMUNITIES",type:"Community technology",year:"2026",summary:"A unified digital platform concept to help communities surface local problems, coordinate responses and connect residents with practical solutions.",role:"Product concept & full-stack development",stack:["React","Vite","React Router","Node.js","Express","JWT","React Leaflet"],sections:[["The challenge","Community information and service requests can be fragmented across channels, making it difficult to understand local needs and follow progress."],["The approach","CommunityOS brings discovery, reporting and coordination into one place, with a map-led interface and a modular web architecture."],["What it explores","Accessible workflows, location-aware interfaces, secure authentication and community-first product thinking."]]},
 "visual-stories":{name:"Visual stories",tag:"DIGITAL CREATIVITY",type:"Creative work",year:"Ongoing",summary:"Short-form video and visual experiments focused on pacing, composition and turning raw footage into a clear story.",role:"Editing & visual storytelling",stack:["CapCut","Editing","Composition","Storytelling"],sections:[["The intent","Make every cut, transition and frame support the story rather than distract from it."],["The process","Explore footage, find a visual rhythm, shape the sequence and refine the final edit for its intended audience."],["The focus","Clarity, timing, atmosphere and a strong visual point of view."]]},
 "lab-notes":{name:"Lab notes",tag:"SECURITY RESEARCH",type:"Research & experimentation",year:"Ongoing",summary:"A collection of hands-on security explorations across web testing, network security, Linux and defensive validation in controlled environments.",role:"Independent learning & experimentation",stack:["Burp Suite","Nmap","Linux","Active Directory","Wireshark","TryHackMe"],sections:[["The mindset","Treat every claim as a hypothesis. Build a reproducible test, observe the result and preserve the evidence."],["The environment","Practice takes place in authorized labs, CTFs and explicitly scoped environments."],["The focus","Reconnaissance, attack-surface understanding, defensive visibility and clear technical notes."]]}
};
function Orb({variant=0,pointer}){
 const group=useRef(), knot=useRef(), ring=useRef(), core=useRef();
 const cursor=useRef(new THREE.Vector2());
 useFrame((state,delta)=>{
  cursor.current.x=THREE.MathUtils.damp(cursor.current.x,pointer.current.x,4,delta);
  cursor.current.y=THREE.MathUtils.damp(cursor.current.y,pointer.current.y,4,delta);
  if(group.current){
   group.current.rotation.y=state.clock.elapsedTime*.12+cursor.current.x*.3;
   group.current.rotation.x=Math.sin(state.clock.elapsedTime*.22)*.12+cursor.current.y*.2;
   group.current.position.x=cursor.current.x*.12;
   group.current.position.y=cursor.current.y*.08;
  }
  if(knot.current){knot.current.rotation.x+=delta*.17;knot.current.rotation.z+=delta*.11}
  if(ring.current){ring.current.rotation.z-=delta*.08;ring.current.rotation.x=Math.sin(state.clock.elapsedTime*.3)*.12}
  if(core.current){core.current.rotation.y-=delta*.1}
 });
 const tint=variant===1?"#9d8cff":"#9af2cc";
 return <group ref={group} scale={variant===1?1.2:1}>
  <mesh ref={knot}><torusKnotGeometry args={[1.03,.018,220,12,2,5]}/><meshStandardMaterial color={tint} emissive={tint} emissiveIntensity={1.2} metalness={.7} roughness={.2}/></mesh>
  <mesh ref={ring} rotation={[1.1,.2,.3]}><torusGeometry args={[1.42,.008,8,180]}/><meshBasicMaterial color={tint} transparent opacity={.55}/></mesh>
  <mesh ref={core}><icosahedronGeometry args={[.72,2]}/><meshPhysicalMaterial color="#0c211a" roughness={.28} metalness={.65} wireframe transparent opacity={.72}/></mesh>
  {Array.from({length:18},(_,i)=><mesh key={i} position={[Math.sin(i*2.4)*1.8,Math.cos(i*1.7)*1.4,Math.sin(i*3.1)*.7]}><sphereGeometry args={[i%3===0?.025:.012,8,8]}/><meshBasicMaterial color={tint} transparent opacity={.7}/></mesh>)}
 </group>
}
function Scene3D({className="",variant=0}){
 const ref=useRef(null),pointer=useRef({x:0,y:0});
 useEffect(()=>{
  const move=e=>{
   const bounds=ref.current?.getBoundingClientRect();
   if(!bounds?.width||!bounds.height)return;
   if(e.clientX<bounds.left||e.clientX>bounds.right||e.clientY<bounds.top||e.clientY>bounds.bottom){reset();return}
   pointer.current.x=THREE.MathUtils.clamp(((e.clientX-bounds.left)/bounds.width-.5)*2,-1,1);
   pointer.current.y=THREE.MathUtils.clamp((.5-(e.clientY-bounds.top)/bounds.height)*2,-1,1);
  };
  const reset=()=>{pointer.current.x=0;pointer.current.y=0};
  const leave=e=>{if(!e.relatedTarget)reset()};
  window.addEventListener("pointermove",move,{passive:true});
  window.addEventListener("pointerout",leave);
  return()=>{window.removeEventListener("pointermove",move);window.removeEventListener("pointerout",leave)};
 },[]);
 return <div ref={ref} className={`scene3d ${className}`} aria-hidden="true"><Canvas dpr={[1,1.6]} camera={{position:[0,0,5.4],fov:42}} gl={{alpha:true,antialias:true}}><ambientLight intensity={.65}/><pointLight position={[3,3,4]} intensity={2} color="#9af2cc"/><pointLight position={[-3,-2,2]} intensity={1.2} color="#7d8dff"/><Orb variant={variant} pointer={pointer}/></Canvas></div>
}
function Header(){const[menu,setMenu]=useState(false);const links=[["HOME","/"],["ABOUT","/about"],["WORK","/work"],["CONTACT","/contact"]];return <><header className="header"><Link className="logo" to="/">SANJAY <span>S</span></Link><nav>{links.map(([a,b])=><NavLink end={b==="/"} to={b} key={a}>{a}</NavLink>)}</nav><Link className="contact-btn" to="/contact">LET'S TALK ↗</Link><button className="menu" aria-label="Toggle navigation" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>{menu&&<div className="mobile">{links.map(([a,b])=><NavLink end={b==="/"} to={b} onClick={()=>setMenu(false)} key={a}>{a} ↗</NavLink>)}</div>}</>}
function Footer(){return <footer><Link className="logo" to="/">SANJAY <span>S</span></Link><span>© {new Date().getFullYear()} SANJAY S — MADE WITH INTENTION.</span><a href="#top">BACK TO TOP ↑</a></footer>}
function PageFrame({children}){const location=useLocation();useEffect(()=>{window.scrollTo(0,0)},[location.pathname]);return <AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.35}}>{children}</motion.div></AnimatePresence>}
function Home(){
 return <><section className="hero hero3d" id="top"><div className="grid-bg"/><Scene3D className="hero-orb"/><div className="hero-content"><p className="status">● CYBERSECURITY RESEARCHER <b>×</b> DIGITAL CREATIVE <span>INDIA / WORLDWIDE</span></p><p className="eyebrow">THINK IN SYSTEMS. CREATE WITH INTENTION.</p><h1>BUILT TO<br/><em>EXPLORE.</em><br/>DRIVEN TO<br/>PROVE<span>.</span></h1><p className="hero-desc">I’m Sanjay — a cybersecurity researcher and digital creative. I investigate how systems behave, build ideas into experiences and turn curiosity into evidence.</p><div className="hero-actions"><Link className="enter" to="/work">EXPLORE MY WORK <ArrowUpRight size={15}/></Link><a className="text-link" href="#story">WATCH THE STORY <ArrowDown size={14}/></a></div></div><div className="hero-foot mono"><span>PORTFOLIO / 2026</span><span>CYBER × CREATIVE / INDIA</span></div><div className="hero-orbit-label mono">INTERACTIVE 3D / 01</div></section>
 <Sequence/>
 <section className="section about" id="about"><div className="meta"><span>01 / ABOUT</span><span>A DUAL-LENS APPROACH</span></div><div className="about-grid"><Reveal><p className="eyebrow">MORE THAN ONE DISCIPLINE</p><h2>Two paths.<br/><em>One curiosity.</em></h2><Scene3D className="about-orb" variant={1}/></Reveal><Reveal delay={.1} className="about-copy"><p className="lead">I’m Sanjay. I explore the space between technology and creativity — from understanding how systems work to shaping how people experience ideas.</p><p>The creative side taught me to think in frames, emotion and perspective. The security side taught me to think in systems, evidence and consequences. I bring both ways of thinking into the things I create.</p><p className="note">Different disciplines. The same instinct: stay curious, question assumptions and make the result better.</p><div className="tags"><span><Shield size={14}/> CYBERSECURITY</span><span><Video size={14}/> DIGITAL CREATIVE</span></div><Link className="inline-link" to="/about">MORE ABOUT ME <ArrowUpRight size={15}/></Link></Reveal></div></section>
 <section className="section work" id="work"><div className="meta"><span>02 / SELECTED WORK</span><span>IDEAS, BUILDS & EXPLORATIONS</span></div><div className="work-head"><Reveal><p className="eyebrow">THE WORK IS THE EVIDENCE</p><h2>Selected<br/><em>chapters.</em></h2></Reveal><p className="work-note">Security platforms, community technology, visual storytelling and practical research — built through curiosity and iteration.</p></div><div className="projects">{projects.map((p,i)=><ProjectCard key={p.n} p={p} i={i}/>)}</div><Link className="all-work" to="/work">VIEW ALL PROJECTS <ArrowUpRight size={16}/></Link></section>
 <section className="manifesto"><Reveal><p className="eyebrow">CHAPTER 05 — THE PRINCIPLE</p><h2>Curiosity starts<br/>the story.<br/><em>Proof moves it forward.</em></h2><p>Question the assumption. Test the edge case. Keep the evidence. Then shape the result into something useful.</p></Reveal></section>
 <ContactCTA/></>
}
function ProjectCard({p,i}){const I=p.icon;const slug={"XBow":"xbow","Skoobie Pro":"skoobie-pro","Wireduard":"wireduard","ROGOT":"rogot","ARES X":"ares-x","Visual stories":"visual-stories","CommunityOS":"communityos","Lab notes":"lab-notes"}[p.name]||"ares-x";const ref=useRef(null);const move=e=>{if(!ref.current)return;const r=ref.current.getBoundingClientRect();ref.current.style.setProperty("--rx",`${-((e.clientY-r.top)/r.height-.5)*6}deg`);ref.current.style.setProperty("--ry",`${((e.clientX-r.left)/r.width-.5)*8}deg`)};const reset=()=>{if(ref.current){ref.current.style.setProperty("--rx","0deg");ref.current.style.setProperty("--ry","0deg")}};return <Reveal delay={i*.07}><Link ref={ref} to={`/work/${slug}`} className={`project ${p.tone}`} onMouseMove={move} onMouseLeave={reset}><div className="project-top"><span>{p.n} / {p.tag}</span><I/></div><div className="art"><div className="ring"/><div className="ring second"/><div className="glyph"><I size={42}/></div></div><small>{p.tag}</small><h3>{p.name}</h3><p>{p.desc}</p><div className="chips">{p.chips.map(x=><span key={x}>{x}</span>)}</div><div className="project-foot">EXPLORE PROJECT <ArrowUpRight size={16}/></div></Link></Reveal>}
function Work(){return <main className="inner-page" id="top"><section className="inner-hero"><Scene3D className="inner-orb" variant={1}/><p className="eyebrow">02 / SELECTED WORK</p><h1>Ideas made<br/><em>tangible.</em></h1><p className="inner-lead">A growing collection of platforms, experiments and creative work. Each project is a chance to ask better questions and build a clearer answer.</p><div className="meta"><span>04 FEATURED PROJECTS</span><span>SECURITY / PRODUCT / CREATIVE</span></div></section><section className="section work"><div className="projects">{projects.map((p,i)=><ProjectCard key={p.n} p={p} i={i}/>)}</div></section></main>}
function ProjectPage(){const{slug}=useParams();const p=projectDetails[slug];if(!p)return <NotFound/>;return <main className="inner-page project-detail" id="top"><section className="inner-hero detail-hero"><Scene3D className="inner-orb" variant={slug==="communityos"?1:0}/><Link className="back-link" to="/work"><ArrowLeft size={14}/> BACK TO WORK</Link><p className="eyebrow">{p.tag}</p><h1>{p.name}<span>.</span></h1><p className="inner-lead">{p.summary}</p><div className="detail-meta"><div><small>TYPE</small><b>{p.type}</b></div><div><small>YEAR</small><b>{p.year}</b></div><div><small>ROLE</small><b>{p.role}</b></div></div></section><section className="detail-body"><div className="detail-stack"><p className="eyebrow">TOOLS & TECHNOLOGIES</p><div className="chips">{p.stack.map(s=><span key={s}>{s}</span>)}</div></div><div className="detail-content">{p.sections.map(([h,t],i)=><Reveal key={h}><article className="detail-section"><span className="mono">0{i+1} / {h.toUpperCase()}</span><h2>{h}</h2><p>{t}</p></article></Reveal>)}</div></section><div className="detail-next"><span>HAVE A QUESTION ABOUT THIS PROJECT?</span><Link to="/contact">LET’S TALK <ArrowUpRight size={16}/></Link></div></main>}
function About(){return <main className="inner-page" id="top"><section className="inner-hero about-hero"><Scene3D className="inner-orb"/><p className="eyebrow">01 / THE PERSON BEHIND THE WORK</p><h1>Curious by<br/><em>default.</em></h1><p className="inner-lead">I’m Sanjay S. — a cybersecurity researcher and digital creative interested in how things work, where they break and how to make them better.</p></section><section className="about-detail"><div><p className="eyebrow">THE TWO LENSES</p><h2>Understand the system.<br/><em>Shape the experience.</em></h2></div><div className="about-columns"><article><Shield/><h3>Cybersecurity</h3><p>Hands-on learning across web security, network analysis, Linux, Active Directory and defensive validation. My approach is evidence-led: test carefully, document clearly and respect scope.</p></article><article><Video/><h3>Digital creativity</h3><p>Visual storytelling, editing and creative experimentation. I care about pacing, composition and making an idea understandable at a glance.</p></article></div></section><section className="resume-experience"><div><p className="eyebrow">EXPERIENCE / FIELD NOTES</p><h2>Learning by<br/><em>doing.</em></h2></div><div className="timeline">
 <article><span>SEP 2025</span><div><h3>Cybersecurity Intern — Kerala Police Cyber Cell</h3><p>Assisted with cybercrime investigation casework and digital forensics under law-enforcement supervision; supported evidence handling and analysis workflows.</p></div></article>
 <article><span>JUN – JUL 2026</span><div><h3>Intern — CC Cyber Campus</h3><p>Practical exposure to cybersecurity concepts and hands-on training in a campus-based cyber lab environment.</p></div></article>
 <article><span>2021 — PRESENT</span><div><h3>Independent Penetration Tester — Hack The Box</h3><p>Hands-on practice across enumeration, exploitation and privilege escalation in vulnerable machines and labs.</p></div></article>
 <article><span>ONGOING</span><div><h3>Security Researcher — HackerOne</h3><p>Bug bounty hunting and web application vulnerability research through coordinated disclosure programs.</p></div></article>
 <article><span>ONGOING</span><div><h3>Independent Tool Developer</h3><p>Building custom security tools and AI-driven training systems for defense-oriented applications.</p></div></article>
 </div></section>
 <section className="resume-skills"><p className="eyebrow">TECHNICAL ARSENAL</p><h2>Tools of the<br/><em>trade.</em></h2><div className="skill-panels">
 {[[ "LANGUAGES & SYSTEMS","Python","Java","C","Bash","Linux","Git","GitHub"],["SECURITY TOOLING","Kali Linux","Burp Suite","Metasploit","Wireshark","Nmap","Gobuster","Nikto","sqlmap","Hydra","John the Ripper","Hashcat"],["ACTIVE DIRECTORY","BloodHound","Mimikatz","Rubeus","PowerView","Impacket","CrackMapExec","Responder","Evil-WinRM","PsExec","Kerbrute"],["CURRENTLY LEARNING","Cloud Security","DevSecOps","Reverse Engineering","Active Directory"]].map(([title,...items])=><article key={title}><h3>{title}</h3><div className="chips">{items.map(x=><span key={x}>{x}</span>)}</div></article>)}
 </div></section>
 <section className="resume-profiles"><p className="eyebrow">ELSEWHERE ON THE INTERNET</p><div><a href="https://github.com/samurai-io" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="https://linkedin.com/in/sanjay-s" target="_blank" rel="noreferrer">LINKEDIN ↗</a><a href="https://hackerone.com/sanjay-s" target="_blank" rel="noreferrer">HACKERONE ↗</a><a href="https://app.hackthebox.com/profile/WHITEDECVIL" target="_blank" rel="noreferrer">HACK THE BOX ↗</a></div></section>
 <section className="principles"><p className="eyebrow">WORKING PRINCIPLES</p><div className="principle-grid">{[["01","Stay curious","Keep learning; never assume the first answer is the right one."],["02","Prove the claim","Prefer reproducible tests and evidence over confident guesses."],["03","Build with intent","Make work useful, understandable and considered."]].map(x=><article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div></section></main>}
function ContactCTA(){return <section className="section contact" id="contact"><div className="meta"><span>CHAPTER 06 / WHAT’S NEXT</span><span>OPEN TO GOOD CONVERSATIONS</span></div><Reveal><p className="eyebrow">HAVE AN IDEA, A CHALLENGE OR A COLLABORATION?</p><h2>Let’s make<br/><em>something matter.</em></h2><p className="contact-copy">For security collaboration, creative projects or a thoughtful conversation — I’d be glad to hear from you.</p><a className="email" href="mailto:sankicju@gmail.com">SANKICJU@GMAIL.COM <ArrowUpRight size={18}/></a><div className="socials"><a href="https://github.com/samurai-io" target="_blank" rel="noreferrer"><Github size={15}/> GITHUB</a><a href="https://linkedin.com/in/sanjay-s" target="_blank" rel="noreferrer"><Linkedin size={15}/> LINKEDIN</a></div></Reveal><div className="contact-mark"><Fingerprint/> EVERY DETAIL LEAVES A TRACE.</div></section>}
function Contact(){return <main className="inner-page contact-page" id="top"><section className="inner-hero"><Scene3D className="inner-orb" variant={1}/><p className="eyebrow">03 / START A CONVERSATION</p><h1>What shall we<br/><em>build next?</em></h1><p className="inner-lead">Have a security challenge, a creative brief or an idea worth exploring? Send a note and let’s see where it leads.</p><a className="enter" href="mailto:sankicju@gmail.com"><Mail size={15}/> EMAIL SANJAY <ArrowUpRight size={15}/></a></section><ContactCTA/></main>}
function NotFound(){return <main className="inner-page inner-hero"><p className="eyebrow">404 / NOT FOUND</p><h1>Wrong<br/><em>coordinates.</em></h1><Link className="enter" to="/">RETURN HOME <ArrowUpRight size={15}/></Link></main>}
function App(){return <BrowserRouter><Header/><PageFrame><Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/work" element={<Work/>}/><Route path="/work/:slug" element={<ProjectPage/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes><Footer/></PageFrame></BrowserRouter>}
createRoot(document.getElementById("root")).render(<App/>);
