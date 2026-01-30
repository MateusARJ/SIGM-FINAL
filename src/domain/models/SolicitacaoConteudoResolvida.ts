import { SolicitacaoConteudo } from "../models/RequisicaoModelo";


export type SolicitacaoConteudoResolvida =
    SolicitacaoConteudo & {
        anoLetivo: string;
        nomeDisciplina: string;
        assuntoTitulo: string;
    };