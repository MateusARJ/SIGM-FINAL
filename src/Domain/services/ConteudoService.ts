import { IConteudoService } from "../interfaces/IConteudoService";
import { IRepository } from "../interfaces/IRepository";
import { SolicitacaoConteudo } from "../Models/RequisicaoModelo";

export class ConteudoService implements IConteudoService {
    private repository: IRepository;

    constructor(repository: IRepository) {
        this.repository = repository;
    }

    /**
     * Simula Método que usa um modelo de solicitação e envia para IA generativa .
     * @param solicitacao 
     * @returns
     */
    async salvarGeracao(solicitacao: SolicitacaoConteudo): Promise<string> {
        this.repository.saveGeneratedContentResponse(solicitacao.id, "url_simulada_conteudo");
        console.log("Solicitação enviada para geração:", solicitacao);
        return `req-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    }

    /**
     * Apenas simula a verificação de status por enquanto gerando um status aleatório.
     * @param requestId 
     * @returns string
     */
    async verificarStatusGeracao(requestId: string): Promise<string> {
        // Simula a verificação de status
        this.repository.getGeneratedContentResponseById(requestId);
        console.log(`Verificando status para requisição: ${requestId}`);
        const statuses = ["pendente", "gerando", "concluido", "erro"];
        return statuses[Math.floor(Math.random() * statuses.length)]!;
    }

    async obterConteudoGerado(requestId: string): Promise<any> {
        // Simula a obtenção do conteúdo final
        console.log(`Obtendo conteúdo para requisição: ${requestId}`);
        if (requestId.includes("concluido")) { // Exemplo de simulação
            return {
                requestId: requestId,
                url: `https://example.com/conteudo/${requestId}.pdf`,
                data: "Conteúdo gerado simulado em PDF/PPT/Doc...",
            };
        }
        throw new Error("Conteúdo ainda não disponível ou erro na geração.");
    }
}