document.addEventListener('DOMContentLoaded', function () {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const requestId = urlSearchParams.get('id');
    const token = urlSearchParams.get('token');
    
    if (!requestId) {
        alert("Não foi informado nenhum id");
        return;
    }
    if (!token) {
        alert("Token informado é inválido");
        return;
    }
    const apiUrl = `https://status.omegaeducacional.com/api/proxy?url=${encodeURIComponent(`https://api.movidesk.com/public/v1/tickets?token=${token}&id=${requestId || ''}&now=${new Date().getTime()}`)}`;
    //const apiUrl = `https://cors-anywhere.herokuapp.com/${`https://api.movidesk.com/public/v1/tickets?token=${token}&id=${requestId || ''}&now=${new Date().getTime()}`}`;
    

    // Função para fazer a requisição à API usando Axios
    function fetchTicketDetails() {
        axios.get(apiUrl)
            .then(response => {
                const ticket = response.data;

                // Preencher dinamicamente os detalhes do ticket no HTML
                fillTicketDetails(ticket);

                // Preencher dinamicamente a descrição do ticket no HTML
                fillDescription(ticket);

                // Preencher dinamicamente os anexos do ticket no HTML
                fillAttachments(ticket);

                // Preencher dinamicamente o histórico de status do ticket no HTML
                fillStatusHistory(ticket);
                
                document.getElementById('loading-message').style.display = 'none'; 
            })
            .catch(error => console.error('Erro ao buscar detalhes do ticket:', error));
    }

    function formatDate (date) {
        return new Date(date).toLocaleString().replace(",", " ")
    }

    function fillDescription(ticket) {
        const descriptionElement = document.getElementById('description');
        
        if (ticket.actions && ticket.actions.length > 0) {
            // Limpa o conteúdo anterior
            descriptionElement.innerHTML = '';
            // Loop através de todas as ações
            ticket.actions.sort((a, b) => b.id - a.id).forEach(action => {
                const htmlDescription = action.htmlDescription;
    
                // Cria um novo elemento para cada descrição
                const descriptionItem = document.createElement('div');
                // descriptionItem.innerHTML = htmlDescription;
                descriptionItem.innerHTML = `
                    <div class="card-header d-flex justify-content-between">
                        <b>${action.createdBy?.businessName}</b>
                        <small><small>${formatDate(action.createdDate)}</small></small>
                    </div>
                    <div class="card-body">${htmlDescription}</div>
                `;
                descriptionItem.className = "card mb-2 mt-2";
                // Adiciona o novo elemento à descrição
                descriptionElement.appendChild(descriptionItem);
            });
        }
    }

    // Função para preencher dinamicamente os anexos do ticket no HTML
    function fillAttachments(ticket) {
        const attachmentsSection = document.getElementById('attachmentsSection');
        attachmentsSection.innerHTML = `
            <h4 class="text-danger">Anexos</h4>
            <!-- Loop através dos anexos e exibição de imagens -->
            ${ticket.actions[0].attachments.map(attachment => `
                <a href="https://s3.amazonaws.com/movidesk-files/${attachment.path}" target="_blank">${attachment.fileName}</a>
            `).join('') || "Sem anexos"}
        `;
    }

    function fillTicketDetails(ticket) {
        document.getElementById('ticket-category').innerText = ticket.category;
        document.getElementById('ticket-urgency').innerText = ticket.urgency;
        document.getElementById('ticket-status').innerText = ticket.status;
        document.getElementById('ticket-responsible').innerText = ticket.owner?.businessName;
        document.getElementById('ticket-service').innerText = ticket.serviceFirstLevel;
        document.getElementById('ticket-created-date').innerText = formatDate(ticket.createdDate);
        document.getElementById('ticket-clientName').innerText = ticket.clients[0]?.organization?.businessName;
        document.getElementById('ticket-clientUserName').innerText = ticket.clients[0]?.businessName;
        document.getElementById('ticket-id').innerText = ticket.id;
        document.getElementById('ticket-subject').innerText = ticket.subject;
    }

    // Função para preencher dinamicamente o histórico de status do ticket no HTML
    function fillStatusHistory(ticket) {
        const statusHistoryTable = document.getElementById('statusHistoryTable');
        statusHistoryTable.innerHTML = `
            <tr>
                <th>Status</th>
                <th>Justificativa</th>
                <th>Alterado por</th>
                <th>Data da Alteração</th>
            </tr>
            <!-- Loop através do histórico de status e exibição de linhas -->
            ${ticket.statusHistories.map(history => `
                <tr>
                    <td>${history.status}</td>
                    <td>${history.justification || "-"}</td>
                    <td>${history.changedBy?.businessName}</td>
                    <td>${formatDate(history.changedDate)}</td>
                </tr>
            `).join('')}
        `;
    }

    // Chamar a função de busca quando a página é carregada
    fetchTicketDetails();
});
