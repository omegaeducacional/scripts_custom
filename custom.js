function addScript(url) {
    var script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
}
function toTopBottomButton() {
    $("body").append(`
        <a class="to-top hide" href="">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 6"><path d="M12 6H0l6-6z"/></svg>
            <span class="screen-reader-text">Ir para o topo</span>
        </a>
        <a class="to-bottom hide" href="">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 6"><path d="M12 6H0l6-6z"/></svg>
            <span class="screen-reader-text">Ir para baixo</span>
        </a>
    `);

    // Set a variable for our button element.
    const scrollToTopButton = document.querySelector('.to-top');
    const scrollToBottomButton = document.querySelector('.to-bottom');

    // Let's set up a function that shows our scroll-to-top button if we scroll beyond the height of the initial window.
    const scrollFunc = () => {
        // Get the current scroll value
        let y = window.scrollY;

        // If the scroll value is greater than the window height, let's add a class to the scroll-to-top button to show it!
        if (y > 0) {
            scrollToTopButton.className = "to-top show";
            scrollToBottomButton.className = "to-bottom show";
        } else {
            scrollToTopButton.className = "to-top hide";
        }
    };

    window.addEventListener("scroll", scrollFunc);

    const scrollToTop = () => {
        // Let's set a variable for the number of pixels we are from the top of the document.
        const c = document.documentElement.scrollTop || document.body.scrollTop;

        // If that number is greater than 0, we'll scroll back to 0, or the top of the document.
        // We'll also animate that scroll with requestAnimationFrame:
        // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
        if (c > 0) {
            window.requestAnimationFrame(scrollToTop);
            // ScrollTo takes an x and a y coordinate.
            // Increase the '10' value to get a smoother/slower scroll!
            window.scrollTo(0, c - c / 10);
        }
    };

    const scrollToBottom = () => {
        // Let's set a variable for the height of the entire document.
        const scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
    
        window.scrollTo(0, scrollHeight);
        
    };

    // When the button is clicked, run our ScrolltoTop function above!
    scrollToTopButton.onclick = function (e) {
        e.preventDefault();
        scrollToTop();
    }

    scrollToBottomButton.onclick = function (e) {
        e.preventDefault();
        scrollToBottom();
    }
}

(function () {
    'use strict';

    // Your code here...
    setInterval(() => {
        [...document.querySelectorAll(".gl-label:not(.omg-ext-checked)")].forEach((row) => {
            // adiciona label
            if (row.innerText.includes("::")) {
                const parts = row.innerText.split("::");
                const text = parts[0];
                const scoped = parts[1];
                row.classList.add("gl-label-scoped");
                const link = window.jQuery(row).find(".gl-label-link");
                link.find(".gl-label-text").text(text);
                link.append(`<span class="gl-label-text-scoped">${scoped}</span>`);
            }
            row.classList.add("omg-ext-checked");
            // --/ adiciona label

            // ajusta texto no board (estava trazendo apenas o ultimo path)
            [...document.querySelectorAll(".board-item-path")].forEach((row) => {
                row.innerText = row.title.split("/").slice(-2).join("/");
            });
            // --/ ajusta label
        });
    }, 150);

    function commandsTemplate() {
        $(".comment-warning-wrapper").before(`
            <div class="omg-issue-toolbar">
                <label for="commands_omega">Templates</label>
                <select id="commands_omega">
                    <option value=''>Selecione um template</option>
                    <optgroup label="Retornos">
                    <option value='/apply_template retorno_dev'>Retorno para qualidade(Dev web)</option>
                    <option value='/apply_template retorno_dev2'>Retorno para qualidade(Dev desktop)</option>
                    <optgroup label="Templates execução bot">
                    <option value='/create_branch feature'>Cria galho feature</option>
                    <option value='/create_branch hotfix'>Cria galho hotfix</option>
                </select>
            </div>
        `);

        $("body").on("change", "#commands_omega", function (e) {
            // $("#note-body").val($("#note-body").val() + this.value);
            const note = $("#note-body");
            if (note.val().trim() !== "") {
                if (confirm("Atenção, seu conteúdo será atualizado com o template, confirma?")) {
                    note.val(this.value).change();
                }
            } else {
                note.val(this.value).change();
            }
        });
    }

    function timerIssue () {
        const element = $(`[data-testid="reportLink"]`);
        if (!element) {
            setTimeout(timerIssue, 100);
            return;
        }

        addScript('https://omegaeducacional.github.io/scripts_custom/cronometro/script.js');
        
        element.after(`
            <div class="container-timer">
                <h1 id="timer">00:00:00</h1>
                <button id="startBtn" onclick="startTimer()" class="btn btn-default btn-md">Iniciar</button>
                <button id="stopBtn" onclick="stopTimer()" class="btn btn-default btn-md">Parar</button>
            </div>
        `);
    }
    setTimeout(() => {
        commandsTemplate();
        timerIssue();
        toTopBottomButton();
    }, 150)
})();
