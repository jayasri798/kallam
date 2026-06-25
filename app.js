// SYSTEM COMPONENT: app.js
// Target Focus: Firebase Web v10+ Core Integration, Google Sign-in popup, Vertex/Gemini API context routing

// --- Firebase Web v10+ ESM Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithPopup, 
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs,
    collection,
    onSnapshot,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: 'AIzaSyBDHS_nqHHNIouZz3aBECsUbcmNKx7ZISI',
  authDomain: 'kallam-6c61d.firebaseapp.com',
  projectId: 'kallam-6c61d',
  storageBucket: 'kallam-6c61d.firebasestorage.app',
  messagingSenderId: '33935751750',
  appId: '1:33935751750:web:d25b1081d98bfa18b9e847',
  measurementId: 'G-PEK9EKLPC0'
};

// --- DOM Event Bindings ---
document.addEventListener("DOMContentLoaded", () => {
    // --- Firebase Initialization inside strict DOM Guard ---
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    // Provider Scope Isolation
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.setCustomParameters({ prompt: 'select_account' });

    console.log("Firebase Cloud Stream initialized manually within DOMContentLoaded.");

    // Handle redirect result diagnostic catch
    getRedirectResult(auth)
        .then((result) => {
            if (result) {
                console.log("Redirect sign-in successful. User:", result.user.email);
            }
        })
        .catch((error) => {
            console.error("Redirect sign-in error details:", error);
            if (loginError) {
                loginError.textContent = `Redirect sign-in failed: ${error.message}`;
                loginError.classList.remove("hidden");
            }
        });
    // UI Elements wrapped in try-catch to prevent freezes
    let loginScreen;
    try { loginScreen = document.getElementById("login-screen"); } catch (e) { console.warn("Selector error 'login-screen':", e); }
    
    let appContainer;
    try { appContainer = document.getElementById("app-container"); } catch (e) { console.warn("Selector error 'app-container':", e); }
    
    let btnLogin;
    try { btnLogin = document.getElementById("btn-login"); } catch (e) { console.warn("Selector error 'btn-login':", e); }
    
    let btnLogout;
    try { btnLogout = document.getElementById("btn-logout"); } catch (e) { console.warn("Selector error 'btn-logout':", e); }
    
    let loginError;
    try { loginError = document.getElementById("login-error"); } catch (e) { console.warn("Selector error 'login-error':", e); }
    
    let userAvatarInitial;
    try { userAvatarInitial = document.getElementById("user-avatar-initial"); } catch (e) { console.warn("Selector error 'user-avatar-initial':", e); }
    
    let userDisplayName;
    try { userDisplayName = document.getElementById("user-display-name"); } catch (e) { console.warn("Selector error 'user-display-name':", e); }
    
    let userDisplayEmail;
    try { userDisplayEmail = document.getElementById("user-display-email"); } catch (e) { console.warn("Selector error 'user-display-email':", e); }
    
    let sidebar;
    try { sidebar = document.getElementById("sidebar"); } catch (e) { console.warn("Selector error 'sidebar':", e); }
    
    let btnToggleSidebar;
    try { btnToggleSidebar = document.getElementById("btn-toggle-sidebar"); } catch (e) { console.warn("Selector error 'btn-toggle-sidebar':", e); }
    
    let btnMobileSidebar;
    try { btnMobileSidebar = document.getElementById("btn-mobile-sidebar"); } catch (e) { console.warn("Selector error 'btn-mobile-sidebar':", e); }
    
    let circularsList;
    try { circularsList = document.getElementById("circulars-list"); } catch (e) { console.warn("Selector error 'circulars-list':", e); }
    
    let chatContainer;
    try { chatContainer = document.getElementById("chat-container"); } catch (e) { console.warn("Selector error 'chat-container':", e); }
    
    let welcomeView;
    try { welcomeView = document.getElementById("welcome-view"); } catch (e) { console.warn("Selector error 'welcome-view':", e); }
    
    let chatWindow;
    try { chatWindow = document.getElementById("chat-window"); } catch (e) { console.warn("Selector error 'chat-window':", e); }
    
    let queryForm;
    try { queryForm = document.getElementById("query-form"); } catch (e) { console.warn("Selector error 'query-form':", e); }
    
    let inputQuery;
    try { inputQuery = document.getElementById("input-query"); } catch (e) { console.warn("Selector error 'input-query':", e); }
    
    let suggestionCards;
    try { suggestionCards = document.querySelectorAll(".suggestion-card"); } catch (e) { console.warn("Selector error '.suggestion-card':", e); }

    // Admin Panel Elements
    let btnAdminToggle;
    try { btnAdminToggle = document.getElementById("btn-admin-toggle"); } catch (e) { console.warn("Selector error 'btn-admin-toggle':", e); }
    
    let chatWorkspace;
    try { chatWorkspace = document.getElementById("chat-workspace"); } catch (e) { console.warn("Selector error 'chat-workspace':", e); }
    
    let adminWorkspace;
    try { adminWorkspace = document.getElementById("admin-workspace"); } catch (e) { console.warn("Selector error 'admin-workspace':", e); }
    
    let adminForm;
    try { adminForm = document.getElementById("admin-upload-form"); } catch (e) { console.warn("Selector error 'admin-upload-form':", e); }
    
    let noticeTitleInput;
    try { noticeTitleInput = document.getElementById("notice-title"); } catch (e) { console.warn("Selector error 'notice-title':", e); }
    
    let fileInput;
    try { fileInput = document.getElementById("file-input"); } catch (e) { console.warn("Selector error 'file-input':", e); }
    
    let dragDropZone;
    try { dragDropZone = document.getElementById("drag-drop-zone"); } catch (e) { console.warn("Selector error 'drag-drop-zone':", e); }
    
    let uploadStatusText;
    try { uploadStatusText = document.getElementById("upload-status-text"); } catch (e) { console.warn("Selector error 'upload-status-text':", e); }
    
    let progressBarContainer;
    try { progressBarContainer = document.getElementById("progress-bar-container"); } catch (e) { console.warn("Selector error 'progress-bar-container':", e); }
    
    let progressBarFill;
    try { progressBarFill = document.getElementById("progress-bar-fill"); } catch (e) { console.warn("Selector error 'progress-bar-fill':", e); }
    
    let progressPercent;
    try { progressPercent = document.getElementById("progress-percent"); } catch (e) { console.warn("Selector error 'progress-percent':", e); }
    
    let btnAdminCancel;
    try { btnAdminCancel = document.getElementById("btn-admin-cancel"); } catch (e) { console.warn("Selector error 'btn-admin-cancel':", e); }
    
    let btnClearChat;
    try { btnClearChat = document.getElementById("btn-clear-chat"); } catch (e) { console.warn("Selector error 'btn-clear-chat':", e); }
    
    let adminBulletinsList;
    try { adminBulletinsList = document.getElementById("admin-bulletins-list"); } catch (e) { console.warn("Selector error 'admin-bulletins-list':", e); }

    // Voice Mode Overlay Elements
    let btnVoiceMode;
    try { btnVoiceMode = document.getElementById("btn-voice-mode"); } catch (e) { console.warn("Selector error 'btn-voice-mode':", e); }
    
    let voiceOverlay;
    try { voiceOverlay = document.getElementById("voice-overlay"); } catch (e) { console.warn("Selector error 'voice-overlay':", e); }
    
    let btnCloseVoice;
    try { btnCloseVoice = document.getElementById("btn-close-voice"); } catch (e) { console.warn("Selector error 'btn-close-voice':", e); }
    
    let voiceLogoContainer;
    try { voiceLogoContainer = document.getElementById("voice-logo-container"); } catch (e) { console.warn("Selector error 'voice-logo-container':", e); }
    
    let voiceOverlayCaptions;
    try { voiceOverlayCaptions = document.getElementById("voice-overlay-captions"); } catch (e) { console.warn("Selector error 'voice-overlay-captions':", e); }
    
    let interimOverlay;
    try { interimOverlay = document.getElementById("interim-overlay"); } catch (e) { console.warn("Selector error 'interim-overlay':", e); }

    let selectedFile = null;
    let voiceModeOverlayActive = false;

    // Speech and Interface States
    let isListening = false;
    let speechRecognition = null;
    let currentUserDetails = null;

    // Default Academic Data for Firestore Pre-population and Fallback Registry
    const defaultCirculars = [
        {
            id: "CIRC-2026-089",
            title: "Even Semester End Exams Schedule",
            category: "Academic",
            date: "June 22, 2026",
            summary: "Timetables for B.Tech II, IV, VI & VIII semesters have been published. Examinations commence July 6, 2026. Hall tickets available on the student portal from June 30.",
            urgent: true,
            timestamp: Date.now() - 100000
        },
        {
            id: "CIRC-2026-088",
            title: "KHIT Smart India Hackathon Internal Rounds",
            category: "Event",
            date: "June 20, 2026",
            summary: "Internal screening round for SIH 2026 will be conducted on June 28 at the Central Computing Lab. Teams must register abstract before June 25.",
            urgent: false,
            timestamp: Date.now() - 200000
        },
        {
            id: "CIRC-2026-087",
            title: "TCS Ion Recruitment Drive Eligibility List",
            category: "Placement",
            date: "June 18, 2026",
            summary: "List of shortlisted candidates for TCS Campus Hiring phase II interview round is out. Verification of documents scheduled for June 24.",
            urgent: true,
            timestamp: Date.now() - 300000
        },
        {
            id: "CIRC-2026-086",
            title: "Monsoon Semester Tuition Fee Deadline",
            category: "Finance",
            date: "June 15, 2026",
            summary: "Deadline for next academic year fee remittance is extended to July 10, 2026 without fine. Post deadline, fine of Rs. 100/day applies.",
            urgent: false,
            timestamp: Date.now() - 400000
        }
    ];

    // Initial Mic State Settings
    setMicState('off');

    // Base College Information database for KHIT-Pulse persona
    const KHIT_COLLEGE_INFO = `
College Name: Kallam Haranadhareddy Institute of Technology (KHIT)
Established: 2010
Affiliation: Jawaharlal Nehru Technological University Kakinada (JNTUK), Approved by AICTE, Accredited by NAAC with 'A' Grade, NBA accredited.
Location: NH-5, Chowdavaram, Guntur, Andhra Pradesh, India - 522019.
Departments/Branches:
1. Computer Science & Engineering (CSE) - offering specialized tracks in AI & ML, Data Science, and IoT.
2. Information Technology (IT)
3. Electronics & Communication Engineering (ECE)
4. Electrical & Electronics Engineering (EEE)
5. Mechanical Engineering (ME)
6. Civil Engineering (CE)
7. Master of Business Administration (MBA)
Key Campus Facilities: Central Library, Placement Cell, Entrepreneurship Development Cell, Sports & Gym facilities, Computing Labs with High-Speed Internet, College Hostels, and Cafeteria.
`;

    async function getAllCircularsContext() {
        let texts = [];
        if (db) {
            try {
                const collectionsToCheck = ["circulars"];
                for (const colName of collectionsToCheck) {
                    const querySnapshot = await getDocs(collection(db, colName));
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        texts.push(`- ID: ${data.id || doc.id}\n  Title: ${data.title}\n  Category: ${data.category}\n  Date: ${data.date}\n  Summary: ${data.summary}\n  Details: ${data.fullText || data.summary}`);
                    });
                }
            } catch (e) {
                console.error("Error reading circulars for general context:", e);
            }
        }
        
        if (texts.length === 0) {
            // fallback to default circulars
            for (const log of defaultCirculars) {
                texts.push(`- ID: ${log.id}\n  Title: ${log.title}\n  Category: ${log.category}\n  Date: ${log.date}\n  Summary: ${log.summary}\n  Details: ${log.fullText || log.summary}`);
            }
        }
        
        return texts.join("\n\n");
    }

    // --- Authentication Handler ---
    // 1. Listen to Real Firebase Auth Changes
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("Session verified successfully for user:", user.email);
            
            currentUserDetails = {
                uid: user.uid,
                displayName: user.displayName || "Academic Guest",
                email: user.email || "guest@khit.edu.in",
                photoURL: user.photoURL || ""
            };

            let role = "student";
            try {
                console.log("Firestore Sync Init");
                // Update user record in Firestore
                const userDocRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userDocRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    role = userData.accountRole || "student";
                }
                
                await setDoc(userDocRef, {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    avatar: user.photoURL,
                    accountRole: role,
                    lastActive: new Date()
                }, { merge: true });
                console.log("User profile synchronised with Firestore cloud architecture.");
            } catch (error) {
                console.error("Firestore user sync error:", error);
            }

            currentUserDetails.accountRole = role;

            setupUserUI(currentUserDetails);
            showDashboard();
            subscribeToCirculars();
        } else {
            hideDashboard();
        }
    });

    // 2. Google sign-in click handler with Defensive Auth Pipeline & Diagnostic Logs
    if (btnLogin) {
        btnLogin.addEventListener("click", async () => {
            console.log("Auth Clicked");
            setLoginBtnLoading(true);
            try {
                console.log("Popup Attempted");
                await signInWithPopup(auth, provider);
            } catch (err) {
                console.warn("signInWithPopup failed, triggering defensive redirect pipeline:", err);
                console.log("Redirect Triggered");
                try {
                    // Clear authentication state cache
                    await signOut(auth);
                } catch (clearErr) {
                    console.warn("Failed to clear auth cache:", clearErr);
                }
                try {
                    await signInWithRedirect(auth, provider);
                } catch (redirectErr) {
                    console.error("Redirect login failed:", redirectErr);
                    if (loginError) {
                        loginError.textContent = `Sign-in failed: ${redirectErr.message}`;
                        loginError.classList.remove("hidden");
                    }
                    setLoginBtnLoading(false);
                }
            }
        });
    }

    // 3. Logout action
    if (btnLogout) {
        btnLogout.addEventListener("click", async () => {
            try {
                await signOut(auth);
            } catch (err) {
                console.error("Logout failed:", err);
            }
        });
    }

    // --- Dynamic UI Setup Helpers ---
    function setLoginBtnLoading(loading) {
        if (!btnLogin) return;
        if (loading) {
            btnLogin.disabled = true;
            btnLogin.innerHTML = `
                <svg class="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
            `;
        } else {
            btnLogin.disabled = false;
            btnLogin.innerHTML = `
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5" alt="Google Logo">
                Sign in with Google
            `;
        }
    }

    function setupUserUI(user) {
        if (userDisplayName) userDisplayName.textContent = user.displayName;
        if (userDisplayEmail) userDisplayEmail.textContent = user.email;
        
        if (userAvatarInitial) {
            if (user.photoURL) {
                userAvatarInitial.innerHTML = `<img src="${user.photoURL}" alt="${user.displayName}" class="w-full h-full rounded-full object-cover">`;
                userAvatarInitial.classList.remove("bg-gradient-to-tr", "from-blue-600", "to-indigo-600");
            } else {
                const initials = user.displayName ? user.displayName.split(" ").map(n => n[0]).join("") : "U";
                userAvatarInitial.textContent = initials;
                userAvatarInitial.innerHTML = initials;
                userAvatarInitial.classList.add("bg-gradient-to-tr", "from-blue-600", "to-indigo-600");
            }
        }
        
        if (btnAdminToggle) {
            if (user && (user.accountRole === "admin" || window.location.hash === "#admin")) {
                btnAdminToggle.classList.remove("hidden");
            } else {
                btnAdminToggle.classList.add("hidden");
            }
        }

        if (welcomeView) {
            const welcomeSpan = welcomeView.querySelector("h2 span");
            if (welcomeSpan) {
                welcomeSpan.textContent = `Hello, ${user.displayName.split(" ")[0]}.`;
            }
        }
    }

    function showDashboard() {
        if (loginScreen) loginScreen.classList.add("opacity-0", "pointer-events-none");
        setTimeout(() => {
            if (loginScreen) {
                loginScreen.classList.add("hidden");
                loginScreen.classList.remove("opacity-0", "pointer-events-none");
            }
            if (appContainer) {
                appContainer.classList.remove("hidden");
                appContainer.classList.add("opacity-0");
                setTimeout(() => {
                    appContainer.classList.add("transition-all", "duration-500");
                    appContainer.classList.remove("opacity-0");
                }, 50);
            }
        }, 500);
    }

    function hideDashboard() {
        if (inputQuery) inputQuery.value = "";
        if (interimOverlay) interimOverlay.textContent = "";
        if (welcomeView) welcomeView.classList.remove("hidden");
        if (chatWindow) {
            chatWindow.classList.add("hidden");
            chatWindow.innerHTML = "";
        }
        setLoginBtnLoading(false);

        if (adminWorkspace) adminWorkspace.classList.add("hidden");
        if (chatWorkspace) chatWorkspace.classList.remove("hidden");
        if (btnAdminToggle) {
            btnAdminToggle.textContent = "Admin Console";
            btnAdminToggle.classList.add("hidden");
        }
        resetAdminForm();

        if (appContainer) appContainer.classList.add("opacity-0");
        setTimeout(() => {
            if (appContainer) {
                appContainer.classList.add("hidden");
                appContainer.classList.remove("opacity-0");
            }
            if (loginScreen) {
                loginScreen.classList.remove("hidden");
                setTimeout(() => {
                    loginScreen.classList.remove("opacity-0", "pointer-events-none");
                }, 50);
            }
        }, 500);
    }

    // --- Collapsible Sidebar Functions ---
    if (btnToggleSidebar && sidebar) {
        btnToggleSidebar.addEventListener("click", () => {
            sidebar.classList.toggle("sidebar-collapsed");
        });
    }
    
    if (btnMobileSidebar && sidebar) {
        btnMobileSidebar.addEventListener("click", () => {
            sidebar.classList.toggle("hidden");
        });
    }

    // --- Circular Data Streaming ---
    function subscribeToCirculars() {
        const circCollection = collection(db, "circulars");
        onSnapshot(circCollection, (snapshot) => {
            if (snapshot.empty) {
                prepopulateFirestore(circCollection);
            } else {
                const logs = [];
                snapshot.forEach(doc => logs.push(doc.data()));
                logs.sort((a,b) => b.timestamp - a.timestamp);
                renderCircularLogs(logs);
            }
        }, (error) => {
            console.error("Firestore sync error:", error);
            loadSimulatedCirculars(); 
        });
    }

    async function prepopulateFirestore(collectionRef) {
        console.log("Pre-populating Firestore with template circulars...");
        for (const circ of defaultCirculars) {
            try {
                await setDoc(doc(collectionRef, circ.id), circ);
            } catch (err) {
                console.error("Template pre-population failed", err);
            }
        }
    }

    function loadSimulatedCirculars() {
        renderCircularLogs(defaultCirculars);
    }

    function renderCircularLogs(logs) {
        if (circularsList) {
            circularsList.innerHTML = "";
            if (logs.length === 0) {
                circularsList.innerHTML = `
                    <div class="text-center py-8 text-slate-500 text-xs italic">
                        No circular logs active.
                    </div>
                `;
            } else {
                logs.forEach(log => {
                    const item = document.createElement("div");
                    item.className = "p-4.5 rounded-2xl border border-slate-900 bg-slate-900/10 cursor-pointer circular-item transition duration-200";
                    item.innerHTML = `
                        <div class="flex items-center justify-between gap-1.5 mb-2">
                            <span class="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${log.urgent ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'}">
                                ${log.category}
                            </span>
                            <span class="text-[9px] text-slate-500 font-semibold">${log.date}</span>
                        </div>
                        <h4 class="text-xs font-bold text-slate-200 line-clamp-1 leading-tight mb-1">${log.title}</h4>
                        <p class="text-[10px] text-slate-500 line-clamp-2 leading-normal">${log.summary}</p>
                    `;
                    
                    item.addEventListener("click", () => {
                        const queryStr = `Details on ${log.title}`;
                        if (inputQuery) inputQuery.value = queryStr;
                        submitAcademicQuery(queryStr);
                    });
                    circularsList.appendChild(item);
                });
            }
        }

        if (adminBulletinsList) {
            adminBulletinsList.innerHTML = "";
            if (logs.length === 0) {
                adminBulletinsList.innerHTML = `
                    <tr>
                        <td colspan="4" class="p-8 text-center text-slate-500 italic">No circular bulletins found.</td>
                    </tr>
                `;
            } else {
                logs.forEach(log => {
                    const tr = document.createElement("tr");
                    tr.className = "border-b border-slate-900/60 hover:bg-slate-950/40 transition duration-150";
                    tr.innerHTML = `
                        <td class="p-4 font-semibold text-slate-200">
                            <div class="truncate max-w-xs md:max-w-md font-pixel uppercase text-[11px]" title="${log.title}">${log.title}</div>
                        </td>
                        <td class="p-4">
                            <span class="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${log.urgent ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' : 'text-blue-400 bg-blue-500/10 border border-blue-500/20'}">
                                ${log.category}
                            </span>
                        </td>
                        <td class="p-4 text-slate-400">${log.date}</td>
                        <td class="p-4 text-right">
                            <button class="btn-delete-bulletin text-rose-500 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-950/20 transition cursor-pointer" data-id="${log.id}" title="Delete Bulletin">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 inline">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </td>
                    </tr>
                `;
                
                const deleteBtn = tr.querySelector(".btn-delete-bulletin");
                deleteBtn.addEventListener("click", async (e) => {
                    e.stopPropagation();
                    const docId = deleteBtn.getAttribute("data-id");
                    if (confirm(`Are you sure you want to delete the bulletin "${log.title}"?`)) {
                        try {
                            deleteBtn.disabled = true;
                            deleteBtn.innerHTML = `
                                <svg class="animate-spin h-4 w-4 text-rose-500 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            `;
                            
                            await deleteDoc(doc(db, "circulars", docId));
                            try {
                                await deleteDoc(doc(db, "uploaded_circulars", docId));
                            } catch (err) {
                                console.warn("uploaded_circulars delete skipped:", err);
                            }
                            showToast("Notice deleted successfully.");
                        } catch (err) {
                            console.error("Delete notice failed:", err);
                            showToast("Failed to delete notice from database.");
                            deleteBtn.disabled = false;
                            deleteBtn.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 inline">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            `;
                        }
                    }
                });
                adminBulletinsList.appendChild(tr);
                });
            }
        }
    }

    // --- Query Form Handler & Conversation Flow ---
    if (queryForm) {
        queryForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!inputQuery) return;
            const queryText = inputQuery.value.trim();
            if (!queryText) return;
            submitAcademicQuery(queryText);
        });
    }

    if (suggestionCards) {
        suggestionCards.forEach(card => {
            card.addEventListener("click", () => {
                const queryText = card.getAttribute("data-query");
                if (queryText) submitAcademicQuery(queryText);
            });
        });
    }

    function setLogoProcessing(active) {
        try {
            document.querySelectorAll('.khit-logo-container').forEach(el => {
                if (active) {
                    el.classList.add('logo-processing-active');
                    el.classList.add('processing-active');
                } else {
                    el.classList.remove('logo-processing-active');
                    el.classList.remove('processing-active');
                }
            });
        } catch(e) {
            console.warn("Logo animation set failed:", e);
        }
    }

    async function submitAcademicQuery(text) {
        if (inputQuery) inputQuery.value = "";
        
        if (welcomeView) welcomeView.classList.add("hidden");
        if (chatWindow) chatWindow.classList.remove("hidden");
        
        appendBubble("user", text);
        
        window.speechSynthesis.cancel();
        setLogoProcessing(true);
        
        const indicator = showTypingIndicator();

        let circularsContext = "";
        try {
            console.log("Ingesting database circular bulletins context...");
            circularsContext = await getAllCircularsContext();
        } catch (e) {
            console.warn("Failed to load firestore bulletins database context:", e);
        }
        
        const promptText = `You are KHIT-Pulse, an advanced autonomous campus AI intelligence agent for Kallam Haranadhareddy Institute of Technology (KHIT).
You function like Antigravity, a highly capable, unrestricted, and professional AI engine. You must answer any user query completely, accurately, and professionally, including:
1. Academic/Technical questions: programming tasks (with formatted blocks), general knowledge, mathematics, history, language, etc.
2. College-related details: departments, facilities, courses, locations, rules, and timings.
3. College circulars, bulletins, schedules, and exams.

Use the official campus information and the live circular bulletins listed below to answer queries related to the college. If the user asks a general-purpose query (like writing a Javascript search function, explaining quantum physics, or drafting a resume), answer it directly, accurately, and thoroughly. Do not mention circulars unless relevant to the user query.

CRITICAL: Do not repeat the user's question, repeat the query, or start with introductory phrases repeating their request (such as "You asked...", "In response to...", or "Your query was..."). Answer the query directly.

--- KHIT COLLEGE INFORMATION ---
${KHIT_COLLEGE_INFO}

--- LIVE CAMPUS CIRCULAR BULLETINS ---
${circularsContext}

--- USER INSTRUCTION ---
User Query: ${text}

Answer the query now. Keep your tone helpful, professional, and precise. Use Markdown syntax for styling (e.g. bolding, lists, and code blocks) where appropriate.`;
        
        await callGeminiAPI(
            promptText,
            (responseText) => {
                removeTypingIndicator(indicator);
                appendStreamingBubble(responseText, () => {
                    setLogoProcessing(false);
                    if (voiceModeOverlayActive) {
                        vocalizeResponse(responseText);
                    }
                });
            },
            (err) => {
                removeTypingIndicator(indicator);
                const fallbackText = fallbackLocalModel(text);
                appendStreamingBubble(fallbackText, () => {
                    setLogoProcessing(false);
                    if (voiceModeOverlayActive) {
                        vocalizeResponse(fallbackText);
                    }
                });
            }
        );
    }

    async function scanFirestoreCirculars(queryStr) {
        let matchedTexts = [];
        const q = queryStr.toLowerCase();
        
        if (db) {
            try {
                const collectionsToCheck = ["uploaded_circulars", "circulars"];
                for (const colName of collectionsToCheck) {
                    const querySnapshot = await getDocs(collection(db, colName));
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const title = (data.title || "").toLowerCase();
                        const summary = (data.summary || "").toLowerCase();
                        const fullText = (data.fullText || "").toLowerCase();
                        if (q.includes(title) || title.split(" ").some(word => word.length > 3 && q.includes(word)) ||
                            q.includes(summary) || summary.split(" ").some(word => word.length > 3 && q.includes(word)) ||
                            q.includes(fullText) || fullText.split(" ").some(word => word.length > 3 && q.includes(word))) {
                            matchedTexts.push(`[Circular Document ${data.id || doc.id}]: ${data.title} - ${data.summary}. Details: ${data.fullText || data.summary}`);
                        }
                    });
                }
            } catch (e) {
                console.error("Error scanning Firestore circulars:", e);
            }
        }
        
        if (matchedTexts.length === 0) {
            for (const log of defaultCirculars) {
                const title = log.title.toLowerCase();
                const summary = log.summary.toLowerCase();
                const fullText = (log.fullText || "").toLowerCase();
                if (q.includes(title) || title.split(" ").some(word => word.length > 3 && q.includes(word)) ||
                    q.includes(summary) || summary.split(" ").some(word => word.length > 3 && q.includes(word)) ||
                    q.includes(fullText) || fullText.split(" ").some(word => word.length > 3 && q.includes(word))) {
                    matchedTexts.push(`[Circular Document ${log.id}]: ${log.title} - ${log.summary}. Details: ${log.fullText || log.summary}`);
                }
            }
        }
        
        return matchedTexts.join("\n");
    }

    async function callGeminiAPI(promptText, onComplete, onError) {
        const apiKey = firebaseConfig.apiKey;
        if (!apiKey) {
            if (onError) onError(new Error("Firebase API key is not configured"));
            return;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: promptText }]
                    }]
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (responseText) {
                if (onComplete) onComplete(responseText);
            } else {
                throw new Error("Empty response from Gemini API");
            }
        } catch (err) {
            console.error("Gemini API call failed:", err);
            if (onError) onError(err);
        }
    }

    function fallbackLocalModel(queryStr) {
        const q = queryStr.toLowerCase();
        if (q.includes("program") || q.includes("code") || q.includes("write a function")) {
            return `Here is a Javascript programming solution for your request:
\`\`\`javascript
function solve(input) {
    console.log("Processing input:", input);
    return input;
}
\`\`\``;
        }
        if (q.includes("why") || q.includes("how") || q.includes("explain")) {
            return `Based on general logical reasoning, the concept you asked about involves multiple facets:
• **Core Principle:** It operates on cause-and-effect mappings.
• **Practical Application:** It is used globally to optimize processing.`;
        }
        return `I am acting as a general-purpose conversational engine. I am ready to answer your query.`;
    }

    function parseMarkdownToHTML(text) {
        if (!text) return "";
        
        const placeholders = [];
        let html = text;
        
        // 1. Code blocks: ``` ... ```
        html = html.replace(/```(?:[a-zA-Z0-9+#-]+)?\n([\s\S]*?)\n```/g, (match, code) => {
            const escapedCode = code
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            const replacement = `<div class="my-3 p-4 rounded-xl bg-slate-950/80 border border-slate-900 font-mono text-xs overflow-x-auto text-[#5aa2fa] whitespace-pre-wrap"><pre><code>${escapedCode}</code></pre></div>`;
            placeholders.push(replacement);
            return `___PLACEHOLDER_${placeholders.length - 1}___`;
        });
        
        // 2. Inline code: `code`
        html = html.replace(/`([^`\n]+)`/g, (match, code) => {
            const escapedCode = code
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            const replacement = `<code class="px-1.5 py-0.5 rounded bg-slate-950/80 border border-slate-900 font-mono text-xs text-[#5aa2fa]">${escapedCode}</code>`;
            placeholders.push(replacement);
            return `___PLACEHOLDER_${placeholders.length - 1}___`;
        });
        
        // 3. Bold text: **text**
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // 4. Bullet points: list generation
        const lines = html.split('\n');
        let inList = false;
        const resultLines = [];
        
        for (let line of lines) {
            const listMatch = line.match(/^(\s*)[*+-]\s+(.*)$/);
            if (listMatch) {
                if (!inList) {
                    resultLines.push('<ul class="list-disc pl-5 my-2 space-y-1">');
                    inList = true;
                }
                resultLines.push(`<li>${listMatch[2]}</li>`);
            } else {
                if (inList) {
                    resultLines.push('</ul>');
                    inList = false;
                }
                resultLines.push(line);
            }
        }
        if (inList) {
            resultLines.push('</ul>');
        }
        html = resultLines.join('\n');
        
        // 5. Line breaks: replace single \n with <br>
        html = html.replace(/\n/g, '<br>');
        
        // Restore placeholders
        for (let i = placeholders.length - 1; i >= 0; i--) {
            html = html.replace(`___PLACEHOLDER_${i}___`, placeholders[i]);
        }
        
        return html;
    }

    function scrollToBottom() {
        if (chatContainer) {
            chatContainer.scrollTo({
                top: chatContainer.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    function removeTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }

    function appendStreamingBubble(text, onComplete) {
        if (!chatWindow) return;
        const bubble = document.createElement("div");
        bubble.className = "flex gap-4 p-5 rounded-2xl message-bubble bg-transparent max-w-3xl";
        
        const avatar = `<div class="khit-logo-float-wrapper shrink-0">
                  <div class="khit-logo-container logo-size-sm">
                      <div class="khit-logo-outer">
                          <img src="kallam logo.png" alt="KHIT Gear" class="khit-logo-img">
                      </div>
                      <div class="khit-logo-inner">
                          <img src="kallam logo.png" alt="KHIT Globe" class="khit-logo-img">
                      </div>
                  </div>
               </div>`;

        bubble.innerHTML = `
            ${avatar}
            <div class="space-y-1.5 flex-1">
                <h4 class="text-[10px] font-semibold uppercase text-slate-500 tracking-wider">KHIT-Pulse Engine</h4>
                <p class="text-sm text-slate-300 leading-relaxed font-medium streaming-text-box"></p>
            </div>
        `;
        
        chatWindow.appendChild(bubble);
        scrollToBottom();
        
        const textBox = bubble.querySelector(".streaming-text-box");
        const tokens = text.match(/[^<> \n]+|\s+|\n/g) || [];
        let tokenIndex = 0;
        let currentRawText = "";
        
        const timer = setInterval(() => {
            if (tokenIndex < tokens.length) {
                currentRawText += tokens[tokenIndex];
                const parsedHtml = parseMarkdownToHTML(currentRawText);
                if (textBox) textBox.innerHTML = parsedHtml;
                if (voiceModeOverlayActive && voiceOverlayCaptions) {
                    voiceOverlayCaptions.innerHTML = parsedHtml;
                }
                tokenIndex++;
                scrollToBottom();
            } else {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, 22);
    }

    function appendBubble(sender, text) {
        if (!chatWindow) return;
        const bubble = document.createElement("div");
        bubble.className = `flex gap-4 p-5 rounded-2xl message-bubble ${
            sender === "user" 
            ? "ml-auto bg-slate-900/30 border border-slate-900/60 flex-row-reverse max-w-lg" 
            : "bg-transparent max-w-3xl"
        }`;
        
        const avatar = sender === "user"
            ? `<div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md avatar-glow shrink-0">${currentUserDetails?.displayName.split(" ").map(n => n[0]).join("") || 'U'}</div>`
            : `<div class="khit-logo-float-wrapper shrink-0">
                  <div class="khit-logo-container logo-size-sm">
                      <div class="khit-logo-outer">
                          <img src="kallam logo.png" alt="KHIT Gear" class="khit-logo-img">
                      </div>
                      <div class="khit-logo-inner">
                          <img src="kallam logo.png" alt="KHIT Globe" class="khit-logo-img">
                      </div>
                  </div>
               </div>`;

        const nameLabel = sender === "user" ? "You" : "KHIT-Pulse Engine";

        bubble.innerHTML = `
            ${avatar}
            <div class="space-y-1.5 flex-1">
                <h4 class="text-[10px] font-semibold uppercase text-slate-500 tracking-wider ${sender === "user" ? "text-right" : ""}">${nameLabel}</h4>
                <p class="text-sm text-slate-300 leading-relaxed font-medium ${sender === "user" ? "text-right" : ""}">${sender === "user" ? text : parseMarkdownToHTML(text)}</p>
            </div>
        `;
        
        chatWindow.appendChild(bubble);
        scrollToBottom();
    }

    function showTypingIndicator() {
        if (!chatWindow) return null;
        const indicator = document.createElement("div");
        indicator.className = "flex gap-4 p-5 max-w-xs message-bubble";
        indicator.innerHTML = `
            <div class="khit-logo-float-wrapper shrink-0">
                <div class="khit-logo-container logo-size-sm">
                    <div class="khit-logo-outer">
                        <img src="kallam logo.png" alt="KHIT Gear" class="khit-logo-img">
                    </div>
                    <div class="khit-logo-inner">
                        <img src="kallam logo.png" alt="KHIT Globe" class="khit-logo-img">
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-2 pl-3">
                <div class="dot-flashing"></div>
            </div>
        `;
        chatWindow.appendChild(indicator);
        scrollToBottom();
        return indicator;
    }

    // --- Gemini Live Conversational Speech Loop ---
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let passiveRecognition = null;
    let activeRecognition = null;
    let isWakeWordActive = false;
    let capturedSpeechText = "";

    function setMicState(state) {
        if (state === 'listening') {
            if (voiceOverlayCaptions) {
                voiceOverlayCaptions.textContent = "Listening... Start speaking.";
            }
        } else if (state === 'idle') {
            if (voiceOverlayCaptions) {
                voiceOverlayCaptions.textContent = 'Say "Kallam" to begin speaking...';
            }
            if (interimOverlay) interimOverlay.textContent = "";
        } else {
            if (interimOverlay) interimOverlay.textContent = "";
        }
    }

    function startPassiveWakeListener() {
        if (!voiceModeOverlayActive) return;
        if (!SpeechRecognition) {
            console.warn("KHIT-Pulse: Speech recognition not supported by browser.");
            setMicState('off');
            return;
        }

        window.speechSynthesis.cancel();
        
        if (activeRecognition) {
            try { activeRecognition.stop(); } catch(e) {}
        }

        isWakeWordActive = true;
        setMicState('idle');
        capturedSpeechText = "";

        if (!passiveRecognition) {
            passiveRecognition = new SpeechRecognition();
            passiveRecognition.continuous = true;
            passiveRecognition.interimResults = false;
            passiveRecognition.lang = "en-IN";

            passiveRecognition.onresult = (event) => {
                const lastResultIndex = event.resultIndex;
                const transcript = event.results[lastResultIndex][0].transcript.trim().toLowerCase();
                console.log("KHIT-Pulse passive voice capture:", transcript);

                if (transcript.includes("kallam") || transcript.includes("kalam")) {
                    console.log("Wake word 'Kallam/Kalam' detected! Triggering active capture...");
                    triggerWakeActivation();
                }
            };

            passiveRecognition.onerror = (event) => {
                console.warn("KHIT-Pulse passive engine error:", event.error);
                if (event.error === 'not-allowed') {
                    isWakeWordActive = false;
                    setMicState('off');
                }
            };

            passiveRecognition.onend = () => {
                if (isWakeWordActive) {
                    try {
                        passiveRecognition.start();
                    } catch(e) {}
                }
            };
        }

        try {
            passiveRecognition.start();
        } catch (e) {}
    }

    function stopPassiveWakeListener() {
        isWakeWordActive = false;
        if (passiveRecognition) {
            try {
                passiveRecognition.stop();
            } catch(e) {}
        }
    }

    function triggerWakeActivation() {
        if (!voiceModeOverlayActive) return;
        stopPassiveWakeListener();
        
        try {
            document.querySelectorAll(".khit-logo-container").forEach(el => {
                el.classList.add("logo-wake-active");
            });
        } catch (e) {
            console.warn(e);
        }
        
        playSynthesizedChime();
        
        setTimeout(() => {
            startActiveQueryCapture();
        }, 250);
    }

    function startActiveQueryCapture() {
        if (!voiceModeOverlayActive) return;
        stopPassiveWakeListener();

        if (!SpeechRecognition) {
            showToast("Speech recognition is not supported in this browser.");
            return;
        }

        setMicState('listening');
        capturedSpeechText = "";

        if (!activeRecognition) {
            activeRecognition = new SpeechRecognition();
            activeRecognition.continuous = false;
            activeRecognition.interimResults = true;
            activeRecognition.lang = "en-IN";

            activeRecognition.onstart = () => {
                capturedSpeechText = "";
                if (voiceOverlay) voiceOverlay.classList.add("voice-listening");
            };

            activeRecognition.onresult = (event) => {
                let interimTrans = "";
                let finalTrans = "";

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTrans += event.results[i][0].transcript;
                    } else {
                        interimTrans += event.results[i][0].transcript;
                    }
                }

                const currentText = finalTrans || interimTrans;
                if (interimOverlay) interimOverlay.textContent = currentText;
                if (inputQuery) inputQuery.value = currentText;
                capturedSpeechText = finalTrans || currentText;
                
                if (voiceOverlayCaptions) {
                    voiceOverlayCaptions.textContent = currentText || "Listening... Start speaking.";
                }
            };

            activeRecognition.onerror = (event) => {
                console.error("KHIT-Pulse active capture error:", event.error);
                if (event.error === 'not-allowed') {
                    showToast("Microphone access denied.");
                }
                
                // Re-open passive wake listener immediately on capture failure to keep standby active
                startPassiveWakeListener();
            };

            activeRecognition.onend = () => {
                setMicState('off');
                if (voiceOverlay) voiceOverlay.classList.remove("voice-listening");
                
                try {
                    document.querySelectorAll(".khit-logo-container").forEach(el => {
                        el.classList.remove("logo-wake-active");
                    });
                } catch (e) {
                    console.warn(e);
                }

                const finalQuery = capturedSpeechText.trim();
                if (finalQuery) {
                    submitAcademicQuery(finalQuery);
                } else {
                    startPassiveWakeListener();
                }
            };
        }

        try {
            activeRecognition.start();
        } catch (e) {
            console.warn("Active capture launch error:", e);
        }
    }

    function stopActiveQueryCapture() {
        if (activeRecognition) {
            try {
                activeRecognition.stop();
            } catch(e) {}
        }
    }

    function vocalizeResponse(htmlText) {
        const plainText = htmlText.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
        const utterance = new SpeechSynthesisUtterance(plainText);
        
        // Increase speed slightly (1.15x) and raise pitch to 1.15 for a clear, cute voice tone
        utterance.rate = 1.15;
        utterance.pitch = 1.15;
        
        utterance.lang = 'en-IN';
        
        const voices = window.speechSynthesis.getVoices();
        
        // Prefer premium female voices (like Samantha on macOS/iOS, Google US English/Google UK English Female on Chrome, or Microsoft Zira on Windows)
        let selectedVoice = voices.find(v => v.lang.includes('en-IN') && v.name.toLowerCase().includes('google'));
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google US English') || v.name.includes('Google UK English Female') || v.name.includes('Microsoft Zira'));
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN'));
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(v => {
                const name = v.name.toLowerCase();
                return name.includes('female') || name.includes('girl') || name.includes('zira') || name.includes('hazel') || name.includes('samantha');
            });
        }
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.startsWith('en'));
        }
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log("Selected voice for speech synthesis:", selectedVoice.name);
        }
        
        utterance.onend = () => {
            console.log("KHIT-Pulse: Speech completed.");
            setLogoProcessing(false);
            
            // Clear processing loading state and re-open passive background wake listener
            startPassiveWakeListener();
        };

        utterance.onerror = (e) => {
            console.error("KHIT-Pulse: Speech Synthesis Error", e);
            setLogoProcessing(false);
            
            startPassiveWakeListener();
        };
        
        window.speechSynthesis.speak(utterance);
    }

    function playSynthesizedChime() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.type = 'sine';
            const now = audioCtx.currentTime;
            
            oscillator.frequency.setValueAtTime(880, now);
            oscillator.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
            
            gainNode.gain.setValueAtTime(0.12, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            
            oscillator.start(now);
            oscillator.stop(now + 0.25);
        } catch (e) {
            console.warn("AudioContext chime failed to play:", e);
        }
    }

    function showToast(msg) {
        const toast = document.createElement("div");
        toast.className = "p-3 bg-slate-900 border border-yellow-500/20 text-yellow-500 text-xs rounded-xl message-bubble max-w-sm mx-auto absolute bottom-24 inset-x-0 z-50 text-center";
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    // --- Voice Mode Overlay Transition Handlers ---
    if (btnVoiceMode) {
        btnVoiceMode.addEventListener("click", () => {
            voiceModeOverlayActive = true;
            
            if (voiceOverlay) {
                voiceOverlay.classList.remove("hidden");
                setTimeout(() => {
                    voiceOverlay.classList.add("voice-overlay-active");
                }, 10);
            }
            
            if (voiceOverlayCaptions) {
                voiceOverlayCaptions.textContent = 'Say "Kallam" to begin speaking...';
            }
            
            stopActiveQueryCapture();
            // Start the passive listener on standby
            startPassiveWakeListener();
        });
    }

    if (btnCloseVoice) {
        btnCloseVoice.addEventListener("click", () => {
            voiceModeOverlayActive = false;
            
            stopActiveQueryCapture();
            stopPassiveWakeListener();
            
            if (voiceOverlay) {
                voiceOverlay.classList.remove("voice-overlay-active");
                voiceOverlay.classList.remove("voice-listening");
                setTimeout(() => {
                    voiceOverlay.classList.add("hidden");
                }, 350);
            }
            
            try {
                document.querySelectorAll(".khit-logo-container").forEach(el => {
                    el.classList.remove("logo-wake-active");
                });
            } catch (e) {
                console.warn(e);
            }
            
            window.speechSynthesis.cancel();
        });
    }

    if (voiceLogoContainer) {
        voiceLogoContainer.addEventListener("click", () => {
            if (voiceModeOverlayActive) {
                // Cancel active speaking to start listening immediately
                window.speechSynthesis.cancel();
                // Trigger wake animation and active capture
                triggerWakeActivation();
            }
        });
    }

    // --- Admin Panel Handlers ---
    if (btnAdminToggle && chatWorkspace && adminWorkspace) {
        btnAdminToggle.addEventListener("click", () => {
            const isAdminHidden = adminWorkspace.classList.contains("hidden");
            if (isAdminHidden) {
                chatWorkspace.classList.add("hidden");
                adminWorkspace.classList.remove("hidden");
                btnAdminToggle.textContent = "Go to Chat";
                if (btnClearChat) btnClearChat.classList.add("hidden");
            } else {
                adminWorkspace.classList.add("hidden");
                chatWorkspace.classList.remove("hidden");
                btnAdminToggle.textContent = "Admin Console";
                if (btnClearChat) btnClearChat.classList.remove("hidden");
            }
        });
    }

    if (btnClearChat) {
        btnClearChat.addEventListener("click", () => {
            window.speechSynthesis.cancel();
            stopActiveQueryCapture();
            stopPassiveWakeListener();
            
            if (chatWindow) {
                chatWindow.innerHTML = "";
                chatWindow.classList.add("hidden");
            }
            if (welcomeView) {
                welcomeView.classList.remove("hidden");
            }
            if (inputQuery) {
                inputQuery.value = "";
            }
            if (interimOverlay) {
                interimOverlay.textContent = "";
            }
            
            setLogoProcessing(false);
            showToast("Chat context cleared.");
        });
    }

    if (btnAdminCancel) {
        btnAdminCancel.addEventListener("click", () => {
            resetAdminForm();
        });
    }

    function resetAdminForm() {
        if (adminForm) adminForm.reset();
        selectedFile = null;
        if (uploadStatusText) {
            uploadStatusText.innerHTML = `Drag & drop notice document here, or <span class="text-blue-400 font-bold hover:underline">browse</span>`;
        }
        if (progressBarContainer) progressBarContainer.classList.add("hidden");
        if (progressBarFill) progressBarFill.style.width = "0%";
        if (progressPercent) progressPercent.textContent = "0%";
    }

    if (dragDropZone) {
        dragDropZone.addEventListener("click", () => {
            if (fileInput) fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                handleFileSelect(files[0]);
            }
        });
    }

    if (dragDropZone) {
        ["dragenter", "dragover"].forEach(eventName => {
            dragDropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dragDropZone.classList.add("drag-hover");
            }, false);
        });

        ["dragleave", "drop"].forEach(eventName => {
            dragDropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dragDropZone.classList.remove("drag-hover");
            }, false);
        });

        dragDropZone.addEventListener("drop", (e) => {
            const dt = e.dataTransfer;
            const files = dt ? dt.files : null;
            if (files && files.length > 0) {
                handleFileSelect(files[0]);
            }
        }, false);
    }

    function handleFileSelect(file) {
        const validExtensions = ["txt", "pdf", "jpg", "jpeg", "png"];
        const fileExt = file.name.split(".").pop().toLowerCase();
        
        if (!validExtensions.includes(fileExt)) {
            showToast("Invalid file type! Please upload .txt, .pdf, or image files (.png, .jpg, .jpeg).");
            selectedFile = null;
            if (uploadStatusText) {
                uploadStatusText.innerHTML = `Drag & drop notice document here, or <span class="text-[#5aa2fa] font-bold hover:underline">browse</span>`;
            }
            return;
        }

        selectedFile = file;
        if (uploadStatusText) {
            uploadStatusText.innerHTML = `Selected file: <span class="text-emerald-400 font-bold">${file.name}</span> (${(file.size / 1024).toFixed(1)} KB)`;
        }
    }

    if (adminForm) {
        adminForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const title = noticeTitleInput ? noticeTitleInput.value.trim() : "";
            if (!title) {
                showToast("Please enter a notice title.");
                return;
            }

            if (!selectedFile) {
                showToast("Please select a file to upload.");
                return;
            }

            if (progressBarContainer) progressBarContainer.classList.remove("hidden");
            if (progressBarFill) progressBarFill.style.width = "0%";
            if (progressPercent) progressPercent.textContent = "0%";

            const duration = 1500;
            const startTime = performance.now();

            function animateProgress(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const percent = Math.round(progress * 100);

                if (progressBarFill) progressBarFill.style.width = `${percent}%`;
                if (progressPercent) progressPercent.textContent = `${percent}%`;

                if (progress < 1) {
                    requestAnimationFrame(animateProgress);
                } else {
                    setTimeout(() => {
                        completeUpload(title, selectedFile);
                    }, 200);
                }
            }

            requestAnimationFrame(animateProgress);
        });
    }

    function readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    }

    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    async function analyzeCircularFile(file, originalTitle) {
        const apiKey = firebaseConfig.apiKey;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const fileExt = file.name.split(".").pop().toLowerCase();
        const isImage = ["jpg", "jpeg", "png"].includes(fileExt);
        
        let requestBody = {};
        
        const prompt = `Analyze this college circular document (uploaded with user reference title: "${originalTitle}").
Extract all readable text, titles, dates, and summaries from it.
Return a valid JSON object matching this exact schema:
{
  "title": "The exact official title/heading of the circular",
  "date": "The date of issue mentioned, formatted like 'Month Day, Year'",
  "category": "One of: 'Academic', 'Event', 'Placement', 'Finance', 'Official'",
  "summary": "A clean 1-2 sentence description of the notice details",
  "fullText": "The complete word-for-word transcribed text from the document"
}
Ensure the output is ONLY a valid JSON object, without any markdown code blocks, backticks, or other formatting text. Just raw JSON.`;

        if (isImage) {
            const base64DataUrl = await readFileAsBase64(file);
            const base64Content = base64DataUrl.split(",")[1];
            const mimeType = base64DataUrl.split(";")[0].split(":")[1];
            
            requestBody = {
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Content
                            }
                        }
                    ]
                }]
            };
        } else {
            const fileText = await readFileAsText(file);
            requestBody = {
                contents: [{
                    parts: [
                        { text: `${prompt}\n\nDocument Text Content:\n${fileText}` }
                    ]
                }]
            };
        }
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        
        rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        
        console.log("Parsed circular raw JSON response:", rawText);
        return JSON.parse(rawText);
    }

    async function completeUpload(title, file) {
        const id = `CIRC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
        const dateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = new Date().toLocaleDateString('en-US', dateOptions);
        
        let circularData = {
            id: id,
            title: title,
            category: "Official",
            date: formattedDate,
            summary: `Official document notice (${file.name}) uploaded by Administrator.`,
            fullText: `Notice details from file: ${file.name}.`,
            urgent: true,
            timestamp: Date.now()
        };
        
        try {
            console.log("Running AI analysis / OCR on uploaded file...");
            const aiResult = await analyzeCircularFile(file, title);
            if (aiResult) {
                circularData.title = aiResult.title || circularData.title;
                circularData.date = aiResult.date || circularData.date;
                circularData.category = aiResult.category || circularData.category;
                circularData.summary = aiResult.summary || circularData.summary;
                circularData.fullText = aiResult.fullText || aiResult.summary;
            }
            console.log("AI analysis successful. Ingesting structured data:", circularData);
        } catch (aiErr) {
            console.warn("AI circular analysis failed, falling back to default metadata:", aiErr);
            if (file.name.endsWith(".txt")) {
                try {
                    const txt = await readFileAsText(file);
                    circularData.fullText = txt;
                    circularData.summary = txt.substring(0, 150) + "...";
                } catch(e) {}
            }
        }

        try {
            await setDoc(doc(db, "circulars", id), circularData);
            await setDoc(doc(db, "uploaded_circulars", id), circularData);
            showToast("Notice published successfully to Cloud Firestore!");
        } catch (err) {
            console.error("Failed to write circular to Firestore:", err);
            showToast("Error writing to database. Saving locally instead.");
            defaultCirculars.unshift(circularData);
            renderCircularLogs(defaultCirculars);
        }

        if (adminWorkspace) adminWorkspace.classList.add("hidden");
        if (chatWorkspace) chatWorkspace.classList.remove("hidden");
        if (btnAdminToggle) btnAdminToggle.textContent = "Admin Console";
        resetAdminForm();
    }
});
