// export default function Home() {
//   return (
//     <div>
//       <h1>Home Page</h1>
//     </div>
//   );
// }

// app/page.tsx (Next.js 13+ App Router)
// or pages/index.tsx if using Pages Router

"use client";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    projectId: "expo_openhouse",
    deepLink: "",
    fallbackUrl: "",
    title: "",
    description: "",
    image: "",
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/expo_openhouse/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: form.projectId,
          deepLink: form.deepLink,
          fallbackUrl: form.fallbackUrl,
          meta: {
            title: form.title,
            description: form.description,
            image: form.image,
          },
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      alert("Error creating link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Dynamic Link Generator</h2>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Deep Link</label>
          <input type="text" className="form-control" name="deepLink" value={form.deepLink} onChange={handleChange} placeholder="com.openuniverse.openhouse://property/1234" required />
        </div>

        <div className="mb-3">
          <label className="form-label">Fallback URL</label>
          <input type="text" className="form-control" name="fallbackUrl" value={form.fallbackUrl} onChange={handleChange} placeholder="https://play.google.com/..." required />
        </div>

        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} placeholder="Property #1234" />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" value={form.description} onChange={handleChange} placeholder="Beautiful 2BHK flat in Mumbai"></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input type="text" className="form-control" name="image" value={form.image} onChange={handleChange} placeholder="https://picsum.photos/400" />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Link"}
        </button>
      </form>

      {response && (
        <div className="card mt-4 p-3 shadow-sm">
          <h5 className="card-title">{response.meta.title}</h5>
          <p className="card-text">{response.meta.description}</p>
          <img src={response.meta.image} alt="preview" className="img-fluid rounded mb-3" style={{ maxWidth: "300px" }} />
          <p><strong>Short ID:</strong> {response.shortId}</p>
          <p><strong>Deep Link:</strong> {response.deepLink}</p>
          <p><strong>Fallback URL:</strong> <a href={response.fallbackUrl} target="_blank">{response.fallbackUrl}</a></p>
          <p><strong>Created At:</strong> {new Date(response.createdAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
