export const emptyResume = () => ({
  meta: {
    author: "",
    location: "",
    textSize: "9pt",
    hidden: false,
  },
  contacts: [],
  experience: [],
  projects: [],
  skills: [],
  education: [],
  certifications: [],
  extras: [],
});

const esc = (s) =>
  String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');

const escLabel = (s) =>
  String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/@/g, "\\@");

const link = (url, label) => {
  if (!url) return label;
  const isMail = /^mailto:/i.test(url);
  const safeUrl = isMail ? url : url;
  return `[#link("${esc(safeUrl)}")[${escLabel(label || url)}]]`;
};

const block = (content) => {
  if (content === undefined || content === null || content === "") return '""';
  const s = String(content).trim();
  if (s.startsWith("[") || s.startsWith("#")) return s;
  return `"${esc(s)}"`;
};

const joinContacts = (contacts) =>
  contacts
    .filter((c) => !c.hidden && (c.label || c.url))
    .map((c) => {
      if (!c.url) return `[${escLabel(c.label)}]`;
      return link(c.url, c.label);
    })
    .join(",\n    ");

const buildBullets = (text) => {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const normalized = line.startsWith("- ") ? line : `- ${line}`;
      return `    ${escLabel(normalized)}`;
    })
    .join("\n");
};

const buildExp = (e) => `
#exp(
  role: ${block(e.role)},
  project: ${e.projectUrl ? link(e.projectUrl, e.project) : block(e.project)},
  date: ${block(e.date)},
  location: ${block(e.location)},
  summary: ${block(e.summary)},
  details: [
${buildBullets(e.bulletsText)}
  ]
)`.trim();

const buildDegrees = (text) => {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, field] = line.split("|").map((s) => (s || "").trim());
      return `    (${block(title)}, ${block(field || "")}),`;
    })
    .join("\n");
};

const buildEdu = (e) => `
#edu(
  institution: ${e.institutionUrl ? link(e.institutionUrl, e.institution) : block(e.institution)},
  date: ${block(e.date)},
  location: ${block(e.location)},
  gpa: ${block(e.gpa)},
  degrees: (
${buildDegrees(e.degreesText)}
  )
)`.trim();

const buildSkillItems = (text) => {
  if (!text) return "";
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `      [${escLabel(s.replace(/\*/g, ""))}],`)
    .join("\n");
};

const buildSkills = (areas) =>
  areas
    .filter((a) => !a.hidden)
    .map(
      (a) => `  (
    ${block(a.category)},
    (
${buildSkillItems(a.itemsText)}
    ),
  ),`,
    )
    .join("\n");

export const serialize = (r) => {
  const contacts = joinContacts(r.contacts || []);
  const exps = (r.experience || []).filter((e) => !e.hidden).map(buildExp).join("\n\n");
  const edus = (r.education || []).filter((e) => !e.hidden).map(buildEdu).join("\n\n");
  const skills = buildSkills(r.skills || []);
  const certs = (r.certifications || [])
    .filter((c) => !c.hidden && (c.title || c.url))
    .map((c) =>
      c.url
        ? `- #link("${esc(c.url)}")[*${escLabel(c.title || "").replace(/\*/g, "")}*] - ${escLabel(c.issuer || "")}`
        : `- *${escLabel(c.title || "").replace(/\*/g, "")}* - ${escLabel(c.issuer || "")}`,
    )
    .join("\n");

  const extras = (r.extras || [])
    .filter((s) => !s.hidden && s.title)
    .map((s) => `\n= ${escLabel(s.title)}\n${buildBullets(s.linesText)}`)
    .join("\n");

  return `#import "templates/resume.template.typ": *

#set text(size: ${esc(r.meta?.textSize || "9pt")})

#show: resume.with(
  author: ${block(r.meta?.author)},
  location: ${block(r.meta?.location)},
  contacts: (
    ${contacts}
  ),
)

= Experience

${exps}

= Skills
#skills((
${skills}
))

= Education

${edus}

${
  certs
    ? `= Certifications
${certs}
`
    : ""
}${extras}
`;
};

export const seedFromCurrent = async () => {
  try {
    const res = await fetch("/resume-seed.json", { cache: "no-store" });
    if (!res.ok) throw new Error("no seed");
    return await res.json();
  } catch {
    return emptyResume();
  }
};