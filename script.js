// === HTML Elements ===
const btn = document.querySelector("#btn");
const content = document.querySelector("#content");
const voice = document.querySelector("#voice");

// === Speech Synthesis ===
const synth = window.speechSynthesis;
let englishVoice = null;

//Voice load modulation
function loadVoices() {
    const voices = synth.getVoices();
    englishVoice = voices.find(v => v.lang === 'en-US');
    if (englishVoice) {
        console.log("SUCCESS: english voice found and loaded.");
    } else {
        console.warn("WARNING: english (hi-IN) voice not found. Using default.");
    }
}

// Ensures voices are loaded
loadVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
}

// Speaking function
function speak(text) {
    if (synth.speaking) {
        synth.cancel();
    }
    
    // A bit delay to ensure smooth speech synthesis
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onerror = (event) => {
            console.error("SpeechSynthesis Error:", event.error);
        };
        
        if (englishVoice) {
            utterance.voice = englishVoice;
        }
        
        utterance.lang = 'en-US';
        utterance.pitch = 1;
        utterance.rate = 1;
        utterance.volume = 1;
        
        synth.speak(utterance);
    }, 200);
}

// === Speech Recognition ===
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.continuous = false;


// Voice recognition started
recognition.onstart = () => {
    console.log("Listening has started.");
    voice.style.display = "block";
    btn.style.display = "none";
};

// Voice recognition ended
recognition.onend = () => {
    console.log("Listening has ended.");
    voice.style.display = "none";
    btn.style.display = "flex";
};

// When error detected
recognition.onerror = (event) => {
    console.error("SpeechRecognition Error:", event.error);
    content.innerText = "Sorry, I can't hear you। Check your microphone।";
};

// Voice recognized
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    content.innerText = `You said: "${transcript}"`;
    console.log(`Command received: ${transcript}`);
    takeCommand(transcript.toLowerCase());
};

// Click Button to Start Listening
btn.addEventListener("click", () => {
    synth.cancel();
    recognition.start();
});

// === Command Handling ===
function takeCommand(message) {
    console.log(`Processing command: ${message}`);
    if (message.includes("hello") || message.includes("hey") || message.includes("Hi")) {
        speak("Hello Boss, How can I help you?");
    } else if (message.includes("who are you")) {
        speak("I am an Virtual Assistant,Made by Nabhansh Sir।");
    } else if (message.includes("open youtube")) {
        speak("Opening Youtube");
        window.open("https://youtube.com/", "_blank");
    } else if (message.includes("open google")) {
        speak("Opening Google");
        window.open("https://google.com/", "_blank");
    } else if (message.includes("time")) {
        const time = new Date().toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
        speak(`Now ${time} is।`);
    } else if (message.includes("date")) {
        const date = new Date().toLocaleString("en-US", { day: "numeric", month: "long" });
        speak(`Today ${date} is।`);
    } else {
        const query = message.replace("shipra", "").replace("shifra", "").trim();
        speak(`I got some ${query} to find on internet।`);
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
}