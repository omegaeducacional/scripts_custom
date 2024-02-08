document.addEventListener('DOMContentLoaded', function () {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const requestId = urlSearchParams.get('id');
    if (!requestId) {
        alert("Não foi informado nenhum id");
        return;
    }
    const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.movidesk.com/public/v1/tickets?token=649048bd-ae76-4ee6-b496-478eddbb4d30&id=${requestId || ''}`;
    

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
                
                // Preencher dinamicamente os detalhes do ticket no HTML
                fillTicketDetails(ticket);
            })
            .catch(error => console.error('Erro ao buscar detalhes do ticket:', error));
    }

    // Função para preencher dinamicamente os detalhes do ticket no HTML
    function fillTicketDetails(ticket) {
        const ticketDetailsTable = document.getElementById('ticketDetails');
        ticketDetailsTable.innerHTML = `
            <tr>
                <th>ID</th>
                <td>${ticket.id}</td>
            </tr>
            <tr>
                <th>Assunto</th>
                <td>${ticket.subject}</td>
            </tr>
        `;
    }

    function fillDescription(ticket) {
        const descriptionElement = document.getElementById('description');
        
        if (ticket.actions && ticket.actions.length > 0) {
            // Limpa o conteúdo anterior
            descriptionElement.innerHTML = '';
    
            // Loop através de todas as ações
            ticket.actions.forEach(action => {
                const htmlDescription = action.htmlDescription;
    
                // Cria um novo elemento para cada descrição
                const descriptionItem = document.createElement('div');
                descriptionItem.innerHTML = htmlDescription;
                descriptionItem.style.borderBottom = "1px dashed #000";
    
                // Adiciona o novo elemento à descrição
                descriptionElement.appendChild(descriptionItem);
            });
        }
    }

    // Função para preencher dinamicamente os anexos do ticket no HTML
    function fillAttachments(ticket) {
        const attachmentsSection = document.getElementById('attachmentsSection');
        attachmentsSection.innerHTML = `
            <h2>Anexos</h2>
            <!-- Loop através dos anexos e exibição de imagens -->
            ${ticket.actions[0].attachments.map(attachment => `
                <a href="https://s3.amazonaws.com/movidesk-files/${attachment.path}" target="_blank">${attachment.fileName}</a>
            `).join('')}
        `;
    }

    function fillTicketDetails(ticket) {
        document.getElementById('ticket-category').innerText = ticket.category;
        document.getElementById('ticket-urgency').innerText = ticket.urgency;
        document.getElementById('ticket-status').innerText = ticket.status;
        document.getElementById('ticket-justification').innerText = ticket.justification;
        document.getElementById('ticket-created-date').innerText = new Date(ticket.createdDate).toLocaleString();
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
                    <td>${history.justification}</td>
                    <td>${history.changedBy.businessName}</td>
                    <td>${history.changedDate}</td>
                </tr>
            `).join('')}
        `;
    }

    // Chamar a função de busca quando a página é carregada
    fetchTicketDetails();
});
