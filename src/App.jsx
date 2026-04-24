import { useEffect, useRef, useState } from "react";

export default function App() {
  const canvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#1f3d1f");

  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [name, setName] = useState("");

  const [posts, setPosts] = useState([]);

  useEffect(() => {
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
  }, []);

  const getPoint = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const point = getPoint(e);

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);

    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

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

  const submitPost = () => {
    const canvas = canvasRef.current;

    const image = canvas.toDataURL("image/png");

    const newPost = {
      title,
      story,
      name,
      image,
    };

    setPosts([newPost, ...posts]);

    setTitle("");
    setStory("");
    setName("");

    clearCanvas();
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
            maxWidth: "700px",
            lineHeight: 1.7,
            color: "#4b5b46",
            marginBottom: "50px",
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
            style={{
              width: "100%",
              background: "#fdfcf7",
              borderRadius: "20px",
              border: "1px solid #b7c4aa",
              cursor: "crosshair",
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
