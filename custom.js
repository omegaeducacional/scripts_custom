(function () {
    'use strict';

    // Your code here...
    setInterval(() => {
        [...document.querySelectorAll(".gl-label:not(.omg-ext-checked)")].forEach((row) => {
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
        });
    }, 150);

    $(".full-screen").after(`
      <label for="commands_omega">Templates</label>
      <select id="commands_omega">
        <optgroup label="Comentário padrão">
        <option value='/apply_template retorno_dev2'>Retorno para qualidade(Dev desktop)</option>
        <option value='/apply_template retorno_dev'>Retorno para qualidade(Dev web)</option>
        <optgroup label="Templates execução bot">
        <option value='/create_branch feature'>Cria galho feature</option>
        <option value='/create_branch hotfix'>Cria galho hotfix</option>
     </select>
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
    })

})();