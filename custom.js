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

    
    setTimeout(() => {
        $(".comment-warning-wrapper").before(`
            <div class="omg-issue-toolbar">
                <label for="commands_omega">Templates</label>
                <select id="commands_omega">
                    <optgroup label="Comentário padrão">
                    <option value='/apply_template retorno_dev2'>Retorno para qualidade(Dev desktop)</option>
                    <option value='/apply_template retorno_dev'>Retorno para qualidade(Dev web)</option>
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
                    note.val(this.value);
                }
            } else {
                note.val(this.value);
            }
         });

        $("body").after(`<link rel="stylesheet" href="https://omegaeducacional.github.io/scripts_custom/board-enhancement/board-enhancement.css"></link>
         <script src="https://omegaeducacional.github.io/scripts_custom/board-enhancement/board-enhancement.js"></script>
        `);
    }, 150)
    
    
    

})();
