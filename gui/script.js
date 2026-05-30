const texts = {
    en: {
        upload: "Upload",
        convert: "Convert",
        files: "Files",
        settings: "Settings",
        help: "Help",

        uploadTitle: "Upload File",
        convertTitle: "Convert File",
        filesTitle: "File Explorer",
        settingsTitle: "Settings",
        helpTitle: "User Manual",

        uploadSuccess: "Upload successful",
        uploadError: "Upload failed",
        convertSuccess: "Conversion done",
        convertError: "Conversion failed",
        noFile: "No file selected",
        selectFile: "Select file",

        helpBox: `
        <h2>How to convert CDR to AI</h2>
        <ol>
            <li>Upload CDR</li>
            <li>Convert file</li>
            <li>Download result</li>
            <li>Open in Illustrator</li>
            <li>Save as .AI</li>
        </ol>
        `
    },

    ru: {
        upload: "Загрузить",
        convert: "Конвертировать",
        files: "Файлы",
        settings: "Настройки",
        help: "Помощь",

        uploadTitle: "Загрузка файла",
        convertTitle: "Конвертация",
        filesTitle: "Файловый менеджер",
        settingsTitle: "Настройки",
        helpTitle: "Руководство",

        uploadSuccess: "Файл загружен",
        uploadError: "Ошибка загрузки",
        convertSuccess: "Готово",
        convertError: "Ошибка конвертации",
        noFile: "Файл не выбран",
        selectFile: "Выберите файл",

        helpBox: `
        <h2>Как конвертировать CDR в AI</h2>
        <ol>
            <li>Загрузите CDR</li>
            <li>Конвертируйте файл</li>
            <li>Скачайте результат</li>
            <li>Откройте в Illustrator</li>
            <li>Сохраните как .AI</li>
        </ol>
        `
    }
};

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

function setScale(val) {
    document.documentElement.style.setProperty("--scale", val / 100);
    localStorage.setItem("uiScale", val);
    document.getElementById("scaleValue").innerText = val + "%";
}

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

document.getElementById("langSelect").addEventListener("change", (e) => {
    setLanguage(e.target.value);
});

function setLanguage(lang) {
    localStorage.setItem("lang", lang);

    document.getElementById("helpTitle").innerText = texts[lang].helpTitle;
    document.getElementById("helpBox").innerHTML = texts[lang].help;
}

function applyLanguage(lang) {
    const t = texts[lang];

    document.querySelectorAll(".sidebar button")[0].innerText = t.upload;
    document.querySelectorAll(".sidebar button")[1].innerText = t.convert;
    document.querySelectorAll(".sidebar button")[2].innerText = t.files;
    document.querySelectorAll(".sidebar button")[3].innerText = t.settings;
    document.querySelectorAll(".sidebar button")[4].innerText = t.help;

    document.querySelector("#upload h1").innerText = t.uploadTitle;
    document.querySelector("#convert h1").innerText = t.convertTitle;
    document.querySelector("#files h1").innerText = t.filesTitle;
    document.querySelector("#settings h1").innerText = t.settingsTitle;
    document.querySelector("#help h1").innerText = t.helpTitle;

    document.getElementById("helpBox").innerHTML = t.helpBox;

    localStorage.setItem("lang", lang);
}

document.addEventListener("DOMContentLoaded", () => {

    const savedScale = localStorage.getItem("uiScale") || 100;
    document.getElementById("scaleSlider").value = savedScale;
    setScale(savedScale);

    document.getElementById("scaleSlider").addEventListener("input", (e) => {
        setScale(e.target.value);
    });

    const langSelect = document.getElementById("langSelect");

    const savedLang = localStorage.getItem("lang") || "en";
    langSelect.value = savedLang;
    applyLanguage(savedLang);

    langSelect.addEventListener("change", (e) => {
        setLanguage(e.target.value);
    });

});