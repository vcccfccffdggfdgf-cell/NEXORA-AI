const $=id=>document.getElementById(id);
const KEY="nexora_official_chats_v1";
let chats=readChats(),activeId=null,toastTimer=null,attachedFile=null,currentLang=localStorage.getItem("nexora_language")||"en";
const translations={
en:{newChat:"New chat",workspace:"WORKSPACE",home:"Home",history:"History",discover:"Discover",settings:"Settings",recent:"RECENT CONVERSATIONS",personalWorkspace:"Personal workspace",tagline:"Intelligence, refined.",workspaceTitle:"AI WORKSPACE",eyebrow:"A CLEARER WAY TO THINK",greeting:"What would you like<br><em>to explore?</em>",welcomeCopy:"A thoughtful space to ask, create, learn and get things done.",learn:"Learn",learnDesc:"Understand something new",create:"Create",createDesc:"Turn ideas into a plan",code:"Code",codeDesc:"Build and solve problems",plan:"Plan",planDesc:"Bring structure to your day",historyTitle:"Conversation history",historyCopy:"Your previous conversations, saved on this device.",searchConversations:"Search conversations...",exportAll:"Export all",discoverTitle:"Explore possibilities",discoverCopy:"Choose a starting point for your next task.",research:"Research & learn",researchDesc:"Break down topics and explore ideas",brainstorm:"Brainstorm",brainstormDesc:"Generate and shape new concepts",programming:"Programming",programmingDesc:"Understand, write and debug code",writing:"Writing",writingDesc:"Draft, rewrite and improve text",inspiredBy:"Inspired by modern AI workspaces",inspiredCopy:"NEXORA brings together a clean chat experience, saved conversations, writing and coding shortcuts, and a focused workspace. External AI models and live web search can be connected in a later version.",preferences:"PREFERENCES",settingsTitle:"Settings",settingsCopy:"Configure your NEXORA workspace.",language:"Language",languageDesc:"Change the interface language.",appearance:"Appearance",appearanceDesc:"A minimal black interface.",blackTheme:"Black / White",privacy:"Conversation storage",privacyDesc:"Conversations stay in this browser on this device.",localStorage:"Local",aiProvider:"AI connection",aiProviderDesc:"An AI provider has not been connected yet.",notConnected:"Not connected",clearChats:"Delete all conversations",generalMode:"General",creativeMode:"Creative",reasoningMode:"Reasoning",codingMode:"Coding",messagePlaceholder:"Message NEXORA...",disclaimer:"NEXORA may make mistakes. Verify important information.",noChats:"No conversations yet.",noResults:"No matching conversations.",saved:"Saved on this device.",attachUnsupported:"File selected. File reading will be added when AI connection is enabled.",voiceUnsupported:"Voice input is not supported by this browser.",voiceListening:"Listening… speak now.",confirmClear:"Delete all saved conversations from this browser?",deleted:"All conversations deleted.",exported:"Conversation export prepared.",searchHint:"Search your conversations.",aiNotice:"Your message is saved. Connect an AI provider to receive generated answers.",file:"File"},
ar:{newChat:"محادثة جديدة",workspace:"مساحة العمل",home:"الرئيسية",history:"السجل",discover:"استكشف",settings:"الإعدادات",recent:"المحادثات الأخيرة",personalWorkspace:"مساحة العمل الشخصية",tagline:"ذكاء، بأسلوب متقن.",workspaceTitle:"مساحة الذكاء الاصطناعي",eyebrow:"طريقة أوضح للتفكير",greeting:"ماذا تودّ<br><em>أن تستكشف؟</em>",welcomeCopy:"مساحة هادئة للسؤال والإبداع والتعلّم وإنجاز المهام.",learn:"تعلّم",learnDesc:"افهم شيئًا جديدًا",create:"إبداع",createDesc:"حوّل الأفكار إلى خطة",code:"برمجة",codeDesc:"أنشئ حلولًا واكتب الأكواد",plan:"تنظيم",planDesc:"رتّب مهام يومك",historyTitle:"سجل المحادثات",historyCopy:"محادثاتك السابقة محفوظة على هذا الجهاز.",searchConversations:"ابحث في المحادثات...",exportAll:"تصدير الكل",discoverTitle:"اكتشف الإمكانيات",discoverCopy:"اختر نقطة بداية لمهمتك التالية.",research:"البحث والتعلّم",researchDesc:"افهم المواضيع واستكشف الأفكار",brainstorm:"العصف الذهني",brainstormDesc:"ابتكر أفكارًا وطوّرها",programming:"البرمجة",programmingDesc:"افهم الأكواد واكتبها وأصلحها",writing:"الكتابة",writingDesc:"اكتب النصوص وأعد صياغتها وحسّنها",inspiredBy:"مستوحى من مساحات الذكاء الاصطناعي الحديثة",inspiredCopy:"يجمع NEXORA بين تجربة محادثة واضحة وسجل محفوظ واختصارات للكتابة والبرمجة ومساحة عمل مركّزة. يمكن ربط نماذج ذكاء اصطناعي خارجية والبحث المباشر على الويب في إصدار لاحق.",preferences:"التفضيلات",settingsTitle:"الإعدادات",settingsCopy:"خصّص مساحة عمل NEXORA.",language:"اللغة",languageDesc:"غيّر لغة واجهة التطبيق.",appearance:"المظهر",appearanceDesc:"واجهة سوداء بسيطة.",blackTheme:"أسود / أبيض",privacy:"حفظ المحادثات",privacyDesc:"تُحفظ المحادثات في هذا المتصفح على هذا الجهاز.",localStorage:"محلي",aiProvider:"اتصال الذكاء الاصطناعي",aiProviderDesc:"لم يتم ربط مزوّد ذكاء اصطناعي بعد.",notConnected:"غير متصل",clearChats:"حذف جميع المحادثات",generalMode:"عام",creativeMode:"إبداعي",reasoningMode:"استدلال",codingMode:"برمجة",messagePlaceholder:"اكتب رسالتك إلى NEXORA...",disclaimer:"قد يخطئ NEXORA. تحقّق من المعلومات المهمة.",noChats:"لا توجد محادثات بعد.",noResults:"لا توجد محادثات مطابقة.",saved:"تم الحفظ على هذا الجهاز.",attachUnsupported:"تم اختيار الملف. ستتوفر قراءة الملفات بعد ربط الذكاء الاصطناعي.",voiceUnsupported:"الإدخال الصوتي غير مدعوم في هذا المتصفح.",voiceListening:"جارٍ الاستماع… تكلّم الآن.",confirmClear:"هل تريد حذف جميع المحادثات المحفوظة في هذا المتصفح؟",deleted:"تم حذف جميع المحادثات.",exported:"تم تجهيز تصدير المحادثات.",searchHint:"ابحث في محادثاتك.",aiNotice:"تم حفظ رسالتك. اربط مزوّد ذكاء اصطناعي للحصول على إجابات مولّدة.",file:"ملف"},
fr:{newChat:"Nouvelle discussion",workspace:"ESPACE DE TRAVAIL",home:"Accueil",history:"Historique",discover:"Découvrir",settings:"Paramètres",recent:"DISCUSSIONS RÉCENTES",personalWorkspace:"Espace personnel",tagline:"L’intelligence, avec précision.",workspaceTitle:"ESPACE IA",eyebrow:"UNE FAÇON PLUS CLAIRE DE PENSER",greeting:"Que souhaitez-vous<br><em>explorer ?</em>",welcomeCopy:"Un espace pour poser des questions, créer, apprendre et avancer.",learn:"Apprendre",learnDesc:"Comprendre quelque chose",create:"Créer",createDesc:"Transformer une idée en plan",code:"Coder",codeDesc:"Créer et résoudre",plan:"Organiser",planDesc:"Structurer votre journée",historyTitle:"Historique des discussions",historyCopy:"Vos discussions précédentes, enregistrées sur cet appareil.",searchConversations:"Rechercher des discussions...",exportAll:"Tout exporter",discoverTitle:"Explorer les possibilités",discoverCopy:"Choisissez un point de départ.",research:"Recherche et apprentissage",researchDesc:"Comprendre des sujets et explorer des idées",brainstorm:"Brainstorming",brainstormDesc:"Générer et développer des idées",programming:"Programmation",programmingDesc:"Comprendre, écrire et corriger du code",writing:"Rédaction",writingDesc:"Rédiger, reformuler et améliorer",inspiredBy:"Inspiré des espaces IA modernes",inspiredCopy:"NEXORA réunit une interface de discussion claire, un historique enregistré et des raccourcis pour l’écriture et le code. Des modèles IA externes et la recherche web pourront être connectés ultérieurement.",preferences:"PRÉFÉRENCES",settingsTitle:"Paramètres",settingsCopy:"Configurez votre espace NEXORA.",language:"Langue",languageDesc:"Changer la langue de l’interface.",appearance:"Apparence",appearanceDesc:"Une interface noire minimaliste.",blackTheme:"Noir / Blanc",privacy:"Stockage des discussions",privacyDesc:"Les discussions restent dans ce navigateur sur cet appareil.",localStorage:"Local",aiProvider:"Connexion IA",aiProviderDesc:"Aucun fournisseur IA n’est encore connecté.",notConnected:"Non connecté",clearChats:"Supprimer toutes les discussions",generalMode:"Général",creativeMode:"Créatif",reasoningMode:"Raisonnement",codingMode:"Code",messagePlaceholder:"Écrivez à NEXORA...",disclaimer:"NEXORA peut se tromper. Vérifiez les informations importantes.",noChats:"Aucune discussion pour le moment.",noResults:"Aucune discussion correspondante.",saved:"Enregistré sur cet appareil.",attachUnsupported:"Fichier sélectionné. La lecture des fichiers sera ajoutée après la connexion IA.",voiceUnsupported:"La saisie vocale n’est pas prise en charge par ce navigateur.",voiceListening:"Écoute en cours… parlez maintenant.",confirmClear:"Supprimer toutes les discussions enregistrées dans ce navigateur ?",deleted:"Toutes les discussions ont été supprimées.",exported:"Export des discussions préparé.",aiNotice:"Votre message est enregistré. Connectez un fournisseur IA pour recevoir des réponses générées.",file:"Fichier"}
};
function t(k){return translations[currentLang]?.[k]||translations.en[k]||k}
function readChats(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}}
function save(){localStorage.setItem(KEY,JSON.stringify(chats))}
function activeChat(){return chats.find(c=>c.id===activeId)}
function id(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2600)}
function applyLanguage(lang){
 currentLang=lang;localStorage.setItem("nexora_language",lang);
 document.documentElement.lang=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";
 document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(translations[lang][key])el.innerHTML=translations[lang][key]});
 document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{const key=el.dataset.i18nPlaceholder;el.placeholder=t(key)});
 $("languageSelect").value=lang;
 document.querySelectorAll("[data-prompt-en]").forEach(el=>{el.dataset.prompt=el.dataset["prompt"+lang.toUpperCase()]||el.dataset.promptEn});
 renderRecent();renderHistory();
}
function setPage(page){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 $(page+"Page").classList.add("active");
 document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 $("composerWrap").style.display=page==="home"?"flex":"none";
 if(page==="history")renderHistory();
 $("sidebar").classList.remove("open");$("overlay").classList.remove("show");
}
function renderRecent(){
 const host=$("recentList");host.innerHTML="";
 if(!chats.length){host.innerHTML=`<div class="recent-empty">${t("noChats")}</div>`;return}
 chats.slice().reverse().slice(0,9).forEach(c=>{const b=document.createElement("button");b.className="recent-chat";b.textContent=c.title;b.onclick=()=>openChat(c.id);host.appendChild(b)});
}
function renderMessages(){
 const host=$("messages");host.innerHTML="";const chat=activeChat(),items=chat?.messages||[];
 $("welcome").style.display=items.length?"none":"flex";
 items.forEach(m=>{const row=document.createElement("div");row.className="message "+m.role;if(m.role==="assistant"){const mark=document.createElement("div");mark.className="message-mark";mark.textContent="N";row.appendChild(mark)}const bubble=document.createElement("div");bubble.className="bubble";bubble.textContent=m.text;row.appendChild(bubble);host.appendChild(row)});
 $("homePage").scrollTop=$("homePage").scrollHeight;
}
function renderHistory(){
 const host=$("historyList");if(!host)return;host.innerHTML="";
 const q=($("historySearch")?.value||"").toLowerCase();
 const filtered=chats.slice().reverse().filter(c=>c.title.toLowerCase().includes(q));
 if(!filtered.length){host.innerHTML=`<div class="recent-empty">${q?t("noResults"):t("noChats")}</div>`;return}
 filtered.forEach(c=>{const b=document.createElement("button");b.className="history-entry";const title=document.createElement("b");title.textContent=c.title;const meta=document.createElement("small");meta.textContent=`${c.messages.length} · ${t("saved")}`;b.append(title,meta);b.onclick=()=>{openChat(c.id);setPage("home")};host.appendChild(b)});
}
function openChat(chatId){activeId=chatId;renderMessages();setPage("home")}
function newChat(){activeId=null;$("messageInput").value="";$("messageInput").style.height="auto";renderMessages();setPage("home");$("messageInput").focus()}
function sendMessage(text){
 const value=(text??$("messageInput").value).trim();if(!value)return;
 let chat=activeChat();if(!chat){chat={id:id(),title:value.length>42?value.slice(0,42)+"…":value,messages:[],created:Date.now()};chats.push(chat);activeId=chat.id}
 let full=value;if(attachedFile)full+=`\n[${t("file")}: ${attachedFile}]`;
 chat.messages.push({role:"user",text:full,mode:$("modeSelect").value});save();attachedFile=null;$("attachmentLabel").textContent="";
 $("messageInput").value="";$("messageInput").style.height="auto";renderMessages();renderRecent();toast(t("aiNotice"));
}
function exportChats(){
 const data=JSON.stringify(chats,null,2);const blob=new Blob([data],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="nexora-conversations.json";a.click();URL.revokeObjectURL(url);toast(t("exported"));
}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>setPage(b.dataset.page)));
document.querySelectorAll("[data-prompt-en]").forEach(b=>b.addEventListener("click",()=>{setPage("home");sendMessage(b.dataset["prompt"+currentLang.toUpperCase()]||b.dataset.promptEn)}));
$("newChat").addEventListener("click",newChat);
$("chatForm").addEventListener("submit",e=>{e.preventDefault();sendMessage()});
$("messageInput").addEventListener("input",e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,125)+"px"});
$("menuBtn").addEventListener("click",()=>{$("sidebar").classList.add("open");$("overlay").classList.add("show")});
$("closeSidebar").addEventListener("click",()=>{$("sidebar").classList.remove("open");$("overlay").classList.remove("show")});
$("overlay").addEventListener("click",()=>{$("sidebar").classList.remove("open");$("overlay").classList.remove("show")});
$("topSearch").addEventListener("click",()=>{setPage("history");$("historySearch").focus()});
$("historySearch").addEventListener("input",renderHistory);
$("exportAll").addEventListener("click",exportChats);
$("clearChats").addEventListener("click",()=>{if(confirm(t("confirmClear"))){chats=[];activeId=null;save();renderRecent();renderHistory();renderMessages();toast(t("deleted"))}});
$("languageSelect").addEventListener("change",e=>applyLanguage(e.target.value));
$("attachButton").addEventListener("click",()=>$("fileInput").click());
$("fileInput").addEventListener("change",e=>{const f=e.target.files[0];if(f){attachedFile=f.name;$("attachmentLabel").textContent="＋ "+f.name;toast(t("attachUnsupported"))}});
$("voiceButton").addEventListener("click",()=>{
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){toast(t("voiceUnsupported"));return}
 const recognition=new SR();recognition.lang=currentLang==="ar"?"ar-TN":currentLang==="fr"?"fr-FR":"en-US";recognition.onstart=()=>toast(t("voiceListening"));recognition.onresult=e=>{$("messageInput").value+=($("messageInput").value?" ":"")+e.results[0][0].transcript};recognition.start();
});
$("profileButton").addEventListener("click",()=>setPage("settings"));
applyLanguage(currentLang);renderRecent();renderMessages();
