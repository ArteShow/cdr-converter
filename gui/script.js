const API = "http://localhost:8080";

function showTab(id) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function toast(message, type="success") {
    const div = document.createElement("div");
    div.className = `toast ${type}`;
    div.innerText = message;

    document.getElementById("toastContainer").appendChild(div);

    setTimeout(() => div.remove(), 3000);
}

/* SCALE SYSTEM */
function setScale(val) {
    document.documentElement.style.setProperty("--scale", val / 100);
    localStorage.setItem("uiScale", val);
    document.getElementById("scaleValue").innerText = val + "%";
}

document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("uiScale") || 100;
    document.getElementById("scaleSlider").value = saved;
    setScale(saved);

    document.getElementById("scaleSlider").addEventListener("input", (e) => {
        setScale(e.target.value);
    });
});

/* UPLOAD */
document.getElementById("uploadBtn").addEventListener("click", async () => {
    const file = document.getElementById("fileInput").files[0];
    if (!file) return toast("No file selected", "error");

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API}/upload`, {
        method: "POST",
        body: form
    });

    if (res.ok) {
        toast("Upload successful");
        loadTempFiles();
    } else {
        toast("Upload failed", "error");
    }
});

/* CONVERT */
document.getElementById("convertBtn").addEventListener("click", async () => {
    const filename = document.getElementById("tempFiles").value;
    if (!filename) return toast("Select file", "error");

    const out = filename.split(".")[0] + ".pdf";

    const res = await fetch(`${API}/convert`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            filename,
            output_file_name: out
        })
    });

    if (res.status === 201) {
        toast("Conversion done");
        loadOutputFiles();
    } else {
        toast("Conversion failed", "error");
    }
});

/* FILES */
async function loadTempFiles() {
    const res = await fetch(`${API}/files/temp`);
    const files = await res.json();

    const list = document.getElementById("tempList");
    const select = document.getElementById("tempFiles");

    list.innerHTML = "";
    select.innerHTML = "";

    files.forEach(f => {
        list.innerHTML += `<li>${f}</li>`;
        select.innerHTML += `<option value="${f}">${f}</option>`;
    });
}

async function loadOutputFiles() {
    const res = await fetch(`${API}/files/output`);
    const files = await res.json();

    const list = document.getElementById("outputList");
    list.innerHTML = "";

    files.forEach(f => {
        list.innerHTML += `<li>${f} <a href="${API}/download/${f}">download</a></li>`;
    });
}