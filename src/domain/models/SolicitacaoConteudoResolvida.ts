import { SolicitacaoConteudo } from "../models/RequisicaoModelo";


export type SolicitacaoConteudoResolvida =
    SolicitacaoConteudo & {
        anoLetivo: string;
        nomeDisciplina: string;
        assuntoTitulo: string;
    };
/**
 * Type Guard
 * @param s 
 * @returns 
 */
export function isSolicitacaoConteudoResolvida(
    s: SolicitacaoConteudo & Partial<SolicitacaoConteudoResolvida>
): s is SolicitacaoConteudoResolvida {
    return (
        typeof (s as any).anoLetivo === "string" &&
        typeof (s as any).nomeDisciplina === "string" &&
        typeof (s as any).assuntoTitulo === "string" 
    );
}
