// GLOBAL
window.TKT_TK = '649048bd-ae76-4ee6-b496-478eddbb4d30';

function addScript(url) {
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
}

function substituirLinks(texto) {
    // Expressão regular para encontrar o padrão [TK X]
    const regex = /\[TK (\d+)\]/g;

    // Função de substituição que gera o link com o ID extraído
    function substituir(match, id) {
        return `<a href="#" onclick="abrirPopup(${id}); return false;">🔗 ${match}</a>`;
    }

    // Executa a substituição no texto
    const resultado = texto.replace(regex, substituir);

    return resultado;
}

function extrairIdDaUrl(url) {
    const match = url.match(/\/Ticket\/(?:Create|Edit)\/(\d+)/);
    return match ? match[1] : null;
}

function abrirPopup(id) {
    // Verifica se o ID é uma URL
    const isUrl = String(id).startsWith('http');

    // Extrai o ID da URL, se for o caso
    const extractedId = isUrl ? extrairIdDaUrl(id) : id;
    if (!extractedId) {
        alert('ID inválido ou formato de URL não reconhecido.');
        return;
    }
    const url = `https://omegaeducacional.github.io/scripts_custom/tickets/?id=${extractedId}&token=${window.TKT_TK}`;
    const largura = 1200;
    const altura = 900;

    // Calcula o posicionamento centralizado
    const esquerda = (window.innerWidth - largura) / 2;
    const topo = (window.innerHeight - altura) / 2;

    // Abre o popup
    window.open(url, 'popup', `width=${largura},height=${altura},left=${esquerda},top=${topo}`);
}

function addCSS(url) {
    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url; 

    document.head.appendChild(link);
}

function addComment (text, check = false) {
    let note = $("#work-item-add-or-edit-comment");
    if (note.length === 0) {
        note = $("note-body");
    }
    if (note.val().trim() !== "" && check) {
        if (confirm("Atenção, a caixa de comentário tem texto informado e será substituida, confirma?")) {
            note.val(text).change();
            $('[data-testid="content_editor_editablebox"] .ProseMirror').html(text);
        }
    } else {
        note.val(text).change();
        $('[data-testid="content_editor_editablebox"] .ProseMirror').html(text);
    }
}

function buttonCommentClick () {
    setTimeout(() => {
        $(`[data-track-label="comment_button"] button:eq(0)`).click();
    }, 150);
}

function toTopBottomButton() {
    if (window.$ === undefined) {
        return;
    }
    $("body").append(`
        <a class="to-top hide" href="">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 6"><path d="M12 6H0l6-6z"/></svg>
            <span class="screen-reader-text">Ir para o topo</span>
        </a>
        <a class="to-bottom hide" href="">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 6"><path d="M12 6H0l6-6z"/></svg>
            <span class="screen-reader-text">Ir para baixo</span>
        </a>
        <img src="https://www.movidesk.com/assets/pt-br/img/logo-movidesk-zenvia.svg" class="img-fluid openTicket" width="160" alt="Movidesk tickets">
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
        const insertOmegaToolbar = () => {
            if (window.$ === undefined) {
                return;
            }
            const target = $(".comment-warning-wrapper");
            if (target.length > 0 && $(".omg-issue-toolbar").length === 0) {
                target.before(`
                  <div class="omg-issue-toolbar">
                    <label for="commands_omega">Templates</label>
                    <select id="commands_omega">
                      <option value=''>Selecione um template</option>
                      <optgroup label="Comentários">
                        <option value='/apply_template retorno_dev'>Retorno para qualidade (Web)</option>
                        <option value='/apply_template retorno_dev2'>Retorno para qualidade (Desktop)</option>
                        <option value='/apply_template homologacao_desktop'>Homologação (Desktop)</option>
                        <option value='/apply_template notificacao_versao'>Notificação de envio de versão</option>
                      </optgroup>
                      <optgroup label="Templates execução bot">
                        <option value='/create_branch feature'>Cria galho feature</option>
                        <option value='/create_branch hotfix'>Cria galho hotfix</option>
                      </optgroup>
                    </select>
                  </div>
                `);
                clearInterval(observer);
            }
        };
        
        const observer = setInterval(insertOmegaToolbar, 500);
        
        /*$(".comment-warning-wrapper").before(`
            <div class="omg-issue-toolbar">
                <label for="commands_omega">Templates</label>
                <select id="commands_omega">
                    <option value=''>Selecione um template</option>
                    <optgroup label="Comentários">
                    <option value='/apply_template retorno_dev'>Retorno para qualidade (Web)</option>
                    <option value='/apply_template retorno_dev2'>Retorno para qualidade (Desktop)</option>
                    <option value='/apply_template homologacao_desktop'>Homologação (Desktop)</option>
                    <option value='/apply_template notificacao_versao'>Notificação de envio de versão</option>
                    <optgroup label="Templates execução bot">
                    <option value='/create_branch feature'>Cria galho feature</option>
                    <option value='/create_branch hotfix'>Cria galho hotfix</option>
                </select>
            </div>
        `);*/

        $("body").on("change", "#commands_omega", function (e) {
            var text = this.value;
            if (this.value.includes("notificacao_versao")) {
                text = `## Encaminhamento de versão do sistema

* [ ] Geral
* [ ] Cliente especifico:

| Sistema | Versão |
|---------|--------|
|  |  |

~"Published to client" 

/label ~"Published to client"

- Ao publicar a versão deverá ser executado as notificações nas aplicações:
1. Central de atendimento Omega (movidesk);
1. Notion: Preenchimento da data de entrega;
1. RocketChat: Notificação de envio no grupo de homologações.


                `;
            }
            addComment(text, true);
        });
    }

    function timerIssue () {
        const element = $(`[data-testid="reportLink"], [data-testid="noTrackingPane"]`);
        if (element.length === 0) {
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

    function loadBoardPlugin () {
        addScript("https://omegaeducacional.github.io/scripts_custom/board-enhancement/board-enhancement.js");
        addCSS("https://omegaeducacional.github.io/scripts_custom/board-enhancement/board-enhancement.css");
    }

    function changeTicketLinks () {
        if (window.$ === undefined) {
            return;
        }
        const element = $('[data-testid="issue-title"]');
        if (element.length !== 0) {
            element.html(substituirLinks(element.html()))
        }

        $(".openTicket").on("click", () => {
            const id = window.prompt("Por favor, insira a URL ou o ID do ticket:");
            if (id) {
                abrirPopup(id);
            }
        })
    }

  const exportCSV = (async () => {
      const GITLAB_URL = window.location.origin;
    
      // Extrair o ID do projeto do DOM e garantir que seja apenas numérico
      const PROJECT_ID_ELEMENT = document.querySelector('[data-testid="project-id-content"]');
      if (!PROJECT_ID_ELEMENT) {
        console.error('Erro: Não foi possível encontrar o elemento com data-testid="project-id-content"');
        return;
      }
      const PROJECT_ID_TEXT = PROJECT_ID_ELEMENT.textContent.trim();
      const PROJECT_ID = PROJECT_ID_TEXT.match(/\d+/)[0];
    
      // Função para obter todas as issues
      const headers = new Headers({
        'Content-Type': 'application/json'
      });
    
      async function getAllIssues(label) {
        let issues = [];
        let url = `${GITLAB_URL}/api/v4/projects/${PROJECT_ID}/issues`;
        
        // Adiciona filtro por label, se fornecido
        if (label) {
            label = "Sprint::" + label.padStart(2, "0");
            url += `?labels=${encodeURIComponent(label)}`;
        }
        while (url) {
          const response = await fetch(url, { headers });
          if (!response.ok) {
            throw new Error(`Erro ao acessar a API: ${response.status}`);
          }
          const data = await response.json();
          issues = issues.concat(data);
          // Verificando se há uma próxima página
          const linkHeader = response.headers.get('link');
          const nextLink = linkHeader && linkHeader.match(/<([^>]+)>;\s*rel="next"/);
          url = nextLink ? nextLink[1] : null;
        }
        return issues;
      }
    
      // Função para converter JSON para CSV com colunas específicas mapeadas
      function jsonToCsv(json) {
        const csvRows = [];
    
        // Mapeamento das colunas
        json.forEach(issue => {
          const row = {
            issue: issue.iid,
            cadastro: issue.created_at,
            conclusao: issue.closed_at,
            titulo: issue.title,
            Status: getStatus(issue.labels),
            aberto: issue.state === 'opened' ? 'sim' : 'não',
            sprint: getSprintNumber(issue.labels),
            autor: issue.author ? issue.author.name : '',
            atribuido: issue.assignee ? issue.assignee.name : '',
            tester: getTesterName(issue.labels)
          };
          
          // Transforma objeto em array ordenado para gerar CSV
          const values = [
            row.issue,
            row.cadastro,
            row.conclusao,
            row.titulo,
            row.Status,
            row.aberto,
            row.sprint,
            row.autor,
            row.atribuido,
            row.tester
          ];
    
          // Converte valores em string CSV com aspas
          const csvRow = values.map(value => {
            if (value === null || value === undefined) {
              return '""'; // Retorna uma string vazia com aspas
            }
            return `"${value.toString().replace(/"/g, '""')}"`; // Escape double quotes
          }).join(',');
          
          csvRows.push(csvRow);
        });
    
        // Adiciona cabeçalho com nome de colunas
        const header = [
          'issue',
          'cadastro',
          'conclusao',
          'titulo',
          'Status',
          'aberto',
          'sprint',
          'autor',
          'atribuido',
          'tester'
        ].join(',');
        csvRows.unshift(header);
    
        return csvRows.join('\r\n');
      }
    
      // Função para obter o status com base nas labels específicas
      function getStatus(labels) {
        const statusMap = {
          'To do': 'Aguardando',
          'Development': 'Em desenvolvimento',
          'Test analysis': 'Aguardando Teste Analista',
          'Test quality': 'Aguardando Teste Qualidade',
          'Test': 'Teste',
          'Done': 'Concluído'
        };
    
        for (let label of labels) {
          if (statusMap.hasOwnProperty(label)) {
            return statusMap[label];
          }
        }
        return ''; // Retorna vazio se nenhum status válido for encontrado
      }
    
      // Função para obter o número da sprint a partir da label
      function getSprintNumber(labels) {
        const sprintRegex = /^Sprint::(\d+)$/;
        for (let label of labels) {
          const match = label.match(sprintRegex);
          if (match) {
            return "Sprint " + match[1]; // Retorna o número da sprint encontrado
          }
        }
        return ''; // Retorna vazio se nenhuma label de sprint for encontrada
      }
    
      // Função para obter o nome do tester a partir das labels
      function getTesterName(labels) {
        const testerRegex = /^Test::(.+)$/;
        for (let label of labels) {
          const match = label.match(testerRegex);
          if (match) {
            return match[1]; // Retorna o nome do tester encontrado
          }
        }
        return ''; // Retorna vazio se nenhum nome de tester for encontrado
      }
    
      // Função para exportar issues para CSV
      async function exportIssuesToCsv(label) {
        const defaultFileName = (document.querySelector('.home-panel-title')?.textContent.trim() || 'issues').replace(/Gerar CSV/i, '').trim();
        const fileName = prompt('Digite o nome do arquivo CSV:', defaultFileName) || defaultFileName;
    
        try {
          const issues = await getAllIssues(label);
          const csv = jsonToCsv(issues);
    
          // Adiciona BOM para garantir que a codificação esteja correta
          const bom = '\uFEFF';
          const csvWithBom = bom + csv;
    
          // Criar um link para download do arquivo CSV
          const blob = new Blob([csvWithBom], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${fileName}.csv`;
          a.click();
          URL.revokeObjectURL(url);
    
          console.log(`Exportado ${issues.length} issues para '${fileName}.csv'`);
        } catch (error) {
          console.error('Erro:', error);
        }
      }
    
      // Criar e adicionar o botão ao DOM
      const exportButton = document.createElement('a');
      exportButton.title = 'Gera o CSV de todas ISSUES deste projeto';
      exportButton.dataset.toggle = 'tooltip';
      exportButton.dataset.placement = 'top';
      exportButton.dataset.container = 'body';
      exportButton.className = 'gl-button btn btn-success';
      exportButton.href = '#';
      exportButton.style.marginLeft = '5px';
      exportButton.textContent = 'Gerar CSV';
    
      const referenceElement = document.querySelector('.home-panel-title');
      if (referenceElement) {
        referenceElement.appendChild(exportButton);
      } else {
        console.error('Erro: Não foi possível encontrar o elemento de referência com a classe "home-panel-title"');
        return;
      }
    
      // Adicionar evento de clique ao botão para exportar issues
      exportButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Perguntar pelo label da sprint
        const label = prompt('Digite o número da sprint (ex: 4) para filtrar as labels que contenham a sprint por exemplo "Sprint::04" ou deixe em branco para todas');
        exportIssuesToCsv(label.trim());
      });
    });

    const checkAndExecute = () => {
        if (typeof window.$ !== 'undefined') {
            commandsTemplate();
            //timerIssue();
            toTopBottomButton();
            //loadBoardPlugin();
            changeTicketLinks();
            exportCSV();
        } else {
            setTimeout(checkAndExecute, 100); // Verifica a cada 100ms
        }
    };

    checkAndExecute();
})();
