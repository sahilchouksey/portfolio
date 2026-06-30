import React, { useEffect, useMemo, useRef, useState } from "react";
import { serialize, seedFromCurrent } from "./state.js";

const uid = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

const move = (arr, from, to) => {
  const copy = arr.slice();
  const [it] = copy.splice(from, 1);
  copy.splice(to, 0, it);
  return copy;
};

const EyeIcon = ({ off }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {off ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

const Reorder = ({ onUp, onDown, upDisabled, downDisabled }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <button
      onClick={onUp}
      disabled={upDisabled}
      title="Move up"
      style={btn("mini", upDisabled)}
    >
      ▲
    </button>
    <button
      onClick={onDown}
      disabled={downDisabled}
      title="Move down"
      style={btn("mini", downDisabled)}
    >
      ▼
    </button>
  </div>
);

const btn = (kind, disabled = false) => {
  const base = {
    background: "transparent",
    border: "1px solid #2a2a2a",
    color: disabled ? "#555" : "#ddd",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: 4,
    fontFamily: "inherit",
    fontSize: 12,
    padding: "4px 8px",
    lineHeight: 1,
    transition: "all 0.15s",
  };
  if (kind === "mini")
    return { ...base, padding: "2px 6px", fontSize: 10, minWidth: 22 };
  if (kind === "primary")
    return {
      ...base,
      background: "#2563eb",
      border: "1px solid #2563eb",
      color: "#fff",
      padding: "8px 14px",
      fontSize: 13,
      fontWeight: 500,
    };
  if (kind === "danger")
    return { ...base, color: "#f87171", borderColor: "#3f1f1f" };
  return base;
};

const inputStyle = {
  width: "100%",
  background: "#0d0d0d",
  border: "1px solid #2a2a2a",
  borderRadius: 4,
  color: "#eee",
  padding: "6px 8px",
  fontFamily: "inherit",
  fontSize: 13,
  outline: "none",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 60,
  fontFamily: "ui-monospace, monospace",
  fontSize: 12,
};

const labelStyle = {
  fontSize: 11,
  color: "#888",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginBottom: 2,
  display: "block",
};

const cardStyle = (hidden) => ({
  background: "#111",
  border: "1px solid #222",
  borderRadius: 6,
  padding: 12,
  marginBottom: 8,
  opacity: hidden ? 0.4 : 1,
  transition: "opacity 0.2s",
});

const HeaderStrip = ({ title, count, onAdd, hidden, onToggleHidden }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 0 8px",
      borderBottom: "1px solid #1f1f1f",
      marginBottom: 8,
      position: "sticky",
      top: 0,
      background: "#0a0a0a",
      zIndex: 5,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#eee" }}>
        {title}
      </h3>
      <span style={{ fontSize: 11, color: "#666" }}>{count}</span>
    </div>
    <div style={{ display: "flex", gap: 6 }}>
      <button onClick={onToggleHidden} style={btn()} title="Toggle visibility">
        {hidden ? "Show all" : "Hide all"}
      </button>
      {onAdd && (
        <button onClick={onAdd} style={btn("primary")} title="Add new">
          + Add
        </button>
      )}
    </div>
  </div>
);

const ItemHeader = ({ title, hidden, onToggleHide, onRemove, reorder }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
      gap: 6,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
      {reorder}
      <strong style={{ fontSize: 12, color: "#ccc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {title || "(untitled)"}
      </strong>
    </div>
    <div style={{ display: "flex", gap: 4 }}>
      <button
        onClick={onToggleHide}
        style={btn("mini")}
        title={hidden ? "Show" : "Hide"}
      >
        <EyeIcon off={hidden} />
      </button>
      {onRemove && (
        <button onClick={onRemove} style={btn("mini", false)} title="Remove">
          ×
        </button>
      )}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 8 }}>
    {label && <label style={labelStyle}>{label}</label>}
    {children}
  </div>
);

const ContactEditor = ({ contacts, onChange }) => (
  <div>
    <HeaderStrip
      title="Contacts"
      count={`${contacts.filter((c) => !c.hidden).length}/${contacts.length}`}
      onAdd={() => onChange([...contacts, { id: uid("c"), label: "", url: "", hidden: false }])}
    />
    {contacts.map((c, i) => (
      <div key={c.id} style={cardStyle(c.hidden)}>
        <ItemHeader
          title={c.label || c.url}
          hidden={c.hidden}
          onToggleHide={() => {
            const copy = contacts.slice();
            copy[i] = { ...c, hidden: !c.hidden };
            onChange(copy);
          }}
          onRemove={() => onChange(contacts.filter((_, idx) => idx !== i))}
          reorder={
            <Reorder
              onUp={() => i > 0 && onChange(move(contacts, i, i - 1))}
              onDown={() => i < contacts.length - 1 && onChange(move(contacts, i, i + 1))}
              upDisabled={i === 0}
              downDisabled={i === contacts.length - 1}
            />
          }
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Field label="Label">
            <input
              style={inputStyle}
              value={c.label}
              placeholder="hey@…"
              onChange={(e) => {
                const copy = contacts.slice();
                copy[i] = { ...c, label: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
          <Field label="URL">
            <input
              style={inputStyle}
              value={c.url}
              placeholder="mailto:… or https://…"
              onChange={(e) => {
                const copy = contacts.slice();
                copy[i] = { ...c, url: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
        </div>
      </div>
    ))}
  </div>
);

const ExperienceEditor = ({ items, onChange }) => (
  <div>
    <HeaderStrip
      title="Experience"
      count={`${items.filter((x) => !x.hidden).length}/${items.length}`}
      onAdd={() =>
        onChange([
          ...items,
          {
            id: uid("e"),
            hidden: false,
            role: "",
            project: "",
            projectUrl: "",
            date: "",
            location: "",
            summary: "",
            bulletsText: "",
          },
        ])
      }
    />
    {items.map((exp, i) => (
      <div key={exp.id} style={cardStyle(exp.hidden)}>
        <ItemHeader
          title={`${exp.role || "(role)"} @ ${exp.project || "(project)"}`}
          hidden={exp.hidden}
          onToggleHide={() => {
            const copy = items.slice();
            copy[i] = { ...exp, hidden: !exp.hidden };
            onChange(copy);
          }}
          onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
          reorder={
            <Reorder
              onUp={() => i > 0 && onChange(move(items, i, i - 1))}
              onDown={() => i < items.length - 1 && onChange(move(items, i, i + 1))}
              upDisabled={i === 0}
              downDisabled={i === items.length - 1}
            />
          }
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Field label="Role">
            <input
              style={inputStyle}
              value={exp.role}
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...exp, role: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
          <Field label="Project / Company">
            <input
              style={inputStyle}
              value={exp.project}
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...exp, project: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
          <Field label="Project URL">
            <input
              style={inputStyle}
              value={exp.projectUrl}
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...exp, projectUrl: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
          <Field label="Date">
            <input
              style={inputStyle}
              value={exp.date}
              placeholder="Nov 2025 - Present"
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...exp, date: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
          <Field label="Location">
            <input
              style={inputStyle}
              value={exp.location}
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...exp, location: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
          <Field label="Summary (subheadline)">
            <input
              style={inputStyle}
              value={exp.summary}
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...exp, summary: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
        </div>
        <Field label="Bullets (one per line; use *word* for bold)">
          <textarea
            style={{ ...textareaStyle, minHeight: 140 }}
            placeholder={"- First bullet\n- Second bullet\n- *Bold* third bullet"}
            value={exp.bulletsText || (exp.bullets || []).map((b) => b.text).join("\n")}
            onChange={(e) => {
              const copy = items.slice();
              copy[i] = { ...exp, bulletsText: e.target.value };
              onChange(copy);
            }}
          />
        </Field>
      </div>
    ))}
  </div>
);

const SkillsEditor = ({ items, onChange }) => (
  <div>
    <HeaderStrip
      title="Skills"
      count={`${items.filter((x) => !x.hidden).length}/${items.length} categories`}
      onAdd={() =>
        onChange([
          ...items,
          { id: uid("sk"), hidden: false, category: "", itemsText: "" },
        ])
      }
    />
    {items.map((area, i) => (
      <div key={area.id} style={cardStyle(area.hidden)}>
        <ItemHeader
          title={area.category || "(category)"}
          hidden={area.hidden}
          onToggleHide={() => {
            const copy = items.slice();
            copy[i] = { ...area, hidden: !area.hidden };
            onChange(copy);
          }}
          onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
          reorder={
            <Reorder
              onUp={() => i > 0 && onChange(move(items, i, i - 1))}
              onDown={() => i < items.length - 1 && onChange(move(items, i, i + 1))}
              upDisabled={i === 0}
              downDisabled={i === items.length - 1}
            />
          }
        />
        <Field label="Category">
          <input
            style={inputStyle}
            value={area.category}
            onChange={(e) => {
              const copy = items.slice();
              copy[i] = { ...area, category: e.target.value };
              onChange(copy);
            }}
          />
        </Field>
        <Field label="Items (comma-separated)">
          <textarea
            style={{ ...textareaStyle, minHeight: 70 }}
            placeholder="JavaScript/TypeScript, Python, Go, React.js, …"
            value={area.itemsText || (area.items || []).map((x) => x.label).join(", ")}
            onChange={(e) => {
              const copy = items.slice();
              copy[i] = { ...area, itemsText: e.target.value };
              onChange(copy);
            }}
          />
        </Field>
      </div>
    ))}
  </div>
);

const EducationEditor = ({ items, onChange }) => (
  <div>
    <HeaderStrip
      title="Education"
      count={`${items.filter((x) => !x.hidden).length}/${items.length}`}
      onAdd={() =>
        onChange([
          ...items,
          {
            id: uid("ed"),
            hidden: false,
            institution: "",
            institutionUrl: "",
            date: "",
            location: "",
            gpa: "",
            degreesText: "",
          },
        ])
      }
    />
    {items.map((edu, i) => (
      <div key={edu.id} style={cardStyle(edu.hidden)}>
        <ItemHeader
          title={edu.institution || "(institution)"}
          hidden={edu.hidden}
          onToggleHide={() => {
            const copy = items.slice();
            copy[i] = { ...edu, hidden: !edu.hidden };
            onChange(copy);
          }}
          onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
          reorder={
            <Reorder
              onUp={() => i > 0 && onChange(move(items, i, i - 1))}
              onDown={() => i < items.length - 1 && onChange(move(items, i, i + 1))}
              upDisabled={i === 0}
              downDisabled={i === items.length - 1}
            />
          }
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Field label="Institution">
            <input
              style={inputStyle}
              value={edu.institution}
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...edu, institution: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
          <Field label="Institution URL">
            <input
              style={inputStyle}
              value={edu.institutionUrl}
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...edu, institutionUrl: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
          <Field label="Date">
            <input
              style={inputStyle}
              value={edu.date}
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...edu, date: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
          <Field label="Location">
            <input
              style={inputStyle}
              value={edu.location}
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...edu, location: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
          <Field label="GPA">
            <input
              style={inputStyle}
              value={edu.gpa}
              placeholder="7.8/10"
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...edu, gpa: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
        </div>
        <Field label="Degrees (one per line: Title | Field)">
          <textarea
            style={{ ...textareaStyle, minHeight: 80 }}
            placeholder={"Master of Computer Applications | Computer Science and Engineering\nBachelor of Computer Applications | Computer Applications"}
            value={edu.degreesText || (edu.degrees || []).map((d) => `${d.title} | ${d.field}`).join("\n")}
            onChange={(e) => {
              const copy = items.slice();
              copy[i] = { ...edu, degreesText: e.target.value };
              onChange(copy);
            }}
          />
        </Field>
      </div>
    ))}
  </div>
);

const CertsEditor = ({ items, onChange }) => (
  <div>
    <HeaderStrip
      title="Certifications"
      count={`${items.filter((x) => !x.hidden).length}/${items.length}`}
      onAdd={() =>
        onChange([...items, { id: uid("ce"), hidden: false, title: "", issuer: "", url: "" }])
      }
    />
    {items.map((c, i) => (
      <div key={c.id} style={cardStyle(c.hidden)}>
        <ItemHeader
          title={c.title || "(certification)"}
          hidden={c.hidden}
          onToggleHide={() => {
            const copy = items.slice();
            copy[i] = { ...c, hidden: !c.hidden };
            onChange(copy);
          }}
          onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
          reorder={
            <Reorder
              onUp={() => i > 0 && onChange(move(items, i, i - 1))}
              onDown={() => i < items.length - 1 && onChange(move(items, i, i + 1))}
              upDisabled={i === 0}
              downDisabled={i === items.length - 1}
            />
          }
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <Field label="Title">
            <input
              style={inputStyle}
              value={c.title}
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...c, title: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
          <Field label="Issuer">
            <input
              style={inputStyle}
              value={c.issuer}
              onChange={(e) => {
                const copy = items.slice();
                copy[i] = { ...c, issuer: e.target.value };
                onChange(copy);
              }}
            />
          </Field>
        </div>
        <Field label="URL">
          <input
            style={inputStyle}
            value={c.url}
            onChange={(e) => {
              const copy = items.slice();
              copy[i] = { ...c, url: e.target.value };
              onChange(copy);
            }}
          />
        </Field>
      </div>
    ))}
  </div>
);

const ExtrasEditor = ({ items, onChange }) => (
  <div>
    <HeaderStrip
      title="Extra Sections"
      count={`${items.filter((x) => !x.hidden).length}/${items.length}`}
      onAdd={() =>
        onChange([
          ...items,
          { id: uid("ex"), hidden: false, title: "", linesText: "" },
        ])
      }
    />
    {items.map((s, i) => (
      <div key={s.id} style={cardStyle(s.hidden)}>
        <ItemHeader
          title={s.title || "(section)"}
          hidden={s.hidden}
          onToggleHide={() => {
            const copy = items.slice();
            copy[i] = { ...s, hidden: !s.hidden };
            onChange(copy);
          }}
          onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
          reorder={
            <Reorder
              onUp={() => i > 0 && onChange(move(items, i, i - 1))}
              onDown={() => i < items.length - 1 && onChange(move(items, i, i + 1))}
              upDisabled={i === 0}
              downDisabled={i === items.length - 1}
            />
          }
        />
        <Field label="Section title (e.g. Awards, Publications, Volunteer)">
          <input
            style={inputStyle}
            value={s.title}
            onChange={(e) => {
              const copy = items.slice();
              copy[i] = { ...s, title: e.target.value };
              onChange(copy);
            }}
          />
        </Field>
        <Field label="Lines (one per line)">
          <textarea
            style={{ ...textareaStyle, minHeight: 100 }}
            value={s.linesText || (s.lines || []).map((l) => l.text).join("\n")}
            onChange={(e) => {
              const copy = items.slice();
              copy[i] = { ...s, linesText: e.target.value };
              onChange(copy);
            }}
          />
        </Field>
      </div>
    ))}
  </div>
);

const MetaEditor = ({ meta, onChange }) => (
  <div>
    <HeaderStrip title="Header" count="1" />
    <div style={cardStyle(false)}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <Field label="Author">
          <input
            style={inputStyle}
            value={meta.author}
            onChange={(e) => onChange({ ...meta, author: e.target.value })}
          />
        </Field>
        <Field label="Location">
          <input
            style={inputStyle}
            value={meta.location}
            onChange={(e) => onChange({ ...meta, location: e.target.value })}
          />
        </Field>
        <Field label="Body font size">
          <input
            style={inputStyle}
            value={meta.textSize}
            onChange={(e) => onChange({ ...meta, textSize: e.target.value })}
          />
        </Field>
      </div>
    </div>
  </div>
);

export default function ResumeEditor() {
  const [data, setData] = useState(null);
  const [buildState, setBuildState] = useState({ status: "idle", url: null, error: null, log: "" });
  const [showTyp, setShowTyp] = useState(false);
  const typRef = useRef("");

  useEffect(() => {
    seedFromCurrent().then(setData);
  }, []);

  const typ = useMemo(() => (data ? serialize(data) : ""), [data]);
  typRef.current = typ;

  const build = async () => {
    setBuildState({ status: "building", url: null, error: null, log: "" });
    try {
      const res = await fetch("/api/build-resume", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ typ }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setBuildState({ status: "done", url, error: null, log: "" });
    } catch (e) {
      setBuildState({ status: "error", url: null, error: e.message, log: "" });
    }
  };

  const download = () => {
    if (!buildState.url) return;
    const a = document.createElement("a");
    a.href = buildState.url;
    a.download = `${(data?.meta?.author || "resume").replace(/\s+/g, "_")}.pdf`;
    a.click();
  };

  if (!data) {
    return (
      <div style={{ padding: 40, color: "#888", fontFamily: "system-ui" }}>
        Loading editor…
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        height: "100vh",
        background: "#0a0a0a",
        color: "#eee",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          overflowY: "auto",
          padding: "16px 20px",
          borderRight: "1px solid #1f1f1f",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            position: "sticky",
            top: 0,
            background: "#0a0a0a",
            zIndex: 10,
            paddingTop: 4,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Resume Editor</h2>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setShowTyp((s) => !s)} style={btn()}>
              {showTyp ? "Hide" : "Show"} .typ
            </button>
            <button onClick={build} disabled={buildState.status === "building"} style={btn("primary")}>
              {buildState.status === "building" ? "Building…" : "Build PDF"}
            </button>
            {buildState.url && (
              <button onClick={download} style={btn()}>
                Download
              </button>
            )}
          </div>
        </div>

        <MetaEditor meta={data.meta} onChange={(meta) => setData({ ...data, meta })} />
        <ContactEditor contacts={data.contacts} onChange={(contacts) => setData({ ...data, contacts })} />
        <ExperienceEditor items={data.experience} onChange={(experience) => setData({ ...data, experience })} />
        <SkillsEditor items={data.skills} onChange={(skills) => setData({ ...data, skills })} />
        <EducationEditor items={data.education} onChange={(education) => setData({ ...data, education })} />
        <CertsEditor items={data.certifications} onChange={(certifications) => setData({ ...data, certifications })} />
        <ExtrasEditor items={data.extras} onChange={(extras) => setData({ ...data, extras })} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", background: "#050505" }}>
        {showTyp ? (
          <pre
            style={{
              flex: 1,
              margin: 0,
              padding: 16,
              overflow: "auto",
              fontSize: 11,
              fontFamily: "ui-monospace, monospace",
              color: "#a3e635",
              whiteSpace: "pre-wrap",
            }}
          >
            {typ}
          </pre>
        ) : buildState.status === "done" && buildState.url ? (
          <iframe
            title="resume-preview"
            src={buildState.url}
            style={{ flex: 1, border: "none", background: "#fff" }}
          />
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
            <div>
              <div style={{ fontSize: 14, color: "#888", marginBottom: 6 }}>
                {buildState.status === "building"
                  ? "Compiling Typst → PDF on the server…"
                  : buildState.status === "error"
                  ? `Build failed: ${buildState.error}`
                  : "Edit on the left, then click Build PDF."}
              </div>
              {buildState.status === "error" && (
                <pre
                  style={{
                    marginTop: 12,
                    padding: 12,
                    background: "#1a0a0a",
                    border: "1px solid #3f1f1f",
                    borderRadius: 4,
                    color: "#fca5a5",
                    fontSize: 11,
                    textAlign: "left",
                    maxWidth: 600,
                    overflow: "auto",
                  }}
                >
                  {buildState.error}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}