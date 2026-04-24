import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://bujahrqqercpsasynxgi.supabase.co",
  "sb_publishable_G8Mr7FRFfYfFNRyWjhNiwA_qpyDpmRW"
);

export default function App() {
  const canvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#1f3d1f");

  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [name, setName] = useState("");

  const [posts, setPosts] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setupCanvas();
    loadPosts();
  }, []);

  const setupCanvas = () => {
    const canvas = canvasRef.current;

    const width = canvas.offsetWidth;
    const height = 400;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fdfcf7";
    ctx.fillRect(0, 0, width, height);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setPosts(data);
    }
  };

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const touch = e.touches ? e.touches[0] : e;

    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    setHistory((prev) => [...prev, canvas.toDataURL()]);

    const point = getPoint(e);

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);

    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const point = getPoint(e);

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fdfcf7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const undo = () => {
    if (history.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const previous = history[history.length - 1];
    const img = new Image();

    img.src = previous;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    setHistory(history.slice(0, -1));
  };

  const submitPost = async () => {
    const canvas = canvasRef.current;

    const image = canvas.toDataURL("image/png");

    const newPost = {
      title,
      story,
      name,
      image,
    };

    const { error } = await supabase
      .from("memories")
      .insert([newPost]);

    if (!error) {
      setPosts([newPost, ...posts]);

      setTitle("");
      setStory("");
      setName("");

      clearCanvas();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#dbe7cf",
        padding: "60px 20px",
        fontFamily: "Georgia, serif",
        color: "#203020",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "72px",
            lineHeight: 1,
            marginBottom: "20px",
          }}
        >
          Hyde Park
          <br />
          Memory Archive
        </h1>

        <p
          style={{
            fontSize: "20px",
            maxWidth: "620px",
            lineHeight: 1.7,
            color: "#4b5b46",
            marginBottom: "50px",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          Draw a memory you have of Hyde Park. It can be a place, a person,
          weather, a sound, or a feeling.
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.65)",
            borderRadius: "30px",
            padding: "30px",
            marginBottom: "60px",
          }}
        >
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "15px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button onClick={clearCanvas}>Clear</button>

            <button onClick={undo}>Undo</button>

            <label>
              Colour{" "}
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
              />
            </label>

            <label>
              Size{" "}
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(e.target.value)}
              />
            </label>
          </div>

          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              width: "100%",
              background: "#fdfcf7",
              borderRadius: "20px",
              border: "1px solid #b7c4aa",
              cursor: "crosshair",
              touchAction: "none",
            }}
          />

          <div
            style={{
              marginTop: "30px",
              display: "grid",
              gap: "15px",
            }}
          >
            <input
              placeholder="Memory title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                padding: "15px",
                borderRadius: "14px",
                border: "1px solid #b7c4aa",
              }}
            />

            <textarea
              placeholder="Write your story..."
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
              Submit memory
            </button>
          </div>
        </div>

        <h2
          style={{
            fontSize: "40px",
            marginBottom: "30px",
          }}
        >
          Community memories
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
              key={index}
              style={{
                background: "rgba(255,255,255,0.7)",
                borderRadius: "24px",
                overflow: "hidden",
              }}
            >
              <img
                src={post.image}
                alt=""
                style={{
                  width: "100%",
                  height: "240px",
                  objectFit: "contain",
                  background: "#fdfcf7",
                }}
              />

              <div
                style={{
                  padding: "20px",
                }}
              >
                <h3>{post.title}</h3>

                <p
                  style={{
                    lineHeight: 1.7,
                    color: "#4b5b46",
                  }}
                >
                  {post.story}
                </p>

                <p
                  style={{
                    marginTop: "15px",
                    fontSize: "14px",
                    color: "#607060",
                  }}
                >
                  — {post.name || "Anonymous"}
                </p>

                <a
                  href={`data:text/html;charset=utf-8,${encodeURIComponent(`
                    <html>
                      <body style="font-family: Georgia, serif; padding: 40px; background: #dbe7cf;">
                        <h1>${post.title || "Untitled memory"}</h1>
                        <p><strong>By:</strong> ${post.name || "Anonymous"}</p>
                        <img src="${post.image}" style="max-width: 100%; border: 1px solid #b7c4aa; background: #fdfcf7;" />
                        <p style="font-size: 18px; line-height: 1.7;">${post.story || ""}</p>
                      </body>
                    </html>
                  `)}`}
                  download={`${post.title || "memory"}.html`}
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
                  Download Memory
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}