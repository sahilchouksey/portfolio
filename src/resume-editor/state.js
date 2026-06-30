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

const link = (url, label) => {
  if (!url) return label;
  const isMail = /^mailto:/i.test(url);
  const safeUrl = isMail ? url : url;
  return `[#link("${esc(safeUrl)}")[${esc(label || url)}]]`;
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
      if (!c.url) return `[${esc(c.label)}]`;
      return link(c.url, c.label);
    })
    .join(",\n    ");

const buildExp = (e) => `
#exp(
  role: ${block(e.role)},
  project: ${e.projectUrl ? link(e.projectUrl, e.project) : block(e.project)},
  date: ${block(e.date)},
  location: ${block(e.location)},
  summary: ${block(e.summary)},
  details: [
${(e.bullets || [])
  .filter((b) => !b.hidden && b.text)
  .map((b) => `    - ${b.text}`)
  .join("\n")}
  ]
)`.trim();

const buildEdu = (e) => `
#edu(
  institution: ${e.institutionUrl ? link(e.institutionUrl, e.institution) : block(e.institution)},
  date: ${block(e.date)},
  location: ${block(e.location)},
  gpa: ${block(e.gpa)},
  degrees: (
${(e.degrees || [])
  .filter((d) => !d.hidden && (d.title || d.field))
  .map((d) => `    (${block(d.title)}, ${block(d.field)}),`)
  .join("\n")}
  )
)`.trim();

const buildSkills = (areas) =>
  areas
    .filter((a) => !a.hidden)
    .map(
      (a) => `  (
    ${block(a.category)},
    (
${(a.items || [])
  .filter((i) => !i.hidden && i.label)
  .map((i) => `      [${i.label.replace(/\*/g, "")}],`)
  .join("\n")}
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
        ? `- #link("${esc(c.url)}")[*${(c.title || "").replace(/\*/g, "")}*] - ${esc(c.issuer || "")}`
        : `- *${(c.title || "").replace(/\*/g, "")}* - ${esc(c.issuer || "")}`,
    )
    .join("\n");

  const extras = (r.extras || [])
    .filter((s) => !s.hidden && s.title)
    .map(
      (s) => `\n= ${s.title}\n${(s.lines || [])
        .filter((l) => !l.hidden && l.text)
        .map((l) => `- ${l.text}`)
        .join("\n")}`,
    )
    .join("\n");

  return `#import "templates/resume.template.typ": *

#set text(size: ${block(r.meta?.textSize || "9pt")})

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