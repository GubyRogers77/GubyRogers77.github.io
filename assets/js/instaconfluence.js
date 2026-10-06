(() => {
  const CREATORS = [
    { name: "Daksh Sethi", handle: "dakshsethi", category: "Education", followers: "Deck snapshot", posts: "—", following: "—", bio: "Host voice on the campus summit, connecting creators and students." },
    { name: "Sanket Prakash", handle: "", category: "Technology", followers: "Deck snapshot", posts: "—", following: "—", bio: "Technology creator on the live programme." },
    { name: "Ujjawal Pahwa", handle: "", category: "Technology", followers: "Deck snapshot", posts: "—", following: "—", bio: "Technology creator on the live programme." },
    { name: "CA Sakchi Jain", handle: "", category: "Finance", followers: "Deck snapshot", posts: "—", following: "—", bio: "Finance creator on the live programme." },
    { name: "Chandralekha", handle: "", category: "Spirituality", followers: "Deck snapshot", posts: "—", following: "—", bio: "Spirituality creator on the live programme." },
    { name: "Namit Chawla", handle: "", category: "Lifestyle", followers: "Deck snapshot", posts: "—", following: "—", bio: "Lifestyle creator on the live programme." },
    { name: "Ashutosh Pratap Singh", handle: "", category: "Education", followers: "Deck snapshot", posts: "—", following: "—", bio: "Education creator on the live programme." },
    { name: "Zeel Patel", handle: "", category: "Lifestyle", followers: "Deck snapshot", posts: "—", following: "—", bio: "Lifestyle creator on the live programme." },
    { name: "Kritika Arora", handle: "", category: "Education", followers: "Deck snapshot", posts: "—", following: "—", bio: "Education-panel creator on the live programme." },
    { name: "Ashish Dawar", handle: "", category: "Education", followers: "Deck snapshot", posts: "—", following: "—", bio: "Education-panel creator on the live programme." },
    { name: "Tejaswee Tripathy", handle: "", category: "Education", followers: "Deck snapshot", posts: "—", following: "—", bio: "Education-panel creator on the live programme." },
    { name: "Arthi Baskar", handle: "", category: "Education", followers: "Deck snapshot", posts: "—", following: "—", bio: "Education-panel creator on the live programme." },
    { name: "Deepanshu Bhaskar", handle: "", category: "Lifestyle", followers: "Deck snapshot", posts: "—", following: "—", bio: "Creator on the live programme." },
    { name: "Raj Angad Singh", handle: "", category: "Lifestyle", followers: "Deck snapshot", posts: "—", following: "—", bio: "Creator on the live programme." },
    { name: "Jai Arora", handle: "", category: "Lifestyle", followers: "Deck snapshot", posts: "—", following: "—", bio: "Creator on the live programme." },
    { name: "Bhanu Pathak", handle: "", category: "Lifestyle", followers: "Deck snapshot", posts: "—", following: "—", bio: "Creator on the live programme." },
    { name: "Riya Upreti", handle: "", category: "Lifestyle", followers: "Deck snapshot", posts: "—", following: "—", bio: "Creator on the live programme." },
    { name: "Mohmed Abubacker", handle: "", category: "Lifestyle", followers: "Deck snapshot", posts: "—", following: "—", bio: "Creator on the live programme." },
  ];

  const CAPTIONS = [
    "Stage",
    "Audience",
    "LPU stage and audience",
    "Campus hall",
    "Panel",
    "Student interaction",
    "Creators",
    "Conversation",
    "Auditorium",
    "Event coverage",
    "Campus",
    "Programme close",
  ];

  const initials = (name) =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  const track = document.querySelector("[data-speakers-track]");
  if (track) {
    track.innerHTML = CREATORS.map((c, i) => {
      const n = String(i + 1).padStart(2, "0");
      const img = `../assets/instaconfluence/creator-${n}.jpg`;
      const href = c.handle ? `https://www.instagram.com/${c.handle}/` : "https://www.instagram.com/";
      const handle = c.handle ? `@${c.handle}` : "Instagram";
      return `<article class="cs-speaker is-wide">
        <div class="cs-speaker-photo">${initials(c.name)}<img src="${img}" alt="${c.name}" width="400" height="400" loading="lazy" decoding="async" onerror="this.remove()"></div>
        <div class="cs-speaker-body">
          <h3>${c.name}</h3>
          <div class="cs-speaker-role">${c.category}</div>
          <p class="cs-speaker-bio">${c.bio}</p>
          <p class="cs-speaker-stats"><span>${c.followers}</span><span>${c.posts} posts</span><span>${c.following} following</span></p>
          <ul class="cs-socials"><li><a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${c.name} on Instagram">IG ${handle}</a></li></ul>
        </div>
      </article>`;
    }).join("");
  }

  const dual = document.querySelector("[data-dual-track]");
  if (dual) {
    const figs = CAPTIONS.map((caption, i) => {
      const n = String(i + 1).padStart(2, "0");
      const src = `../assets/instaconfluence/gallery-${n}.jpg`;
      return `<figure class="cs-dual-shot" data-lightbox-open>
        <img src="${src}" alt="${caption} at InstaConfluence" loading="lazy" decoding="async" width="400" height="400" onerror="this.closest('figure').hidden=true">
        <figcaption>${caption}</figcaption>
      </figure>`;
    });
    let html = "";
    for (let i = 0; i < figs.length; i += 2) {
      html += `<div class="cs-dual-col">${figs[i]}${figs[i + 1] || ""}</div>`;
    }
    dual.innerHTML = html;
  }
})();
