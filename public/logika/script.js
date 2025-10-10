document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    const navigace = document.querySelector(".navigace");
    const menuLinks = document.querySelectorAll("nav a, .logo a");
    const heroTitle = document.querySelector(".hero h1");
    const heroDesc = document.querySelector(".hero p");
    const hero = document.querySelector(".hero");
    const header = document.querySelector("header");
    const container = document.getElementById("articlesContainer");

    // >>> Vyhledávání
    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");
    const noResults = document.getElementById("noResults");
    const suggestionsBox = document.querySelector(".suggestions");

    let articles = [];
    let activeCategory = "all";
    let query = "";

    // Hamburger menu
    if (hamburger && navigace) {
        hamburger.addEventListener("click", () => {
            navigace.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
    }

    // Scroll efekt pro hlavičku
    let lastScroll = 0;
    const delta = 200;
    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;
        if (Math.abs(currentScroll - lastScroll) < delta) return;

        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = "translateY(-100%)";
        } else {
            header.style.transform = "translateY(0)";
        }
        lastScroll = currentScroll;
    });

    // Hero banner obsah
    const heroContent = {
        all: { title: "Blog o zdravém životním stylu a cestování", desc: "Fitness · Zdravá výživa · Cestování", image: "img/banner_index.jpg" },
        fitness: { title: "Fitness tipy a tréninkové plány", desc: "Začni cvičit a udržuj kondici každý den", image: "/img/banner_fitness.jpg" },
        zdrava_strava: { title: "Nutriční tipy a zdravé recepty", desc: "Objevuj jednoduché a chutné recepty", image: "/img/banner_strava.jpg" },
        cestovani: { title: "Cestovatelské inspirace", desc: "Nejlepší destinace a tipy na cestování", image: "/img/banner_cestovani.jpg" }
    };

    const norm = s => (s || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Filtrování článků
    function applyFilters() {
        let visibleCount = 0;
        const nq = norm(query);

        articles.forEach(card => {
            const catOk = activeCategory === "all" || card.dataset.category === activeCategory;
            const titleEl = card.querySelector("h2");
            const descEl  = card.querySelector("p");
            const title = titleEl?.textContent || "";
            const desc  = descEl?.textContent || "";

            const textOk = nq === "" || norm(title).includes(nq) || norm(desc).includes(nq);
            card.hidden = !(catOk && textOk);
            if (!card.hidden) visibleCount++;

            if (nq !== "") {
                const regex = new RegExp(`(${query})`, "gi");
                if (titleEl) titleEl.innerHTML = title.replace(regex, `<span class="highlight">$1</span>`);
                if (descEl)  descEl.innerHTML  = desc.replace(regex, `<span class="highlight">$1</span>`);
            } else {
                if (titleEl) titleEl.textContent = title;
                if (descEl)  descEl.textContent  = desc;
            }
        });

        if (noResults) noResults.hidden = visibleCount !== 0;
    }

    // Našeptávání
    function updateSuggestions() {
        if (!searchInput.value) {
            suggestionsBox.classList.remove("active");
            suggestionsBox.hidden = true;
            return;
        }

        const nq = norm(searchInput.value);
        const matches = [];

        articles.forEach(card => {
            const title = card.querySelector("h2")?.textContent || "";
            const desc  = card.querySelector("p")?.textContent || "";
            const catOk = activeCategory === "all" || card.dataset.category === activeCategory;

            if (catOk && (norm(title).includes(nq) || norm(desc).includes(nq))) {
                matches.push({card, title});
            }
        });

        suggestionsBox.innerHTML = "";
        matches.slice(0,5).forEach(m => {
            const div = document.createElement("div");
            div.textContent = m.title;
            div.addEventListener("click", () => {
                searchInput.value = m.title;
                query = m.title;
                suggestionsBox.classList.remove("active");
                setTimeout(() => suggestionsBox.hidden = true, 300);
                applyFilters();
            });
            suggestionsBox.appendChild(div);
        });

        if (matches.length === 0) {
            suggestionsBox.classList.remove("active");
            setTimeout(() => suggestionsBox.hidden = true, 300);
        } else {
            suggestionsBox.hidden = false;
            setTimeout(() => suggestionsBox.classList.add("active"), 10);
        }
    }

    // SEO
    function updateSEO(category){
        const categorySEO = {
            all: {
                title: "Blog o zdravém životním stylu | FitJourney",
                description: "Fitness, zdravá výživa, cestování a inspirace pro každý den.",
                image: "/img/banner_index.jpg"
            },
            fitness: {
                title: "Fitness tipy a trénink | FitJourney",
                description: "Tipy, tréninkové plány a motivace pro fitness nadšence.",
                image: "/img/banner_fitness.jpg"
            },
            zdrava_strava: {
                title: "Nutriční tipy a zdravé recepty | FitJourney",
                description: "Recepty a rady pro zdravou stravu a životní styl.",
                image: "/img/banner_strava.jpg"
            },
            cestovani: {
                title: "Cestovatelské inspirace | FitJourney",
                description: "Nejlepší destinace, tipy a zážitky z cestování.",
                image: "/img/banner_cestovani.jpg"
            }
        };

        const seo = categorySEO[category] || categorySEO.all;
        const url = window.location.href;

        document.title = seo.title;

        let metaDesc = document.querySelector("meta[name='description']");
        if(!metaDesc){
            metaDesc = document.createElement("meta");
            metaDesc.name = "description";
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = seo.description;

        const setOG = (property, content) => {
            let tag = document.querySelector(`meta[property='${property}']`);
            if(!tag){
                tag = document.createElement("meta");
                tag.setAttribute("property", property);
                document.head.appendChild(tag);
            }
            tag.content = content;
        };

        setOG("og:title", seo.title);
        setOG("og:description", seo.description);
        setOG("og:image", seo.image);
        setOG("og:url", url);
        setOG("og:type", "website");
        setOG("og:locale", "cs_CZ");

        let ldScript = document.querySelector("script[type='application/ld+json']");
        if(ldScript) ldScript.remove();

        ldScript = document.createElement("script");
        ldScript.type = "application/ld+json";
        ldScript.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "headline": seo.title,
            "description": seo.description,
            "image": seo.image,
            "url": url,
            "publisher": {
                "@type": "Organization",
                "name": "FitJourney",
                "logo": {
                    "@type": "ImageObject",
                    "url": "/img/logo.png"
                }
            }
        });
        document.head.appendChild(ldScript);
    }

    // Menu klik
    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const cat = link.dataset.cat;
            if (cat) {
                e.preventDefault();
                activeCategory = cat;

                menuLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");

                if (heroContent[activeCategory]) {
                    heroTitle.textContent = heroContent[activeCategory].title;
                    heroDesc.textContent  = heroContent[activeCategory].desc;
                    hero.style.backgroundImage = `url('${heroContent[activeCategory].image}')`;
                }

                applyFilters();
                history.replaceState(null, null, `#${activeCategory}`);

                updateSEO(activeCategory); // ← volání SEO
            }
        });
    });

    // Načtení kategorie z URL
    const hash = window.location.hash.replace("#","");
    if (hash && heroContent[hash]) {
        activeCategory = hash;
        heroTitle.textContent = heroContent[activeCategory].title;
        heroDesc.textContent  = heroContent[activeCategory].desc;
        hero.style.backgroundImage = `url('${heroContent[activeCategory].image}')`;

        menuLinks.forEach(l => {
            if (l.dataset.cat === activeCategory) l.classList.add("active");
            else l.classList.remove("active");
        });

        updateSEO(activeCategory); // ← volání SEO
    }

    // Vyhledávání
    let t;
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            query = searchInput.value || "";
            clearTimeout(t);
            t = setTimeout(() => {
                applyFilters();
                updateSuggestions();
            }, 120);
        });
    }

    if (clearSearch && searchInput) {
        clearSearch.addEventListener("click", () => {
            searchInput.value = "";
            query = "";
            searchInput.focus();
            applyFilters();
            suggestionsBox.classList.remove("active");
            setTimeout(() => suggestionsBox.hidden = true, 300);
        });
    }

    // Načtení článků pro index.html
    if (container) {
        fetch("logika/articles.json")
        .then(res => res.json())
        .then(data => {
            data.forEach(article => {
                const card = document.createElement("article");
                card.classList.add("article-card");
                card.dataset.category = article.category;
                card.innerHTML = `
                    <img src="${article.img}" alt="${article.title}">
                    <div class="article-content">
                        <h2>${article.title}</h2>
                        <p>${article.desc}</p>
                        <a href="${article.file}" class="btn">Číst dál</a>
                    </div>
                `;
                container.appendChild(card);
            });

            articles = document.querySelectorAll(".article-card");
            applyFilters();
        });
    }

        // >>> Doporučené články (jen nadpisy)
        const articlePage = document.querySelector(".clanek");
        if (articlePage) {
            const bodyCategory = articlePage.classList.contains("fitness") ? "fitness" :
                                articlePage.classList.contains("zdrava_strava") ? "zdrava_strava" :
                                articlePage.classList.contains("cestovani") ? "cestovani" : "";

            const currentFile = window.location.pathname.split("/").pop();

            fetch("/logika/articles.json")
            .then(res => res.json())
            .then(data => {
                const related = data
                .filter(a => a.category === bodyCategory && !a.file.endsWith(currentFile))
                .slice(0, 3);

                const relatedList = document.getElementById("relatedList");
                if (!relatedList) return;

                related.forEach(a => {
                    const li = document.createElement("li");
                    li.textContent = a.title;
                    li.addEventListener("click", () => {
                        window.location.href = a.file;
                    });
                    li.style.cursor = "pointer";
                    relatedList.appendChild(li);
                });

            })
            .catch(err => console.error("Chyba při načítání doporučených článků:", err));
        }

});
