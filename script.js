/* =========
   Config
========= */
const EMAIL = "your@email.com"; // <-- TROQUE AQUI
const yearEl = document.getElementById("year");
const emailTextEl = document.getElementById("emailText");
const toastEl = document.getElementById("toast");

/* =========
   Data: Projects
   - Add/remove projects here
========= */
const projects = [
  {
    title: "Personal Portfolio Website",
    tags: ["Frontend", "HTML", "CSS", "JavaScript"],
    problem: "Needed a clean, fast online presence to attract international clients.",
    solution: "Built a responsive portfolio with a modern UI, filtering/search, and strong copywriting.",
    result: "A professional site that presents services and projects clearly, improving conversion.",
    links: [
      { label: "Live", href: "#" },      // coloque o link do GitHub Pages aqui
      { label: "Code", href: "#" }       // coloque o link do GitHub repo aqui
    ]
  },
  {
    title: "Business Automation (VBA + Reporting)",
    tags: ["Automation", "VBA", "Reporting"],
    problem: "Manual repetitive tasks caused delays and human errors in reporting.",
    solution: "Created VBA automations and structured reports to standardize and accelerate workflows.",
    result: "Reduced manual work and improved consistency in operational reporting.",
    links: [{ label: "Details", href: "#contact" }]
  },
  {
    title: "Backend APIs & Database Work",
    tags: ["Backend", "JavaScript", "PHP", "SQL"],
    problem: "Systems needed stable endpoints and reliable database operations.",
    solution: "Implemented clean APIs and database-driven features with predictable behavior.",
    result: "More stable systems with clearer integrations and fewer production issues.",
    links: [{ label: "Contact", href: "#contact" }]
  }
];

/* =========
   UI helpers
========= */
function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove("show"), 1800);
}

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    toast("Copied!");
  }catch{
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    toast("Copied!");
  }
}

/* =========
   Theme
========= */
function getSavedTheme(){
  try { return localStorage.getItem("theme"); } catch { return null; }
}
function setTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("theme", theme); } catch {}
  toast(theme === "light" ? "Light mode" : "Dark mode");
}
function toggleTheme(){
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
}

/* =========
   Mobile menu
========= */
const menuBtn = document.getElementById("menuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

function openMenu(){
  mobileMenu.classList.add("show");
  mobileMenu.setAttribute("aria-hidden", "false");
}
function closeMenu(){
  mobileMenu.classList.remove("show");
  mobileMenu.setAttribute("aria-hidden", "true");
}
menuBtn?.addEventListener("click", openMenu);
closeMenuBtn?.addEventListener("click", closeMenu);
mobileMenu?.addEventListener("click", (e) => {
  if (e.target === mobileMenu) closeMenu();
});
document.querySelectorAll(".mLink").forEach(a => {
  a.addEventListener("click", closeMenu);
});

/* =========
   Reveal on scroll
========= */
const revealEls = Array.from(document.querySelectorAll(".reveal"));
const io = new IntersectionObserver((entries) => {
  for (const entry of entries){
    if (entry.isIntersecting){
      entry.target.classList.add("visible");
      io.unobserve(entry.target);
    }
  }
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* =========
   Projects rendering + filters
========= */
const projectsGrid = document.getElementById("projectsGrid");
const filtersEl = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");

let activeTag = "All";
let searchTerm = "";

function getAllTags(){
  const set = new Set(["All"]);
  projects.forEach(p => p.tags.forEach(t => set.add(t)));
  return Array.from(set);
}

function renderFilters(){
  const tags = getAllTags();
  filtersEl.innerHTML = "";
  tags.forEach(tag => {
    const btn = document.createElement("button");
    btn.className = "filterBtn" + (tag === activeTag ? " active" : "");
    btn.type = "button";
    btn.textContent = tag;
    btn.addEventListener("click", () => {
      activeTag = tag;
      renderFilters();
      renderProjects();
    });
    filtersEl.appendChild(btn);
  });
}

function matchProject(p){
  const tagOk = activeTag === "All" || p.tags.includes(activeTag);
  const hay = (
    p.title + " " +
    p.tags.join(" ") + " " +
    p.problem + " " +
    p.solution + " " +
    p.result
  ).toLowerCase();
  const searchOk = !searchTerm || hay.includes(searchTerm);
  return tagOk && searchOk;
}

function renderProjects(){
  const filtered = projects.filter(matchProject);
  projectsGrid.innerHTML = "";

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "pCard reveal visible"; // visible to avoid re-animating
    card.innerHTML = `
      <div class="pTitle">${p.title}</div>
      <div class="pMeta">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="pLine"><span class="pStrong">Problem:</span> ${p.problem}</div>
      <div class="pLine"><span class="pStrong">Solution:</span> ${p.solution}</div>
      <div class="pLine"><span class="pStrong">Result:</span> ${p.result}</div>
      <div class="pActions">
        ${(p.links || []).map(l => `<a class="pLink" href="${l.href}" target="${l.href.startsWith("#") ? "_self" : "_blank"}" rel="noreferrer">${l.label}</a>`).join("")}
      </div>
    `;
    projectsGrid.appendChild(card);
  });

  if (filtered.length === 0){
    const empty = document.createElement("div");
    empty.className = "muted";
    empty.style.padding = "12px 2px";
    empty.textContent = "No projects found. Try another search or filter.";
    projectsGrid.appendChild(empty);
  }
}

searchInput?.addEventListener("input", (e) => {
  searchTerm = (e.target.value || "").trim().toLowerCase();
  renderProjects();
});

/* =========
   Contact: copy email + mailto
========= */
function syncEmail(){
  emailTextEl.textContent = EMAIL;
  const mailtoBtn = document.getElementById("mailtoBtn");
  if (mailtoBtn){
    mailtoBtn.href = `mailto:${encodeURIComponent(EMAIL)}?subject=Project%20Inquiry&body=Hi%20Vinicius%2C%0A%0AI%20need%20help%20with%3A%20...%0A%0ADeadline%3A%20...%0ABudget%3A%20...%0A%0AThanks!`;
  }
}

document.getElementById("copyEmailBtn")?.addEventListener("click", () => copyText(EMAIL));
document.getElementById("copyEmailBtn2")?.addEventListener("click", () => copyText(EMAIL));

/* =========
   Theme buttons
========= */
document.getElementById("themeBtn")?.addEventListener("click", toggleTheme);
document.getElementById("themeBtn2")?.addEventListener("click", toggleTheme);

/* =========
   Contact form generates email draft (local only)
========= */
const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const subject = `Project Inquiry from ${name || "Client"}`;
  const body =
`Hi Vinicius,

My name is ${name}.
My email: ${email}

Task:
${message}

Deadline:
Budget:

Links/specs:

Thanks!`;

  const mailto = `mailto:${encodeURIComponent(EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
});

/* =========
   Init
========= */
yearEl.textContent = String(new Date().getFullYear());
syncEmail();

const saved = getSavedTheme();
if (saved === "light" || saved === "dark") setTheme(saved);
else setTheme("dark");

renderFilters();
renderProjects();
