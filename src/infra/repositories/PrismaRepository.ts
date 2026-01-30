import { PrismaClient } from "@prisma/client";
import { IRepository } from "../../domain/interfaces/IRepository";
import type { Assunto, Disciplina, AnoLetivo } from "../../domain/models/ConfiguracaoConteudo";
import { SolicitacaoConteudo, RegistroConteudo } from "../../../src/domain/models/RequisicaoModelo";

export class PrismaRepository implements IRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // ============================================
  // MÉTODOS PARA DISCIPLINA
  // ============================================

  async addDisciplina(disciplina: Disciplina): Promise<void> {
    await this.prisma.disciplina.create({
      data: {
        id: disciplina.id,
        nome: disciplina.nome,
        anoLetivoId: disciplina.serieId, // Mapeando serieId para a FK do banco
        // Assumindo que ao criar disciplina, não criamos assuntos aninhados ainda,
        // mas se precisar, poderia usar 'create: ...'
      },
    });
  }

  async getDisciplinaById(id: string): Promise<Disciplina | undefined> {
    const result = await this.prisma.disciplina.findUnique({
      where: { id },
      include: { assuntos: true }, // Trazemos os assuntos para cumprir a interface
    });

    if (!result) return undefined;

    // Adaptação do retorno do Prisma para sua Interface
    return {
      id: result.id,
      nome: result.nome,
      serieId: result.anoLetivoId,
      assuntos: result.assuntos.map(a => ({
        id: a.id,
        nome: a.nome,
        disciplinaID: a.disciplinaId
      }))
    };
  }

  async getDisciplinaByName(name: string): Promise<Disciplina | undefined> {
    const result = await this.prisma.disciplina.findFirst({
      where: { nome: name },
      include: { assuntos: true },
    });

    if (!result) return undefined;

    return {
      id: result.id,
      nome: result.nome,
      serieId: result.anoLetivoId,
      assuntos: result.assuntos.map(a => ({
        id: a.id,
        nome: a.nome,
        disciplinaID: a.disciplinaId
      }))
    };
  }

  async getAllDisciplinas(): Promise<Disciplina[]> {
    const results = await this.prisma.disciplina.findMany({
      include: { assuntos: true },
    });

    return results.map((d) => ({
      id: d.id,
      nome: d.nome,
      serieId: d.anoLetivoId,
      assuntos: d.assuntos.map(a => ({
        id: a.id,
        nome: a.nome,
        disciplinaID: a.disciplinaId
      }))
    }));
  }

  async updateDisciplina(disciplina: Disciplina): Promise<void> {
    await this.prisma.disciplina.update({
      where: { id: disciplina.id },
      data: {
        nome: disciplina.nome,
        anoLetivoId: disciplina.serieId,
      },
    });
  }

  async deleteDisciplina(id: string): Promise<void> {
    await this.prisma.disciplina.delete({
      where: { id },
    });
  }

  // ============================================
  // MÉTODOS PARA ANO LETIVO
  // ============================================

  async addAnoLetivo(anoLetivo: AnoLetivo): Promise<void> {
    await this.prisma.anoLetivo.create({
      data: {
        id: anoLetivo.serieId,
        nome: anoLetivo.nome,
      },
    });
  }

  async getAnoLetivoById(id: string): Promise<AnoLetivo | undefined> {
    const result = await this.prisma.anoLetivo.findUnique({
      where: { id },
      include: {
        // Deep nested include para trazer Ano -> Disciplinas -> Assuntos
        disciplinas: {
          include: { assuntos: true }
        }
      },
    });

    if (!result) return undefined;

    // Mapeamento manual para garantir conformidade exata com a interface
    return {
      serieId: result.id,
      nome: result.nome as any, // Cast necessário se "AnoOuSerie" for um tipo union específico
      disciplinas: result.disciplinas.map(d => ({
        id: d.id,
        nome: d.nome,
        serieId: d.anoLetivoId,
        assuntos: d.assuntos.map(a => ({
          id: a.id,
          nome: a.nome,
          disciplinaID: a.disciplinaId
        }))
      }))
    };
  }

  async getAnoLetivoByName(name: string): Promise<AnoLetivo | undefined> {
    const result = await this.prisma.anoLetivo.findFirst({
      where: { nome: name },
      include: {
        disciplinas: { include: { assuntos: true } }
      },
    });

    if (!result) return undefined;

    return {
      serieId: result.id,
      nome: result.nome as any,
      disciplinas: result.disciplinas.map(d => ({
        id: d.id,
        nome: d.nome,
        serieId: d.anoLetivoId,
        assuntos: d.assuntos.map(a => ({
          id: a.id,
          nome: a.nome,
          disciplinaID: a.disciplinaId
        }))
      }))
    };
  }

  async getAllAnoLetivos(): Promise<AnoLetivo[]> {
    const results = await this.prisma.anoLetivo.findMany({
      include: {
        disciplinas: { include: { assuntos: true } }
      },
    });

    return results.map(result => ({
      serieId: result.id,
      nome: result.nome as any,
      disciplinas: result.disciplinas.map(d => ({
        id: d.id,
        nome: d.nome,
        serieId: d.anoLetivoId,
        assuntos: d.assuntos.map(a => ({
          id: a.id,
          nome: a.nome,
          disciplinaID: a.disciplinaId
        }))
      }))
    }));
  }

  async updateAnoLetivo(anoLetivo: AnoLetivo): Promise<void> {
    await this.prisma.anoLetivo.update({
      where: { id: anoLetivo.serieId },
      data: { nome: anoLetivo.nome },
    });
  }

  async deleteAnoLetivo(id: string): Promise<void> {
    await this.prisma.anoLetivo.delete({ where: { id } });
  }

  // ============================================
  // MÉTODOS PARA ASSUNTO
  // ============================================

  async addAssunto(assunto: Assunto): Promise<void> {
    await this.prisma.assunto.create({
      data: {
        id: assunto.id,
        nome: assunto.nome,
        disciplinaId: assunto.disciplinaID,
      },
    });
  }

  async getAssuntoById(id: string): Promise<Assunto | undefined> {
    const result = await this.prisma.assunto.findUnique({ where: { id } });
    if (!result) return undefined;
    return {
      id: result.id,
      nome: result.nome,
      disciplinaID: result.disciplinaId
    };
  }

  async getAssuntosByDisciplina(disciplinaId: string): Promise<Assunto[]> {
    const results = await this.prisma.assunto.findMany({
      where: { disciplinaId },
    });
    return results.map(r => ({
      id: r.id,
      nome: r.nome,
      disciplinaID: r.disciplinaId
    }));
  }

  async getAllAssuntos(): Promise<Assunto[]> {
    const results = await this.prisma.assunto.findMany();
    return results.map(r => ({
      id: r.id,
      nome: r.nome,
      disciplinaID: r.disciplinaId
    }));
  }

  async updateAssunto(assunto: Assunto): Promise<void> {
    await this.prisma.assunto.update({
      where: { id: assunto.id },
      data: { nome: assunto.nome, disciplinaId: assunto.disciplinaID },
    });
  }

  async deleteAssunto(id: string): Promise<void> {
    await this.prisma.assunto.delete({ where: { id } });
  }

  // ============================================
  // CONTEÚDO GERADO (IA)
  // ============================================

  async salvarConteudoResultado(conteudo: RegistroConteudo): Promise<string> {
    // Aqui assumimos que 'conteudo' é o objeto completo RegistroConteudo
    // Precisamos extrair os IDs de dentro da 'solicitacao' para popular as FKs
    
    await this.prisma.registroConteudo.create({
      data: {
        requestId: conteudo.requestId,
        status: conteudo.status,
        criadoEm: conteudo.criadoEm,
        atualizadoEm: conteudo.atualizadoEm,
        
        // Extraindo FKs obrigatórias do objeto de solicitação
        anoLetivoId: conteudo.solicitacao.serieId,
        disciplinaId: conteudo.solicitacao.disciplinaId,
        assuntoId: conteudo.solicitacao.assuntoId,

        // Prisma lida com JSON automaticamente
        solicitacao: conteudo.solicitacao as any, 
        resultado: conteudo.resultado ? (conteudo.resultado as any) : undefined
      }
    });

    return conteudo.requestId;
  }

  async buscarConteudoPorId(requestId: string): Promise<RegistroConteudo | undefined> {
    const result = await this.prisma.registroConteudo.findUnique({
      where: { requestId }
    });

    if (!result) return undefined;

    // Reconstrói o objeto para o formato da Interface
    return {
      requestId: result.requestId,
      status: result.status as any, // Cast para "pendente" | "processando" etc.
      criadoEm: result.criadoEm,
      atualizadoEm: result.atualizadoEm,
      solicitacao: result.solicitacao as unknown as SolicitacaoConteudo,
      resultado: result.resultado ? (result.resultado as any) : undefined
    };
  }

  async atualizarConteudo(conteudo: RegistroConteudo): Promise<string> {
    // Atualiza status, resultado e timestamp
    await this.prisma.registroConteudo.update({
      where: { requestId: conteudo.requestId },
      data: {
        status: conteudo.status,
        resultado: conteudo.resultado ? (conteudo.resultado as any) : undefined,
        solicitacao: conteudo.solicitacao as any, // Caso tenha sido editada
      }
    });
    return conteudo.requestId;
  }

  async removerConteudo(requestId: string): Promise<string> {
    await this.prisma.registroConteudo.delete({
      where: { requestId }
    });
    return requestId;
  }

  async verificarStatusGeracao(requestId: string): Promise<string> {
    const result = await this.prisma.registroConteudo.findUnique({
      where: { requestId },
      select: { status: true }
    });

    if (!result) throw new Error("Conteúdo não encontrado");
    return result.status;
  }
}