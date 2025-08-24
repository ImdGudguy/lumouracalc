window.addEventListener('load', () => {

    // --- SPLASH SCREEN LOGIC ---
    const splash = document.getElementById('splash-screen');
    const appWrapper = document.getElementById('app-wrapper');
    setTimeout(() => {
        splash.style.opacity = '0';
        splash.addEventListener('transitionend', () => splash.classList.add('hidden'));
        appWrapper.classList.remove('hidden');
    }, 2500);

    // --- THEME TOGGLE LOGIC ---
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') { themeToggle.checked = true; }
    }
    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- NAVIGATION LOGIC ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetViewId = button.dataset.view;
            const targetView = document.getElementById(targetViewId);
            navButtons.forEach(btn => btn.classList.remove('active'));
            views.forEach(view => view.classList.remove('active'));
            button.classList.add('active');
            targetView.classList.add('active');
        });
    });

    // --- CALCULATOR LOGIC ---
    const waxData = { soy: { density: 0.9, cureTime: '1-2 weeks' }, paraffin: { density: 0.9, cureTime: '3-5 days' }, beeswax: { density: 0.96, cureTime: '48-72 hours' }, coconut: { density: 0.9, cureTime: '2 weeks' } };
    const waterWeightInput = document.getElementById('waterWeight');
    const waxTypeSelect = document.getElementById('waxType');
    const waxInfoBox = document.getElementById('waxInfo');
    const fragranceLoadSlider = document.getElementById('fragranceLoad');
    const fragranceValueSpan = document.getElementById('fragranceValue');
    const presetButtons = document.querySelectorAll('.preset');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('results');
    const waxResultSpan = document.getElementById('waxResult');
    const fragranceResultSpan = document.getElementById('fragranceResult');
    const totalResultSpan = document.getElementById('totalResult');
    function updateWaxInfo() { const selectedWax = waxTypeSelect.value; if (selectedWax && waxData[selectedWax]) { const data = waxData[selectedWax]; waxInfoBox.innerHTML = `<strong>Tip:</strong> ${selectedWax.charAt(0).toUpperCase() + selectedWax.slice(1)} wax ka density ${data.density} hai aur isse ${data.cureTime} ka cure time lagta hai.`; waxInfoBox.classList.add('visible'); } else { waxInfoBox.classList.remove('visible'); } }
    function updateFragranceDisplay() { const currentValue = parseFloat(fragranceLoadSlider.value); fragranceValueSpan.textContent = `${currentValue.toFixed(1)}%`; presetButtons.forEach(button => { if (Math.abs(parseFloat(button.dataset.value) * 100 - currentValue) < 0.1) { button.classList.add('active'); } else { button.classList.remove('active'); } }); }
    function calculateRecipe() {
        calculateBtn.classList.add('calculating');
        const waterWeight = parseFloat(waterWeightInput.value); const selectedWax = waxTypeSelect.value; const fragranceLoad = parseFloat(fragranceLoadSlider.value) / 100;
        if (!waterWeight || waterWeight <= 0 || !selectedWax) { alert('Please enter a valid water weight and select a wax type.'); calculateBtn.classList.remove('calculating'); return; }
        const waxDensity = waxData[selectedWax].density; const totalMixtureWeight = waterWeight * waxDensity; const waxWeight = totalMixtureWeight / (1 + fragranceLoad); const fragranceWeight = waxWeight * fragranceLoad;
        setTimeout(() => { waxResultSpan.textContent = `${waxWeight.toFixed(2)} g`; fragranceResultSpan.textContent = `${fragranceWeight.toFixed(2)} g`; totalResultSpan.textContent = `${totalMixtureWeight.toFixed(2)} g`; resultsSection.classList.remove('hidden'); calculateBtn.classList.remove('calculating'); }, 500);
    }
    waxTypeSelect.addEventListener('change', updateWaxInfo);
    fragranceLoadSlider.addEventListener('input', updateFragranceDisplay);
    presetButtons.forEach(button => { button.addEventListener('click', () => { const presetValue = parseFloat(button.dataset.value); fragranceLoadSlider.value = presetValue * 100; updateFragranceDisplay(); }); });
    calculateBtn.addEventListener('click', calculateRecipe);

    // --- INTERNATIONALIZATION (i18n) LOGIC ---
    const translations = {
        en: {
            appTitle: "Candle Wax Calculator", waterWeightLabel: "Water Weight (grams)", waxTypeLabel: "Select Wax Type", selectWaxOption: "-- Select a Wax --", fragranceLoadLabel: "Fragrance Load", calculateBtn: "Calculate", resultsTitle: "Your Recipe", waxWeightLabelResult: "Wax Weight:", fragranceWeightLabelResult: "Fragrance Weight:", totalWeightLabelResult: "Total Weight:", navCalc: "Calculator", navFaq: "FAQ", faqTitle: "Frequently Asked Questions", faqHowTitle: "How does the calculator work?", faqHowDesc: "The calculator uses the weight of water a container can hold and the specific density of the selected wax to determine the total weight of wax and fragrance needed to fill that same volume.", waterWeightPlaceholder: "e.g., 250",
            faqQ0: "How do I use this calculator?", faqA0: "1. Weigh your empty candle container (mould/jar).\n2. Fill it with water to your desired fill-height.\n3. Weigh it again. The difference is the water weight.\n4. Enter this weight, select your wax, choose your fragrance load, and click calculate!",
            faqQ1: "What is 'Fragrance Load'?", faqA1: "Fragrance Load (FO) is the percentage of fragrance oil relative to the weight of your wax. A 6-10% load is standard for most waxes.",
            faqQ2: "What does 'Cure Time' mean?", faqA2: "Curing is the time required for the wax and fragrance oil to bind together for the best scent throw. This can range from 3 days to 2 weeks depending on the wax.",
            faqQ3: "Why is my candle top bumpy or rough?", faqA3: "This is common with natural waxes like soy. It's often caused by the wax cooling too quickly. Try warming your jars before pouring or controlling the room temperature.",
            faqQ4: "What is 'tunnelling'?", faqA4: "Tunnelling is when the wick only melts a small diameter of wax in the center, leaving a ring of hard wax on the outside. It's usually caused by a wick that is too small for the container diameter.",
            faqQ5: "What are 'wet spots'?", faqA5: "These are patches where the wax has pulled away from the glass. It's a cosmetic issue caused by wax shrinkage during cooling and doesn't affect the burn.",
            faqQ6: "At what temperature should I add fragrance oil?", faqA6: "This depends on the wax, but a general rule is around 85°C (185°F). Adding it too hot can burn off the scent; too cold and it may not bind properly.",
            faqQ7: "At what temperature should I pour my wax?", faqA7: "Pouring temperature also varies by wax type. A cooler pour (around 55-60°C or 130-140°F) often results in smoother tops for soy wax.",
            faqQ8: "What is a 'melt pool'?", faqA8: "The melt pool is the layer of liquid wax that forms around the wick as the candle burns. For the first burn, you should let it reach the edges of the container to prevent tunnelling.",
            faqQ9: "What's the difference between essential oils and fragrance oils?", faqA9: "Fragrance oils are synthetic and specifically designed for high heat in candles. Essential oils are natural but can be volatile and may not produce a strong scent in a candle.",
            faqQ10: "Why is my candle smoking?", faqA10: "A smoking wick is often too long. Trim your wick to about 1/4 inch (6mm) before each burn. It can also be a sign of a draft or too much fragrance oil.",
            faqQ11: "Can I use crayons to color my candles?", faqA11: "It's not recommended. The pigments in crayons can clog the wick and create a fire hazard. Always use candle-specific dyes.",
            faqQ12: "What is 'frosting' on soy wax?", faqA12: "Frosting is the formation of tiny white crystals on the surface of natural waxes. It's a normal characteristic of soy wax and doesn't impact the candle's performance.",
            faqQ13: "Do I have to use a double boiler?", faqA13: "Yes, you should never melt wax directly on a heat source as it's flammable. A double boiler (or a pot inside a larger pot of water) provides gentle, even heat.",
            faqQ14: "How do I choose the right wick?", faqA14: "Wick selection depends on your wax type, container diameter, and fragrance/dye load. It often requires testing. Consult your supplier's wick guide as a starting point.",
            faqQ15: "What is 'scent throw'?", faqA15: "'Cold throw' is the scent when the candle is unlit. 'Hot throw' is the scent released when the candle is burning. Curing your candle properly is key to a good hot throw.",
            faqQ16: "Why did my candle crack?", faqA16: "Cracks are usually caused by the wax cooling too rapidly. Ensure your workspace is free from drafts and the surface you're cooling on isn't too cold.",
            faqQ17: "Can I reuse old candle jars?", faqA17: "Yes! Clean them thoroughly by freezing the remaining wax (it should pop out) or using a heat gun, then wash with hot, soapy water.",
            faqQ18: "What's the best wax for beginners?", faqA18: "Many beginners start with soy wax (like GW 464) because it's natural, cleans up easily with soap and water, and is generally forgiving.",
            faqQ19: "Do I need to add any other additives?", faqA19: "Most modern container waxes are pre-blended and don't require additives. Some waxes, like paraffin, can benefit from additives like Vybar for scent retention or Stearin for hardness.",
            faqQ20: "Is candle making safe?", faqA20: "It is safe if you follow precautions. Never leave melting wax unattended, keep a fire extinguisher nearby, and work in a well-ventilated area away from children and pets."
        },
        hi: {
            appTitle: "Candle Wax Calculator", waterWeightLabel: "Paani ka Wajan (grams)", waxTypeLabel: "Wax ka Type Chunein", selectWaxOption: "-- Wax Chunein --", fragranceLoadLabel: "Fragrance Load", calculateBtn: "Calculate", resultsTitle: "Aapki Recipe", waxWeightLabelResult: "Wax ka Wajan:", fragranceWeightLabelResult: "Fragrance ka Wajan:", totalWeightLabelResult: "Total Wajan:", navCalc: "Calculator", navFaq: "FAQ", faqTitle: "Aksar Puche Gaye Sawal", faqHowTitle: "Yeh calculator kaam kaise karta hai?", faqHowDesc: "Yeh calculator container mein paani ka wajan aur chune gaye wax ki density ka use karke, ussi volume ko bharne ke liye zaroori wax aur fragrance ka total wajan batata hai.", waterWeightPlaceholder: "उदा., 250",
            faqQ0: "Calculator kaise use karein?", faqA0: "1. Khaali container ka wajan lein.\n2. Usse paani se bharein jahan tak candle chahiye.\n3. Phir se wajan lein. Dono ka antar paani ka wajan hai.\n4. Yeh wajan enter karein, wax chunein, fragrance load select karein, aur calculate karein!",
            faqQ1: "'Fragrance Load' kya hai?", faqA1: "Fragrance Load (FO) aapke wax ke wajan ke hisaab se fragrance oil ka percentage hai. 6-10% load standard hai.",
            faqQ2: "'Cure Time' ka kya matlab hai?", faqA2: "Curing woh time hai jismein wax aur fragrance oil aapas mein achhe se mil jaate hain taaki best scent mile. Yeh 3 din se 2 hafte tak ho sakta hai.",
            faqQ3: "Meri candle ka top ajeeb kyun hai?", faqA3: "Yeh soy wax jaise natural wax mein aam hai. Aksar wax ke jaldi thanda hone se hota hai. Pour karne se pehle jars ko thoda garam karke try karein.",
            faqQ4: "'Tunnelling' kya hota hai?", faqA4: "Jab wick sirf center ka wax pighlata hai aur side mein wax bacha rehta hai, usse tunnelling kehte hain. Yeh aksar chote wick ke kaaran hota hai.",
            faqQ5: "'Wet spots' kya hain?", faqA5: "Yeh woh jagah hai jahan wax thanda hote waqt glass se thoda alag ho jaata hai. Isse candle ke jalne par koi fark nahi padta.",
            faqQ6: "Fragrance oil kis temperature par daalein?", faqA6: "Yeh wax par depend karta hai, par lagbhag 85°C (185°F) aam hai. Zyada garam mein scent udd sakta hai, aur thande mein mix nahi hoga.",
            faqQ7: "Wax ko kis temperature par pour karein?", faqA7: "Thande temperature par pour karne se (lagbhag 55-60°C) soy wax ka top smooth hota hai.",
            faqQ8: "'Melt pool' kya hai?", faqA8: "Melt pool jalte waqt wick ke aas paas pighle hue wax ki layer hai. Pehli baar jalane par, isse container ke kinaron tak pahunchna chahiye.",
            faqQ9: "Essential oils aur fragrance oils mein kya fark hai?", faqA9: "Fragrance oils specially candles ke liye banaye jaate hain. Essential oils natural hote hain par tez garmi mein unka scent khatm ho sakta hai.",
            faqQ10: "Meri candle se dhuan kyun nikal raha hai?", faqA10: "Wick aksar lamba hone par dhuan deta hai. Har baar jalane se pehle wick ko 1/4 inch tak kaat lein.",
            faqQ11: "Candle color karne ke liye crayons use kar sakte hain?", faqA11: "Nahi. Crayons ke color wick ko block kar sakte hain aur aag lagne ka khatra hota hai. Hamesha candle-specific dye use karein.",
            faqQ12: "Soy wax par 'frosting' kya hai?", faqA12: "Frosting soy wax par banne wale chhote safed crystals hain. Yeh normal hai aur isse candle ki performance par koi asar nahi padta.",
            faqQ13: "Double boiler use karna zaroori hai?", faqA13: "Haan, wax ko kabhi bhi direct aag par na pighlayein. Double boiler se wax aaram se aur aasaani se pighalta hai.",
            faqQ14: "Sahi wick kaise chunein?", faqA14: "Sahi wick aapke wax, container ke size, aur fragrance par depend karta hai. Iske liye thoda testing karna padta hai.",
            faqQ15: "'Scent throw' kya hai?", faqA15: "'Cold throw' bina jali candle ki khushboo hai. 'Hot throw' jalte waqt candle ki khushboo hai. Achhe hot throw ke liye curing zaroori hai.",
            faqQ16: "Meri candle crack kyun ho gayi?", faqA16: "Cracks aksar wax ke bahut jaldi thanda hone se aate hain. Apne kamre ko thanda aur hawa se bachayein.",
            faqQ17: "Purane candle jars reuse kar sakte hain?", faqA17: "Haan! Bacha hua wax freeze karke nikaal lein aur phir garam paani aur sabun se dho lein.",
            faqQ18: "Beginners ke liye best wax kaunsa hai?", faqA18: "Soy wax (jaise GW 464) shuruaat ke liye achha hai kyunki yeh natural hai aur aasani se saaf ho jaata hai.",
            faqQ19: "Kya mujhe koi aur cheez add karni padegi?", faqA19: "Aaj kal ke zyada tar wax pre-blended aate hain. Unmein kuch add karne ki zaroorat nahi hoti.",
            faqQ20: "Candle banana safe hai?", faqA20: "Haan, agar aap savdhani bartein. Pighalte hue wax ko akela na chhodein aur bachhon aur paaltu janwaron se door kaam karein."
        }
    };
    const langButtons = document.querySelectorAll('.lang-btn');
    function setLanguage(lang) {
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            const key = element.getAttribute('data-i18n-key');
            if (translations[lang][key]) {
                if(element.tagName === 'INPUT') { element.placeholder = translations[lang][key]; }
                else if (element.tagName === 'P' && key.startsWith('faqA')) {
                    element.innerHTML = translations[lang][key].replace(/\n/g, '<br>');
                }
                else { element.textContent = translations[lang][key]; }
            }
        });
    }
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedLang = button.dataset.lang;
            langButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            setLanguage(selectedLang);
        });
    });
    setLanguage('en');

    // --- FAQ ACCORDION LOGIC ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => { item.classList.toggle('active'); });
    });
});
