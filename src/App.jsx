import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://bujahrqqercpsasynxgi.supabase.co",
  "sb_publishable_G8Mr7FRFfYfFNRyWjhNiwA_qpyDpmRW"
);

export default function App() {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setPosts(data);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (file.type === "application/pdf") {
        setImage(reader.result);
        return;
      }

      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 1200;
        const scale = Math.min(maxWidth / img.width, 1);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedImage = canvas.toDataURL("image/jpeg", 0.75);
        setImage(compressedImage);
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const submitPost = async () => {
    if (!image) {
      alert("Please upload a map photo first.");
      return;
    }

    const newPost = {
      title,
      story,
      name,
      image,
    };

    const { error } = await supabase.from("memories").insert([newPost]);

    if (error) {
      alert("Upload failed: " + error.message);
      return;
    }

    setPosts([newPost, ...posts]);
    setTitle("");
    setStory("");
    setName("");
    setImage("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#dbe7cf",
        backgroundImage:
          'linear-gradient(rgba(219,231,207,0.55), rgba(219,231,207,0.55)), url("/hyde-park-bg.svg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: "60px clamp(16px, 4vw, 40px)",
        fontFamily: "Georgia, serif",
        color: "#203020",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "clamp(46px, 8vw, 86px)",
            lineHeight: 1,
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Hyde Park
          <br />
          Memory Map Archive
        </h1>

        <p
          style={{
            fontSize: "20px",
            maxWidth: "680px",
            lineHeight: 1.7,
            color: "#4b5b46",
            margin: "0 auto 50px",
            textAlign: "center",
          }}
        >
          Upload your own Hyde Park map.
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(8px)",
            borderRadius: "30px",
            padding: "30px",
            marginBottom: "60px",
          }}
        >
          <label
            style={{
              display: "block",
              border: "2px dashed #9cad8d",
              borderRadius: "24px",
              padding: "40px 20px",
              textAlign: "center",
              background: "#fdfcf7",
              cursor: "pointer",
              marginBottom: "25px",
            }}
          >
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>
              Upload your map photo
            </div>
            <div style={{ color: "#607060" }}>
              Take a photo or choose an image from your phone.
            </div>
          </label>

          {image && image.startsWith("data:application/pdf") ? (
            <div
              style={{
                padding: "30px",
                borderRadius: "20px",
                background: "#fdfcf7",
                border: "1px solid #b7c4aa",
                marginBottom: "25px",
                textAlign: "center",
              }}
            >
              PDF selected.
              <br />
              <a href={image} target="_blank" rel="noreferrer">
                Open PDF
              </a>
            </div>
          ) : image ? (
            <img
              src={image}
              alt="Uploaded map"
              style={{
                width: "100%",
                maxHeight: "520px",
                objectFit: "contain",
                borderRadius: "20px",
                background: "#fdfcf7",
                border: "1px solid #b7c4aa",
                marginBottom: "25px",
              }}
            />
          ) : null}

          <div style={{ display: "grid", gap: "15px" }}>
            <input
              placeholder="Map title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                padding: "15px",
                borderRadius: "14px",
                border: "1px solid #b7c4aa",
              }}
            />

            <textarea
              placeholder="Write the story behind this map..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              rows={5}
              style={{
                padding: "15px",
                borderRadius: "14px",
                border: "1px solid #b7c4aa",
              }}
            />

            <input
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: "15px",
                borderRadius: "14px",
                border: "1px solid #b7c4aa",
              }}
            />

            <button
              onClick={submitPost}
              style={{
                padding: "16px",
                borderRadius: "999px",
                border: "none",
                background: "#2d4a2d",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Submit map memory
            </button>
          </div>
        </div>

        <h2 style={{ fontSize: "40px", marginBottom: "30px" }}>
          Community map memories
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
          }}
        >
          {posts.map((post, index) => (
            <div
              key={post.id || index}
              style={{
                background: "rgba(255,255,255,0.82)",
                borderRadius: "24px",
                overflow: "hidden",
              }}
            >
              {post.image?.startsWith("data:application/pdf") ? (
                <div
                  style={{
                    height: "260px",
                    background: "#fdfcf7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  <a href={post.image} target="_blank" rel="noreferrer">
                    Open uploaded PDF
                  </a>
                </div>
              ) : (
                <img
                  src={post.image}
                  alt=""
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "contain",
                    background: "#fdfcf7",
                  }}
                />
              )}

              <div style={{ padding: "20px" }}>
                <h3>{post.title || "Untitled map memory"}</h3>
                <p style={{ lineHeight: 1.7, color: "#4b5b46" }}>
                  {post.story}
                </p>
                <p style={{ marginTop: "15px", fontSize: "14px", color: "#607060" }}>
                  — {post.name || "Anonymous"}
                </p>

                <a
                  href={post.image}
                  download={`${post.title || "map-memory"}.jpg`}
                  style={{
                    display: "inline-block",
                    marginTop: "14px",
                    padding: "10px 14px",
                    background: "#2d4a2d",
                    color: "white",
                    borderRadius: "999px",
                    textDecoration: "none",
                    fontSize: "14px",
                  }}
                >
                  Download image
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
